import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { Prisma } from '@prisma/client';

// D1 호환성을 위한 JSON 파싱 헬퍼
const safeParse = (value: string | null, defaultValue: any) => {
    if (!value) return defaultValue;
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

const safeStringify = (value: any, defaultValue: string = '[]') => {
    if (value === undefined || value === null) return defaultValue;
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
};

@Injectable()
export class CatalogsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, createCatalogDto: CreateCatalogDto) {
        const dbData = {
            ...createCatalogDto,
            imageUrls: safeStringify(createCatalogDto.imageUrls, '[]'),
            specifications: safeStringify(createCatalogDto.specifications, '{}'),
            tenantId,
        };

        const catalog = await this.prisma.productCatalog.create({
            data: dbData as any,
        });

        return {
            ...catalog,
            imageUrls: safeParse(catalog.imageUrls, []),
            specifications: safeParse(catalog.specifications, {}),
        };
    }

    async findAll(
        tenantId: string,
        params: {
            page?: number;
            limit?: number;
            search?: string;
        },
    ) {
        const page = params.page || 1;
        const limit = params.limit || 10;
        const skip = (page - 1) * limit;

        const where: Prisma.ProductCatalogWhereInput = {
            tenantId,
        };

        if (params.search) {
            where.OR = [
                { name: { contains: params.search } },
                { brand: { contains: params.search } },
                { category: { contains: params.search } },
            ];
        }

        const [data, total] = await Promise.all([
            this.prisma.productCatalog.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.productCatalog.count({ where }),
        ]);

        const transformedData = data.map(catalog => ({
            ...catalog,
            imageUrls: safeParse(catalog.imageUrls, []),
            specifications: safeParse(catalog.specifications, {}),
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
        const catalog = await this.prisma.productCatalog.findFirst({
            where: { id, tenantId },
        });

        if (!catalog) {
            throw new NotFoundException('상품 카탈로그를 찾을 수 없습니다.');
        }

        return {
            ...catalog,
            imageUrls: safeParse(catalog.imageUrls, []),
            specifications: safeParse(catalog.specifications, {}),
        };
    }

    async update(
        tenantId: string,
        id: string,
        updateCatalogDto: UpdateCatalogDto,
    ) {
        const catalog = await this.prisma.productCatalog.findFirst({
            where: { id, tenantId },
        });

        if (!catalog) {
            throw new NotFoundException('상품 카탈로그를 찾을 수 없습니다.');
        }

        const dbData: any = { ...updateCatalogDto };
        if (dbData.imageUrls) dbData.imageUrls = safeStringify(dbData.imageUrls);
        if (dbData.specifications) dbData.specifications = safeStringify(dbData.specifications);

        const updatedCatalog = await this.prisma.productCatalog.update({
            where: { id },
            data: dbData,
        });

        return {
            ...updatedCatalog,
            imageUrls: safeParse(updatedCatalog.imageUrls, []),
            specifications: safeParse(updatedCatalog.specifications, {}),
        };
    }

    async remove(tenantId: string, id: string) {
        const catalog = await this.prisma.productCatalog.findFirst({
            where: { id, tenantId },
        });

        if (!catalog) {
            throw new NotFoundException('상품 카탈로그를 찾을 수 없습니다.');
        }

        return this.prisma.productCatalog.delete({
            where: { id },
        });
    }
}
