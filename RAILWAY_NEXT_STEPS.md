# 🚀 Railway 배포 다음 단계

PostgreSQL 데이터베이스가 생성되었습니다! 이제 백엔드를 배포하세요.

## ✅ 완료된 단계

- [x] GitHub 저장소 생성 및 푸시
- [x] Railway 계정 생성
- [x] PostgreSQL 데이터베이스 생성

## 📋 다음 단계

### 1. DATABASE_URL 복사 (중요!)

1. Railway 대시보드에서 **Postgres** 서비스 클릭
2. **"Variables"** 탭 클릭
3. `DATABASE_URL` 변수 찾기
4. 값 복사 (나중에 사용)

**예시:**
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

---

### 2. NestJS 백엔드 서비스 생성

1. Railway 프로젝트에서 **"+ New"** 버튼 클릭
2. **"GitHub Repo"** 선택
3. 저장소 선택: `seojeongju/seller-erp`
4. 서비스가 생성되면 자동으로 배포가 시작됩니다

**참고**: 
- Railway가 자동으로 Dockerfile을 감지합니다
- 루트 디렉토리의 `Dockerfile`을 사용합니다

---

### 3. 환경 변수 설정

백엔드 서비스 → **"Variables"** 탭에서 다음 변수 추가:

```env
# 데이터베이스 (PostgreSQL 서비스의 DATABASE_URL 사용)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# 포트 (Railway가 자동 설정하지만 명시적으로 설정 가능)
PORT=3001

# CORS 설정 (나중에 프론트엔드 URL로 변경)
CORS_ORIGIN=https://your-frontend.vercel.app

# Node 환경
NODE_ENV=production

# NextAuth 시크릿 (터미널에서 생성: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-key-here
```

**중요**: 
- `DATABASE_URL`은 `${{Postgres.DATABASE_URL}}` 형식으로 입력
- Railway가 자동으로 PostgreSQL 서비스의 URL을 연결합니다

---

### 4. 배포 확인

1. **"Deployments"** 탭에서 배포 상태 확인
2. **"Logs"** 탭에서 빌드/실행 로그 확인
3. 배포 완료 후 **"Settings"** → **"Networking"**에서 공개 URL 확인

**예상 시간**: 5-10분 (첫 빌드)

---

### 5. 데이터베이스 마이그레이션 실행

배포가 완료되면 데이터베이스 스키마를 생성해야 합니다.

#### 방법 1: Railway CLI 사용 (권장)

```bash
# Railway CLI 설치
npm i -g @railway/cli

# 로그인
railway login

# 프로젝트 연결
railway link

# 데이터베이스 마이그레이션 실행
cd packages/db
railway run pnpm prisma migrate deploy
```

#### 방법 2: Railway 대시보드에서 실행

1. 백엔드 서비스 → **"Settings"** → **"Deploy"**
2. **"Run Command"** 사용 (고급)

---

### 6. 시드 데이터 추가 (선택)

테스트 데이터를 추가하려면:

```bash
railway run pnpm db:seed
```

---

## 🔍 문제 해결

### 빌드 실패

1. **"Logs"** 탭에서 에러 확인
2. Dockerfile 경로 확인
3. 환경 변수 확인

### 데이터베이스 연결 실패

1. `DATABASE_URL` 환경 변수 확인
2. PostgreSQL 서비스가 실행 중인지 확인
3. 네트워크 설정 확인

### 포트 에러

- Railway가 자동으로 `PORT` 환경 변수를 설정합니다
- `main.ts`에서 `process.env.PORT` 사용 확인

---

## 📝 체크리스트

배포 전 확인:
- [ ] DATABASE_URL 복사 완료
- [ ] 백엔드 서비스 생성 완료
- [ ] 환경 변수 설정 완료
- [ ] 배포 완료 확인
- [ ] 데이터베이스 마이그레이션 실행
- [ ] API 엔드포인트 테스트

---

## 🎯 다음 단계

백엔드 배포 완료 후:
1. 프론트엔드 배포 (Vercel)
2. 환경 변수 연결
3. 전체 시스템 테스트

---

**마지막 업데이트**: 2024-11-17

