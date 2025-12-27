import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@seller-erp/db";
import { getDbClient } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
export const runtime = 'edge';

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

// GET /api/products/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const prisma = getDbClient();
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const product = await prisma.product.findFirst({
            where: {
                id: params.id,
                tenantId: user.tenantId,
            },
            include: {
                variants: {
                    include: {
                        inventoryItems: {
                            where: {
                                status: "AVAILABLE",
                            },
                        },
                    },
                },
            },
        });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        const responseData = {
            ...product,
            imageUrls: safeParse(product.imageUrls, []),
            tags: safeParse(product.tags, []),
            noticeInfo: safeParse(product.noticeInfo, {}),
            variants: product.variants.map((v: any) => ({
                ...v,
                attributes: safeParse(v.attributes as string, {}),
            })),
        };

        return NextResponse.json({ data: responseData });
    } catch (error: any) {
        console.error("Failed to fetch product:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// PATCH /api/products/[id]
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const prisma = getDbClient();
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json() as Record<string, any>;
        const dbData: any = { ...body };

        // JSON Stringify
        if (dbData.imageUrls) dbData.imageUrls = safeStringify(dbData.imageUrls, "[]");
        if (dbData.tags) dbData.tags = safeStringify(dbData.tags, "[]");
        if (dbData.noticeInfo) dbData.noticeInfo = safeStringify(dbData.noticeInfo, "{}");

        // Decimal Convert
        if (dbData.price) dbData.price = new Prisma.Decimal(dbData.price);
        if (dbData.consumerPrice) dbData.consumerPrice = new Prisma.Decimal(dbData.consumerPrice);
        if (dbData.cost) dbData.cost = new Prisma.Decimal(dbData.cost);
        if (dbData.shippingFee) dbData.shippingFee = new Prisma.Decimal(dbData.shippingFee);

        // 먼저 소유권 확인
        const existingProduct = await prisma.product.findFirst({
            where: { id: params.id, tenantId: user.tenantId }
        });

        if (!existingProduct) {
            return NextResponse.json({ message: "Product not found or forbidden" }, { status: 404 });
        }

        const updatedProduct = await prisma.product.update({
            where: {
                id: params.id,
            },
            data: dbData,
            include: { variants: true },
        });

        const responseData = {
            ...updatedProduct,
            imageUrls: safeParse(updatedProduct.imageUrls, []),
            tags: safeParse(updatedProduct.tags, []),
            noticeInfo: safeParse(updatedProduct.noticeInfo, {}),
        };

        return NextResponse.json({ data: responseData });

    } catch (error: any) {
        console.error("Failed to update product:", error);
        if (error.code === 'P2025') {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE /api/products/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const prisma = getDbClient();
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 소유권 확인
        const product = await prisma.product.findFirst({
            where: { id: params.id, tenantId: user.tenantId },
        });

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: any) {
        console.error("Failed to delete product:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
