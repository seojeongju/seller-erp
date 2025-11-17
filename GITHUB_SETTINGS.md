# ⚙️ GitHub 저장소 설정 가이드

Railway 배포를 위한 GitHub 저장소 권장 설정입니다.

## 📋 필수 설정

### 1. General (일반 설정)

#### Repository name
- ✅ **현재 값**: `seller-erp` (또는 설정한 이름)
- 변경 필요 없음

#### Description
- 저장소 설명 추가 (선택)
- 예: "Multi-tenant SaaS ERP system for jewelry, camera, and electronics vendors"

#### Template repository
- ❌ **체크 해제** (일반 저장소이므로)

#### Require contributors to sign off on web-based commits
- ❌ **체크 해제** (개인 프로젝트인 경우)
- ✅ **체크** (오픈소스 프로젝트인 경우)

---

### 2. Features (기능)

#### ✅ Wikis
- **체크 해제 권장** (문서는 README로 충분)

#### ✅ Issues
- **체크 유지 권장** (버그 리포트 및 기능 요청용)

#### ✅ Projects
- **체크 해제 권장** (간단한 프로젝트인 경우)
- **체크 유지** (프로젝트 관리가 필요한 경우)

#### ✅ Discussions
- **체크 해제 권장** (Issues로 충분)

#### ✅ Sponsors
- **체크 해제** (후원 기능이 필요 없는 경우)

---

### 3. Security (보안)

#### Advanced Security
- ✅ **Enable** (무료 플랜에서도 사용 가능)
  - Dependency graph
  - Dependabot alerts
  - Code scanning (선택)

#### Secrets and variables → Actions
- Railway 배포에는 필요 없음 (Railway가 직접 GitHub과 연동)

---

### 4. Code and automation

#### Actions → General
- ✅ **Allow all actions and reusable workflows** (Railway 배포에 필요)
- 또는 **Allow local actions and reusable workflows** 선택

#### Webhooks
- Railway가 자동으로 설정 (수동 설정 불필요)

---

## 🔒 보안 권장 사항

### 1. Branch Protection Rules (중요)

**Settings → Code and automation → Rules → Branches**

#### main 브랜치 보호 설정

1. "Add rule" 클릭
2. Branch name pattern: `main`
3. 다음 옵션 활성화:
   - ✅ **Require a pull request before merging**
     - Required number of approvals: 1 (선택)
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require conversation resolution before merging**
   - ✅ **Do not allow bypassing the above settings**

**이유**: 실수로 main 브랜치에 직접 푸시하는 것을 방지

---

### 2. Secrets (민감한 정보)

**Settings → Security → Secrets and variables → Actions**

Railway 배포에는 GitHub Secrets가 필요 없습니다. (Railway가 직접 환경 변수 관리)

하지만 CI/CD를 사용한다면:
- `RAILWAY_TOKEN` (Railway API 토큰)
- `DATABASE_URL` (개발용, 선택)

---

## 🚀 Railway 연동 설정

### 1. GitHub App 권한 확인

Railway가 GitHub 저장소에 접근하려면:

1. Railway 대시보드 → Settings → Connections
2. GitHub 연결 확인
3. 저장소 접근 권한 확인

### 2. 자동 배포 설정

**Settings → Code and automation → Actions → General**

- ✅ **Allow all actions and reusable workflows**
- ✅ **Workflow permissions**: Read and write permissions

---

## 📝 권장 설정 요약

### ✅ 활성화 권장
- [x] Issues
- [x] Actions (Railway 자동 배포용)
- [x] Advanced Security → Dependency graph
- [x] Advanced Security → Dependabot alerts
- [x] Branch protection rules (main 브랜치)

### ❌ 비활성화 권장
- [ ] Wikis (문서는 README로 충분)
- [ ] Projects (간단한 프로젝트인 경우)
- [ ] Discussions
- [ ] Sponsors
- [ ] Template repository

---

## 🔧 Railway 배포를 위한 최소 설정

Railway 배포만을 위해서는:

1. ✅ **Actions 활성화** (필수)
2. ✅ **Railway GitHub App 권한** (Railway에서 설정)
3. ❌ 나머지는 기본값으로 충분

---

## 📌 다음 단계

설정 완료 후:
1. `QUICK_DEPLOY.md` 참조하여 Railway 배포 시작
2. 또는 `RAILWAY_DEPLOYMENT.md` 참조하여 상세 가이드 따라하기

---

**마지막 업데이트**: 2024-11-17

