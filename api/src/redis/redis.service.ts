import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379
    });
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async getValue(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }
  async addLocationToGeoSet(geoSetName: string, longitude: number, latitude: number, member: string): Promise<void> {
    await this.redisClient.geoadd(geoSetName, longitude, latitude, member);
  }

  async getDistanceBetweenLocations(geoSetName: string, member1: string, member2: string, unit: 'm' | 'km' | 'mi' | 'ft' = 'm'): Promise<number | null> {
    const distance = await this.redisClient.geodist(geoSetName, member1, member2);
    return distance !== null ? parseFloat(distance) : null;
  }
}
