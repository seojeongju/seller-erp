# ✅ Railway 환경 변수 확인 가이드

백엔드 서비스의 환경 변수 설정이 올바른지 확인하는 방법입니다.

## 📋 필수 환경 변수 체크리스트

### ✅ 확인된 변수들

화면에서 확인할 수 있는 변수들:

1. **DATABASE_URL** ✅
   - Variable Reference로 설정되어야 함
   - 값: `${{Postgres.DATABASE_URL}}` 형식

2. **PORT** ✅
   - 값: `3001` (또는 Railway가 자동 설정)

3. **CORS_ORIGIN** ✅
   - 값: 프론트엔드 URL (나중에 변경 필요)
   - 예: `https://your-frontend.vercel.app`

4. **NODE_ENV** ✅
   - 값: `production`

5. **NEXTAUTH_SECRET** ✅
   - 값: 생성된 시크릿 키

### 📌 PostgreSQL 관련 변수들 (자동 생성)

다음 변수들은 Railway가 자동으로 생성하므로 수정할 필요 없습니다:
- `DATABASE_PUBLIC_URL`
- `PGDATA`
- `PGDATABASE`
- `PGHOST`
- `PGPASSWORD`
- `PGPORT`
- `PGUSER`
- `POSTGRES_DB`

---

## 🔍 DATABASE_URL 확인 방법

### Variable Reference로 설정되었는지 확인

1. `DATABASE_URL` 변수 클릭
2. 값이 다음 중 하나인지 확인:
   - `${{Postgres.DATABASE_URL}}` (Variable Reference)
   - 또는 실제 내부 URL (자동 변환됨)

**중요**: 직접 URL을 입력한 경우 Variable Reference로 변경하는 것이 좋습니다.

---

## ✅ 설정 완료 확인

모든 필수 변수가 설정되었다면:

- [x] DATABASE_URL 설정 완료
- [x] PORT 설정 완료
- [x] CORS_ORIGIN 설정 완료
- [x] NODE_ENV 설정 완료
- [x] NEXTAUTH_SECRET 설정 완료

---

## 🚀 다음 단계

환경 변수 설정이 완료되었으므로:

1. **배포 확인**
   - "Deployments" 탭에서 배포 상태 확인
   - "Logs" 탭에서 빌드/실행 로그 확인

2. **배포 완료 대기**
   - 첫 빌드는 5-10분 소요될 수 있음
   - 빌드 완료 후 자동으로 실행됨

3. **데이터베이스 마이그레이션**
   - 배포 완료 후 실행
   - Railway CLI 사용: `railway run pnpm prisma migrate deploy`

4. **API 테스트**
   - 배포 완료 후 공개 URL 확인
   - API 엔드포인트 테스트

---

## 🐛 문제 해결

### 배포 실패

1. **"Logs"** 탭에서 에러 확인
2. 환경 변수 이름/값 확인
3. Dockerfile 경로 확인

### 데이터베이스 연결 실패

1. `DATABASE_URL`이 Variable Reference인지 확인
2. Postgres 서비스가 실행 중인지 확인
3. 네트워크 설정 확인

---

## 📝 참고사항

- **CORS_ORIGIN**: 프론트엔드 배포 후 실제 URL로 변경 필요
- **NEXTAUTH_SECRET**: 프론트엔드에도 동일한 값 설정 필요 (나중에)
- **DATABASE_URL**: Variable Reference 사용 권장

---

**마지막 업데이트**: 2024-11-17

