import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class AppService {
  constructor() {}

  async pingDurable(): Promise<string> {
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6389' });
    await redisClient.connect();
    return `${await redisClient.ping()} from 6389`;
  }

  async pingCache(): Promise<string> {
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6390' });
    await redisClient.connect();
    return `${await redisClient.ping()} from 6390`;
  }
}
