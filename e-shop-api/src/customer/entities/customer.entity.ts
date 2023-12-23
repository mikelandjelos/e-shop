import { Order } from 'src/order/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '' })
  first_name: string;

  @Column({ default: '' })
  last_name: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  password: string;

  @Column({ default: '' })
  phone_number: string;
  @OneToMany(() => Order, (orderEntity) => orderEntity.customer)
  orders: Order[];
}
