# 🗄️ Railway PostgreSQL 데이터베이스 설정

## 📋 DATABASE_URL 정보

Railway에서 제공하는 DATABASE_URL은 두 가지가 있습니다:

### 1. 내부 네트워크 URL (서비스 간 통신)
```
postgresql://postgres:JzVdMvrxlUVGUlQqEUFFUEoNuxdunzGQ@postgres.railway.internal:5432/railway
```
- **용도**: Railway 내부 서비스 간 통신
- **사용**: 백엔드 서비스에서 자동으로 사용됨
- **특징**: `postgres.railway.internal` 도메인 사용

### 2. 공개 URL (외부 접근)
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```
- **용도**: 로컬 개발, 마이그레이션, 외부 도구 연결
- **사용**: Prisma Studio, 로컬 마이그레이션 등
- **특징**: `containers-us-west-xxx.railway.app` 도메인 사용

---

## ✅ 백엔드 서비스 설정 방법

### 방법 1: Railway 변수 참조 (권장)

백엔드 서비스의 **"Variables"** 탭에서:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

**장점**:
- Railway가 자동으로 올바른 URL 제공
- 내부 네트워크 URL 자동 사용
- 보안 강화

### 방법 2: 직접 입력 (비권장)

```
DATABASE_URL=postgresql://postgres:JzVdMvrxlUVGUlQqEUFFUEoNuxdunzGQ@postgres.railway.internal:5432/railway
```

**단점**:
- 비밀번호가 노출됨
- Railway 변수 참조를 사용하는 것이 더 안전

---

## 🔧 환경 변수 설정 가이드

### 백엔드 서비스 (NestJS) 환경 변수

Railway 대시보드 → 백엔드 서비스 → **"Variables"** 탭:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | PostgreSQL 연결 (자동) |
| `PORT` | `3001` | 서버 포트 (선택) |
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` | CORS 허용 도메인 |
| `NODE_ENV` | `production` | 프로덕션 모드 |
| `NEXTAUTH_SECRET` | `your-secret-key` | NextAuth 암호화 키 |

---

## 🚀 데이터베이스 마이그레이션

### Railway CLI 사용 (권장)

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
```

**참고**: Railway CLI는 자동으로 올바른 DATABASE_URL을 사용합니다.

### 공개 URL 확인 (필요한 경우)

1. Railway 대시보드 → Postgres 서비스
2. **"Variables"** 탭
3. `DATABASE_URL` 또는 `PUBLIC_DATABASE_URL` 확인
4. 로컬에서 사용 (Prisma Studio 등)

---

## 🔒 보안 주의사항

### ✅ 안전한 방법
- Railway 변수 참조 사용: `${{Postgres.DATABASE_URL}}`
- 환경 변수에 직접 비밀번호 입력하지 않기
- 공개 저장소에 DATABASE_URL 커밋하지 않기

### ❌ 위험한 방법
- 코드에 DATABASE_URL 하드코딩
- GitHub에 DATABASE_URL 커밋
- 공개 채널에 DATABASE_URL 공유

---

## 📝 체크리스트

- [ ] 백엔드 서비스 생성 완료
- [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}` 설정
- [ ] 다른 환경 변수 설정 완료
- [ ] 배포 완료 확인
- [ ] 데이터베이스 마이그레이션 실행
- [ ] 연결 테스트 완료

---

## 🐛 문제 해결

### 에러: "Can't reach database server"

**원인**: 내부 네트워크 URL을 외부에서 사용하려고 함

**해결**:
1. Railway 변수 참조 사용 확인: `${{Postgres.DATABASE_URL}}`
2. 백엔드 서비스가 같은 프로젝트에 있는지 확인
3. PostgreSQL 서비스가 실행 중인지 확인

### 에러: "Authentication failed"

**원인**: 잘못된 비밀번호 또는 URL

**해결**:
1. Railway 변수 참조 사용: `${{Postgres.DATABASE_URL}}`
2. PostgreSQL 서비스의 Variables에서 올바른 URL 확인

---

## 📌 다음 단계

1. 백엔드 서비스 생성
2. 환경 변수 설정 (`DATABASE_URL=${{Postgres.DATABASE_URL}}`)
3. 배포 완료 대기
4. 마이그레이션 실행
5. API 테스트

---

**마지막 업데이트**: 2024-11-17

