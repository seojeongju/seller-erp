# 🚀 GitHub에 푸시하기

로컬 프로젝트를 GitHub 저장소에 푸시하는 방법입니다.

## ✅ 완료된 단계

- [x] Git 저장소 초기화
- [x] 파일 추가 및 커밋
- [ ] 원격 저장소 연결
- [ ] GitHub에 푸시

---

## 다음 단계: 원격 저장소 연결 및 푸시

### 1. GitHub 저장소 URL 확인

GitHub 저장소 페이지에서:
1. 초록색 "Code" 버튼 클릭
2. HTTPS URL 복사
   - 예: `https://github.com/YOUR_USERNAME/seller-erp.git`

### 2. 원격 저장소 연결

PowerShell 또는 터미널에서 실행:

```bash
# YOUR_USERNAME을 실제 GitHub 사용자명으로 변경
git remote add origin https://github.com/YOUR_USERNAME/seller-erp.git

# 연결 확인
git remote -v
```

### 3. GitHub에 푸시

```bash
# 메인 브랜치 푸시
git push -u origin main
```

**참고**: GitHub 인증이 필요할 수 있습니다.
- Personal Access Token 사용 (권장)
- 또는 GitHub CLI 사용

---

## 🔐 GitHub 인증

### 방법 1: Personal Access Token (권장)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)" 클릭
3. 권한 선택:
   - ✅ `repo` (전체 저장소 접근)
4. 토큰 생성 및 복사
5. 푸시 시:
   - Username: GitHub 사용자명
   - Password: Personal Access Token

### 방법 2: GitHub CLI

```bash
# GitHub CLI 설치 (없는 경우)
# Windows: winget install GitHub.cli

# 로그인
gh auth login

# 푸시
git push -u origin main
```

---

## ⚠️ 문제 해결

### 에러: "remote origin already exists"

```bash
# 기존 원격 저장소 제거
git remote remove origin

# 새로 추가
git remote add origin https://github.com/YOUR_USERNAME/seller-erp.git
```

### 에러: "Authentication failed"

1. Personal Access Token 사용 확인
2. GitHub CLI로 재인증: `gh auth login`
3. 또는 SSH 키 사용 (고급)

### 경고: "embedded git repository"

`apps/web` 폴더에 Git 저장소가 있는 경우:

```bash
# apps/web/.git 폴더 제거
Remove-Item -Recurse -Force apps/web/.git

# 다시 추가 및 커밋
git add apps/web
git commit -m "Fix: Remove embedded git repository"
```

---

## ✅ 푸시 완료 확인

GitHub 웹사이트에서:
1. 저장소 페이지 접속
2. 파일들이 올바르게 업로드되었는지 확인
3. README.md가 표시되는지 확인

---

## 📝 다음 단계

푸시 완료 후:
1. `QUICK_DEPLOY.md` 참조하여 Railway 배포 시작
2. 또는 `RAILWAY_DEPLOYMENT.md` 참조하여 상세 가이드 따라하기

---

**마지막 업데이트**: 2024-11-17

