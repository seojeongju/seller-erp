# 수동 데이터베이스 설정 가이드

Prisma 마이그레이션이 계속 실패하는 경우, 수동으로 데이터베이스를 설정할 수 있습니다.

## 방법 1: SQL 스크립트로 직접 생성

### 1. Prisma 스키마를 SQL로 변환

```bash
cd packages/db
pnpm prisma migrate dev --create-only --name init
```

이 명령은 마이그레이션 파일을 생성하지만 실행하지는 않습니다.

### 2. 생성된 SQL 파일 확인

`packages/db/prisma/migrations/` 폴더에 SQL 파일이 생성됩니다.

### 3. Docker를 통해 SQL 실행

```bash
# SQL 파일 내용을 복사하여
docker exec -i seller-erp-db psql -U postgres -d seller_erp < migration.sql
```

---

## 방법 2: Prisma Studio로 수동 생성

```bash
cd packages/db
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"
pnpm prisma studio
```

Prisma Studio가 열리면 테이블을 수동으로 생성할 수 있습니다.

---

## 방법 3: Docker 컨테이너 내부에서 Prisma 실행

```bash
# Prisma를 Docker 컨테이너 내부에서 실행
docker exec -it seller-erp-db sh

# 컨테이너 내부에서
# (이 방법은 복잡하므로 권장하지 않음)
```

---

## 방법 4: 다른 PostgreSQL 클라이언트 사용

DBeaver, pgAdmin 등 다른 클라이언트로 연결하여:
1. Prisma 스키마를 SQL로 변환
2. SQL을 직접 실행

---

## 임시 해결책: 개발 환경에서 SQLite 사용

프로덕션 전에만 사용:

`packages/db/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

```bash
cd packages/db
pnpm prisma db push
```

**주의**: SQLite는 일부 PostgreSQL 기능을 지원하지 않으므로, 프로덕션 전에 PostgreSQL로 변경해야 합니다.

---

## 문제 진단

다음 명령어로 연결을 테스트하세요:

```bash
# 1. Docker 컨테이너 연결 테스트
docker exec seller-erp-db psql -U postgres -d seller_erp -c "SELECT 1;"

# 2. 로컬에서 연결 테스트 (psql이 설치되어 있다면)
psql -h localhost -p 5432 -U postgres -d seller_erp

# 3. 환경 변수 확인
cd packages/db
Get-Content .env
```

---

## 권장 해결 방법

가장 간단한 방법은 **Prisma Studio**를 사용하는 것입니다:

```powershell
cd d:\Program_DEV\Seller\packages\db
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"
pnpm prisma studio
```

Prisma Studio가 열리면 연결이 성공한 것이고, 스키마를 확인할 수 있습니다.

