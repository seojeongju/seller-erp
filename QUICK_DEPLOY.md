# 🚀 빠른 배포 가이드

Railway에 빠르게 배포하는 방법입니다.

## ⚠️ 사전 준비: GitHub 저장소 생성

**중요**: Railway 배포 전에 GitHub 저장소가 필요합니다!

### GitHub 저장소 만들기

1. [GitHub.com](https://github.com) 접속 및 로그인
2. "+" → "New repository"
3. 저장소 이름 입력 (예: `seller-erp`)
4. Private 또는 Public 선택
5. "Create repository" 클릭

### 로컬 프로젝트를 GitHub에 푸시

```bash
# Git 초기화 (아직 안 했다면)
git init
git branch -M main

# 파일 추가 및 커밋
git add .
git commit -m "Initial commit"

# 원격 저장소 연결 (your-username과 seller-erp를 실제 값으로 변경)
git remote add origin https://github.com/your-username/seller-erp.git

# 푸시
git push -u origin main
```

**자세한 내용**: `GITHUB_SETUP.md` 참조

---

## 1단계: Railway 계정 생성 (5분)

1. [railway.app](https://railway.app) 접속
2. "Start a New Project" 클릭
3. GitHub로 로그인
4. "New Project" → "Deploy from GitHub repo"

---

## 2단계: PostgreSQL 데이터베이스 생성 (2분)

1. 프로젝트에서 "+ New" 클릭
2. "Database" → "Add PostgreSQL"
3. 생성 완료 후 "Variables" 탭에서 `DATABASE_URL` 복사

---

## 3단계: NestJS 백엔드 배포 (5분)

1. "+ New" → "GitHub Repo" → 저장소 선택
2. 서비스 이름: "backend"
3. "Settings" → "Root Directory": (비워두기 - 루트 사용)
4. "Variables" 탭에서 환경 변수 추가:

```env
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
PORT=3001
CORS_ORIGIN=https://your-frontend.vercel.app
NODE_ENV=production
NEXTAUTH_SECRET=your-secret-key-here
```

5. 배포 시작 (자동)

---

## 4단계: Next.js 프론트엔드 배포 (Vercel) (5분)

1. [vercel.com](https://vercel.com) 접속
2. GitHub 저장소 연결
3. 프로젝트 설정:
   - **Root Directory**: `apps/web`
   - **Framework**: Next.js
   - **Build Command**: `cd ../.. && pnpm turbo build --filter=@seller-erp/web`
   - **Output Directory**: `.next`

4. 환경 변수 추가:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-frontend.vercel.app
```

5. 배포 시작

---

## 5단계: 데이터베이스 마이그레이션 (3분)

```bash
# Railway CLI 설치
npm i -g @railway/cli

# 로그인
railway login

# 프로젝트 연결
railway link

# 마이그레이션 실행
cd packages/db
railway run pnpm prisma migrate deploy

# 시드 데이터 (선택)
railway run pnpm db:seed
```

---

## ✅ 완료!

이제 다음 URL로 접속하세요:
- 프론트엔드: `https://your-frontend.vercel.app`
- 백엔드 API: `https://your-backend.railway.app/api`

---

## 🔑 NEXTAUTH_SECRET 생성

터미널에서 실행:
```bash
openssl rand -base64 32
```

이 값을 `NEXTAUTH_SECRET`으로 사용하세요.

---

## 📝 참고

- 자세한 내용은 `RAILWAY_DEPLOYMENT.md` 참조
- 문제 발생 시 Railway 로그 확인

