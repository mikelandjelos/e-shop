import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class GeoService {
  constructor() {}
  async addLocationToGeoSet(
    name: string,
    longitude: number,
    lattitude: number,
    member: string,
  ): Promise<number> {
    const redis = new Redis({ host: 'localhost', port: 6390 });
    return redis.geoadd(name, longitude, lattitude, member);
  }
  async getDistanceBetweenLocations(
    geoSetName: string,
    member1: string,
    member2: string,
  ): Promise<string> {
    const redis = new Redis({ host: 'localhost', port: 6390 });
    return await redis.geodist(geoSetName, member1, member2);
  }
}
