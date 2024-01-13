import { Body, Controller, Get,Post } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { values } from 'src/values.interface';
@Controller('example')
export class ExampleController {
  constructor(private readonly redisService: RedisService) {}

  @Get()
  async getValueFromRedis(@Body()values:values): Promise<string | null> {
    return await this.redisService.getValue(values.key);
  }
  @Post()
  async setValue(@Body()values:values) {
    return await this.redisService.setValue(values.key,values.value);
  }
  @Post('/addLocationToGeoSet')
  async addLocationToGeoSet(@Body() geoData: { geoSetName: string, longitude: number, latitude: number, member: string }): Promise<void> {
    const { geoSetName, longitude, latitude, member } = geoData;
    return await this.redisService.addLocationToGeoSet(geoSetName, longitude, latitude, member);
  }

  @Post('/getDistanceBetweenLocations')
  async getDistanceBetweenLocations(@Body() geoData: { geoSetName: string, member1: string, member2: string, unit: 'm' | 'km' | 'mi' | 'ft' }): Promise<number | null> {
    const { geoSetName, member1, member2, unit } = geoData;
    return await this.redisService.getDistanceBetweenLocations(geoSetName, member1, member2, unit);
  }
}
