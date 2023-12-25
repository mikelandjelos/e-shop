import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { RedisClientNames } from './globals/redis-clients';

@Injectable()
export class AppService {
  constructor(public readonly redisService: RedisService) {}

  async pingDurable(): Promise<string> {
    const durableRedis = await this.redisService.getClient(
      RedisClientNames.DURABLE,
    );
    return await durableRedis.ping();
  }

  async pingCache(): Promise<string> {
    const cacheRedis = await this.redisService.getClient(
      RedisClientNames.CACHE,
    );
    return await cacheRedis.ping();
  }
}
