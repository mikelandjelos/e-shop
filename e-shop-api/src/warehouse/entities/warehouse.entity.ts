import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('warehouse')
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // LOCATION???
  @Column({ type: 'varchar', name: 'phone', length: 50 })
  phone: string;

  @OneToMany(() => Product, (product) => product.warehouse)
  products: Product[];
}
