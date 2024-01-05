import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import Redis from 'ioredis';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product)public readonly productRepository:Repository<Product>){}
  create(createProductDto: CreateProductDto) {
    return this.productRepository.save(createProductDto);
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
  async incrementPostViews(postId:string){
    const redis = new Redis({ host: 'localhost', port: 6389 });
    const timeStamp = Date.now();
    const key = postId; 
    await redis.zincrby(key,timeStamp,'1')
  }
  async getPostsView(postId:string){
    const redis = new Redis({ host: 'localhost', port: 6389 });
    const key = postId;
    const currentTimeStamp = Date.now();
    const oneHourAgo = currentTimeStamp-60*60*1000;
    const result = await redis.zrangebyscore(key,oneHourAgo,currentTimeStamp);
    console.log(result);
    const totalViews = result.reduce((sum,value)=>sum+=parseInt(value));
    console.log(totalViews);
    return totalViews;
  }
}
