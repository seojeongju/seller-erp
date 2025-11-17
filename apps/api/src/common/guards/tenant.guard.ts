import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // 테넌트 슬러그 추출 (헤더 또는 쿼리 파라미터)
    const tenantSlug =
      request.headers['x-tenant-slug'] ||
      request.query.tenant ||
      request.body?.tenantSlug;

    if (!tenantSlug) {
      throw new BadRequestException('테넌트 슬러그가 필요합니다.');
    }

    // 테넌트 조회
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      throw new UnauthorizedException('유효하지 않은 테넌트입니다.');
    }

    // 요청 객체에 테넌트 정보 추가
    request.tenant = tenant;
    request.tenantId = tenant.id;
    request.tenantSlug = tenant.slug;

    return true;
  }
}

