import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    public readonly customerRepository: Repository<Customer>,
  ) {}
  async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<CreateCustomerDto> {
    const salt = await bcrypt.genSalt();
    createCustomerDto.password = await bcrypt.hash(
      createCustomerDto.password,
      salt,
    );
    console.log(createCustomerDto);
    return this.customerRepository.save(createCustomerDto);
  }

  findAll() {
    return `This action returns all customer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }
  async findUserByUsername(username: string) {
    return await this.customerRepository.findOne({ where: { username } });
  }
  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
  async addLocationToGeoSet(
    username: string,
    longitude: number,
    lattitude: number,
  ): Promise<number> {
    const redis = new Redis({ host: 'localhost', port: 6389 });

    return redis.geoadd('users', longitude, lattitude, username);
  }

  async getCoordinatesForUser(username: string) {
    const redis = new Redis({ host: 'localhost', port: 6389 });
    const city = await redis.get(username);
    const coordinates = await redis.geopos('users', city);
    return coordinates[0];
  }
  async getCitiesInRange(username: string, range: number) {
    console.log(username, range);
    const redis = new Redis({ host: 'localhost', port: 6389 });
    const coords = await this.getCoordinatesForUser(username);
    const citiesInRange = await redis.georadius(
      'City',
      coords[0],
      coords[1],
      range,
      'km',
      'WITHDIST',
    );
    return citiesInRange;
  }
  async logout(username: string) {
    const redis = new Redis({ host: 'localhost', port: 6389 });
    await redis.del(username);
  }
  async getUserCredentials(username: string) {
    console.log(username);
    const redis = new Redis({ host: 'localhost', port: 6389 });
    const obj = await redis.get(username);
    return obj;
  }
}
