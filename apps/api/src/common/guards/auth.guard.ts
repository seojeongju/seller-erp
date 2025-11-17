import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // 테넌트 정보가 있는지 확인 (TenantGuard가 먼저 실행되어야 함)
    const tenantId = request.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('테넌트 정보가 없습니다.');
    }

    // 인증 토큰 추출 (예: Bearer token 또는 세션)
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('인증 토큰이 필요합니다.');
    }

    const token = authHeader.substring(7);

    // TODO: JWT 토큰 검증 또는 NextAuth 세션 검증
    // 현재는 간단히 userId를 헤더에서 받는 것으로 가정
    const userId = request.headers['x-user-id'];
    if (!userId) {
      throw new UnauthorizedException('사용자 정보가 없습니다.');
    }

    // 사용자 조회 및 테넌트 일치 확인
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || user.tenantId !== tenantId) {
      throw new UnauthorizedException('유효하지 않은 사용자입니다.');
    }

    // 요청 객체에 사용자 정보 추가
    request.user = user;

    return true;
  }
}

