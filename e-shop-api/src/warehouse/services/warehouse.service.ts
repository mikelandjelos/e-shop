import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';
import { Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { WarehouseDto } from '../dto/warehouse.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    public readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto): Promise<WarehouseDto> {
    const createdWarehouse =
      await this.warehouseRepository.save(createWarehouseDto);

    return WarehouseDto.fromEntity(createdWarehouse);
  }

  async findAll(): Promise<WarehouseDto[]> {
    const warehouses = await this.warehouseRepository.find();
    return warehouses.map((warehouse) => WarehouseDto.fromEntity(warehouse));
  }

  async findOne(id: string): Promise<WarehouseDto> {
    const warehouse = await this.warehouseRepository.findOneBy({ id });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id '${id}' not found!`);
    }

    return WarehouseDto.fromEntity(warehouse);
  }

  async update(
    id: string,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<WarehouseDto> {
    const warehouse = await this.warehouseRepository.findOneBy({ id });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id '${id}' not found!`);
    }

    this.warehouseRepository.merge(warehouse, updateWarehouseDto);
    const updatedWarehouse = await this.warehouseRepository.save(warehouse);

    return WarehouseDto.fromEntity(updatedWarehouse);
  }

  async remove(id: string): Promise<void> {
    const warehouse = await this.warehouseRepository.findOneBy({ id });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id '${id}' not found!`);
    }

    await this.warehouseRepository.remove(warehouse);
  }
}
