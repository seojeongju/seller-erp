# 🚀 로컬 개발 서버 실행 가이드

배포 전에 로컬에서 변경된 내용을 바로 확인할 수 있습니다!

## 📋 빠른 시작

### 방법 1: 프론트엔드만 실행 (가장 간단)

```powershell
# 프로젝트 루트에서
cd apps/web
npm run dev
```

**접속 URL:**
```
http://localhost:3000
```

### 방법 2: 전체 앱 실행 (프론트엔드 + 백엔드)

```powershell
# 프로젝트 루트에서
npm run dev
```

**접속 URL:**
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:3001

---

## 🎯 주요 기능

### ✅ 실시간 반영 (Hot Reload)
- 파일을 저장하면 **자동으로 브라우저에 반영**됩니다
- 새로고침 없이 변경사항 확인 가능

### ✅ 빠른 피드백
- 배포 전에 바로 확인 가능
- 에러 메시지 즉시 확인

### ✅ 개발자 도구
- 브라우저 개발자 도구로 디버깅
- 네트워크 요청 확인

---

## 📝 사용 방법

### 1. 개발 서버 시작

```powershell
# 터미널에서
cd apps/web
npm run dev
```

### 2. 브라우저에서 접속

```
http://localhost:3000
```

### 3. 파일 수정 및 저장

예: `apps/web/app/page.tsx` 파일 수정 후 저장
→ 브라우저에 **자동으로 반영**됨

### 4. 변경사항 확인

- 랜딩 페이지: http://localhost:3000
- 로그인 페이지: http://localhost:3000/auth/signin?tenant=test-company
- 대시보드: http://localhost:3000/dashboard?tenant=test-company

---

## 🔧 환경 변수 설정 (필요한 경우)

### `apps/web/.env.local` 파일 생성

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL=your-database-url
```

**참고**: 백엔드가 필요 없는 경우 (UI만 확인) 환경 변수 없이도 실행 가능합니다.

---

## 💡 팁

### 1. 포트 변경
```powershell
# apps/web/package.json에서
"dev": "next dev -p 3000"  # 포트 번호 변경
```

### 2. 서버 중지
터미널에서 `Ctrl + C` 누르기

### 3. 빌드 에러 확인
터미널에 에러 메시지가 표시됩니다

---

## 🎨 확인할 수 있는 것들

- ✅ 로고 이미지 (`/Logo.png`)
- ✅ "WOW Seller ERP" 브랜딩
- ✅ 랜딩 페이지 디자인
- ✅ 로그인 페이지
- ✅ 대시보드 레이아웃
- ✅ 모든 UI 변경사항

---

## ❓ Docker가 필요한가요?

### ✅ Docker 불필요한 경우 (UI만 확인)

**로고, 브랜딩, 디자인만 확인하려면:**
- Docker 없이 바로 실행 가능
- `cd apps/web && npm run dev`만 실행하면 됨
- 랜딩 페이지, 로그인 페이지 UI 확인 가능

### ⚠️ Docker 필요한 경우 (전체 기능 테스트)

**로그인, 데이터 조회 등 기능을 테스트하려면:**
- PostgreSQL 데이터베이스 필요
- Docker로 PostgreSQL 실행하거나 로컬 PostgreSQL 설치 필요

**Docker로 PostgreSQL 실행:**
```powershell
docker run --name seller-erp-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=seller_erp -p 5432:5432 -d postgres:14
```

---

## ⚠️ 주의사항

1. **백엔드 없이 실행 시**
   - UI는 확인 가능하지만 API 호출은 실패합니다
   - 로그인 등 기능 테스트는 백엔드가 필요합니다

2. **포트 충돌**
   - 포트 3000이 이미 사용 중이면 다른 포트 사용
   - `npm run dev -- -p 3001` (포트 변경)

3. **의존성 설치**
   - 최초 실행 시 `npm install` 필요
   - `node_modules`가 없으면 설치 필요

---

## 🚀 다음 단계

로컬에서 확인 후:
1. 변경사항이 마음에 들면 → GitHub에 커밋/푸시
2. Vercel이 자동으로 배포 시작
3. 배포 완료 후 실제 사이트에서 확인

