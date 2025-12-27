import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { PaginationParams } from '@seller-erp/types';
import { Prisma } from '@prisma/client';
import { parse } from 'csv-parse/sync';

// D1 호환성을 위한 JSON 파싱 헬퍼
const safeParse = (value: string | null, defaultValue: any) => {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value);
  } catch {
    return value; // 파싱 실패 시 원본 반환 (혹은 defaultValue)
  }
};

const safeStringify = (value: any, defaultValue: string = '[]') => {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === 'string') return value; // 이미 문자열이면 그대로
  return JSON.stringify(value);
};

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(tenantId: string, createProductDto: CreateProductDto) {
    const { variants, ...productData } = createProductDto;

    // D1 호환: Array/Object -> JSON String 변환
    const dbData = {
      ...productData,
      imageUrls: safeStringify(productData.imageUrls, '[]'),
      tags: safeStringify(productData.tags, '[]'),
      noticeInfo: safeStringify(productData.noticeInfo, '{}'),
      tenantId,
    };

    // 트랜잭션으로 상품과 변형을 함께 생성
    const product = await this.prisma.$transaction(async (prisma) => {
      // 상품 생성
      const createdProduct = await prisma.product.create({
        data: dbData as any, // Prisma 타입 불일치 회피
      });

      // 변형이 있으면 함께 생성
      if (variants && variants.length > 0) {
        await prisma.productVariant.createMany({
          data: variants.map((variant) => ({
            ...variant,
            attributes: safeStringify(variant.attributes, '{}'),
            productId: createdProduct.id,
            tenantId,
          })),
        });
      }

      return createdProduct;
    });

    // 결과 반환 시 다시 객체로 변환하여 리턴
    return this.findOne(tenantId, product.id);
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
        { name: { contains: params.search } }, // SQLite는 mode: insensitive 지원 미약하지만 일단 제거하거나 유지. Prisma가 매핑해줄 수도 있음.
        { sku: { contains: params.search } },
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

    // DB JSON String -> Object 변환
    const transformedData = data.map(product => ({
      ...product,
      imageUrls: safeParse(product.imageUrls, []),
      tags: safeParse(product.tags, []),
      noticeInfo: safeParse(product.noticeInfo, {}),
    }));

    return {
      data: transformedData,
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

    // 변형 데이터 파싱
    const variants = product.variants.map(v => ({
      ...v,
      attributes: safeParse(v.attributes as string, {}),
    }));

    return {
      ...product,
      imageUrls: safeParse(product.imageUrls, []),
      tags: safeParse(product.tags, []),
      noticeInfo: safeParse(product.noticeInfo, {}),
      variants,
    };
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

    const dbData: any = { ...updateProductDto };
    if (dbData.imageUrls) dbData.imageUrls = safeStringify(dbData.imageUrls);
    if (dbData.tags) dbData.tags = safeStringify(dbData.tags);
    if (dbData.noticeInfo) dbData.noticeInfo = safeStringify(dbData.noticeInfo);

    await this.prisma.product.update({
      where: { id },
      data: dbData,
    });

    return this.findOne(tenantId, id);
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
        attributes: safeStringify(createVariantDto.attributes, '{}'),
        productId,
        tenantId,
      } as any,
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

    const dbData: any = { ...updateVariantDto };
    if (dbData.attributes) dbData.attributes = safeStringify(dbData.attributes);

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: dbData,
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

  async bulkUpload(tenantId: string, fileBuffer: Buffer) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    let records: any[];
    try {
      records = parse(fileBuffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch (e) {
      throw new BadRequestException('CSV 파일 파싱에 실패했습니다.');
    }

    // SKU 기준으로 그룹화
    const productMap = new Map<string, any[]>();

    for (const row of records) {
      const sku = row['SKU*'];
      if (!sku) {
        results.failed++;
        results.errors.push('SKU가 없는 행이 있습니다.');
        continue;
      }

      if (!productMap.has(sku)) {
        productMap.set(sku, []);
      }
      productMap.get(sku).push(row);
    }

    // 각 상품별로 처리
    for (const [sku, rows] of productMap.entries()) {
      try {
        await this.prisma.$transaction(async (tx) => {
          // 첫 번째 행의 정보로 상품 생성
          const firstRow = rows[0];

          // 필수 값 검증
          if (!firstRow['상품명*']) throw new Error(`상품명 누락 (SKU: ${sku})`);

          // 이미 존재하는 SKU인지 확인
          const existingProduct = await tx.product.findFirst({
            where: { tenantId, sku },
          });

          if (existingProduct) {
            throw new Error(`이미 존재하는 상품 SKU입니다: ${sku}`);
          }

          // 이미지 URL 처리
          const imageUrlsArr = [
            firstRow['이미지URL1'],
            firstRow['이미지URL2'],
            firstRow['이미지URL3'],
          ].filter(url => url && url.trim() !== '');

          // 상품 생성
          const product = await tx.product.create({
            data: {
              tenantId,
              name: firstRow['상품명*'],
              sku: sku,
              description: firstRow['설명'] || '',
              category: firstRow['카테고리'] || '',
              brand: firstRow['브랜드'] || '',
              imageUrls: JSON.stringify(imageUrlsArr), // Stringify
              noticeInfo: '{}', // Default JSON object
              tags: '[]', // Default array
            },
          });

          // 옵션 생성
          for (const row of rows) {
            if (!row['옵션명*']) throw new Error(`옵션명 누락 (SKU: ${sku})`);
            if (!row['판매가*']) throw new Error(`판매가 누락 (SKU: ${sku})`);

            const price = parseFloat(row['판매가*'].replace(/,/g, ''));
            const cost = row['원가'] ? parseFloat(row['원가'].replace(/,/g, '')) : 0;
            const quantity = parseInt(row['재고수량*'].replace(/,/g, '')) || 0;
            const trackSerialNumbers = (row['시리얼추적(Y/N)'] || 'N').toUpperCase() === 'Y';

            if (isNaN(price)) throw new Error(`유효하지 않은 가격 (SKU: ${sku})`);

            await tx.productVariant.create({
              data: {
                tenantId,
                productId: product.id,
                name: row['옵션명*'],
                sku: row['옵션SKU'] || null,
                price: new Prisma.Decimal(price),
                cost: new Prisma.Decimal(cost),
                quantity,
                trackSerialNumbers,
                attributes: '{}', // 기본값 Stringified
              },
            });
          }
        });

        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(error.message || `알 수 없는 오류 (SKU: ${sku})`);
      }
    }

    return results;
  }
}
