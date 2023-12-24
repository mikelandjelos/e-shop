import { Category } from 'src/category/entities/category.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
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

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @ManyToMany(() => Warehouse, (warehouse) => warehouse.products)
  @JoinColumn([{ name: 'warehouse_id', referencedColumnName: 'id' }])
  warehouse: Warehouse;

  @ManyToMany(() => Category, (warehouse) => warehouse.products)
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  category: Category;
}
