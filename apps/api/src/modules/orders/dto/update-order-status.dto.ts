import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '@seller-erp/types';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}

