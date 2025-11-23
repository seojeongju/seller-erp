import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import {
  AdjustInventoryDto,
  InventoryAdjustmentType,
} from './dto/adjust-inventory.dto';
import { InventoryStatus } from '@seller-erp/types';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) { }

  async createInventoryItem(
    tenantId: string,
    variantId: string,
    createDto: CreateInventoryItemDto,
  ) {
    // Variant가 해당 테넌트에 속하는지 확인
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, tenantId },
    });

    if (!variant) {
      throw new NotFoundException('상품 옵션을 찾을 수 없습니다.');
    }

    if (!variant.trackSerialNumbers) {
      throw new BadRequestException(
        '이 상품 옵션은 시리얼 넘버 추적을 지원하지 않습니다.',
      );
    }

    // 시리얼 넘버 중복 확인
    if (createDto.serialNumber) {
      const existing = await this.prisma.inventoryItem.findFirst({
        where: {
          serialNumber: createDto.serialNumber,
          tenantId,
        },
      });

      if (existing) {
        throw new BadRequestException('이미 존재하는 시리얼 넘버입니다.');
      }
    }

    // 트랜잭션으로 InventoryItem 생성 및 Variant 수량 증가
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.create({
        data: {
          ...createDto,
          variantId,
          tenantId,
          status: createDto.status || InventoryStatus.AVAILABLE,
        },
      });

      // Variant 수량 증가
      await tx.productVariant.update({
        where: { id: variantId },
        data: {
          quantity: {
            increment: 1,
          },
        },
      });

      return item;
    });
  }

  async adjustInventory(
    tenantId: string,
    adjustDto: AdjustInventoryDto,
  ) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: adjustDto.variantId, tenantId },
    });

    if (!variant) {
      throw new NotFoundException('상품 옵션을 찾을 수 없습니다.');
    }

    // 트랜잭션으로 재고 조정
    return this.prisma.$transaction(async (tx) => {
      if (variant.trackSerialNumbers) {
        // 시리얼 넘버 추적: InventoryItem 생성/삭제
        if (adjustDto.type === InventoryAdjustmentType.IN) {
          // 입고: InventoryItem 생성
          for (let i = 0; i < adjustDto.quantity; i++) {
            await tx.inventoryItem.create({
              data: {
                variantId: variant.id,
                tenantId,
                status: InventoryStatus.AVAILABLE,
                receivedDate: new Date(),
              },
            });
          }
        } else if (adjustDto.type === InventoryAdjustmentType.OUT) {
          // 출고: 사용 가능한 InventoryItem 선택 및 삭제
          const availableItems = await tx.inventoryItem.findMany({
            where: {
              variantId: variant.id,
              tenantId,
              status: InventoryStatus.AVAILABLE,
            },
            take: adjustDto.quantity,
          });

          if (availableItems.length < adjustDto.quantity) {
            throw new BadRequestException('재고가 부족합니다.');
          }

          await tx.inventoryItem.deleteMany({
            where: {
              id: {
                in: availableItems.map((item) => item.id),
              },
            },
          });
        }
      }

      // Variant 수량 업데이트
      let quantityChange = 0;
      if (adjustDto.type === InventoryAdjustmentType.IN) {
        quantityChange = adjustDto.quantity;
      } else if (adjustDto.type === InventoryAdjustmentType.OUT) {
        quantityChange = -adjustDto.quantity;
      } else if (adjustDto.type === InventoryAdjustmentType.ADJUST) {
        // 조정: 현재 수량을 목표 수량으로 설정
        const currentQuantity = variant.quantity;
        quantityChange = adjustDto.quantity - currentQuantity;
      }

      const newQuantity = variant.quantity + quantityChange;
      if (newQuantity < 0) {
        throw new BadRequestException('재고가 부족합니다.');
      }

      return tx.productVariant.update({
        where: { id: variant.id },
        data: {
          quantity: newQuantity,
        },
        include: {
          inventoryItems: {
            where: {
              status: InventoryStatus.AVAILABLE,
            },
          },
        },
      });
    });
  }

  async getInventoryItems(
    tenantId: string,
    variantId?: string,
    status?: InventoryStatus,
  ) {
    const where: Prisma.InventoryItemWhereInput = {
      tenantId,
    };

    if (variantId) {
      where.variantId = variantId;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.inventoryItem.findMany({
      where,
      include: {
        variant: {
          select: {
            id: true,
            name: true,
            sku: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getInventoryVariants(
    tenantId: string,
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    },
  ) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductVariantWhereInput = {
      tenantId,
    };

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { sku: { contains: params.search, mode: 'insensitive' } },
        { product: { name: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    if (params.status) {
      if (params.status === 'LOW_STOCK') {
        where.quantity = { lte: 10 }; // 임시 기준
      } else if (params.status === 'OUT_OF_STOCK') {
        where.quantity = { equals: 0 };
      } else if (params.status === 'IN_STOCK') {
        where.quantity = { gt: 0 };
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.productVariant.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              imageUrls: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      this.prisma.productVariant.count({ where }),
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

  async getInventoryVariantDetails(tenantId: string, variantId: string) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, tenantId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            imageUrls: true,
          },
        },
        inventoryItems: {
          where: {
            status: { not: InventoryStatus.SOLD },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException('상품 옵션을 찾을 수 없습니다.');
    }

    const history: any[] = [];

    return {
      ...variant,
      history,
    };
  }

  async getLowStockAlerts(tenantId: string, threshold: number = 10) {
    const variants = await this.prisma.productVariant.findMany({
      where: {
        tenantId,
        quantity: {
          lte: threshold,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
      orderBy: {
        quantity: 'asc',
      },
    });

    return variants;
  }
}
