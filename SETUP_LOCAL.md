# 로컬 개발 환경 설정 가이드

## 빠른 시작 (5분)

### 1. 환경 변수 파일 생성

루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-string-at-least-32-characters-long"
```

**NEXTAUTH_SECRET 생성 방법**:
```bash
# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))

# Mac/Linux
openssl rand -base64 32
```

### 2. `apps/web/.env.local` 생성

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="위에서 생성한 값과 동일"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 3. `apps/api/.env.local` 생성

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

### 4. PostgreSQL 실행 (Docker 사용 시)

```bash
docker run --name seller-erp-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=seller_erp \
  -p 5432:5432 \
  -d postgres:14
```

### 5. 의존성 설치 및 데이터베이스 설정

```bash
# 의존성 설치
pnpm install

# Prisma Client 생성
pnpm db:generate

# 데이터베이스 마이그레이션
pnpm db:migrate

# 테스트 데이터 생성 (선택사항)
cd packages/db
pnpm db:seed
```

### 6. 개발 서버 실행

```bash
# 루트 디렉토리에서
pnpm dev
```

### 7. 접속

브라우저에서 다음 URL로 접속:
- **로그인 페이지**: http://localhost:3000/auth/signin?tenant=test-company
- **대시보드** (로그인 후): http://localhost:3000/dashboard?tenant=test-company

**테스트 계정**:
- 이메일: `admin@test.com`
- 비밀번호: `admin123`
- 테넌트 슬러그: `test-company`

---

## 상세 설정

자세한 내용은 [QUICK_START.md](./QUICK_START.md)를 참고하세요.

