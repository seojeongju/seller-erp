# 개발 가이드

## 초기 설정

### 1. 환경 변수 설정

루트 디렉토리와 각 앱 디렉토리에 `.env.local` 파일을 생성하세요.

```bash
# 루트 .env.local
cp .env.example .env.local

# Next.js 앱
cp apps/web/.env.example apps/web/.env.local

# NestJS API
cp apps/api/.env.example apps/api/.env.local
```

각 파일의 값을 실제 환경에 맞게 수정하세요.

### 2. 데이터베이스 설정

PostgreSQL 데이터베이스를 생성하고 연결 문자열을 설정하세요.

```bash
# PostgreSQL 데이터베이스 생성
createdb seller_erp

# 또는 psql 사용
psql -U postgres
CREATE DATABASE seller_erp;
```

### 3. 의존성 설치

```bash
pnpm install
```

### 4. Prisma 마이그레이션

```bash
# Prisma Client 생성
pnpm db:generate

# 데이터베이스 마이그레이션 실행
pnpm db:migrate
```

### 5. 개발 서버 실행

```bash
# 모든 앱 동시 실행
pnpm dev

# 또는 개별 실행
cd apps/web && pnpm dev      # Next.js (포트 3000)
cd apps/api && pnpm start:dev  # NestJS (포트 3001)
```

## 개발 워크플로우

### 데이터베이스 변경

1. `packages/db/prisma/schema.prisma` 파일 수정
2. 마이그레이션 생성:
   ```bash
   pnpm db:migrate
   ```
3. Prisma Client 재생성:
   ```bash
   pnpm db:generate
   ```

### 새 패키지 추가

모노레포에서 패키지를 추가할 때는 루트에서 설치하세요:

```bash
# 공통 패키지 (루트)
pnpm add -w <package-name>

# 특정 앱에만 추가
pnpm --filter @seller-erp/web add <package-name>
pnpm --filter @seller-erp/api add <package-name>
```

### 코드 스타일

```bash
# Prettier 포맷팅
pnpm format

# ESLint 검사
pnpm lint
```

## 프로젝트 구조

### 패키지 간 의존성

```
apps/web
  ├── @seller-erp/ui      (공통 UI 컴포넌트)
  ├── @seller-erp/types   (공유 타입)
  └── @seller-erp/db      (Prisma Client, 읽기 전용)

apps/api
  ├── @seller-erp/types   (공유 타입)
  └── @seller-erp/db      (Prisma Client)
```

### 주요 디렉토리

- `apps/web/app/` - Next.js App Router 페이지
- `apps/api/src/modules/` - NestJS 기능 모듈
- `packages/db/prisma/` - Prisma 스키마
- `packages/ui/src/` - 공통 React 컴포넌트
- `packages/types/src/` - 공유 TypeScript 타입

## 테스트

```bash
# 단위 테스트
pnpm test

# E2E 테스트
pnpm test:e2e
```

## 디버깅

### Prisma Studio

데이터베이스 데이터를 시각적으로 확인:

```bash
pnpm db:studio
```

### Next.js 디버깅

개발 모드에서 자동으로 소스맵이 활성화됩니다.

### NestJS 디버깅

```bash
pnpm start:debug
```

VS Code에서 `.vscode/launch.json` 설정:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug NestJS",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["start:debug"],
  "console": "integratedTerminal",
  "restart": true,
  "protocol": "inspector"
}
```

## 문제 해결

### Prisma Client 생성 오류

```bash
# Prisma Client 강제 재생성
cd packages/db
pnpm db:generate
```

### 포트 충돌

기본 포트:
- Next.js: 3000
- NestJS: 3001

포트를 변경하려면 각 앱의 설정 파일을 수정하세요.

### 모노레포 의존성 문제

```bash
# 의존성 재설치
rm -rf node_modules packages/*/node_modules apps/*/node_modules
pnpm install
```

## 다음 단계

1. [PRD.md](./PRD.md) 문서 확인
2. Phase 2: 인증 및 멀티테넌트 기반 구축 시작
3. 서브도메인 라우팅 구현
4. 테넌트 컨텍스트 관리

