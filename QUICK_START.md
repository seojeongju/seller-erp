# 빠른 시작 가이드

로컬에서 프로젝트를 실행하는 방법입니다.

## 필수 요구사항

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+ (또는 Docker로 PostgreSQL 실행)

---

## 1단계: 환경 변수 설정

### 루트 `.env.local` 파일 생성

```bash
# 루트 디렉토리에 .env.local 파일 생성
```

파일 내용:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/seller_erp?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production-min-32-chars"
```

### `apps/web/.env.local` 파일 생성

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production-min-32-chars"
NEXT_PUBLIC_API_URL="http://localhost:3001"
NODE_ENV=development
```

### `apps/api/.env.local` 파일 생성

```env
DATABASE_URL="postgresql://user:password@localhost:5432/seller_erp?schema=public"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
NODE_ENV=development
```

**중요**: `NEXTAUTH_SECRET`은 최소 32자 이상의 랜덤 문자열이어야 합니다.
생성 방법:
```bash
openssl rand -base64 32
```

---

## 2단계: PostgreSQL 데이터베이스 설정

### 옵션 A: 로컬 PostgreSQL 사용

```bash
# PostgreSQL이 설치되어 있다면
createdb seller_erp

# 또는 psql 사용
psql -U postgres
CREATE DATABASE seller_erp;
```

### 옵션 B: Docker로 PostgreSQL 실행 (추천)

```bash
docker run --name seller-erp-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=seller_erp \
  -p 5432:5432 \
  -d postgres:14
```

그러면 `DATABASE_URL`은:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"
```

---

## 3단계: 의존성 설치

```bash
pnpm install
```

---

## 4단계: Prisma 설정

```bash
# Prisma Client 생성
pnpm db:generate

# 데이터베이스 마이그레이션 실행
pnpm db:migrate
```

---

## 5단계: 개발 서버 실행

### 모든 앱 동시 실행 (추천)

```bash
pnpm dev
```

이 명령은 다음을 실행합니다:
- Next.js (포트 3000): http://localhost:3000
- NestJS API (포트 3001): http://localhost:3001

### 개별 실행

```bash
# 터미널 1: Next.js
cd apps/web
pnpm dev

# 터미널 2: NestJS API
cd apps/api
pnpm start:dev
```

---

## 6단계: 테스트 데이터 생성 (선택사항)

로그인을 테스트하려면 테넌트와 사용자를 생성해야 합니다.

### Prisma Studio로 수동 생성

```bash
pnpm db:studio
```

브라우저에서 http://localhost:5555 열기

1. **Tenant 생성**:
   - `name`: "테스트 회사"
   - `slug`: "test-company"
   - `subdomain`: "test-company.myerp.com"

2. **User 생성**:
   - `email`: "admin@test.com"
   - `password`: bcrypt로 해시된 비밀번호 필요
   - `tenantId`: 위에서 생성한 Tenant의 ID
   - `role`: "ADMIN"

### 또는 시드 스크립트 사용 (추천)

`packages/db/src/seed.ts` 파일을 생성하여 테스트 데이터를 자동 생성할 수 있습니다.

---

## 접속 방법

### 개발 환경에서 테넌트 접속

1. **직접 URL 접속**:
   ```
   http://localhost:3000?tenant=test-company
   ```

2. **로그인 페이지**:
   ```
   http://localhost:3000/auth/signin?tenant=test-company
   ```

3. **대시보드** (로그인 후):
   ```
   http://localhost:3000/dashboard?tenant=test-company
   ```

### 테스트 계정

- **테넌트 슬러그**: `test-company`
- **이메일**: `admin@test.com`
- **비밀번호**: (시드 스크립트에서 설정한 값)

---

## 문제 해결

### 포트가 이미 사용 중인 경우

```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Mac/Linux
lsof -i :3000
lsof -i :3001
```

### Prisma 마이그레이션 오류

```bash
# 마이그레이션 재설정 (주의: 데이터 삭제됨)
cd packages/db
pnpm db:push --force-reset
pnpm db:generate
```

### 패키지 설치 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

---

## 다음 단계

1. 로그인 테스트
2. 대시보드 확인
3. API 엔드포인트 테스트 (Postman 또는 브라우저)

---

## 유용한 명령어

```bash
# Prisma Studio (데이터베이스 GUI)
pnpm db:studio

# 빌드 테스트
pnpm build

# 린트
pnpm lint

# 포맷팅
pnpm format
```

