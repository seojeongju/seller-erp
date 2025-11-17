# 🌐 Railway Networking 설정 가이드

Railway 서비스의 네트워킹 설정과 도메인 관리 방법입니다.

## 📋 Networking 화면 설명

### Public Networking (공개 네트워킹)

외부에서 HTTP로 접근할 수 있는 도메인입니다.

#### HTTP Domain
```
postgres-production-e5c7.up.railway.app → Port 3001
```

**용도**:
- ✅ API 엔드포인트 접근
- ✅ 프론트엔드에서 API 호출
- ✅ 외부 도구에서 API 테스트

**사용 예시**:
```
https://postgres-production-e5c7.up.railway.app/api/dashboard/kpis
```

#### TCP Proxy
```
crossover.proxy.rlwy.net:35042 → :5432
```

**용도**:
- ✅ 데이터베이스 직접 연결 (개발/디버깅용)
- ✅ Prisma Studio 등 외부 도구 연결

---

### Private Networking (내부 네트워킹)

Railway 내부 서비스 간 통신용입니다.

#### Internal Domain
```
postgres.railway.internal
```

**용도**:
- ✅ Railway 서비스 간 통신
- ✅ 백엔드 → 데이터베이스 연결
- ✅ Variable Reference에서 자동 사용

**특징**:
- 외부에서 접근 불가
- 보안 강화
- 빠른 통신 속도

---

## 🔧 백엔드 API URL 사용하기

### 1. API 엔드포인트 확인

백엔드 서비스의 공개 URL:
```
https://postgres-production-e5c7.up.railway.app
```

API 엔드포인트:
```
https://postgres-production-e5c7.up.railway.app/api
```

### 2. 프론트엔드 환경 변수 설정

Vercel 또는 프론트엔드 배포 시:

```env
NEXT_PUBLIC_API_URL=https://postgres-production-e5c7.up.railway.app
```

### 3. API 테스트

브라우저 또는 Postman에서:

```bash
# 대시보드 KPIs
GET https://postgres-production-e5c7.up.railway.app/api/dashboard/kpis

# 상품 목록
GET https://postgres-production-e5c7.up.railway.app/api/products
```

---

## 🔒 보안 설정

### CORS 설정 확인

백엔드 서비스의 `CORS_ORIGIN` 환경 변수에 프론트엔드 URL을 추가해야 합니다:

```
CORS_ORIGIN=https://your-frontend.vercel.app
```

여러 도메인 허용:
```
CORS_ORIGIN=https://your-frontend.vercel.app,https://www.yourdomain.com
```

---

## 🌍 Custom Domain 설정 (선택)

### Custom Domain 추가

1. **"+ Custom Domain"** 버튼 클릭
2. 도메인 입력 (예: `api.yourdomain.com`)
3. DNS 설정 안내에 따라 CNAME 레코드 추가
4. SSL 인증서 자동 발급

**장점**:
- ✅ 브랜드 일관성
- ✅ 더 짧은 URL
- ✅ 자동 SSL 인증서

---

## 📝 다음 단계

### 1. API 테스트

```bash
# Health check
curl https://postgres-production-e5c7.up.railway.app/api

# Dashboard KPIs (인증 필요할 수 있음)
curl https://postgres-production-e5c7.up.railway.app/api/dashboard/kpis
```

### 2. 프론트엔드 환경 변수 업데이트

Vercel 배포 시:
```env
NEXT_PUBLIC_API_URL=https://postgres-production-e5c7.up.railway.app
```

### 3. 데이터베이스 마이그레이션

```bash
railway run pnpm prisma migrate deploy
```

---

## 🐛 문제 해결

### API 접근 불가

1. 배포 상태 확인 (Active인지 확인)
2. 로그에서 에러 확인
3. 포트 설정 확인 (3001)

### CORS 에러

1. `CORS_ORIGIN` 환경 변수 확인
2. 프론트엔드 URL이 정확한지 확인
3. 백엔드 재배포

---

## 📌 참고사항

- **HTTP Domain**: 자동으로 생성되며 변경 가능
- **Internal Domain**: Railway가 자동 관리
- **TCP Proxy**: 데이터베이스 직접 연결용 (보안 주의)

---

**마지막 업데이트**: 2024-11-17

