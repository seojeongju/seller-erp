import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus, InventoryStatus } from '@seller-erp/types';
import { PaginationParams } from '@seller-erp/types';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(tenantId: string, createOrderDto: CreateOrderDto) {
    // 주문 번호 생성
    const orderNumber = await this.generateOrderNumber(tenantId);

    // 트랜잭션으로 주문 생성 및 재고 차감
    return this.prisma.$transaction(async (tx) => {
      // 1. 상품 Variant 확인 및 재고 확인
      const variantIds = createOrderDto.items.map((item) => item.variantId);
      const variants = await tx.productVariant.findMany({
        where: {
          id: { in: variantIds },
          tenantId,
        },
        include: {
          product: true,
        },
      });

      if (variants.length !== variantIds.length) {
        throw new NotFoundException('일부 상품을 찾을 수 없습니다.');
      }

      // 2. 재고 확인 및 차감
      for (const item of createOrderDto.items) {
        const variant = variants.find((v) => v.id === item.variantId);
        if (!variant) continue;

        if (variant.quantity < item.quantity) {
          throw new BadRequestException(
            `${variant.name}의 재고가 부족합니다. (현재: ${variant.quantity}, 요청: ${item.quantity})`,
          );
        }

        // 재고 차감
        if (variant.trackSerialNumbers) {
          // 시리얼 넘버 추적: InventoryItem 선택 및 예약
          const availableItems = await tx.inventoryItem.findMany({
            where: {
              variantId: variant.id,
              tenantId,
              status: InventoryStatus.AVAILABLE,
            },
            take: item.quantity,
          });

          if (availableItems.length < item.quantity) {
            throw new BadRequestException(
              `${variant.name}의 사용 가능한 재고가 부족합니다.`,
            );
          }

          // InventoryItem 상태를 RESERVED로 변경
          await tx.inventoryItem.updateMany({
            where: {
              id: { in: availableItems.map((i) => i.id) },
            },
            data: {
              status: InventoryStatus.RESERVED,
            },
          });
        } else {
          // 일반 재고: 수량만 차감
          await tx.productVariant.update({
            where: { id: variant.id },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // 3. 주문 금액 계산
      let subtotal = 0;
      const orderItems = [];

      for (const item of createOrderDto.items) {
        const variant = variants.find((v) => v.id === item.variantId);
        if (!variant) continue;

        const totalPrice = item.unitPrice * item.quantity;
        subtotal += totalPrice;

        orderItems.push({
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice,
          tenantId,
        });
      }

      const tax = createOrderDto.tax || 0;
      const discount = createOrderDto.discount || 0;
      const total = subtotal + tax - discount;

      // 4. 주문 생성
      const order = await tx.order.create({
        data: {
          orderNumber,
          tenantId,
          customerId: createOrderDto.customerId,
          subtotal,
          tax,
          discount,
          total,
          shippingAddress: createOrderDto.shippingAddress,
          shippingMethod: createOrderDto.shippingMethod,
          notes: createOrderDto.notes,
          status: OrderStatus.PENDING,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
          customer: true,
        },
      });

      return order;
    });
  }

  async findAll(tenantId: string, pagination?: PaginationParams) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
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
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.order.count({
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
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        customer: true,
        items: {
          include: {
            variant: {
              include: {
                product: true,
                inventoryItems: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }

    return order;
  }

  async updateStatus(
    tenantId: string,
    id: string,
    updateStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId },
      include: {
        items: {
          include: {
            variant: true,
            inventoryItem: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }

    // 상태 변경에 따른 재고 처리
    return this.prisma.$transaction(async (tx) => {
      if (
        updateStatusDto.status === OrderStatus.COMPLETED &&
        order.status !== OrderStatus.COMPLETED
      ) {
        // 주문 완료: InventoryItem 상태를 SOLD로 변경
        for (const item of order.items) {
          if (item.inventoryItemId) {
            await tx.inventoryItem.update({
              where: { id: item.inventoryItemId },
              data: {
                status: InventoryStatus.SOLD,
              },
            });
          }
        }
      } else if (
        updateStatusDto.status === OrderStatus.CANCELLED &&
        order.status !== OrderStatus.CANCELLED
      ) {
        // 주문 취소: 재고 복구
        for (const item of order.items) {
          const variant = item.variant;
          if (variant.trackSerialNumbers && item.inventoryItemId) {
            // 시리얼 넘버 추적: InventoryItem 상태를 AVAILABLE로 변경
            await tx.inventoryItem.update({
              where: { id: item.inventoryItemId },
              data: {
                status: InventoryStatus.AVAILABLE,
              },
            });
          } else {
            // 일반 재고: 수량 복구
            await tx.productVariant.update({
              where: { id: variant.id },
              data: {
                quantity: {
                  increment: item.quantity,
                },
              },
            });
          }
        }
      }

      return tx.order.update({
        where: { id },
        data: {
          status: updateStatusDto.status,
          completedAt:
            updateStatusDto.status === OrderStatus.COMPLETED
              ? new Date()
              : order.completedAt,
        },
        include: {
          customer: true,
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });
    });
  }

  private async generateOrderNumber(tenantId: string): Promise<string> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('테넌트를 찾을 수 없습니다.');
    }

    const year = new Date().getFullYear();
    const count = await this.prisma.order.count({
      where: {
        tenantId,
        createdAt: {
          gte: new Date(`${year}-01-01`),
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `ORD-${tenant.slug.toUpperCase()}-${year}-${sequence}`;
  }
}

