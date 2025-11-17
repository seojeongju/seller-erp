# 빠른 해결 방법

## 현재 상황
- ✅ Docker 컨테이너 정상 실행 중
- ✅ 데이터베이스 연결 가능 (docker exec로 확인)
- ❌ Prisma 마이그레이션 실패

## 해결 방법: Prisma Studio로 연결 테스트

PowerShell에서 다음 명령어를 실행하세요:

```powershell
cd d:\Program_DEV\Seller\packages\db

# 환경 변수 설정
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"

# Prisma Studio 실행
pnpm prisma studio
```

**성공하면**: 브라우저에서 http://localhost:5555 가 열립니다.
**실패하면**: 다른 문제가 있는 것입니다.

---

## Prisma Studio가 성공하면

Prisma Studio가 열리면 연결이 성공한 것이므로, 다음을 시도하세요:

### 방법 1: db push 사용

```powershell
cd d:\Program_DEV\Seller\packages\db
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"
pnpm prisma db push --accept-data-loss
```

### 방법 2: 마이그레이션 파일 생성 후 수동 실행

```powershell
# 마이그레이션 파일만 생성 (실행 안 함)
pnpm prisma migrate dev --create-only --name init

# 생성된 SQL 파일 확인
Get-Content prisma\migrations\*\migration.sql

# Docker로 SQL 실행
docker exec -i seller-erp-db psql -U postgres -d seller_erp < prisma\migrations\*\migration.sql
```

---

## Prisma Studio도 실패하면

다음을 확인하세요:

1. **포트 충돌**: 다른 프로그램이 5432 포트를 사용 중일 수 있습니다
   ```powershell
   netstat -ano | findstr :5432
   ```

2. **방화벽**: Windows 방화벽이 PostgreSQL 연결을 차단할 수 있습니다

3. **Prisma 버전**: Prisma를 최신 버전으로 업데이트
   ```powershell
   cd packages/db
   pnpm add -D prisma@latest
   pnpm add @prisma/client@latest
   ```

---

## 대안: SQLite로 임시 개발

프로덕션 전에만 사용:

`packages/db/prisma/schema.prisma`의 `datasource` 부분을:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

로 변경한 후:
```bash
cd packages/db
pnpm prisma db push
```

**주의**: 나중에 PostgreSQL로 다시 변경해야 합니다!

