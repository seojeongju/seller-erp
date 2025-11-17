import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  Min,
} from 'class-validator';

export enum InventoryAdjustmentType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUST = 'ADJUST',
}

export class AdjustInventoryDto {
  @IsString()
  @IsNotEmpty()
  variantId: string;

  @IsEnum(InventoryAdjustmentType)
  @IsNotEmpty()
  type: InventoryAdjustmentType;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

