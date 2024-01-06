export class CreateProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}
