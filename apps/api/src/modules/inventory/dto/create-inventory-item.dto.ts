import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { InventoryStatus } from '@seller-erp/types';

export class CreateInventoryItemDto {
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  batchNumber?: string;

  @IsString()
  @IsOptional()
  lotNumber?: string;

  @IsEnum(InventoryStatus)
  @IsOptional()
  status?: InventoryStatus;

  @IsDateString()
  @IsOptional()
  receivedDate?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @IsString()
  @IsOptional()
  location?: string;
}

