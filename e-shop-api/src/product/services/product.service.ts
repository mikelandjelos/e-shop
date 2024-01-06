import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import {  createClient } from 'redis';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product)public readonly productRepository:Repository<Product>){}
  async create(createProductDto: CreateProductDto) {
    const saved =await this.productRepository.save(createProductDto);
    
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6389' });
    await redisClient.connect();
    await redisClient.ts.create(saved.id);
    await redisClient.disconnect();
    return saved;
  }
  
  
  async viewProduct(id:string)
  {
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6390' });
    redisClient.ts.add(id,'*',1);
  }
  async getNumberOfViews(id:string)
  {
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6390' });
    const currentTimestamp = Date.now();

    const oneHourAgoTimestamp = currentTimestamp - 60 * 60 * 1000;
    redisClient.ts.range(id,oneHourAgoTimestamp,'+');
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

}
