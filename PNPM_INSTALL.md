# pnpm 설치 및 의존성 설치 가이드

## 문제: pnpm이 설치되지 않음

`pnpm`이 인식되지 않습니다. 다음 방법 중 하나로 설치하세요.

---

## 방법 1: npm으로 pnpm 설치 (가장 쉬움)

npm이 설치되어 있다면:

```bash
npm install -g pnpm
```

설치 확인:
```bash
pnpm --version
```

---

## 방법 2: PowerShell 스크립트로 설치 (Windows)

PowerShell을 관리자 권한으로 실행 후:

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

설치 후 PowerShell을 재시작하세요.

---

## 방법 3: Chocolatey 사용 (Windows)

Chocolatey가 설치되어 있다면:

```bash
choco install pnpm
```

---

## 방법 4: Scoop 사용 (Windows)

Scoop이 설치되어 있다면:

```bash
scoop install pnpm
```

---

## 설치 후 확인

```bash
pnpm --version
```

버전이 표시되면 설치 완료입니다.

---

## 의존성 설치 실행 위치

**중요**: 프로젝트 루트 디렉토리에서 실행해야 합니다!

```bash
# 1. 프로젝트 루트로 이동
cd d:\Program_DEV\Seller

# 2. 의존성 설치
pnpm install
```

현재 위치 확인:
```bash
# PowerShell에서
Get-Location

# 또는
pwd
```

프로젝트 루트 디렉토리: `d:\Program_DEV\Seller`

---

## 전체 실행 순서

```bash
# 1. 프로젝트 루트로 이동
cd d:\Program_DEV\Seller

# 2. pnpm 설치 (아직 안 했다면)
npm install -g pnpm

# 3. 의존성 설치
pnpm install

# 4. Prisma Client 생성
pnpm db:generate

# 5. 데이터베이스 마이그레이션
pnpm db:migrate

# 6. 테스트 데이터 생성
cd packages/db
pnpm db:seed
cd ../..

# 7. 개발 서버 실행
pnpm dev
```

---

## 문제 해결

### pnpm 설치 후에도 인식되지 않는 경우

1. **PowerShell 재시작**
2. **환경 변수 확인**:
   ```powershell
   $env:Path
   ```
3. **수동으로 경로 추가** (필요시):
   ```powershell
   $env:Path += ";C:\Users\$env:USERNAME\AppData\Local\pnpm"
   ```

### npm도 없는 경우

Node.js를 먼저 설치하세요:
- 다운로드: https://nodejs.org/
- LTS 버전 설치 (18 이상)

