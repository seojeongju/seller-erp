import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('dashboard')
@UseGuards(TenantGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  getKPIs(@TenantId() tenantId: string) {
    return this.dashboardService.getKPIs(tenantId);
  }

  @Get('recent-orders')
  getRecentOrders(
    @TenantId() tenantId: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.dashboardService.getRecentOrders(tenantId, limit);
  }

  @Get('sales-trend')
  getSalesTrend(
    @TenantId() tenantId: string,
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number,
  ) {
    return this.dashboardService.getSalesTrend(tenantId, days);
  }

  @Get('top-products')
  getTopProducts(
    @TenantId() tenantId: string,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.dashboardService.getTopProducts(tenantId, limit);
  }

  @Get('order-status')
  getOrderStatusDistribution(@TenantId() tenantId: string) {
    return this.dashboardService.getOrderStatusDistribution(tenantId);
  }
}

