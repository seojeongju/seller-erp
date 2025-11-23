# 상품 관리 기능 구현 플랜

## 📋 전체 로드맵

### Phase 1: 기본 상품 관리 (Week 1-2)
- [x] 프로젝트 구조 분석 완료
- [ ] Step 1: 상품 목록 페이지
- [ ] Step 2: 상품 등록 페이지
- [ ] Step 3: 상품 상세/수정 페이지

### Phase 2: 고급 기능 (Week 3-4)
- [ ] Step 4: 대량 상품 등록
- [ ] Step 5: 카테고리 관리
- [ ] Step 6: 재고 알림 설정

### Phase 3: 시리얼 넘버 추적 (Week 5-6)
- [ ] Step 7: 시리얼 넘버 관리

---

## 🎯 Step 1: 상품 목록 페이지 구현

### 1.1 백엔드 API 구현
**파일**: `apps/api/src/products/products.controller.ts`, `products.service.ts`

**작업 내용**:
- [ ] GET `/api/products` - 상품 목록 조회
  - 쿼리 파라미터: `page`, `limit`, `search`, `category`, `brand`, `sortBy`, `sortOrder`
  - 응답: 페이지네이션된 상품 리스트
- [ ] 테넌트별 데이터 격리 적용
- [ ] 검색 및 필터링 로직 구현
- [ ] 정렬 기능 구현

**예상 시간**: 2-3시간

---

### 1.2 프론트엔드 페이지 구현
**파일**: `apps/web/app/dashboard/products/page.tsx`

**작업 내용**:
- [ ] 페이지 레이아웃 생성
- [ ] 상품 목록 테이블 컴포넌트
  - 컬럼: 이미지, 상품명, SKU, 카테고리, 브랜드, 재고, 가격, 생성일, 액션
- [ ] 검색 바 (상품명, SKU 검색)
- [ ] 필터 드롭다운 (카테고리, 브랜드)
- [ ] 정렬 기능
- [ ] 페이지네이션 컴포넌트
- [ ] "새 상품 추가" 버튼
- [ ] 로딩 상태 및 에러 처리
- [ ] 빈 상태 UI (상품이 없을 때)

**사용 기술**:
- React Query (데이터 페칭)
- Shadcn/ui Table 컴포넌트
- React Hook Form (검색/필터 폼)

**예상 시간**: 3-4시간

---

## 🎯 Step 2: 상품 등록 페이지 구현

### 2.1 백엔드 API 구현
**작업 내용**:
- [ ] POST `/api/products` - 상품 생성
- [ ] 데이터 검증 (DTO 사용)
- [ ] 트랜잭션 처리 (Product + ProductVariant 동시 생성)

**예상 시간**: 2-3시간

---

### 2.2 프론트엔드 페이지 구현
**파일**: `apps/web/app/dashboard/products/new/page.tsx`

**작업 내용**:
- [ ] 기본 정보 폼 (상품명, SKU, 설명, 카테고리, 브랜드)
- [ ] 이미지 업로드 컴포넌트
- [ ] 변형 관리 컴포넌트
- [ ] 폼 검증 (Zod)

**예상 시간**: 5-6시간

---

## 🎯 Step 3: 상품 상세/수정 페이지 구현

### 3.1 백엔드 API 구현
**작업 내용**:
- [ ] GET `/api/products/:id` - 상품 상세 조회
- [ ] PUT `/api/products/:id` - 상품 수정
- [ ] DELETE `/api/products/:id` - 상품 삭제

**예상 시간**: 2-3시간

---

### 3.2 프론트엔드 페이지 구현
**파일**: `apps/web/app/dashboard/products/[id]/page.tsx`

**작업 내용**:
- [ ] 상품 정보 표시 및 수정
- [ ] 변형 관리
- [ ] 삭제 기능

**예상 시간**: 3-4시간

---

## 📦 필요한 패키지

```bash
# 프론트엔드
pnpm add @tanstack/react-query react-hook-form @hookform/resolvers zod

# 백엔드
pnpm add class-validator class-transformer
```

---

## 🚀 시작하기

**현재 위치**: Step 1 - 상품 목록 페이지 구현

**다음 작업**: 백엔드 API 구현 (GET /api/products)
