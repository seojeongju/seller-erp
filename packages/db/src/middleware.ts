import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Extension: 자동으로 tenantId 필터링
 * 
 * 이 확장은 모든 쿼리에 자동으로 tenantId를 추가하여
 * 데이터 격리를 보장합니다.
 * 
 * 사용법:
 * ```typescript
 * import { prisma } from '@seller-erp/db';
 * import { withTenantFilter } from '@seller-erp/db/middleware';
 * 
 * const tenantId = 'tenant-id';
 * const tenantPrisma = withTenantFilter(prisma, tenantId);
 * 
 * // 이제 모든 쿼리는 자동으로 tenantId로 필터링됩니다
 * const products = await tenantPrisma.product.findMany();
 * ```
 */
export function withTenantFilter<T extends PrismaClient>(
  prisma: T,
  tenantId: string,
): T {
  return (prisma as any).$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          if (!args.where) {
            args.where = {};
          }
          (args.where as any).tenantId = tenantId;
          return query(args);
        },
        async findFirst({ args, query }) {
          if (!args.where) {
            args.where = {};
          }
          (args.where as any).tenantId = tenantId;
          return query(args);
        },
        async findUnique({ args, query }) {
          // findUnique는 where에 tenantId를 추가할 수 없으므로
          // 쿼리 후에 tenantId를 확인해야 함
          const result = await query(args);
          if (result && (result as any).tenantId !== tenantId) {
            return null;
          }
          return result;
        },
        async create({ args, query }) {
          if (args.data && typeof args.data === 'object') {
            (args.data as any).tenantId = tenantId;
          }
          return query(args);
        },
        async update({ args, query }) {
          if (!args.where) {
            args.where = {} as any;
          }
          (args.where as any).tenantId = tenantId;
          return query(args);
        },
        async updateMany({ args, query }) {
          if (!args.where) {
            args.where = {};
          }
          (args.where as any).tenantId = tenantId;
          return query(args);
        },
        async delete({ args, query }) {
          if (!args.where) {
            args.where = {} as any;
          }
          (args.where as any).tenantId = tenantId;
          return query(args);
        },
        async deleteMany({ args, query }) {
          if (!args.where) {
            args.where = {};
          }
          (args.where as any).tenantId = tenantId;
          return query(args);
        },
        async count({ args, query }) {
          if (!args.where) {
            args.where = {};
          }
          (args.where as any).tenantId = tenantId;
          return query(args);
        },
      },
    },
  }) as T;
}

