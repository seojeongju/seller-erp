# Vercel 프론트엔드 배포 가이드

## 📋 준비 사항

- ✅ GitHub 저장소: `https://github.com/seojeongju/seller-erp`
- ✅ Vercel 계정
- ✅ Railway 백엔드 URL (이미 배포됨)
- ✅ Railway PostgreSQL DATABASE_URL

---

## 🗑️ Step 1: Railway 프론트엔드 서비스 삭제 (선택사항)

Railway Dashboard에서:
1. **captivating-fascination** 서비스 클릭
2. **Settings** 탭
3. 맨 아래 **"Danger"** 섹션
4. **"Delete Service"** 버튼 클릭
5. 확인

> **참고**: 백엔드(seller-erp)와 Postgres는 **절대 삭제하지 마세요!**

---

## 🚀 Step 2: Vercel 프로젝트 생성

### 2.1 Vercel Dashboard 접속
1. **Vercel Dashboard**: https://vercel.com/dashboard
2. **Add New...** → **Project** 클릭

### 2.2 GitHub 저장소 선택
1. **Import Git Repository** 섹션
2. **seojeongju/seller-erp** 저장소 선택
3. **Import** 클릭

### 2.3 프로젝트 설정

**Configure Project** 화면에서:

#### Project Name
- `seller-erp-frontend` 또는 원하는 이름

#### Framework Preset
- **Next.js** (자동 감지됨)

#### Root Directory
- **"Edit"** 클릭
- **`apps/web`** 입력
- **Continue** 클릭

#### Build and Output Settings
- **Override** 토글 ON
- **Build Command**: `npm run build:vercel`
- **Output Directory**: `.next`
- **Install Command**: `npm install --legacy-peer-deps`

#### Environment Variables
아직 설정하지 마세요! (다음 단계에서 설정)

#### Deploy
- **Deploy** 버튼 클릭

---

## 🔐 Step 3: 환경 변수 설정

배포가 시작되면 (실패해도 괜찮습니다):

1. **Settings** 탭 클릭
2. **Environment Variables** 섹션
3. 다음 변수들을 추가:

### 3.1 필수 환경 변수

```env
# 데이터베이스
DATABASE_URL=<Railway PostgreSQL URL>

# NextAuth
NEXTAUTH_SECRET=<생성한 시크릿>
NEXTAUTH_URL=https://<your-vercel-domain>.vercel.app

# API 백엔드
NEXT_PUBLIC_API_URL=https://seller-erp-production.up.railway.app

# 환경
NODE_ENV=production
```

### 3.2 변수 입력 방법

1. **Key** 입력
2. **Value** 입력
3. **Environment**: Production, Preview, Development 모두 선택
4. **Save** 클릭

**중요**: `NEXTAUTH_URL`은 배포 후 생성된 도메인으로 업데이트해야 합니다!

---

## 🔄 Step 4: 재배포

환경 변수 설정 후:

1. **Deployments** 탭 클릭
2. 최신 배포 옆 **...** (점 3개) 클릭
3. **Redeploy** 선택
4. **Use existing Build Cache** 체크 해제 (선택사항)
5. **Redeploy** 클릭

---

## 📋 Step 5: 배포 확인

### 5.1 빌드 로그 확인

**Deployments → 최신 배포 → Build Logs**:

✅ **성공**:
```
> npm run build:vercel
> npm install --legacy-peer-deps
✓ Packages installed
> npm run db:generate
✓ Prisma Client generated
> cd apps/web && npm run build
✓ Building Next.js application
✓ Compiled successfully
```

### 5.2 URL 접속

배포 완료 후 생성된 URL로 접속:
```
https://<your-project>.vercel.app
```

### 5.3 로그인 테스트

**테스트 계정**:
```
Tenant Slug: demo
Email: admin@demo.com
Password: admin123
```

---

## 🔧 문제 해결

### 문제 1: "ERR_PNPM_UNSUPPORTED_ENGINE"
**원인**: pnpm 버전 문제

**해결**:
- `package.json`의 `packageManager` 필드 확인
- Vercel이 자동으로 pnpm을 감지하면, `vercel.json`에서 `installCommand`를 명시적으로 설정

### 문제 2: "Unsupported URL Type workspace:*"
**원인**: npm이 pnpm의 workspace 프로토콜을 이해하지 못함

**해결**:
- `vercel.json`의 `installCommand`에 `--legacy-peer-deps` 사용
- 또는 `package.json`에서 workspace 프로토콜 제거

### 문제 3: "Cannot find module '@seller-erp/db'"
**원인**: workspace 패키지가 설치되지 않음

**해결**:
- `build:vercel` 스크립트가 루트에서 `npm install`을 실행하는지 확인
- `apps/web/package.json`의 dependencies 확인

### 문제 4: "Prisma Client did not initialize"
**원인**: Prisma Client가 생성되지 않음

**해결**:
- `build:vercel` 스크립트에 `npm run db:generate` 포함 확인
- `packages/db/package.json`에 `db:generate` 스크립트 확인

---

## 📊 예상 배포 시간

- **첫 배포**: 5-8분
- **이후 배포**: 3-5분 (캐시 활용)

---

## 🎉 완료!

Vercel에서 프론트엔드가 성공적으로 배포되었습니다!

**다음 단계**:
1. Custom Domain 연결 (선택사항)
2. Analytics 설정
3. Performance 모니터링

