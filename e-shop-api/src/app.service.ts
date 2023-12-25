import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class AppService {
  constructor() {}

  async pingDurable(): Promise<string> {
    const redis = new Redis({ host: 'localhost', port: 6389 });
    return `${await redis.ping()} from 6389`;
  }

  async pingCache(): Promise<string> {
    const redis = new Redis({ host: 'localhost', port: 6390 });
    return `${await redis.ping()} from 6390`;
  }
}
