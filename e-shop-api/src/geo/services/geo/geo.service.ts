import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Observable, from, map } from 'rxjs';
@Injectable()
export class GeoService {
  private readonly redisClient: Redis;
  constructor() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }
  addLocationToGeoSet(
    name: string,
    longitude: number,
    lattitude: number,
    member: string,
  ): Observable<any> {
    return from(this.redisClient.geoadd(name, longitude, lattitude, member));
  }
  getDistanceBetweenLocations(
    geoSetName: string,
    member1: string,
    member2: string,
  ): Observable<any> {
    return from(this.redisClient.geodist(geoSetName, member1, member2)).pipe(
      map((distance: string | null) =>
        distance !== null ? parseFloat(distance) : null,
      ),
    );
  }
}
