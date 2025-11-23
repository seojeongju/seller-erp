import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseEnumPipe,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';
import { InventoryStatus } from '@seller-erp/types';

@Controller('inventory')
@UseGuards(TenantGuard, AuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  @Post('items')
  createInventoryItem(
    @TenantId() tenantId: string,
    @Body('variantId') variantId: string,
    @Body() createDto: Omit<CreateInventoryItemDto, 'variantId'>,
  ) {
    return this.inventoryService.createInventoryItem(
      tenantId,
      variantId,
      createDto,
    );
  }

  @Post('adjust')
  adjustInventory(
    @TenantId() tenantId: string,
    @Body() adjustDto: AdjustInventoryDto,
  ) {
    return this.inventoryService.adjustInventory(tenantId, adjustDto);
  }

  @Get('items')
  getInventoryItems(
    @TenantId() tenantId: string,
    @Query('variantId') variantId?: string,
    @Query('status', new ParseEnumPipe(InventoryStatus, { optional: true }))
    status?: InventoryStatus,
  ) {
    return this.inventoryService.getInventoryItems(tenantId, variantId, status);
  }

  @Get('variants')
  getInventoryVariants(
    @TenantId() tenantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.inventoryService.getInventoryVariants(tenantId, {
      page,
      limit,
      search,
      status,
    });
  }

  @Get('variants/:id')
  getInventoryVariantDetails(
    @TenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.inventoryService.getInventoryVariantDetails(tenantId, id);
  }

  @Get('alerts')
  getLowStockAlerts(
    @TenantId() tenantId: string,
    @Query('threshold') threshold?: string,
  ) {
    const thresholdNum = threshold ? parseInt(threshold, 10) : 10;
    return this.inventoryService.getLowStockAlerts(tenantId, thresholdNum);
  }
}

