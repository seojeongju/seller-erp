# 🚀 개발 서버 시작하기

모든 설정이 완료되었습니다! 이제 개발 서버를 시작할 수 있습니다.

---

## 1. 개발 서버 실행

PowerShell에서 다음 명령을 실행하세요:

```powershell
cd d:\Program_DEV\Seller

pnpm dev
```

이 명령은 다음 서버들을 동시에 실행합니다:
- **프론트엔드 (Next.js)**: http://localhost:3000
- **백엔드 (NestJS)**: http://localhost:3001

서버가 시작되기까지 약 30초 정도 소요됩니다.

---

## 2. 애플리케이션 접속

### 로그인 페이지
```
http://localhost:3000/auth/signin?tenant=test-company
```

### 테스트 계정 정보

#### 관리자 계정
- **이메일**: admin@test.com
- **비밀번호**: admin123
- **권한**: 관리자 (ADMIN)

#### 일반 사용자 계정
- **이메일**: member@test.com
- **비밀번호**: admin123
- **권한**: 멤버 (MEMBER)

#### 테넌트 정보
- **테넌트 슬러그**: test-company
- **회사명**: 테스트 회사

---

## 3. 대시보드 접속

로그인 후 다음 페이지에 접속할 수 있습니다:

```
http://localhost:3000/dashboard
```

---

## 4. API 엔드포인트

백엔드 API는 다음 주소에서 실행됩니다:

```
http://localhost:3001
```

### 주요 API 엔드포인트:

#### 대시보드
- `GET /api/dashboard/kpi` - KPI 데이터
- `GET /api/dashboard/recent-orders` - 최근 주문
- `GET /api/dashboard/sales-trend` - 판매 트렌드
- `GET /api/dashboard/top-products` - 인기 상품

#### 상품 관리
- `GET /api/products` - 상품 목록
- `POST /api/products` - 상품 생성
- `GET /api/products/:id` - 상품 조회
- `PATCH /api/products/:id` - 상품 수정
- `DELETE /api/products/:id` - 상품 삭제

#### 재고 관리
- `GET /api/inventory` - 재고 목록
- `POST /api/inventory` - 재고 생성
- `POST /api/inventory/adjust` - 재고 조정

#### 주문 관리
- `GET /api/orders` - 주문 목록
- `POST /api/orders` - 주문 생성
- `GET /api/orders/:id` - 주문 조회
- `PATCH /api/orders/:id/status` - 주문 상태 변경

#### 고객 관리
- `GET /api/customers` - 고객 목록
- `POST /api/customers` - 고객 생성
- `GET /api/customers/:id` - 고객 조회
- `GET /api/customers/:id/orders` - 고객 주문 내역

**참고**: 모든 API 요청은 `x-tenant-slug: test-company` 헤더를 포함해야 합니다.

---

## 5. Prisma Studio (데이터베이스 관리)

데이터베이스를 직접 확인하고 편집하려면:

```powershell
# 새로운 PowerShell 창에서 실행
cd d:\Program_DEV\Seller
pnpm db:studio
```

브라우저에서 자동으로 http://localhost:5555 가 열립니다.

---

## 6. 서버 중지

개발 서버를 중지하려면:

- PowerShell 창에서 **Ctrl + C** 키를 누르세요

---

## 7. 문제 해결

### 포트가 이미 사용 중인 경우

```powershell
# 3000 포트 확인
netstat -ano | findstr :3000

# 3001 포트 확인
netstat -ano | findstr :3001

# 프로세스 종료 (PID는 위 명령에서 확인한 번호)
taskkill /PID <PID> /F
```

### 데이터베이스 연결 오류

Docker 컨테이너가 실행 중인지 확인:

```powershell
docker ps
```

`seller-erp-db` 컨테이너가 보이지 않으면:

```powershell
docker start seller-erp-db
```

### 패키지 설치 오류

의존성을 다시 설치:

```powershell
pnpm install
```

---

## 8. 다음 단계

✅ 모든 기본 설정이 완료되었습니다!

이제 다음을 진행할 수 있습니다:

1. **기능 테스트**: 로그인 → 대시보드 → 각 메뉴 확인
2. **데이터 추가**: 고객, 상품, 주문 등 추가 데이터 입력
3. **UI/UX 개선**: 디자인 및 사용자 경험 개선
4. **추가 기능 개발**: 보고서, 통계, 알림 등
5. **배포 준비**: Docker 컨테이너화, 환경 설정 등

---

## 📝 주요 정보 요약

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:3001
- **Prisma Studio**: http://localhost:5555
- **데이터베이스**: PostgreSQL (localhost:5433)
- **테넌트**: test-company
- **관리자**: admin@test.com / admin123

---

문제가 발생하면 각 문서 파일을 참고하세요:
- `QUICK_START.md` - 빠른 시작 가이드
- `DEVELOPMENT.md` - 개발 가이드
- `DATABASE_SETUP.md` - 데이터베이스 설정
- `PRD.md` - 프로젝트 요구사항 문서

