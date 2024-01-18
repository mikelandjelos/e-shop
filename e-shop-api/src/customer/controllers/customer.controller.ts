import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }
  @Post('addLocation')
  addLocation(
    @Body()
    body: {
      username: string;
      location: { name: string; longitude: number; lattitude: number };
    },
  ) {
    console.log(body);
    return this.customerService.addLocationToGeoSet(
      body.username,
      'City',
      body.location.longitude,
      body.location.lattitude,
      body.location.name,
    );
  }
  @Post('addWareHouse')
  addWareHouse(
    @Body()
    body: {
      username: string;
      location: { name: string; longitude: number; lattitude: number };
    },
  ) {
    console.log(body);
    return this.customerService.addWareHouseLocation(
      body.username,
      'City',
      body.location.longitude,
      body.location.lattitude,
      body.location.name,
    );
  }
  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.customerService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
  @Get(':username')
  getCoordinates(@Param('username') username: string) {
    console.log(username);
    return this.customerService.getCoordinatesForCity(username);
  }
  @Get(':username/:range')
  getCitiesInRange(
    @Param('username') username: string,
    @Param('range') range: number,
  ) {
    return this.customerService.getCitiesInRange(username, range);
  }
  @Delete('Logout/:username')
  logout( @Param('username') username: string)
  {
    return this.customerService.logout(username);
  }
  @Get('GetUserCredentiales/:username')
  getUserCredentiales(
    @Param('username') username: string
   
  ) {
    console.log(username);
    return this.customerService.getUserCredentials(username);
  }
}
