# Railway 프론트엔드 배포 가이드

## 📋 준비 사항

- ✅ GitHub 저장소: `https://github.com/seojeongju/seller-erp`
- ✅ Railway 계정 (백엔드 배포 시 생성됨)
- ✅ Railway 백엔드 서비스 실행 중
- ✅ PostgreSQL 데이터베이스 실행 중

---

## 🚀 Step 1: Railway 프로젝트에 프론트엔드 서비스 추가

### 1.1 Railway Dashboard 접속
1. **Railway Dashboard**: https://railway.app/dashboard
2. **기존 프로젝트 클릭** (seller-erp 또는 backend가 있는 프로젝트)

### 1.2 새 서비스 추가
1. **+ New** 버튼 클릭
2. **GitHub Repo** 선택
3. **seojeongju/seller-erp** 저장소 선택
4. **Deploy Now** 클릭

### 1.3 서비스 이름 변경
1. 새로 생성된 서비스 클릭
2. **Settings** 탭
3. **Service Name**을 `frontend` 또는 `web`으로 변경
4. **Save** 클릭

---

## ⚙️ Step 2: 프론트엔드 빌드 설정

### 2.1 Root Directory 설정
Railway는 monorepo를 감지하지 못할 수 있으므로 수동 설정이 필요합니다.

**Settings → Build**:
- **Watch Paths**: `apps/web/**`
- **Root Directory**: `apps/web`

### 2.2 Start Command 설정
**Settings → Deploy**:
- **Start Command**: `pnpm start`

또는 `nixpacks.toml` 파일로 자동 설정 (이미 생성됨)

---

## 🔐 Step 3: 환경 변수 설정

프론트엔드 서비스에서 **Variables** 탭으로 이동하여 다음을 추가:

### 3.1 필수 환경 변수

```env
# 데이터베이스 (Railway 내부 변수 참조)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# NextAuth 설정
NEXTAUTH_SECRET=<생성한 시크릿 값>
NEXTAUTH_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# API 백엔드 URL (Railway 내부 변수 참조)
NEXT_PUBLIC_API_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}

# 환경
NODE_ENV=production
```

### 3.2 변수 입력 방법

**중요**: Railway는 서비스 간 변수 참조를 지원합니다.

1. **DATABASE_URL**: 
   - **Raw Editor** 토글 ON
   - 입력: `${{Postgres.DATABASE_URL}}`

2. **NEXTAUTH_SECRET**:
   - 이전에 생성한 시크릿 값 입력
   - 없으면 로컬에서 생성:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     ```

3. **NEXTAUTH_URL**:
   - **Raw Editor** 토글 ON
   - 입력: `https://${{RAILWAY_PUBLIC_DOMAIN}}`

4. **NEXT_PUBLIC_API_URL**:
   - **Raw Editor** 토글 ON
   - 입력: `https://${{backend.RAILWAY_PUBLIC_DOMAIN}}`
   - (`backend`는 백엔드 서비스의 이름. 다른 이름이면 변경)

---

## 🌐 Step 4: Public Domain 생성

### 4.1 도메인 생성
1. **Settings** 탭
2. **Networking** 섹션
3. **Generate Domain** 클릭
4. 생성된 도메인 복사 (예: `web-production-xxxx.up.railway.app`)

### 4.2 도메인을 NEXTAUTH_URL에 반영
**Variables** 탭으로 돌아가서:
- `NEXTAUTH_URL` 값을 실제 도메인으로 변경:
  ```
  https://web-production-xxxx.up.railway.app
  ```

---

## 🏗️ Step 5: 배포 시작

### 5.1 재배포
1. **Deployments** 탭
2. 최신 배포가 실패했다면 **Redeploy** 클릭
3. 또는 GitHub에 새 커밋 푸시 시 자동 배포

### 5.2 로그 확인
**Deployments → 최신 배포 클릭**

기대되는 로그:
```
✓ Installing dependencies (pnpm install)
✓ Prisma Client generation
✓ Building Next.js application
✓ Starting production server on port 3000
```

---

## ✅ Step 6: 배포 확인

### 6.1 URL 접속
생성된 도메인으로 접속:
```
https://web-production-xxxx.up.railway.app
```

### 6.2 기능 테스트
1. **로그인 페이지** 접속 확인
2. **테스트 계정으로 로그인**:
   - Tenant: `demo`
   - Email: `admin@demo.com`
   - Password: `admin123`
3. **대시보드** 데이터 로드 확인

---

## 🔧 문제 해결

### 문제 1: Build 실패 - "Cannot find module"
**원인**: Root directory 설정이 잘못됨

**해결**:
1. Settings → Build
2. Root Directory를 빈 값으로 설정
3. Start Command를 `cd apps/web && pnpm start`로 변경

### 문제 2: Runtime 에러 - "DATABASE_URL is not defined"
**원인**: 환경 변수가 제대로 설정되지 않음

**해결**:
1. Variables 탭에서 모든 변수 확인
2. `${{Postgres.DATABASE_URL}}` 형식이 정확한지 확인
3. Railway 서비스 이름이 정확한지 확인

### 문제 3: 404 Error - "Page not found"
**원인**: Next.js가 정적 빌드되어 동적 라우팅이 작동하지 않음

**해결**:
- 이미 `export const dynamic = 'force-dynamic'` 추가됨
- 재배포 시 자동 해결

---

## 📊 예상 배포 시간

- **첫 배포**: 7-10분
- **이후 배포**: 3-5분 (캐시 활용)

---

## 🎉 완료!

Railway에서 프론트엔드와 백엔드가 모두 실행되고 있습니다!

**다음 단계**:
1. Custom Domain 연결 (선택사항)
2. Monitoring 설정
3. Auto-scaling 구성

