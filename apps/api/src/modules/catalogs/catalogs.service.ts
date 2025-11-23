import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CatalogsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, createCatalogDto: CreateCatalogDto) {
        return this.prisma.productCatalog.create({
            data: {
                ...createCatalogDto,
                tenantId,
            },
        });
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
                { name: { contains: params.search, mode: 'insensitive' } },
                { brand: { contains: params.search, mode: 'insensitive' } },
                { category: { contains: params.search, mode: 'insensitive' } },
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
        const catalog = await this.prisma.productCatalog.findFirst({
            where: { id, tenantId },
        });

        if (!catalog) {
            throw new NotFoundException('상품 카탈로그를 찾을 수 없습니다.');
        }

        return catalog;
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

        return this.prisma.productCatalog.update({
            where: { id },
            data: updateCatalogDto,
        });
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
