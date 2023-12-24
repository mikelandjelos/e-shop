import { Customer } from 'src/customer/entities/customer.entity';
import { Order } from 'src/order/entities/order.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PaymentMethod {
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card',
  PAYPAL = 'PayPal',
  CASH = 'Cash',
  MOBILE_PAYMENT = 'Mobile Payment',
  GIFT_CARD = 'Gift Card',
}

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', name: 'payment_method', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  // AMOUNT???

  @ManyToOne(() => Customer, (customer) => customer.payments)
  @JoinColumn([{ name: 'customer_id', referencedColumnName: 'id' }])
  customer: Customer;

  @OneToMany(() => Order, (order) => order.payment)
  orders: Order[];
}
