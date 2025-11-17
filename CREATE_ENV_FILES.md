# 환경 변수 파일 생성 가이드

## 필수: 환경 변수 파일 생성

다음 3개의 파일을 생성해야 합니다.

---

## 1. 루트 `.env.local` 파일 생성

프로젝트 루트 디렉토리 (`d:\Program_DEV\Seller`)에 `.env.local` 파일을 생성하세요.

**파일 내용**:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-string-at-least-32-characters-long"
```

**NEXTAUTH_SECRET 생성** (PowerShell에서):
```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
```

생성된 값을 `NEXTAUTH_SECRET`에 사용하세요.

---

## 2. `apps/web/.env.local` 파일 생성

`apps/web` 디렉토리에 `.env.local` 파일을 생성하세요.

**파일 내용**:
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="위에서 생성한 값과 동일"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## 3. `apps/api/.env.local` 파일 생성

`apps/api` 디렉토리에 `.env.local` 파일을 생성하세요.

**파일 내용**:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

---

## 빠른 생성 방법 (PowerShell)

프로젝트 루트 디렉토리에서:

```powershell
# 1. 루트 .env.local
@"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-string-at-least-32-characters-long"
"@ | Out-File -FilePath .env.local -Encoding utf8

# 2. apps/web/.env.local
@"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="change-this-to-a-random-string-at-least-32-characters-long"
NEXT_PUBLIC_API_URL="http://localhost:3001"
"@ | Out-File -FilePath apps\web\.env.local -Encoding utf8

# 3. apps/api/.env.local
@"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
"@ | Out-File -FilePath apps\api\.env.local -Encoding utf8
```

**중요**: `NEXTAUTH_SECRET`은 실제로 랜덤한 값으로 변경하세요!

---

## 확인

파일이 생성되었는지 확인:

```powershell
Test-Path .env.local
Test-Path apps\web\.env.local
Test-Path apps\api\.env.local
```

모두 `True`가 나와야 합니다.

