import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@seller-erp/db";
import { Prisma } from "@seller-erp/db";
import { getCurrentUser } from "@/lib/auth";
export const runtime = 'edge';

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

// GET /api/products
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search");
        const category = searchParams.get("category");
        const brand = searchParams.get("brand");
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = {
            tenantId: user.tenantId,
        };

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { sku: { contains: search } },
            ];
        }

        if (category) where.category = category;
        if (brand) where.brand = brand;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
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
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            prisma.product.count({ where }),
        ]);

        const transformedData = products.map((product) => ({
            ...product,
            imageUrls: safeParse(product.imageUrls, []),
            tags: safeParse(product.tags, []),
            noticeInfo: safeParse(product.noticeInfo, {}),
        }));

        return NextResponse.json({
            data: transformedData,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST /api/products
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { variants, ...productData } = body;

        const dbData = {
            ...productData,
            imageUrls: safeStringify(productData.imageUrls, "[]"),
            tags: safeStringify(productData.tags, "[]"),
            noticeInfo: safeStringify(productData.noticeInfo, "{}"),
            tenantId: user.tenantId,
            // Decimal 필드 처리 (Prisma가 자동으로 처리해주지 않는 경우 대비)
            price: productData.price ? new Prisma.Decimal(productData.price) : null,
            consumerPrice: productData.consumerPrice ? new Prisma.Decimal(productData.consumerPrice) : null,
            cost: productData.cost ? new Prisma.Decimal(productData.cost) : null,
            shippingFee: productData.shippingFee ? new Prisma.Decimal(productData.shippingFee) : 0,
        };

        const newProduct = await prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: dbData,
            });

            if (variants && variants.length > 0) {
                await tx.productVariant.createMany({
                    data: variants.map((variant: any) => ({
                        ...variant,
                        attributes: safeStringify(variant.attributes, "{}"),
                        productId: product.id,
                        tenantId: user.tenantId,
                        price: new Prisma.Decimal(variant.price),
                        cost: variant.cost ? new Prisma.Decimal(variant.cost) : null,
                    })),
                });
            }

            return product;
        });

        // 방금 생성한 상품 조회 (응답용)
        const createdProduct = await prisma.product.findUnique({
            where: { id: newProduct.id },
            include: { variants: true },
        });

        if (!createdProduct) throw new Error("Product creation failed");

        // 변환 후 응답
        const responseData = {
            ...createdProduct,
            imageUrls: safeParse(createdProduct.imageUrls, []),
            tags: safeParse(createdProduct.tags, []),
            noticeInfo: safeParse(createdProduct.noticeInfo, {}),
            variants: createdProduct.variants.map(v => ({
                ...v,
                attributes: safeParse(v.attributes as string, {})
            }))
        };

        return NextResponse.json({ data: responseData }, { status: 201 });
    } catch (error: any) {
        console.error("Failed to create product:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
