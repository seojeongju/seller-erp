# 데이터베이스 연결 테스트 가이드

## 문제: Prisma 인증 오류

Prisma가 PostgreSQL에 연결하지 못하고 있습니다. 다음을 확인하세요.

---

## 1. 직접 연결 테스트

PowerShell에서 다음 명령어로 직접 연결을 테스트하세요:

```powershell
# psql이 설치되어 있다면
psql -h localhost -p 5432 -U postgres -d seller_erp

# 비밀번호 입력: postgres
```

또는 Docker를 통해:

```powershell
docker exec -it seller-erp-db psql -U postgres -d seller_erp
```

---

## 2. .env 파일 확인

`packages/db/.env` 파일이 정확히 다음과 같아야 합니다:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public
```

**확인 사항**:
- 따옴표 없음
- 한 줄
- 줄바꿈 없음
- 공백 없음

---

## 3. 대안: 환경 변수 직접 설정

PowerShell에서:

```powershell
cd d:\Program_DEV\Seller\packages\db

# 환경 변수 직접 설정
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"

# Prisma 연결 테스트
pnpm prisma db push
```

---

## 4. Docker 컨테이너 재생성 (최후의 수단)

```powershell
# 기존 컨테이너 삭제
docker stop seller-erp-db
docker rm seller-erp-db

# 새로 생성
docker run --name seller-erp-db `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=seller_erp `
  -p 5432:5432 `
  -d postgres:14

# 5초 대기
Start-Sleep -Seconds 5

# 연결 테스트
docker exec seller-erp-db psql -U postgres -d seller_erp -c "SELECT 1;"
```

---

## 5. Prisma Studio로 연결 테스트

```powershell
cd d:\Program_DEV\Seller\packages\db
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seller_erp?schema=public"
pnpm prisma studio
```

Prisma Studio가 열리면 연결이 성공한 것입니다.

---

## 6. Windows 방화벽 확인

Windows 방화벽이 PostgreSQL 포트(5432)를 차단하고 있을 수 있습니다.

```powershell
# 방화벽 규칙 확인
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*PostgreSQL*"}
```

---

## 다음 단계

연결이 성공하면:

```bash
# 마이그레이션 실행
pnpm db:migrate

# 또는 db push 사용
cd packages/db
pnpm prisma db push
```

