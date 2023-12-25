import { OmitType } from '@nestjs/mapped-types';
import { WarehouseDto } from './warehouse.dto';

export class CreateWarehouseDto extends OmitType(WarehouseDto, ['id']) {}
