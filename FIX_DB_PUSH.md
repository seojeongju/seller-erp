# Prisma db push 인증 오류 해결

## 문제
Prisma Studio는 성공했지만, `db push`는 인증 실패 오류가 발생합니다.

## 원인
환경 변수가 PowerShell 세션에 제대로 설정되지 않았거나, `.env` 파일에 숨겨진 문자가 있을 수 있습니다.

---

## 해결 방법 1: 환경 변수와 함께 실행 (권장)

PowerShell에서 다음 명령을 **한 번에** 실행하세요:

```powershell
cd d:\Program_DEV\Seller\packages\db

$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"

pnpm prisma db push --accept-data-loss
```

**중요**: 세 줄을 모두 선택해서 한 번에 붙여넣고 실행하세요!

---

## 해결 방법 2: .env 파일 재생성

### 2-1. 기존 .env 파일 삭제

```powershell
cd d:\Program_DEV\Seller\packages\db
Remove-Item .env -Force
```

### 2-2. 새로운 .env 파일 생성

```powershell
@"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public
"@ | Out-File -FilePath .env -Encoding ASCII -NoNewline
```

### 2-3. 내용 확인

```powershell
Get-Content .env
```

출력이 다음과 같아야 합니다:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public
```

### 2-4. db push 실행

```powershell
pnpm prisma db push --accept-data-loss
```

---

## 해결 방법 3: 직접 URL 전달

```powershell
cd d:\Program_DEV\Seller\packages\db

pnpm prisma db push --accept-data-loss --schema=./prisma/schema.prisma
```

이 방법도 실패하면, PowerShell에서 환경 변수를 먼저 설정하고 실행하세요:

```powershell
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"; pnpm prisma db push --accept-data-loss
```

---

## 성공 시 다음 단계

스키마 적용이 성공하면:

```powershell
# 시드 데이터 생성
cd d:\Program_DEV\Seller
pnpm db:seed

# 개발 서버 실행
pnpm dev
```

