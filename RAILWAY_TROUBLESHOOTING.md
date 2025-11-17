# 🔧 Railway 배포 문제 해결 가이드

"Application failed to respond" 에러가 발생했을 때 해결하는 방법입니다.

## 🔍 문제 진단

### 1. 배포 로그 확인

Railway 대시보드에서:
1. 백엔드 서비스 클릭
2. **"Logs"** 탭 클릭
3. 최근 로그 확인

**확인할 내용**:
- 빌드 에러가 있는지
- 애플리케이션이 시작되었는지
- 포트 바인딩 에러가 있는지
- 데이터베이스 연결 에러가 있는지

---

## 🐛 일반적인 문제와 해결 방법

### 문제 1: 포트 바인딩 에러

**증상**: 
- "EADDRINUSE" 에러
- "Cannot bind to port" 에러

**해결**:
1. `main.ts`에서 포트 설정 확인:
   ```typescript
   const port = process.env.PORT || 3001;
   await app.listen(port, '0.0.0.0');
   ```
2. Railway가 자동으로 `PORT` 환경 변수를 설정하므로 `process.env.PORT` 사용 확인

### 문제 2: 데이터베이스 연결 실패

**증상**:
- "Can't reach database server" 에러
- "P1001" Prisma 에러

**해결**:
1. `DATABASE_URL` 환경 변수 확인
2. Variable Reference 사용 확인: `${{Postgres.DATABASE_URL}}`
3. Postgres 서비스가 실행 중인지 확인

### 문제 3: 빌드 실패

**증상**:
- Docker 빌드 에러
- 의존성 설치 실패

**해결**:
1. Dockerfile 경로 확인
2. `package.json` 확인
3. 빌드 로그에서 구체적인 에러 확인

### 문제 4: 애플리케이션이 시작되지 않음

**증상**:
- 빌드는 성공했지만 애플리케이션이 실행되지 않음

**해결**:
1. 시작 명령어 확인: `node apps/api/dist/main.js`
2. `dist` 폴더가 생성되었는지 확인
3. Prisma Client 생성 확인

---

## 🔧 단계별 해결 방법

### Step 1: 로그 확인

Railway 대시보드 → 백엔드 서비스 → **"Logs"** 탭

**확인할 로그 메시지**:
```
🚀 API 서버가 포트 3001에서 실행 중입니다.
📍 API 엔드포인트: http://0.0.0.0:3001/api
```

이 메시지가 보이지 않으면 애플리케이션이 시작되지 않은 것입니다.

### Step 2: 환경 변수 확인

백엔드 서비스 → **"Variables"** 탭에서 확인:

- [ ] `DATABASE_URL` 설정됨
- [ ] `PORT` 설정됨 (또는 Railway 자동 설정)
- [ ] `NODE_ENV=production` 설정됨

### Step 3: 배포 상태 확인

**"Deployments"** 탭에서:
- 배포 상태가 "Active"인지 확인
- 최근 배포가 성공했는지 확인

### Step 4: 재배포

문제가 지속되면:
1. **"Deployments"** 탭
2. 최근 배포 옆 **"..."** 메뉴
3. **"Redeploy"** 선택

---

## 📋 체크리스트

### 빌드 단계
- [ ] Dockerfile이 루트에 있는지 확인
- [ ] `package.json` 파일들이 올바른 위치에 있는지 확인
- [ ] 빌드 로그에 에러가 없는지 확인

### 실행 단계
- [ ] 애플리케이션이 시작되었는지 확인 (로그에서 확인)
- [ ] 포트가 올바르게 바인딩되었는지 확인
- [ ] 데이터베이스 연결이 성공했는지 확인

### 네트워크 단계
- [ ] 공개 URL이 올바른지 확인
- [ ] 포트가 올바르게 노출되었는지 확인

---

## 🚀 빠른 해결 방법

### 방법 1: 로그 확인 후 수정

1. **"Logs"** 탭에서 에러 확인
2. 에러 메시지에 따라 수정
3. GitHub에 푸시 (자동 재배포)

### 방법 2: 환경 변수 재확인

1. 모든 환경 변수가 올바른지 확인
2. `DATABASE_URL`이 Variable Reference인지 확인
3. 재배포

### 방법 3: Dockerfile 확인

1. `Dockerfile`이 루트에 있는지 확인
2. 빌드 경로가 올바른지 확인
3. 시작 명령어가 올바른지 확인

---

## 📝 일반적인 에러 메시지

### "Cannot find module"
- **원인**: 의존성 설치 실패 또는 경로 문제
- **해결**: `package.json` 확인, 빌드 로그 확인

### "Port already in use"
- **원인**: 포트 충돌
- **해결**: `process.env.PORT` 사용 확인

### "Database connection failed"
- **원인**: DATABASE_URL 문제 또는 네트워크 문제
- **해결**: Variable Reference 확인, Postgres 서비스 확인

---

## 🔍 디버깅 팁

1. **로그를 자세히 읽기**: 에러 메시지의 첫 번째 줄이 가장 중요
2. **최근 변경사항 확인**: 무엇을 변경했는지 기억하기
3. **단계별 확인**: 빌드 → 실행 → 네트워크 순서로 확인

---

## 📞 추가 도움

문제가 해결되지 않으면:
1. Railway 로그 전체 복사
2. 에러 메시지 스크린샷
3. 환경 변수 목록 (민감한 정보 제외)
4. GitHub Issues에 보고

---

**마지막 업데이트**: 2024-11-17

