import { Order } from 'src/order/entities/order.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'username', length: 50 })
  username: string;

  @Column({ type: 'varchar', name: 'first_name', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', name: 'password', length: 100 })
  password: string;

  @Column({ type: 'varchar', name: 'phone_number', length: 50 })
  phoneNumber: string;

  // ADDRESS - REDIS???

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @OneToMany(() => Payment, (payment) => payment.customer)
  payments: Payment[];
}
