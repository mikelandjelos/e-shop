import { Body, Controller, Get, Post } from '@nestjs/common';
import { GeoService } from 'src/geo/services/geo/geo.service';
import { Location } from 'src/geo/models/location.interface';
@Controller('geo/')
export class GeoController {
  constructor(private geoService: GeoService) {}
  @Post('addLocation')
  async addLocation(@Body() location: Location): Promise<number> {
    return await this.geoService.addLocationToGeoSet(
      location.name,
      location.longitude,
      location.lattitude,
      location.member,
    );
  }
  @Get('getDistance')
  async getDistance(
    @Body()
    requestBody: {
      geoSetName: string;
      member1: string;
      member2: string;
    },
  ): Promise<number> {
    const { geoSetName, member1, member2 } = requestBody;
    return await this.geoService.getDistanceBetweenLocations(
      geoSetName,
      member1,
      member2,
    );
  }
}
