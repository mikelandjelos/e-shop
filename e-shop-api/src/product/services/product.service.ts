import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { createClient } from 'redis';
import { Observable } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    public readonly productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const saved = await this.productRepository.save(createProductDto);

    const redisClient = await createClient({ url: 'redis://127.0.0.1:6389' });
    await redisClient.connect();
    await redisClient.ts.create(saved.id);
    await redisClient.disconnect();
    return saved;
  }

  async viewProduct(id: string) {
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6390' });
    redisClient.ts.add(id, '*', 1);
  }
  async getNumberOfViews(id: string) {
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6390' });
    const currentTimestamp = Date.now();

    const oneHourAgoTimestamp = currentTimestamp - 60 * 60 * 1000;
    redisClient.ts.range(id, oneHourAgoTimestamp, '+');
  }
  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
 async decreaseProduct(id:string, count:number)
  {
    const rC = new Redis({port:6390,host:'localhost'});
    const rcN = new Redis({port:6389,host:'localhost'});
   const product = await this.productRepository.findOne({where:{id}})
   if(product)
   {
    product.stock-=count;
    
    if(product.stock<=0)
   { await rC.zrem("stock",product.id);
    return await this.productRepository.delete(id);}

    await this.productRepository.update({ id }, { stock: product.stock });
    const productScore = await rC.zscore("stock",product.id);
    if(productScore)
    {
      await rC.zincrby("stock",count,product.id)
    }
    else
    {
      
      await rC.zadd("stock",count,product.id)
    }
    rcN.hmset(product.id,product);
  
    return product 
   }
   else
   {
    throw new BadRequestException('Do not exist');
   }
  }
  async getFourWithMostScore()
  {
    const rC = new Redis({port:6390,host:'localhost'});
    const rCN = new Redis({port:6389,host:'localhost'});
   let elements= await rC.zrevrange("stock",0,3);
   
   const promises = elements.map(async (el) => {
    const elRet = await rCN.hgetall(el);
    if(Object.keys(elRet).length !== 0)
    {
      elements = elements.filter((e)=>e!==el)
    }
    
    return elRet;
  }); let retelements = await Promise.all(promises);
  if(elements.length>0)
  {
  const promisesDb= elements.map(async (el)=>{
      const id = JSON.stringify(el);
      const objFromDb = await this.productRepository.findOne({where:{id}})
      return objFromDb;
    });
    const resultsFromDb = await Promise.all(promisesDb);
    return [retelements,resultsFromDb];
  }

  
   return retelements;
  }
}
