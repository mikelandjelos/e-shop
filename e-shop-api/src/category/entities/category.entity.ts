import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'name', length: 50 })
  name: string;

  @Column({ type: 'varchar', name: 'description', length: 500 })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
