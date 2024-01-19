import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { WarehouseService } from '../services/warehouse.service';
import { Warehouse } from '../entities/warehouse.entity';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post('/:longitude/:latitude')
  async create(
    @Body() warehouse: Partial<Warehouse>,
    @Param('longitude') longitude: number,
    @Param('latitude') latitude: number,
  ): Promise<Warehouse> {
    const createdWarehouse = await this.warehouseService.create(
      warehouse,
      longitude,
      latitude,
    );
    console.log(createdWarehouse);
    return createdWarehouse;
  }

  @Get('/findAll')
  async findAll(): Promise<Warehouse[]> {
    return await this.warehouseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Warehouse> {
    return await this.warehouseService.findOne(id);
  }

  @Get('/inRadius/:username/:radius')
  async getAllWarehouseIdsForRadius(
    @Param('username') username: string,
    @Param('radius') radius: number,
  ) {
    return await this.warehouseService.getAllWarehouseIdsForRadius(
      username,
      radius,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: Warehouse,
  ): Promise<Warehouse> {
    try {
      return await this.warehouseService.update(id, updateWarehouseDto);
    } catch (error) {
      Logger.error(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      return await this.warehouseService.remove(id);
    } catch (error) {
      Logger.log(error);
    }
  }
}
