# Seller ERP - 멀티테넌트 SaaS ERP 시스템

주얼리, 소형 카메라, 소형 전자제품 판매 업체를 위한 현대적인 SaaS ERP 시스템입니다.

## 기술 스택

- **모노레포**: Turborepo
- **프론트엔드**: Next.js 14+ (App Router), React, TypeScript
- **백엔드**: NestJS, TypeScript
- **데이터베이스**: PostgreSQL
- **ORM**: Prisma
- **UI**: Tailwind CSS, shadcn/ui, Lucide Icons
- **인증**: NextAuth.js

## 프로젝트 구조

```
.
├── apps/
│   ├── web/          # Next.js 프론트엔드
│   └── api/          # NestJS 백엔드
├── packages/
│   ├── db/           # Prisma 스키마 및 클라이언트
│   ├── ui/           # 공통 React 컴포넌트
│   └── types/        # 공유 TypeScript 타입
└── turbo.json        # Turborepo 설정
```

## 시작하기

### 필수 요구사항

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+

### 설치

```bash
# 의존성 설치
pnpm install

# 데이터베이스 마이그레이션
pnpm db:migrate

# Prisma Client 생성
pnpm db:generate

# 개발 서버 실행
pnpm dev
```

### 환경 변수 설정

환경 변수 예시는 루트의 `.env.example` 파일을 참고하세요. 각 앱 디렉토리에도 `.env.example` 파일이 있습니다.

```bash
# 루트 .env.local 생성
cp .env.example .env.local

# 각 앱의 .env.local 생성
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
```

**필수 환경 변수:**
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `NEXTAUTH_SECRET`: NextAuth.js 비밀키 (프로덕션에서는 반드시 변경)
- `NEXTAUTH_URL`: NextAuth.js URL (개발: http://localhost:3000)

## 스크립트

- `pnpm dev` - 모든 앱 개발 모드 실행
- `pnpm build` - 모든 앱 빌드
- `pnpm lint` - 모든 앱 린트
- `pnpm db:migrate` - 데이터베이스 마이그레이션
- `pnpm db:studio` - Prisma Studio 실행

## 문서

- [PRD.md](./PRD.md) - 프로젝트 요구사항 문서
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 개발 가이드

## 프로젝트 구조 상세

```
.
├── apps/
│   ├── web/                    # Next.js 프론트엔드
│   │   ├── app/                # App Router 페이지
│   │   ├── components/         # 페이지별 컴포넌트
│   │   └── lib/                # 유틸리티 함수
│   └── api/                    # NestJS 백엔드
│       ├── src/
│       │   ├── modules/        # 기능 모듈
│       │   ├── common/         # 공통 모듈 (guards, interceptors)
│       │   └── prisma/         # Prisma 모듈
│       └── test/               # E2E 테스트
├── packages/
│   ├── db/                     # Prisma 스키마 및 클라이언트
│   │   ├── prisma/
│   │   │   └── schema.prisma   # 데이터베이스 스키마
│   │   └── src/
│   │       └── index.ts        # Prisma Client export
│   ├── ui/                     # 공통 React 컴포넌트 (shadcn/ui)
│   │   └── src/
│   │       ├── components/     # UI 컴포넌트
│   │       └── lib/
│   │           └── utils.ts    # 유틸리티 함수
│   └── types/                  # 공유 TypeScript 타입
│       └── src/
│           └── index.ts        # 타입 정의
├── turbo.json                  # Turborepo 설정
├── pnpm-workspace.yaml         # pnpm 워크스페이스 설정
├── PRD.md                      # 프로젝트 요구사항 문서
└── DEVELOPMENT.md             # 개발 가이드
```

## 주요 기능 (계획)

- ✅ 프로젝트 구조 설정
- 🔄 멀티테넌트 아키텍처 (진행 중)
- 🔄 인증 및 권한 관리
- 🔄 상품 관리
- 🔄 재고 관리 (시리얼 넘버 추적)
- 🔄 주문 관리
- 🔄 고객 관리 (CRM)
- 🔄 대시보드

자세한 개발 계획은 [PRD.md](./PRD.md)의 "6. 개발 단계" 섹션을 참고하세요.

