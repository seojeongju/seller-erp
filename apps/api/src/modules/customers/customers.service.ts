import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationParams } from '@seller-erp/types';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        tenantId,
      },
    });
  }

  async findAll(tenantId: string, pagination?: PaginationParams) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where: { tenantId },
        include: {
          _count: {
            select: {
              orders: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.customer.count({
        where: { tenantId },
      }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(tenantId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        orders: {
          include: {
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // 최근 10개 주문만
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('고객을 찾을 수 없습니다.');
    }

    return customer;
  }

  async update(
    tenantId: string,
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, tenantId },
    });

    if (!customer) {
      throw new NotFoundException('고객을 찾을 수 없습니다.');
    }

    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(tenantId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, tenantId },
    });

    if (!customer) {
      throw new NotFoundException('고객을 찾을 수 없습니다.');
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async getCustomerStats(tenantId: string, customerId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId, tenantId },
    });

    if (!customer) {
      throw new NotFoundException('고객을 찾을 수 없습니다.');
    }

    const [totalOrders, totalSpent, lastOrder] = await Promise.all([
      this.prisma.order.count({
        where: {
          customerId,
          tenantId,
        },
      }),
      this.prisma.order.aggregate({
        where: {
          customerId,
          tenantId,
          status: 'COMPLETED',
        },
        _sum: {
          total: true,
        },
      }),
      this.prisma.order.findFirst({
        where: {
          customerId,
          tenantId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          orderNumber: true,
          total: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      customer,
      stats: {
        totalOrders,
        totalSpent: totalSpent._sum.total || 0,
        lastOrder,
      },
    };
  }
}

