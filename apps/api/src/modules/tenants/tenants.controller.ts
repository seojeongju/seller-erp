import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { Tenant, TenantId } from '../../common/decorators/tenant.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@seller-erp/types';

@Controller('tenants')
@UseGuards(TenantGuard)
export class TenantsController {
  constructor(private prisma: PrismaService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentTenant(@Tenant() tenant: any) {
    return tenant;
  }

  @Get('users')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getTenantUsers(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
  ) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }
}

