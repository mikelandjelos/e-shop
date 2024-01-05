import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class GeoService {
  constructor() {}
  async addLocationToGeoSet(
    name: string,
    longitude: number,
    latitude: number,
    member: string,
  ): Promise<number> {
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6390' });
    return await redisClient.geoAdd(name, [{ longitude, latitude, member }]);
  }
  async getDistanceBetweenLocations(
    geoSetName: string,
    member1: string,
    member2: string,
  ): Promise<number> {
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6390' });
    return await redisClient.geoDist(geoSetName, member1, member2);
  }
}
