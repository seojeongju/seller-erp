# 데이터베이스 연결 문제 해결

## 현재 상황

Prisma가 PostgreSQL에 연결하지 못하고 있습니다. 다음 단계를 시도해보세요.

---

## 해결 방법 1: Prisma Studio로 테스트

PowerShell에서 다음 명령어를 실행하세요:

```powershell
cd d:\Program_DEV\Seller\packages\db

# 환경 변수 직접 설정
$env:DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/seller_erp?schema=public"

# Prisma Studio 실행
pnpm prisma studio
```

Prisma Studio가 브라우저에서 열리면 연결이 성공한 것입니다.

---

## 해결 방법 2: .env 파일을 127.0.0.1로 변경

VS Code에서 `packages/db/.env` 파일을 열고:

**기존:**
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public
```

**변경:**
```
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/seller_erp?schema=public
```

그 다음:
```powershell
cd d:\Program_DEV\Seller
pnpm db:migrate
```

---

## 해결 방법 3: 직접 psql로 연결 테스트

```powershell
# Docker를 통해 연결
docker exec -it seller-erp-db psql -U postgres -d seller_erp

# 연결되면 다음 SQL 실행:
SELECT version();
\q
```

연결이 성공하면 데이터베이스는 정상입니다.

---

## 해결 방법 4: db push 사용 (마이그레이션 없이)

```powershell
cd d:\Program_DEV\Seller\packages\db
$env:DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/seller_erp?schema=public"
pnpm prisma db push --accept-data-loss
```

`--accept-data-loss` 플래그는 기존 데이터를 삭제하고 스키마를 새로 생성합니다.

---

## 다음 단계

연결이 성공하면:

```bash
# 테스트 데이터 생성
cd packages\db
pnpm db:seed

# 개발 서버 실행
cd ..\..
pnpm dev
```

---

## 문제가 계속되면

1. Docker 컨테이너 재생성
2. Windows 방화벽 확인
3. 다른 포트 사용 (5433 등)

