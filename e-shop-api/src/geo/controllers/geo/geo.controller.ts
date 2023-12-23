import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GeoService } from 'src/geo/services/geo/geo.service';
import { Location } from 'src/geo/models/location.interface';
@Controller('geo/')
export class GeoController {
  constructor(private geoService: GeoService) {}
  @Post('addLocation')
  addLocation(@Body() location: Location): Observable<any> {
    return this.geoService.addLocationToGeoSet(
      location.name,
      location.longitude,
      location.lattitude,
      location.member,
    );
  }
  @Get('getDistance')
  getDistance(
    @Body()
    requestBody: {
      geoSetName: string;
      member1: string;
      member2: string;
    },
  ): Observable<any> {
    const { geoSetName, member1, member2 } = requestBody;
    console.log(geoSetName);
    return this.geoService.getDistanceBetweenLocations(
      geoSetName,
      member1,
      member2,
    );
  }
}
