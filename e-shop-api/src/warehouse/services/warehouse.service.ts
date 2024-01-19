import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Warehouse } from '../entities/warehouse.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createClient } from 'redis';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    public readonly warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(
    warehouse: Partial<Warehouse>,
    longitude: number,
    latitude: number,
  ): Promise<Warehouse> {
    const createdWarehouse =
      await this.warehouseRepository.save<Partial<Warehouse>>(warehouse);

    const redisClient = await createClient({ url: 'redis://127.0.0.1:6389' });

    await redisClient.connect();

    try {
      await redisClient.geoAdd('warehouses', {
        longitude: longitude,
        latitude: latitude,
        member: warehouse.id,
      });
    } finally {
      await redisClient.disconnect();
    }

    return createdWarehouse;
  }

  async getAllWarehouseIdsForRadius(
    username: string,
    radius: number,
  ): Promise<string[]> {
    const redisClient = await createClient({ url: 'redis://127.0.0.1:6389' });

    await redisClient.connect();

    let warehouseIds: string[] = [];

    try {
      const { longitude, latitude } = (
        await redisClient.geoPos('users', username)
      )[0];

      console.log(longitude, latitude);
      console.log(radius);

      const returnedIds = await redisClient.geoSearch(
        'warehouses',
        { latitude: latitude, longitude: longitude },
        { radius: radius, unit: 'km' },
      );

      console.log(returnedIds);

      warehouseIds = warehouseIds.concat(returnedIds);
    } finally {
      await redisClient.disconnect();
    }

    return warehouseIds;
  }

  async findAll(): Promise<Warehouse[]> {
    const warehouses = await this.warehouseRepository.find();
    return warehouses;
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOneBy({ id });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id '${id}' not found!`);
    }

    return warehouse;
  }

  async update(id: string, updateWarehouseDto: Warehouse): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOneBy({ id });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id '${id}' not found!`);
    }

    this.warehouseRepository.merge(warehouse, updateWarehouseDto);
    const updatedWarehouse = await this.warehouseRepository.save(warehouse);

    return updatedWarehouse;
  }

  async remove(id: string): Promise<void> {
    const warehouse = await this.warehouseRepository.findOneBy({ id });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with id '${id}' not found!`);
    }

    await this.warehouseRepository.remove(warehouse);
  }
}
