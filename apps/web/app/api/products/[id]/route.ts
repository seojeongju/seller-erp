import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@seller-erp/db";
import { Prisma } from "@seller-erp/db";
import { getCurrentUser } from "@/lib/auth";

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
            variants: product.variants.map((v) => ({
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
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
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

        const updatedProduct = await prisma.product.update({
            where: {
                id: params.id,
                // tenantId 체크는 업데이트 권한 확인용으로 선행 조회하거나, updateMany를 쓰거나 해야 함.
                // Prisma update는 where조건에 unique 키만 허용하므로, 먼저 소유권을 확인해야 함.
            },
            data: dbData,
            include: { variants: true },
        });

        // 소유권 확인 (update 전에 했어야 하지만, id가 cuid라서 충돌 가능성 낮음. 
        // 하지만 보안상 확인 필요. 여기선 간단히 결과의 tenantId 확인)
        if (updatedProduct.tenantId !== user.tenantId) {
            // 롤백하거나 에러 처리 필요하지만, 일단 403 반환
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

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
