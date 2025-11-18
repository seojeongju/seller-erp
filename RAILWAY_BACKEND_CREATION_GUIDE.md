# Railway 백엔드 서비스 생성 가이드 (초보자용)

## 📋 준비사항 확인

✅ GitHub 저장소: https://github.com/seojeongju/seller-erp
✅ Railway 계정: railway.app
✅ PostgreSQL 데이터베이스: 이미 생성됨

---

## 🚀 Step 1: Railway 대시보드 접속

### 1-1. Railway 로그인
1. 브라우저에서 https://railway.app 접속
2. **Login** 버튼 클릭
3. GitHub 계정으로 로그인

### 1-2. 프로젝트 선택
1. 로그인 후 대시보드에서 현재 프로젝트 찾기
   - 프로젝트 이름이 보일 것입니다
2. 프로젝트를 클릭하여 들어갑니다

---

## 🎯 Step 2: 새 서비스 추가

### 2-1. "New" 버튼 찾기
현재 화면에 **PostgreSQL 서비스**가 보일 것입니다.

화면 오른쪽 상단 또는 PostgreSQL 서비스 옆에:
- **"+ New"** 버튼이 있습니다
- 또는 **"Add Service"** 같은 버튼

### 2-2. "New" 버튼 클릭
클릭하면 메뉴가 나타납니다:

```
┌─────────────────────┐
│ + Database          │  ← 이건 아님 (이미 있음)
│ + Empty Service     │  ← 이것도 아님
│ + GitHub Repo       │  ← ✅ 이것을 선택!
│ + Template          │
│ + Empty Project     │
└─────────────────────┘
```

**"GitHub Repo"**를 클릭하세요!

---

## 📦 Step 3: GitHub 저장소 연결

### 3-1. 저장소 선택 화면
GitHub Repo를 클릭하면 다음과 같은 화면이 나타납니다:

```
Configure GitHub App
또는
Select a repository
```

### 3-2. 저장소 찾기

#### 방법 A: 이미 권한이 있는 경우
- 저장소 목록에서 **"seojeongju/seller-erp"** 찾기
- 클릭하여 선택

#### 방법 B: 권한이 없는 경우
1. **"Configure GitHub App"** 클릭
2. GitHub 설정 페이지로 이동
3. **"Repository access"** 섹션 찾기
4. **"Only select repositories"** 선택
5. 드롭다운에서 **"seller-erp"** 선택
6. **"Save"** 클릭
7. Railway로 돌아오면 저장소가 보임

### 3-3. 저장소 선택
- **"seojeongju/seller-erp"** 클릭
- Railway가 자동으로 저장소를 스캔합니다

---

## ⚙️ Step 4: 서비스 설정

### 4-1. Dockerfile 감지
Railway가 자동으로:
```
✅ Dockerfile을 찾았습니다!
✅ 빌드 방법을 자동으로 설정했습니다
```

### 4-2. 서비스 이름 확인
- 기본 이름: "seller-erp" 또는 "web"
- 원하면 변경 가능 (예: "backend-api")

### 4-3. Deploy 버튼 클릭
- 화면 하단에 **"Deploy"** 또는 **"Add Service"** 버튼
- 클릭하세요!

---

## 🔧 Step 5: 환경 변수 설정 (중요!)

### 5-1. 서비스 클릭
배포가 시작되면 새로운 서비스가 나타납니다:
```
┌──────────────┐     ┌──────────────┐
│  Postgres    │     │  seller-erp  │  ← 새로 생긴 서비스
└──────────────┘     └──────────────┘
```

**"seller-erp"** (또는 백엔드) 서비스를 클릭하세요!

### 5-2. Variables 탭 선택
상단 메뉴에서:
```
Deployments | Metrics | Variables | Settings
                        ↑ 이것 클릭!
```

### 5-3. 환경 변수 추가
**"New Variable"** 또는 **"+ Add Variable"** 버튼 클릭

다음 환경 변수들을 **하나씩** 추가하세요:

#### ① DATABASE_URL
```
Key:   DATABASE_URL
Value: ${{Postgres.DATABASE_URL}}
```
⚠️ **주의**: `${{Postgres.DATABASE_URL}}`을 정확히 입력하세요!
- 이것은 Railway의 특수 문법입니다
- PostgreSQL 서비스를 자동으로 참조합니다

#### ② PORT
```
Key:   PORT
Value: 3001
```

#### ③ NODE_ENV
```
Key:   NODE_ENV
Value: production
```

#### ④ NEXTAUTH_SECRET
```
Key:   NEXTAUTH_SECRET
Value: ScFK0MVZUr9Vx5X2UhVFuVrPujFNeQvtEJvk7d9xhXo=
```
(이전에 생성한 시크릿 사용)

#### ⑤ CORS_ORIGIN (나중에 업데이트 가능)
```
Key:   CORS_ORIGIN
Value: https://your-frontend.vercel.app
```
(일단 임시 값, 나중에 Vercel 배포 후 수정)

### 5-4. 환경 변수 저장 확인
모두 입력했으면:
- 자동 저장됩니다
- 또는 화면 하단에 **"Save"** 버튼이 있으면 클릭

---

## 🚀 Step 6: 배포 시작 및 확인

### 6-1. 자동 재배포
환경 변수를 저장하면:
- Railway가 자동으로 서비스를 **재배포**합니다
- 몇 분 정도 소요됩니다 (5-10분)

### 6-2. 배포 상태 확인
**"Deployments"** 탭 클릭:

```
Current Deployment
┌─────────────────────────────────────┐
│ 🔵 Building...                      │  ← 진행 중
│ ⏱️  2 minutes ago                   │
└─────────────────────────────────────┘
```

상태 변화:
1. **Building** → 코드를 Docker 이미지로 빌드 중
2. **Deploying** → 이미지를 서버에 배포 중
3. **Active** → ✅ 배포 완료!

### 6-3. 로그 확인
**"View Logs"** 클릭하여 로그를 확인하세요:

**정상 로그 예시:**
```
[Nest] 1  - 11/18/2025, 10:30:00 AM   LOG [NestFactory] Starting Nest application...
[Nest] 1  - 11/18/2025, 10:30:01 AM   LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 1  - 11/18/2025, 10:30:02 AM   LOG [RoutesResolver] AppController {/api}:
[Nest] 1  - 11/18/2025, 10:30:02 AM   LOG [NestApplication] Nest application successfully started
[Nest] 1  - 11/18/2025, 10:30:02 AM   LOG Application is running on: http://0.0.0.0:3001
```

**에러 로그 예시:**
```
Error: Cannot find module '@prisma/client'
```
→ 이런 경우 알려주세요!

---

## 🌐 Step 7: Public URL 얻기

### 7-1. Settings 탭
**"Settings"** 탭 클릭

### 7-2. Generate Domain 찾기
아래로 스크롤하면:
```
Networking
┌─────────────────────────────────────┐
│ Public Networking                   │
│                                     │
│ [Generate Domain]                   │  ← 이 버튼 클릭!
└─────────────────────────────────────┘
```

### 7-3. URL 복사
버튼을 클릭하면 URL이 생성됩니다:
```
https://seller-erp-production-xxxx.up.railway.app
```

이 URL을 복사하세요!

---

## ✅ Step 8: 배포 테스트

### 8-1. 브라우저에서 테스트
생성된 URL에 `/api` 를 붙여서 접속:
```
https://seller-erp-production-xxxx.up.railway.app/api
```

**성공 응답:**
```json
{
  "message": "Seller ERP API Server",
  "version": "1.0.0",
  "timestamp": "2025-11-18T10:30:00.000Z"
}
```

---

## 🎉 완료!

백엔드 서비스가 성공적으로 배포되었습니다!

### 다음 단계
1. ✅ PostgreSQL 데이터베이스: 완료
2. ✅ 백엔드 API 서비스: 완료
3. ⬜ 프론트엔드 (Vercel 배포): 다음 작업

---

## 🆘 문제 해결

### 문제 1: "GitHub Repo" 메뉴가 안 보여요
**해결:**
- GitHub 계정 연동 확인
- Railway 설정 → Integrations → GitHub 연결

### 문제 2: 저장소가 목록에 안 보여요
**해결:**
- "Configure GitHub App" 클릭
- Repository access 설정
- "seller-erp" 저장소 권한 부여

### 문제 3: 배포가 실패해요
**해결:**
1. Deployments 탭 → View Logs
2. 에러 메시지 확인
3. 로그를 저에게 보여주세요!

### 문제 4: 환경 변수를 잘못 입력했어요
**해결:**
1. Variables 탭으로 이동
2. 잘못된 변수 옆 **"..."** 클릭
3. **"Edit"** 또는 **"Delete"** 선택
4. 수정 후 저장

---

## 📞 도움이 필요하면

현재 어느 단계인지 알려주세요:
- "Step X에서 막혔어요"
- "이런 에러가 나와요: [에러 메시지]"
- "이런 화면이 보여요: [설명]"

스크린샷을 보여주셔도 좋습니다!

