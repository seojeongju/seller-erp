# 🔗 Railway Variable Reference 사용 가이드

Railway에서 데이터베이스를 서비스에 연결할 때는 **Variable Reference**를 사용하는 것이 권장됩니다.

## ✅ Variable Reference란?

Railway의 Variable Reference는 다른 서비스의 환경 변수를 참조하는 기능입니다.

**장점**:
- ✅ 자동으로 올바른 URL 제공
- ✅ 내부 네트워크 URL 자동 사용
- ✅ 보안 강화 (비밀번호 직접 노출 방지)
- ✅ 서비스 간 자동 연결

---

## 📋 백엔드 서비스에 DATABASE_URL 연결하기

### 방법 1: Variable Reference 사용 (권장)

1. **백엔드 서비스** → **"Variables"** 탭
2. **"+ New Variable"** 클릭
3. 변수 설정:
   - **Name**: `DATABASE_URL`
   - **Value**: `${{Postgres.DATABASE_URL}}`
   - 또는 **"Variable Reference"** 버튼 클릭
4. **"Add"** 클릭

**참고**: Railway가 자동으로 Postgres 서비스를 감지하고 연결합니다.

### 방법 2: Shared Variable 사용

1. **Postgres 서비스** → **"Variables"** 탭
2. `DATABASE_URL` 변수 옆 **"..."** 메뉴 클릭
3. **"Share Variable"** 선택
4. 백엔드 서비스 선택
5. 자동으로 연결됨

---

## 🔧 환경 변수 설정 완전 가이드

### 백엔드 서비스 (NestJS) 필수 환경 변수

백엔드 서비스 → **"Variables"** 탭에서 다음 변수들을 추가:

#### 1. DATABASE_URL (Variable Reference 사용)

```
Name: DATABASE_URL
Value: ${{Postgres.DATABASE_URL}}
```

또는 **"Variable Reference"** 버튼을 클릭하여 Postgres 서비스 선택

#### 2. 포트 설정

```
Name: PORT
Value: 3001
```

**참고**: Railway가 자동으로 PORT를 설정하지만, 명시적으로 설정 가능

#### 3. CORS 설정

```
Name: CORS_ORIGIN
Value: https://your-frontend.vercel.app
```

**나중에 프론트엔드 URL로 변경 필요**

#### 4. Node 환경

```
Name: NODE_ENV
Value: production
```

#### 5. NextAuth 시크릿

```
Name: NEXTAUTH_SECRET
Value: your-secret-key-here
```

**생성 방법**:
```bash
openssl rand -base64 32
```

---

## 📝 단계별 설정 가이드

### Step 1: 백엔드 서비스 생성

1. Railway 프로젝트에서 **"+ New"** 클릭
2. **"GitHub Repo"** 선택
3. 저장소: `seojeongju/seller-erp` 선택
4. 서비스 이름: `backend` (선택)

### Step 2: DATABASE_URL 연결

1. 백엔드 서비스 → **"Variables"** 탭
2. **"+ New Variable"** 클릭
3. **"Variable Reference"** 버튼 클릭 (또는 직접 입력)
4. **Postgres** 서비스 선택
5. **DATABASE_URL** 변수 선택
6. **"Add"** 클릭

### Step 3: 나머지 환경 변수 추가

위의 환경 변수 목록을 참조하여 추가

### Step 4: 배포 확인

1. **"Deployments"** 탭에서 배포 상태 확인
2. **"Logs"** 탭에서 빌드/실행 로그 확인
3. 배포 완료 대기 (5-10분)

---

## 🔍 Variable Reference 확인 방법

설정 후 확인:

1. 백엔드 서비스 → **"Variables"** 탭
2. `DATABASE_URL` 변수 확인
3. 값이 `${{Postgres.DATABASE_URL}}` 형식인지 확인
4. 또는 실제 URL이 자동으로 표시될 수 있음

---

## ⚠️ 주의사항

### ✅ 올바른 방법

- Variable Reference 사용: `${{Postgres.DATABASE_URL}}`
- Shared Variable 사용
- Railway가 자동으로 관리

### ❌ 잘못된 방법

- 직접 URL 입력: `postgresql://postgres:password@...`
- 비밀번호 하드코딩
- 공개 채널에 URL 공유

---

## 🐛 문제 해결

### Variable Reference가 작동하지 않음

1. Postgres 서비스가 같은 프로젝트에 있는지 확인
2. Postgres 서비스가 실행 중인지 확인
3. 변수 이름이 정확한지 확인: `DATABASE_URL`

### 배포 후 데이터베이스 연결 실패

1. **"Logs"** 탭에서 에러 확인
2. `DATABASE_URL` 환경 변수 확인
3. Variable Reference 형식 확인: `${{Postgres.DATABASE_URL}}`

---

## 📌 체크리스트

- [ ] 백엔드 서비스 생성 완료
- [ ] DATABASE_URL Variable Reference 설정
- [ ] 다른 환경 변수 설정 완료
- [ ] 배포 완료 확인
- [ ] 로그에서 에러 확인
- [ ] 데이터베이스 연결 테스트

---

## 🚀 다음 단계

환경 변수 설정 완료 후:

1. 배포 완료 대기
2. 데이터베이스 마이그레이션 실행
3. API 엔드포인트 테스트
4. 프론트엔드 배포 준비

---

**마지막 업데이트**: 2024-11-17

