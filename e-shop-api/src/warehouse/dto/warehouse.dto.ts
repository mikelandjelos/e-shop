import { IsNotEmpty, IsNumberString, IsUUID } from 'class-validator';
import { Warehouse } from '../entities/warehouse.entity';

export class WarehouseDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsNumberString()
  phone: string;

  static fromEntity(entity: Warehouse): WarehouseDto {
    const dto = new WarehouseDto();
    dto.id = entity.id;
    dto.phone = entity.phone;
    return dto;
  }
}
