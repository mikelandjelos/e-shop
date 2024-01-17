import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Category } from '../entities/category.entity';
import { ILike, Repository } from 'typeorm';
import { createClient } from 'redis';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  private readonly ALL_CATEGORIES_CACHE_EXPIRATION = 60;

  constructor(
    @InjectRepository(Category)
    public readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const savedCategory = await this.categoryRepository.save(createCategoryDto);
    return savedCategory;
  }

  async invalidateCacheForAllCategories(): Promise<void> {
    const redisClient = createClient({ url: 'redis://127.0.0.1:6390' });

    try {
      await redisClient.connect();

      // Invalidate the cache by deleting the key associated with all categories
      const cacheKey = 'categories:all';
      await redisClient.del(cacheKey);
    } catch (error) {
      // Handle potential errors, such as connection issues or cache deletion failures
      console.error('Error invalidating cache for all categories:', error);
    } finally {
      await redisClient.disconnect();
    }
  }

  async findAll(): Promise<Category[]> {
    const cacheKey = 'categories:all';

    const redisClient = createClient({ url: 'redis://127.0.0.1:6390' });

    await redisClient.connect();

    // Check if the data is in the cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // If not in the cache, retrieve data from the database
    const categories = await this.categoryRepository.find();

    // Store the data in the cache for future requests
    await redisClient.setEx(
      cacheKey,
      this.ALL_CATEGORIES_CACHE_EXPIRATION,
      JSON.stringify(categories),
    ); // Set a TTL (time-to-live) of ALL_CATEGORIES_CACHE_EXPIRATION seconds

    await redisClient.disconnect();

    return categories;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async findByName(name: string): Promise<Category | undefined> {
    const cacheKey = `categories:name:${name.toLowerCase()}`; // Use a unique cache key for each name

    const redisClient = createClient({ url: 'redis://127.0.0.1:6390' });

    await redisClient.connect();

    // Check if the data is in the cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // If not in the cache, retrieve data from the database
    const category = await this.categoryRepository.findOne({
      where: {
        name: ILike(name), // ILike for case-insensitive search
      },
    });

    // If category not found, throw NotFoundException
    if (!category) {
      throw new NotFoundException(`Category with name '${name}' not found`);
    }

    // Store the data in the cache for future requests
    await redisClient.setEx(
      cacheKey,
      this.ALL_CATEGORIES_CACHE_EXPIRATION,
      JSON.stringify(category),
    );

    await redisClient.disconnect();

    return category;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
