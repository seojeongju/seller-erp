# Railway 배포 가이드

이 문서는 Seller ERP 시스템을 Railway 플랫폼에 배포하는 방법을 설명합니다.

## 📋 목차

1. [Railway 계정 생성](#1-railway-계정-생성)
2. [PostgreSQL 데이터베이스 생성](#2-postgresql-데이터베이스-생성)
3. [NestJS 백엔드 배포](#3-nestjs-백엔드-배포)
4. [Next.js 프론트엔드 배포](#4-nextjs-프론트엔드-배포)
5. [환경 변수 설정](#5-환경-변수-설정)
6. [데이터베이스 마이그레이션](#6-데이터베이스-마이그레이션)
7. [트러블슈팅](#7-트러블슈팅)

---

## 1. Railway 계정 생성

### 1.1 Railway 웹사이트 접속
1. [Railway.app](https://railway.app) 접속
2. "Start a New Project" 클릭
3. GitHub 계정으로 로그인 (권장)

### 1.2 프로젝트 생성
1. "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. GitHub 저장소 선택 또는 연결

---

## 2. PostgreSQL 데이터베이스 생성

### 2.1 데이터베이스 서비스 추가
1. Railway 대시보드에서 프로젝트 선택
2. "+ New" 버튼 클릭
3. "Database" → "Add PostgreSQL" 선택

### 2.2 데이터베이스 정보 확인
1. PostgreSQL 서비스 클릭
2. "Variables" 탭에서 `DATABASE_URL` 확인
3. 이 URL을 복사해두세요 (나중에 사용)

**예시:**
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

---

## 3. NestJS 백엔드 배포

### 3.1 서비스 추가
1. Railway 프로젝트에서 "+ New" 클릭
2. "GitHub Repo" 선택
3. 저장소 선택
4. **중요**: "Root Directory"를 `apps/api`로 설정하지 마세요 (모노레포이므로 루트에서 빌드)

### 3.2 빌드 설정
Railway는 자동으로 Dockerfile을 감지하지만, 수동 설정도 가능합니다:

1. 서비스 → "Settings" → "Build"
2. Build Command: (비워두기 - Dockerfile 사용)
3. Start Command: `node apps/api/dist/main.js`

### 3.3 환경 변수 설정
서비스 → "Variables" 탭에서 다음 변수 추가:

```env
# 데이터베이스
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}

# 포트 (Railway가 자동 설정)
PORT=3001

# CORS 설정 (프론트엔드 URL)
CORS_ORIGIN=https://your-frontend-domain.railway.app

# NextAuth 설정
NEXTAUTH_SECRET=your-super-secret-key-here-generate-with-openssl
NEXTAUTH_URL=https://your-frontend-domain.railway.app

# Node 환경
NODE_ENV=production
```

**NEXTAUTH_SECRET 생성 방법:**
```bash
openssl rand -base64 32
```

### 3.4 배포 확인
1. "Deployments" 탭에서 배포 상태 확인
2. "View Logs"로 빌드/실행 로그 확인
3. 배포 완료 후 "Settings" → "Networking"에서 공개 URL 확인

---

## 4. Next.js 프론트엔드 배포

### 옵션 A: Vercel 사용 (추천)

#### 4.1 Vercel 프로젝트 생성
1. [Vercel](https://vercel.com) 접속
2. GitHub 저장소 연결
3. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm turbo build --filter=@seller-erp/web`
   - **Output Directory**: `.next`

#### 4.2 환경 변수 설정
Vercel 대시보드 → Settings → Environment Variables:

```env
# API URL (Railway 백엔드 URL)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-frontend.vercel.app

# 데이터베이스 (Prisma용)
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
```

---

### 옵션 B: Railway 사용

#### 4.1 서비스 추가
1. Railway 프로젝트에서 "+ New" → "GitHub Repo"
2. 같은 저장소 선택
3. 서비스 이름: "frontend"

#### 4.2 빌드 설정
1. 서비스 → "Settings" → "Build"
2. Build Command: `cd apps/web && pnpm install && pnpm build`
3. Start Command: `cd apps/web && pnpm start`

#### 4.3 환경 변수
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-frontend.railway.app
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
```

---

## 5. 환경 변수 설정

### 5.1 백엔드 (NestJS) 환경 변수

Railway 서비스 → Variables 탭:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `DATABASE_URL` | `${{PostgreSQL.DATABASE_URL}}` | Railway가 자동 제공 |
| `PORT` | `3001` | Railway가 자동 설정 (선택) |
| `CORS_ORIGIN` | 프론트엔드 URL | CORS 허용 도메인 |
| `NODE_ENV` | `production` | 프로덕션 모드 |

### 5.2 프론트엔드 (Next.js) 환경 변수

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `NEXT_PUBLIC_API_URL` | 백엔드 URL | API 호출 주소 |
| `NEXTAUTH_SECRET` | 랜덤 문자열 | NextAuth 암호화 키 |
| `NEXTAUTH_URL` | 프론트엔드 URL | NextAuth 콜백 URL |
| `DATABASE_URL` | DB URL | Prisma용 (선택) |

---

## 6. 데이터베이스 마이그레이션

### 6.1 Railway CLI 설치
```bash
npm i -g @railway/cli
```

### 6.2 로그인
```bash
railway login
```

### 6.3 프로젝트 연결
```bash
railway link
```

### 6.4 마이그레이션 실행
```bash
# 데이터베이스 마이그레이션
cd packages/db
railway run pnpm prisma migrate deploy

# 또는 Prisma Studio로 확인
railway run pnpm prisma studio
```

### 6.5 시드 데이터 (선택)
```bash
railway run pnpm db:seed
```

---

## 7. 트러블슈팅

### 7.1 빌드 실패

**문제**: Dockerfile 빌드 실패
**해결**:
1. Railway 로그 확인
2. `railway.json` 파일 확인
3. Dockerfile 경로 확인

### 7.2 데이터베이스 연결 실패

**문제**: `P1001: Can't reach database server`
**해결**:
1. `DATABASE_URL` 환경 변수 확인
2. Railway PostgreSQL 서비스가 실행 중인지 확인
3. 네트워크 설정 확인

### 7.3 CORS 에러

**문제**: 프론트엔드에서 API 호출 실패
**해결**:
1. 백엔드 `CORS_ORIGIN` 환경 변수에 프론트엔드 URL 추가
2. Next.js `NEXT_PUBLIC_API_URL` 확인

### 7.4 포트 에러

**문제**: `EADDRINUSE: address already in use`
**해결**:
- Railway는 자동으로 `PORT` 환경 변수를 설정합니다
- `main.ts`에서 `process.env.PORT` 사용 확인

---

## 8. 자동 배포 설정

### 8.1 GitHub 연동
1. Railway 프로젝트 → "Settings" → "Service"
2. "Connect GitHub Repo" 클릭
3. 브랜치 선택 (보통 `main` 또는 `master`)

### 8.2 자동 배포 활성화
- 기본적으로 `main` 브랜치에 푸시하면 자동 배포됩니다
- 특정 브랜치만 배포하려면 "Settings" → "Deploy"에서 설정

---

## 9. 모니터링

### 9.1 로그 확인
1. Railway 대시보드 → 서비스 → "View Logs"
2. 실시간 로그 확인 가능

### 9.2 메트릭
- CPU, 메모리 사용량 확인
- 네트워크 트래픽 모니터링

---

## 10. 비용 관리

### 10.1 무료 플랜
- $5 크레딧/월
- 충분한 개발/테스트 용도

### 10.2 유료 플랜
- Starter: $5/월 + 사용량
- Pro: $20/월 + 사용량
- 사용량 기반 과금

### 10.3 비용 최적화
- 사용하지 않는 서비스 중지
- 로그 보관 기간 조정
- 불필요한 리소스 제거

---

## 11. 다음 단계

배포 완료 후:
1. ✅ 도메인 연결 (선택)
2. ✅ SSL 인증서 (자동)
3. ✅ 백업 설정
4. ✅ 모니터링 설정
5. ✅ 알림 설정

---

## 📞 지원

문제가 발생하면:
1. Railway 로그 확인
2. [Railway 문서](https://docs.railway.app) 참조
3. GitHub Issues에 문제 보고

---

**마지막 업데이트**: 2024-11-17

