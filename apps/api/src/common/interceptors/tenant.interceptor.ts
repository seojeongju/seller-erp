import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.tenantId;

    // Prisma Client에 tenantId를 자동으로 필터링하도록 설정
    // 이는 Prisma Middleware와 함께 작동합니다.
    if (tenantId) {
      // 요청에 tenantId를 추가하여 서비스에서 사용할 수 있도록 함
      request.tenantId = tenantId;
    }

    return next.handle();
  }
}

