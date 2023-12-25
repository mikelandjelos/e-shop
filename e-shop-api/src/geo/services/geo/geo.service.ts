import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class GeoService {
  constructor(private readonly redisService: RedisService) {}
  async addLocationToGeoSet(
    name: string,
    longitude: number,
    lattitude: number,
    member: string,
  ): Promise<number> {
    const redisCacheClient = await this.redisService.getClient('cache');
    return redisCacheClient.geoadd(name, longitude, lattitude, member);
  }
  async getDistanceBetweenLocations(
    geoSetName: string,
    member1: string,
    member2: string,
  ): Promise<string> {
    const redisCacheClient = await this.redisService.getClient('cache');
    return await redisCacheClient.geodist(geoSetName, member1, member2);
  }
}
