import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository, FindOptions, FindManyOptions, ILike } from 'typeorm';
import Redis from 'ioredis';
import { createClient } from 'redis';
import path = require('path');
import { of } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    public readonly productRepository: Repository<Product>,
  ) {}

  public readonly PAGE_CACHE_EXPIRATION: number = 120;

  async create(createProductDto: CreateProductDto) {
    const saved = await this.productRepository.save(createProductDto);

    const redisClient = await createClient({ url: 'redis://127.0.0.1:6390' });
    await redisClient.connect();
    await redisClient.ts.create(saved.id);
    await redisClient.disconnect();

    const rC = new Redis({ port: 6390, host: 'localhost' });
    const value = await rC.xadd('created', '*', 'id', saved.id);
    const rCN = new Redis({ port: 6389, host: 'localhost' });
    rCN.set('stream' + saved.id, value);

    await rCN.hset('created' + saved.id, saved);
    const score = saved.stock;
    await rC.zadd('topSales', score, saved.id);
    await rCN.hmset('topSales' + saved.id, saved);
    await rC.disconnect();

    await this.invalidateCacheForAllProductCategories();

    return saved;
  }

  async viewProduct(id: string) {
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6390' });
    await redisClient.connect();
    await redisClient.ts.add(id, '*', 1);
    await redisClient.disconnect();
  }

  async getNumberOfViews(id: string) {
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6390' });
    const currentTimestamp = Date.now();
    redisClient.connect();
    const oneHourAgoTimestamp = currentTimestamp - 60 * 60 * 1000;
    const num = await redisClient.ts.range(id, oneHourAgoTimestamp, '+');
    redisClient.disconnect();
    const sum = num.length;
    return sum;
  }

  async getLastMeasuredValue(id: string): Promise<any> {
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6390' });
    await redisClient.connect();
    const rangeResult = await redisClient.ts.range(id, '-', '+');
    if (rangeResult && rangeResult.length > 0) {
      const lastMeasuredValue = rangeResult[rangeResult.length - 1];

      if (lastMeasuredValue) {
        const timestamp = lastMeasuredValue.timestamp;
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleString();

        return [rangeResult.length, formattedDate];
      }
    }
    await redisClient.disconnect();
  }

  async decreaseProduct(id: string, count: number): Promise<Object> {
    const rC = new Redis({ port: 6390, host: 'localhost' });
    const rcN = new Redis({ port: 6389, host: 'localhost' });

    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (product) {
        product.stock -= count;

        if (product.stock <= 0) {
          const productID = product.id;
          await rC.zrem('stock', product.id);
          await rC.zrem('topSales', product.id);
          const redisClient = await createClient({
            url: 'redis://127.0.0.1:6390',
          });
          await redisClient.connect();
          const ts = await redisClient.ts.get(product.id);
          console.log(ts);
          const timestamp = ts.timestamp;
          console.log(timestamp);
          //const obj =  await redisClient.xRead('created',productID);
          const obj = await rcN.get('stream' + product.id);
          await redisClient.xDel('created', obj);
          //  await redisClient.ts.del(product.id,'-','+');
          //  console.log(ts)
          redisClient.disconnect();

          return await this.productRepository.delete(id);
        }
        await rC.zincrby('topSales', -count, product.id);

        await this.productRepository.update({ id }, { stock: product.stock });

        const productScore = await rC.zscore('stock', product.id);
        if (productScore !== null) {
          await rC.zincrby('stock', count, product.id);
        } else {
          await rC.zadd('stock', count, product.id);
        }

        await rcN.hmset(product.id, product);

        return product;
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      throw error;
    } finally {
      //rC.quit();
      //rcN.quit();
    }
  }

  async getFourWithMostScore(name: string) {
    const rC = new Redis({ port: 6390, host: 'localhost' });
    const rCN = new Redis({ port: 6389, host: 'localhost' });
    let elements = [];
    if (name == 'stock') elements = await rC.zrevrange(name, 0, 3);
    else if (name == 'created')
      elements = await rC.xrevrange('created', '+', '-', 'COUNT', 4);
    else if (name == 'topSales') elements = await rC.zrange(name, 0, 3);
    console.log(elements);
    const promises = elements.map(async (el) => {
      let elRet;
      if (name == 'stock') elRet = await rCN.hgetall(el);
      else if (name == 'topSales') elRet = await rCN.hgetall(name + el);
      else if (name == 'created')
        elRet = await rCN.hgetall('created' + el[1][1]);
      if (Object.keys(elRet).length !== 0) {
        elements = elements.filter((e) => e !== el);
      }
      if (Object.keys(elRet).length !== 0) return elRet;
    });
    let retelements = await Promise.all(promises);
    if (retelements.length > 0)
      retelements = retelements.filter((e) => e != null);
    if (elements.length > 0) {
      const promisesDb = elements.map(async (el) => {
        const id = el;
        const idDb: string = id[1][1];
        const objFromDb = await this.productRepository.findOne({
          where: { id: idDb },
        });
        return objFromDb;
      });
      const resultsFromDb = await Promise.all(promisesDb);
      return [retelements, resultsFromDb];
    }

    return retelements;
  }

  getImageBlob(imageName: any, res: any) {
    return of(
      res.sendFile(
        path.join(process.cwd(), 'uploads/profileimages/' + imageName),
      ),
    );
  }

  async hotSales(product: CreateProductDto) {
    const rC = new Redis({ port: 6390, host: 'localhost' });
    const rCn = new Redis({ port: 6389, host: 'localhost' });

    const score = product.stock;
    await rC.zadd('topSales', score, product.id);
    await rCn.hmset('topSales' + product.id, product);
  }

  async decreasePrice(newPrice: number, id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const rC = new Redis({ port: 6390, host: 'localhost' });
    const rCn = new Redis({ port: 6389, host: 'localhost' });
    const oldPrice = product.price;
    const discountPercentage = ((oldPrice - newPrice) / oldPrice) * 100;
    await rC.zadd('topSales', discountPercentage, id);
    await rCn.hmset('topSale' + product.id, product);
    product.price = newPrice;

    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct;
  }

  async findPaginated(
    page: number = 1,
    pageSize: number = 10,
    categoryName: string = '',
  ): Promise<{ products: Product[]; total: number }> {
    const cacheKey = `products:page-${page}-size-${pageSize}${
      '-category-' + categoryName
    }`;

    const redisClient = createClient({ url: 'redis://127.0.0.1:6390' });

    await redisClient.connect();

    // Check if the data is in the cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      await redisClient.disconnect();
      return JSON.parse(cachedData);
    }

    // If not in the cache, retrieve data from the database with the category filter
    const options: FindManyOptions<Product> = {
      where: categoryName ? { category: { name: ILike(categoryName) } } : {},
      take: pageSize,
      skip: (page - 1) * pageSize,
      relations: ['category'],
    };

    const [products, total] =
      await this.productRepository.findAndCount(options);

    // Store the data in the cache for future requests
    const result = { products, total };
    await redisClient.setEx(
      cacheKey,
      this.PAGE_CACHE_EXPIRATION,
      JSON.stringify(result),
    ); // Set a TTL (time-to-live) of CACHE_EXPIRATION seconds

    await redisClient.disconnect();

    return result;
  }

  async bulkCreate(createProductDtos: CreateProductDto[]): Promise<Product[]> {
    // Validate the input to ensure it's an array of CreateProductDto objects
    if (!Array.isArray(createProductDtos) || createProductDtos.length === 0) {
      throw new BadRequestException('Invalid input for bulk creation');
    }

    // Perform bulk insert
    const newProducts = createProductDtos.map((dto) =>
      this.productRepository.create(dto),
    );
    const insertedProducts = await this.productRepository.insert(newProducts);

    // Connect to Redis once for bulk creation
    const redisClient = createClient({ url: 'redis://127.0.0.1:6389' });
    await redisClient.connect();

    // Iterate through the inserted products and create timestamps in Redis
    for (const insertedProduct of insertedProducts.identifiers) {
      const productId = insertedProduct.id;
      await redisClient.ts.create(productId);
    }

    // Invalidate the cache for all product categories after bulk creation
    this.invalidateCacheForAllProductCategories();

    // Disconnect from Redis after creating timestamps
    await redisClient.disconnect();

    return insertedProducts.identifiers.map((identifier) => ({
      id: identifier.id,
      ...newProducts[identifier.id - 1],
    }));
  }

  private async invalidateCacheForAllProductCategories() {
    // Example: Delete all keys starting with 'products:'
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6390' });
    redisClient.connect();
    const keys = await redisClient.keys(`products:*`);

    // Delete keys concurrently
    await Promise.all(keys.map((key) => redisClient.del(key)));
    redisClient.disconnect();
  }

  async findOne(id: string): Promise<Product | undefined> {
    const cacheKey = `product:${id}`;
    const redisClient = createClient({ url: 'redis://127.0.0.1:6390' });

    let product = undefined;

    await redisClient.connect();

    try {
      // Check if the product is in the cache
      const cachedProduct = await redisClient.get(cacheKey);
      if (cachedProduct) {
        return JSON.parse(cachedProduct);
      }

      // If not in the cache, retrieve the product from the database
      product = await this.productRepository.findOneBy({ id });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      // Store the product in the cache for future requests
      await redisClient.setEx(
        cacheKey,
        this.PAGE_CACHE_EXPIRATION,
        JSON.stringify(product),
      );
    } finally {
      await redisClient.disconnect();
    }

    return product;
  }

  async addToCart(product: any) {
    const cacheKey = `cart:${product.product.id}`;

    product.product.blob =
      product.product.blob.changingThisBreaksApplicationSecurity;

    const rCN = new Redis({ port: 6389, host: 'localhost' });
    await rCN.hset(cacheKey, product.product);
    return product;
  }

  async getAllProductsFromCache() {
    const rCN = new Redis({ port: 6389, host: 'localhost' });

    const keys = await rCN.keys(`cart:*`);

    const products = [];

    for (const key of keys) {
      const product = await rCN.hgetall(key);
      products.push(product);
    }

    return products;
  }

  async deleteAllProductsFromRedisCache() {
    const rCN = new Redis({ port: 6389, host: 'localhost' });

    const keys = await rCN.keys(`cart:*`);

    const deletionPromises = keys.map(async (key) => {
      await rCN.del(key);
    });

    await Promise.all(deletionPromises);
  }

  async deleteAllKeys() {
    const rCN = new Redis({ port: 6389, host: 'localhost' });
    const rC = new Redis({ port: 6390, host: 'localhost' });

    const keys = await rCN.keys(`*`);
    const keys2 = await rC.keys('*');
    const deletionPromises1 = keys2.map(async (key) => {
      await rC.del(key);
    });

    const deletionPromises = keys.map(async (key) => {
      await rCN.del(key);
    });

    await Promise.all(deletionPromises);
  }
}
