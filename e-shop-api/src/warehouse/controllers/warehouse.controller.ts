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
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';
import { WarehouseDto } from '../dto/warehouse.dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  async create(
    @Body() createWarehouseDto: CreateWarehouseDto,
  ): Promise<WarehouseDto> {
    return await this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  async findAll(): Promise<WarehouseDto[]> {
    return await this.warehouseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WarehouseDto> {
    return await this.warehouseService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<WarehouseDto> {
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
