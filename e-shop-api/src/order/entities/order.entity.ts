import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Customer, (customerEntity) => customerEntity.orders)
  customer: Customer;
}
