import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AppService {
  async getPong(): Promise<string> {
    const redis_client = new Redis({ host: 'localhost', port: 6379 });

    return redis_client.ping();
  }
}
