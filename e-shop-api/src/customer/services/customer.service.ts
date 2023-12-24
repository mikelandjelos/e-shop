import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Observable, from } from 'rxjs';
import * as bcrypt from 'bcrypt';
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
}
