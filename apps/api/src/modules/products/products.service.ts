import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { PaginationParams } from '@seller-erp/types';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(tenantId: string, createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        tenantId,
      },
      include: {
        variants: true,
      },
    });
  }

  async findAll(
    tenantId: string,
    params?: PaginationParams & {
      search?: string;
      category?: string;
      brand?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    },
  ) {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { tenantId };

    // Search by name or SKU
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { sku: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    // Filter by category
    if (params?.category) {
      where.category = params.category;
    }

    // Filter by brand
    if (params?.brand) {
      where.brand = params.brand;
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (params?.sortBy) {
      orderBy[params.sortBy] = params.sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc'; // Default sort
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          variants: {
            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              quantity: true,
              trackSerialNumbers: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.product.count({
        where,
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
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        variants: {
          include: {
            inventoryItems: {
              where: {
                status: 'AVAILABLE',
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    return product;
  }

  async update(
    tenantId: string,
    id: string,
    updateProductDto: UpdateProductDto,
  ) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenantId },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        variants: true,
      },
    });
  }

  async remove(tenantId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenantId },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  // ProductVariant 관련 메서드
  async createVariant(
    tenantId: string,
    productId: string,
    createVariantDto: CreateProductVariantDto,
  ) {
    // 상품이 해당 테넌트에 속하는지 확인
    const product = await this.prisma.product.findFirst({
      where: { id: productId, tenantId },
    });

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    return this.prisma.productVariant.create({
      data: {
        ...createVariantDto,
        productId,
        tenantId,
        quantity: createVariantDto.quantity || 0,
      },
    });
  }

  async updateVariant(
    tenantId: string,
    variantId: string,
    updateVariantDto: UpdateProductVariantDto,
  ) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, tenantId },
    });

    if (!variant) {
      throw new NotFoundException('상품 옵션을 찾을 수 없습니다.');
    }

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: updateVariantDto,
    });
  }

  async removeVariant(tenantId: string, variantId: string) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, tenantId },
    });

    if (!variant) {
      throw new NotFoundException('상품 옵션을 찾을 수 없습니다.');
    }

    return this.prisma.productVariant.delete({
      where: { id: variantId },
    });
  }
}

