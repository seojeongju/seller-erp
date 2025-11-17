# 다음 단계: 로컬 실행 완료하기

Docker 컨테이너가 실행 중입니다! 이제 다음 단계를 진행하세요.

## 1단계: 환경 변수 파일 생성

### 루트 디렉토리에 `.env.local` 파일 생성

파일 내용:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-string-at-least-32-characters-long-please"
```

**NEXTAUTH_SECRET 생성** (PowerShell에서):
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

### `apps/web/.env.local` 파일 생성

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="위에서 생성한 값과 동일"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### `apps/api/.env.local` 파일 생성

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

---

## 2단계: 의존성 설치

```bash
pnpm install
```

---

## 3단계: Prisma 설정

```bash
# Prisma Client 생성
pnpm db:generate

# 데이터베이스 마이그레이션
pnpm db:migrate
```

---

## 4단계: 테스트 데이터 생성

```bash
cd packages/db
pnpm db:seed
```

이 명령은 다음을 자동 생성합니다:
- 테넌트: `test-company`
- 관리자: `admin@test.com` / `admin123`
- 일반 사용자: `member@test.com` / `admin123`
- 테스트 고객 및 상품

---

## 5단계: 개발 서버 실행

```bash
# 루트 디렉토리로 돌아가서
cd ../..
pnpm dev
```

이 명령은 다음을 실행합니다:
- Next.js: http://localhost:3000
- NestJS API: http://localhost:3001

---

## 6단계: 접속

브라우저에서 다음 URL로 접속:

1. **로그인 페이지**:
   ```
   http://localhost:3000/auth/signin?tenant=test-company
   ```

2. **테스트 계정으로 로그인**:
   - 이메일: `admin@test.com`
   - 비밀번호: `admin123`
   - 테넌트 슬러그: `test-company`

3. **대시보드 확인**:
   ```
   http://localhost:3000/dashboard?tenant=test-company
   ```

---

## 문제 해결

### 포트가 이미 사용 중인 경우

```bash
# 포트 확인
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5432
```

### Prisma 마이그레이션 오류

```bash
# 마이그레이션 재설정 (주의: 데이터 삭제됨)
cd packages/db
pnpm db:push --force-reset
pnpm db:generate
```

### 패키지 설치 오류

```bash
# node_modules 삭제 후 재설치
Remove-Item -Recurse -Force node_modules, apps\*\node_modules, packages\*\node_modules
pnpm install
```

---

## 성공 확인

다음이 정상 작동하면 성공입니다:
- ✅ 로그인 페이지 접속 가능
- ✅ 테스트 계정으로 로그인 성공
- ✅ 대시보드 표시
- ✅ KPI 카드 표시

