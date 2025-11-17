# ✅ 배포 체크리스트

Railway 배포 전 확인사항입니다.

## 📋 배포 전 체크리스트

### 1. 코드 준비
- [ ] 모든 변경사항이 GitHub에 푸시되었는지 확인
- [ ] `main` 또는 `master` 브랜치가 최신인지 확인
- [ ] 테스트가 통과하는지 확인 (로컬)

### 2. 환경 변수 준비
- [ ] `NEXTAUTH_SECRET` 생성 (openssl rand -base64 32)
- [ ] 프론트엔드 URL 확인 (Vercel 또는 Railway)
- [ ] 백엔드 URL 확인 (Railway)
- [ ] 데이터베이스 URL 확인 (Railway PostgreSQL)

### 3. Railway 설정
- [ ] Railway 계정 생성 완료
- [ ] GitHub 저장소 연결 완료
- [ ] PostgreSQL 데이터베이스 생성 완료
- [ ] NestJS 서비스 생성 완료
- [ ] 환경 변수 설정 완료

### 4. Vercel 설정 (프론트엔드)
- [ ] Vercel 계정 생성 완료
- [ ] GitHub 저장소 연결 완료
- [ ] 프로젝트 설정 완료 (Root Directory: apps/web)
- [ ] 환경 변수 설정 완료

### 5. 데이터베이스
- [ ] Prisma 마이그레이션 실행
- [ ] 시드 데이터 실행 (선택)
- [ ] 데이터베이스 연결 테스트

### 6. 배포 후 확인
- [ ] 백엔드 API 응답 확인
- [ ] 프론트엔드 로드 확인
- [ ] 로그인 기능 테스트
- [ ] API 호출 테스트
- [ ] 데이터베이스 연결 확인

---

## 🔧 필수 환경 변수

### 백엔드 (Railway)
```env
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
PORT=3001
CORS_ORIGIN=https://your-frontend.vercel.app
NODE_ENV=production
NEXTAUTH_SECRET=your-secret-key
```

### 프론트엔드 (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-frontend.vercel.app
```

---

## 🚨 문제 해결

### 빌드 실패
1. Railway 로그 확인
2. Dockerfile 경로 확인
3. package.json 확인

### 데이터베이스 연결 실패
1. DATABASE_URL 확인
2. PostgreSQL 서비스 실행 확인
3. 네트워크 설정 확인

### CORS 에러
1. CORS_ORIGIN 환경 변수 확인
2. 프론트엔드 URL이 정확한지 확인

---

## 📞 지원

문제 발생 시:
1. Railway 로그 확인
2. Vercel 로그 확인
3. 브라우저 콘솔 확인
4. GitHub Issues에 문제 보고

