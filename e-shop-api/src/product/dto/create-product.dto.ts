import { Category } from 'src/category/entities/category.entity';

export class CreateProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: Category;
  image?: string;
}
