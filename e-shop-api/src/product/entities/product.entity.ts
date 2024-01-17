import { Category } from 'src/category/entities/category.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'name', length: 50 })
  name: string;

  @Column({ type: 'varchar', name: 'description', length: 500 })
  description: string;

  @Column({ type: 'decimal', name: 'price' })
  price: number;

  @Column({ type: 'integer', name: 'stock' })
  stock: number;
  @Column({ type: 'text', name: 'image', nullable: true })
  image: string;
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.products)
  @JoinColumn([{ name: 'warehouse_id', referencedColumnName: 'id' }])
  warehouse: Warehouse;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  category: Category;
}
