import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@seller-erp/types';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getKPIs(tenantId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    // 총 매출 (이번 달 완료된 주문)
    const monthlyRevenue = await this.prisma.order.aggregate({
      where: {
        tenantId,
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        total: true,
      },
    });

    // 오늘 매출
    const todayRevenue = await this.prisma.order.aggregate({
      where: {
        tenantId,
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: startOfDay,
        },
      },
      _sum: {
        total: true,
      },
    });

    // 총 주문 수 (이번 달)
    const monthlyOrders = await this.prisma.order.count({
      where: {
        tenantId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // 오늘 주문 수
    const todayOrders = await this.prisma.order.count({
      where: {
        tenantId,
        createdAt: {
          gte: startOfDay,
        },
      },
    });

    // 대기 중인 주문 수
    const pendingOrders = await this.prisma.order.count({
      where: {
        tenantId,
        status: OrderStatus.PENDING,
      },
    });

    // 낮은 재고 항목 수 (10개 이하)
    const lowStockItems = await this.prisma.productVariant.count({
      where: {
        tenantId,
        quantity: {
          lte: 10,
        },
      },
    });

    // 총 고객 수
    const totalCustomers = await this.prisma.customer.count({
      where: {
        tenantId,
      },
    });

    // 총 상품 수
    const totalProducts = await this.prisma.product.count({
      where: {
        tenantId,
      },
    });

    return {
      revenue: {
        monthly: Number(monthlyRevenue._sum.total || 0),
        today: Number(todayRevenue._sum.total || 0),
      },
      orders: {
        monthly: monthlyOrders,
        today: todayOrders,
        pending: pendingOrders,
      },
      inventory: {
        lowStock: lowStockItems,
      },
      customers: {
        total: totalCustomers,
      },
      products: {
        total: totalProducts,
      },
    };
  }

  async getRecentOrders(tenantId: string, limit: number = 10) {
    return this.prisma.order.findMany({
      where: { tenantId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
      take: limit,
    });
  }

  async getSalesTrend(tenantId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.prisma.order.findMany({
      where: {
        tenantId,
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // 날짜별로 그룹화
    const dailySales: Record<string, number> = {};
    
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = 0;
      }
      dailySales[date] += Number(order.total);
    });

    // 날짜 배열 생성 및 데이터 포맷팅
    const dates: string[] = [];
    const sales: number[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dates.push(dateStr);
      sales.push(dailySales[dateStr] || 0);
    }

    return {
      dates,
      sales,
    };
  }

  async getTopProducts(tenantId: string, limit: number = 5) {
    const orders = await this.prisma.order.findMany({
      where: {
        tenantId,
        status: OrderStatus.COMPLETED,
      },
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
    });

    // 상품별 판매량 집계
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.variant.product.id;
        const productName = item.variant.product.name;
        
        if (!productSales[productId]) {
          productSales[productId] = {
            name: productName,
            quantity: 0,
            revenue: 0,
          };
        }
        
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += Number(item.totalPrice);
      });
    });

    // 판매량 기준으로 정렬
    const topProducts = Object.entries(productSales)
      .map(([id, data]) => ({
        productId: id,
        ...data,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);

    return topProducts;
  }

  async getOrderStatusDistribution(tenantId: string) {
    const statusCounts = await this.prisma.order.groupBy({
      by: ['status'],
      where: {
        tenantId,
      },
      _count: {
        id: true,
      },
    });

    return statusCounts.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));
  }
}

