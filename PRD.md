# SaaS ERP 시스템 - Product Requirements Document (PRD)

## 1. 프로젝트 개요

### 1.1 목적
주얼리, 소형 카메라, 소형 전자제품 판매 업체를 위한 멀티테넌트 SaaS ERP 시스템 개발

### 1.2 타겟 고객
- 소규모 B2B 비즈니스
- 재고 관리가 중요한 소매업체
- 시리얼 넘버 추적이 필요한 제품 판매업체

### 1.3 핵심 가치 제안
- 멀티테넌트 아키텍처로 비용 효율적인 SaaS 제공
- 직관적인 UI/UX로 학습 곡선 최소화
- 시리얼 넘버 및 옵션별 재고 관리로 정확한 재고 추적

---

## 2. 기술 스택

### 2.1 아키텍처
- **모노레포**: Turborepo
- **프론트엔드**: Next.js 14+ (App Router), React, TypeScript
- **백엔드**: NestJS, TypeScript
- **데이터베이스**: PostgreSQL
- **ORM**: Prisma
- **UI 라이브러리**: Tailwind CSS, shadcn/ui, Lucide Icons
- **인증**: NextAuth.js (서브도메인 멀티테넌트 지원)

### 2.2 패키지 구조
```
packages/
  ├── db/          # Prisma 스키마 및 클라이언트
  ├── ui/          # 공통 React 컴포넌트 (shadcn/ui)
  └── types/       # 공유 TypeScript 타입

apps/
  ├── web/         # Next.js 프론트엔드
  └── api/         # NestJS 백엔드
```

---

## 3. 핵심 기능 요구사항

### 3.1 멀티테넌트 아키텍처
- **서브도메인 기반 라우팅**: `{tenant-slug}.myerp.com`
- **데이터 격리**: 모든 테이블에 `tenantId` 필수
- **테넌트별 설정**: 브랜딩, 설정 등 독립 관리

### 3.2 인증 및 권한 관리
- **사용자 역할**: 
  - `ADMIN`: 테넌트 관리자 (모든 권한)
  - `MEMBER`: 일반 사용자 (제한된 권한)
- **세션 관리**: NextAuth.js 기반
- **테넌트 컨텍스트**: 로그인 시 자동으로 테넌트 컨텍스트 설정

### 3.3 상품 관리
- 상품 기본 정보 (이름, SKU, 카테고리, 설명)
- 상품 옵션 (ProductVariant): 사이즈, 색상, 용량 등
- 상품 이미지 관리
- 상품 검색 및 필터링

### 3.4 재고 관리
- **Variant 레벨 재고**: ProductVariant 단위로 재고 수량 관리
- **시리얼 넘버 추적**: 
  - InventoryItem으로 개별 항목 추적
  - 시리얼 넘버, 배치 번호, 입고일 등 메타데이터
- **재고 입출고 이력**: 재고 변동 추적
- **재고 알림**: 낮은 재고 경고

### 3.5 판매 관리
- 주문 생성 및 관리
- 주문 상태 추적 (대기, 처리중, 완료, 취소)
- 주문 내역 (OrderItem) 관리
- 판매 통계 및 리포트

### 3.6 고객 관리 (CRM)
- 고객 정보 관리
- 고객별 주문 이력
- 고객 통계

### 3.7 대시보드
- 주요 지표 (KPI) 표시
- 최근 주문
- 재고 알림
- 판매 트렌드

---

## 4. 데이터 모델

### 4.1 핵심 엔티티

#### Tenant (테넌트)
- 고객사 정보
- 서브도메인 슬러그
- 브랜딩 설정

#### User (사용자)
- 테넌트에 속한 ERP 사용자
- 역할 (Role): ADMIN, MEMBER
- 인증 정보

#### Customer (고객)
- 테넌트의 고객 (B2B 고객)
- 연락처, 주소 등

#### Product (상품)
- 기본 상품 정보
- 카테고리, 브랜드 등

#### ProductVariant (상품 옵션)
- Product에 속한 옵션
- 재고 수량 관리
- 가격, SKU 등

#### InventoryItem (재고 항목)
- 개별 재고 항목
- 시리얼 넘버, 배치 번호
- 입고일, 상태 등

#### Order (주문)
- 판매 주문
- 고객, 주문 상태, 총액 등

#### OrderItem (주문 내역)
- 주문에 포함된 상품
- ProductVariant, 수량, 가격

---

## 5. 잠재적 문제점 및 해결 방안

### 5.1 멀티테넌트 데이터 격리
**문제점**: 
- 실수로 다른 테넌트 데이터 접근 가능성
- 쿼리 시 `tenantId` 필터링 누락 위험

**해결 방안**:
- Prisma Middleware로 자동 `tenantId` 필터링
- NestJS Guard로 요청 레벨에서 테넌트 검증
- Row-level Security (PostgreSQL) 고려 (선택사항)

### 5.2 서브도메인 라우팅
**문제점**:
- Next.js에서 동적 서브도메인 처리 복잡성
- 개발 환경에서 로컬 서브도메인 테스트 어려움

**해결 방안**:
- Next.js Middleware에서 서브도메인 추출
- 개발 환경: `localhost:3000?tenant=client-a` 형태로 대체
- 프로덕션: DNS 및 리버스 프록시 설정 가이드 제공

### 5.3 재고 관리 복잡성
**문제점**:
- 시리얼 넘버 추적 vs 일반 재고 관리 혼재
- 재고 감소 시 InventoryItem 선택 로직 복잡

**해결 방안**:
- ProductVariant에 `trackSerialNumbers` 플래그 추가
- 시리얼 추적 필요 시 InventoryItem 사용, 아니면 수량만 관리
- 재고 입출고 시 자동으로 InventoryItem 생성/삭제

### 5.4 인증 및 세션 관리
**문제점**:
- 멀티테넌트 환경에서 세션 관리 복잡성
- 테넌트 전환 시 세션 처리

**해결 방안**:
- NextAuth.js의 세션에 `tenantId` 포함
- API 요청 시 자동으로 테넌트 컨텍스트 설정
- 테넌트 전환은 재로그인 필요 (보안 강화)

### 5.5 확장성 고려사항
**문제점**:
- 테넌트 수 증가 시 성능 저하
- 데이터베이스 인덱싱 전략

**해결 방안**:
- `tenantId` + 주요 필드에 복합 인덱스 생성
- 페이지네이션 필수
- 캐싱 전략 (Redis 등) 고려

### 5.6 초기 마이그레이션 전략
**문제점**:
- 기존 데이터 마이그레이션 경로 부재
- 테넌트 온보딩 프로세스

**해결 방안**:
- 테넌트 등록 API 제공
- 초기 관리자 계정 생성 자동화
- 데이터 임포트 기능 (CSV 등) 계획

### 5.7 재고 동시성 문제
**문제점**:
- 동시 주문 시 재고 중복 차감 가능성
- Race condition으로 인한 재고 부족 주문 생성

**해결 방안**:
- 데이터베이스 트랜잭션 및 락 활용
- Optimistic locking 또는 Pessimistic locking 적용
- 재고 차감 시 원자적 연산 보장 (Prisma transaction)

### 5.8 주문 번호 생성 전략
**문제점**:
- 테넌트별 고유 주문 번호 생성 필요
- 동시 주문 시 중복 번호 생성 가능성

**해결 방안**:
- 테넌트별 시퀀스 또는 카운터 테이블 사용
- UUID + 테넌트 접두사 조합 (예: `ORD-{tenantSlug}-{timestamp}-{seq}`)
- 데이터베이스 시퀀스 활용

### 5.9 이미지 업로드 및 스토리지
**문제점**:
- 상품 이미지 저장 위치 및 관리
- 멀티테넌트 환경에서 이미지 격리
- 스토리지 비용 관리

**해결 방안**:
- 클라우드 스토리지 (AWS S3, Cloudflare R2 등) 활용
- 테넌트별 폴더 구조: `{tenantId}/products/{productId}/`
- 이미지 최적화 및 CDN 연동
- 업로드 크기 제한 및 파일 타입 검증

### 5.10 환경 변수 및 설정 관리
**문제점**:
- 개발/스테이징/프로덕션 환경별 설정 관리
- 민감한 정보 (DB URL, API 키) 보안
- 모노레포에서 환경 변수 공유

**해결 방안**:
- `.env.example` 파일 제공
- 환경별 `.env.local` 파일 사용
- `@nestjs/config` 모듈 활용
- 환경 변수 검증 (zod 등)

### 5.11 에러 핸들링 및 로깅
**문제점**:
- 멀티테넌트 환경에서 에러 추적 어려움
- 테넌트별 로그 분리 필요
- 프로덕션 환경 디버깅 어려움

**해결 방안**:
- 구조화된 로깅 (Winston, Pino 등)
- 로그에 `tenantId` 자동 포함
- 에러 추적 서비스 연동 (Sentry 등)
- 사용자 친화적 에러 메시지

### 5.12 API 설계 및 버전 관리
**문제점**:
- API 엔드포인트 일관성
- 버전 관리 전략
- RESTful vs GraphQL 선택

**해결 방안**:
- RESTful API 우선 (간단하고 직관적)
- API 버전 관리: `/api/v1/...`
- OpenAPI/Swagger 문서화
- 일관된 응답 형식 (`ApiResponse<T>`)

### 5.13 소프트 삭제 (Soft Delete)
**문제점**:
- 데이터 삭제 시 복구 불가능
- 주문 이력 등 중요한 데이터 보존 필요

**해결 방안**:
- `deletedAt` 필드 추가 (선택적)
- 중요한 데이터는 소프트 삭제만 허용
- 하드 삭제는 관리자만 가능하도록 제한

### 5.14 감사 로그 (Audit Log)
**문제점**:
- 데이터 변경 이력 추적 필요
- 누가, 언제, 무엇을 변경했는지 기록

**해결 방안**:
- AuditLog 모델 추가 (선택적, Phase 2 이후)
- 중요한 변경사항만 기록 (주문 상태 변경 등)
- Prisma Middleware로 자동 로깅

### 5.15 트랜잭션 일관성
**문제점**:
- 주문 생성 시 재고 차감, 주문 생성 등 여러 작업의 원자성 보장 필요
- 부분 실패 시 롤백 처리

**해결 방안**:
- Prisma Transaction 활용
- NestJS에서 `@Transactional()` 데코레이터 고려
- 트랜잭션 범위 최소화 (성능 고려)

---

## 6. 개발 단계

### Phase 1: 프로젝트 구조 설정 ✅
- [x] Turborepo 모노레포 설정
- [x] 기본 패키지 구조 생성
- [x] Prisma 스키마 초기 작성
- [ ] 환경 변수 설정 가이드
- [ ] 개발 환경 설정 문서화

### Phase 2: 인증 및 멀티테넌트 기반 구축
- [ ] NextAuth.js 설정 및 커스터마이징
- [ ] 서브도메인 라우팅 구현 (Next.js Middleware)
- [ ] 테넌트 컨텍스트 관리 (Context API)
- [ ] NestJS Guard 구현 (TenantGuard, AuthGuard)
- [ ] Prisma Middleware 구현 (자동 tenantId 필터링)
- [ ] 에러 핸들링 및 로깅 설정

### Phase 3: 핵심 기능 개발
- [ ] 상품 관리 (CRUD)
  - [ ] 상품 목록, 상세, 생성, 수정, 삭제
  - [ ] ProductVariant 관리
  - [ ] 이미지 업로드
- [ ] 재고 관리
  - [ ] 재고 입출고
  - [ ] 시리얼 넘버 추적
  - [ ] 재고 알림
- [ ] 주문 관리
  - [ ] 주문 생성 (재고 차감 포함)
  - [ ] 주문 상태 관리
  - [ ] 주문 번호 생성
- [ ] 고객 관리 (CRM)
  - [ ] 고객 CRUD
  - [ ] 고객별 주문 이력

### Phase 4: 대시보드 및 리포트
- [ ] 대시보드 UI
  - [ ] KPI 카드 (총 매출, 주문 수, 재고 알림 등)
  - [ ] 최근 주문 목록
  - [ ] 판매 트렌드 차트
- [ ] 통계 및 리포트
  - [ ] 판매 리포트
  - [ ] 재고 리포트

### Phase 5: 최적화 및 배포
- [ ] 성능 최적화
  - [ ] 데이터베이스 쿼리 최적화
  - [ ] 캐싱 전략 (Redis 등)
  - [ ] 이미지 최적화
- [ ] 보안 강화
  - [ ] 입력 검증 강화
  - [ ] Rate limiting
  - [ ] 보안 헤더 설정
- [ ] 배포 설정
  - [ ] Docker 설정
  - [ ] CI/CD 파이프라인
  - [ ] 환경별 배포 가이드

---

## 7. 보안 고려사항

1. **데이터 격리**: 테넌트 간 데이터 완전 격리 보장
2. **인증**: 강력한 비밀번호 정책, 세션 만료 관리
3. **권한 관리**: 역할 기반 접근 제어 (RBAC)
4. **API 보안**: Rate limiting, 입력 검증
5. **데이터 백업**: 정기적인 백업 전략
6. **입력 검증**: Zod 또는 class-validator로 모든 입력 검증
7. **SQL Injection 방지**: Prisma ORM 사용으로 자동 방지
8. **XSS 방지**: React의 자동 이스케이프, CSP 헤더 설정
9. **CSRF 방지**: NextAuth.js 기본 제공, SameSite 쿠키
10. **비밀번호 보안**: bcrypt 해싱, 최소 길이 요구사항

---

## 8. 성공 지표

- 테넌트 온보딩 시간 < 10분
- 페이지 로딩 시간 < 2초
- 데이터 격리 100% 보장
- 사용자 만족도 > 4.5/5.0

---

## 9. 기술적 구현 세부사항

### 9.1 NestJS 구조
```
apps/api/src/
├── common/          # 공통 모듈
│   ├── guards/      # TenantGuard, AuthGuard
│   ├── interceptors/# 에러 핸들링, 로깅
│   └── decorators/  # @Tenant(), @CurrentUser() 등
├── modules/
│   ├── auth/        # 인증 모듈
│   ├── tenants/     # 테넌트 관리
│   ├── products/    # 상품 관리
│   ├── inventory/   # 재고 관리
│   ├── orders/      # 주문 관리
│   └── customers/   # 고객 관리
└── prisma/          # Prisma 모듈
```

### 9.2 Next.js 구조
```
apps/web/
├── app/
│   ├── (auth)/      # 인증 관련 페이지
│   ├── (dashboard)/ # 대시보드 (인증 필요)
│   │   ├── products/
│   │   ├── orders/
│   │   ├── customers/
│   │   └── inventory/
│   └── api/         # API Routes (NextAuth 등)
├── components/      # 페이지별 컴포넌트
├── lib/            # 유틸리티 함수
└── middleware.ts   # 서브도메인 라우팅
```

### 9.3 Prisma Middleware 예시
```typescript
// 자동 tenantId 필터링
prisma.$use(async (params, next) => {
  if (params.action === 'findMany' || params.action === 'findFirst') {
    if (params.args?.where && !params.args.where.tenantId) {
      // tenantId가 없으면 에러 또는 자동 추가
    }
  }
  return next(params);
});
```

### 9.4 테넌트 컨텍스트 추출
```typescript
// Next.js Middleware
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  // 테넌트 조회 및 검증
  // 요청 헤더에 tenantId 추가
}
```

---

## 10. 향후 확장 계획

- 다국어 지원 (i18n)
- 모바일 앱 (React Native)
- 고급 리포트 및 분석
- API 웹훅 지원
- 통합 (쇼핑몰, 배송 등)
- 실시간 알림 (WebSocket)
- 고급 권한 관리 (세부 권한 설정)

