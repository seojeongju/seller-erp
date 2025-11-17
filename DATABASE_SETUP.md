# 데이터베이스 설정 가이드

## 문제: Docker Desktop이 실행되지 않음

Docker Desktop이 실행되지 않았거나 설치되지 않은 경우, 다음 방법 중 하나를 선택하세요.

---

## 방법 1: Docker Desktop 실행 (추천)

### Docker Desktop이 설치되어 있는 경우

1. **Docker Desktop 실행**
   - Windows 시작 메뉴에서 "Docker Desktop" 검색 후 실행
   - 시스템 트레이에 Docker 아이콘이 나타날 때까지 대기 (1-2분)

2. **실행 확인**
   ```bash
   docker ps
   ```
   에러가 없으면 정상 실행 중입니다.

3. **PostgreSQL 컨테이너 실행**
   ```bash
   docker run --name seller-erp-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=seller_erp -p 5432:5432 -d postgres:14
   ```

---

## 방법 2: 로컬 PostgreSQL 사용 (Docker 없이)

### Windows에서 PostgreSQL 설치

#### 옵션 A: PostgreSQL 공식 설치 프로그램

1. **다운로드**: https://www.postgresql.org/download/windows/
2. **설치**: 설치 마법사 따라하기
   - 포트: 5432 (기본값)
   - 비밀번호: 원하는 비밀번호 설정 (예: `postgres`)
   - 데이터 디렉토리: 기본값 사용

3. **데이터베이스 생성**
   ```bash
   # psql 실행 (PostgreSQL 설치 경로의 bin 폴더에서)
   psql -U postgres
   
   # 또는 pgAdmin 사용 (GUI 도구)
   ```

   psql에서:
   ```sql
   CREATE DATABASE seller_erp;
   \q
   ```

4. **환경 변수 설정**
   
   `.env.local` 파일:
   ```env
   DATABASE_URL="postgresql://postgres:설정한비밀번호@localhost:5432/seller_erp?schema=public"
   ```

#### 옵션 B: Chocolatey 사용 (Windows 패키지 관리자)

```bash
# Chocolatey 설치되어 있다면
choco install postgresql14

# 서비스 시작
net start postgresql-x64-14
```

---

## 방법 3: SQLite 사용 (개발/테스트용, 간단함)

프로덕션에서는 PostgreSQL을 사용하지만, 빠른 테스트를 위해 SQLite를 사용할 수 있습니다.

### Prisma 스키마 수정

`packages/db/prisma/schema.prisma` 파일의 `datasource` 부분을 수정:

```prisma
datasource db {
  provider = "sqlite"  // "postgresql"에서 변경
  url      = "file:./dev.db"
}
```

**주의**: SQLite는 일부 PostgreSQL 기능을 지원하지 않으므로, 프로덕션 전에 PostgreSQL로 변경해야 합니다.

---

## 방법 4: 클라우드 PostgreSQL 사용 (무료 티어)

### 옵션 A: Supabase (추천)

1. **가입**: https://supabase.com
2. **프로젝트 생성**
3. **연결 문자열 복사**
4. **환경 변수에 설정**

```env
DATABASE_URL="postgresql://postgres:[비밀번호]@db.[프로젝트ID].supabase.co:5432/postgres"
```

### 옵션 B: Neon

1. **가입**: https://neon.tech
2. **프로젝트 생성**
3. **연결 문자열 복사**

---

## 추천 순서

1. **Docker Desktop이 있다면**: 방법 1 사용
2. **Docker가 없다면**: 방법 2 (로컬 PostgreSQL) 또는 방법 4 (클라우드)
3. **빠른 테스트만**: 방법 3 (SQLite)

---

## 현재 상황 확인

다음 명령어로 확인하세요:

```bash
# Docker 상태 확인
docker --version
docker ps

# PostgreSQL 설치 확인
psql --version

# 포트 사용 확인 (Windows)
netstat -ano | findstr :5432
```

---

## 다음 단계

데이터베이스가 준비되면:

```bash
# Prisma Client 생성
pnpm db:generate

# 마이그레이션 실행
pnpm db:migrate

# 테스트 데이터 생성
cd packages/db
pnpm db:seed
```

