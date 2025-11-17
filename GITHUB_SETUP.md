# 📦 GitHub 저장소 설정 가이드

Railway 배포 전에 GitHub 저장소를 먼저 만들어야 합니다.

## 1단계: GitHub 저장소 생성

### 1.1 GitHub 웹사이트에서 생성

1. [GitHub.com](https://github.com) 접속 및 로그인
2. 우측 상단 "+" 버튼 클릭 → "New repository"
3. 저장소 정보 입력:
   - **Repository name**: `seller-erp` (또는 원하는 이름)
   - **Description**: "Multi-tenant SaaS ERP system for jewelry, camera, and electronics vendors"
   - **Visibility**: 
     - ✅ **Private** (개인 프로젝트인 경우)
     - ✅ **Public** (오픈소스로 공개할 경우)
   - **Initialize this repository with**: 체크 해제 (로컬에 이미 코드가 있으므로)
4. "Create repository" 클릭

### 1.2 저장소 URL 복사

생성된 저장소 페이지에서 HTTPS URL 복사:
```
https://github.com/your-username/seller-erp.git
```

---

## 2단계: 로컬 Git 저장소 초기화

### 2.1 Git 초기화

프로젝트 루트 디렉토리에서 실행:

```bash
# Git 저장소 초기화
git init

# 기본 브랜치를 main으로 설정
git branch -M main

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Seller ERP system"
```

### 2.2 원격 저장소 연결

```bash
# 원격 저장소 추가 (your-username과 seller-erp를 실제 값으로 변경)
git remote add origin https://github.com/your-username/seller-erp.git

# 원격 저장소 확인
git remote -v
```

### 2.3 GitHub에 푸시

```bash
# 메인 브랜치 푸시
git push -u origin main
```

**참고**: GitHub 인증이 필요할 수 있습니다.
- Personal Access Token 사용 (권장)
- 또는 GitHub CLI 사용

---

## 3단계: GitHub 인증 설정

### 옵션 A: Personal Access Token (권장)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)" 클릭
3. 권한 선택:
   - ✅ `repo` (전체 저장소 접근)
4. 토큰 생성 및 복사
5. 푸시 시 비밀번호 대신 토큰 사용

### 옵션 B: GitHub CLI

```bash
# GitHub CLI 설치 (없는 경우)
# Windows: winget install GitHub.cli
# 또는 https://cli.github.com/ 에서 다운로드

# 로그인
gh auth login

# 저장소 연결
gh repo create seller-erp --private --source=. --remote=origin --push
```

---

## 4단계: .gitignore 확인

프로젝트 루트에 `.gitignore` 파일이 있는지 확인:

```bash
# .gitignore 파일 확인
cat .gitignore
```

다음 항목들이 포함되어 있어야 합니다:
- `node_modules/`
- `.env*`
- `.next/`
- `dist/`
- `.turbo/`
- 기타 빌드 산출물

---

## 5단계: 첫 푸시 확인

GitHub 웹사이트에서 확인:
1. 저장소 페이지 접속
2. 파일들이 올바르게 업로드되었는지 확인
3. README.md가 표시되는지 확인

---

## 6단계: Railway 연결 준비

GitHub 저장소가 준비되면:
1. Railway에서 "Deploy from GitHub repo" 선택
2. 방금 만든 저장소 선택
3. 자동 배포 시작

---

## 🔧 문제 해결

### 에러: "remote origin already exists"

```bash
# 기존 원격 저장소 제거
git remote remove origin

# 새 원격 저장소 추가
git remote add origin https://github.com/your-username/seller-erp.git
```

### 에러: "Authentication failed"

1. Personal Access Token 사용 확인
2. GitHub CLI로 재인증: `gh auth login`
3. 또는 SSH 키 사용 (고급)

### 에러: "Large files"

```bash
# .gitignore에 큰 파일 추가
echo "large-file.zip" >> .gitignore

# Git 캐시에서 제거
git rm --cached large-file.zip
git commit -m "Remove large file"
```

---

## ✅ 체크리스트

배포 전 확인:
- [ ] GitHub 저장소 생성 완료
- [ ] 로컬 Git 초기화 완료
- [ ] 첫 커밋 완료
- [ ] 원격 저장소 연결 완료
- [ ] 첫 푸시 완료
- [ ] GitHub에서 파일 확인 완료
- [ ] .gitignore 확인 완료
- [ ] 민감한 정보(.env 등)가 커밋되지 않았는지 확인

---

## 📝 다음 단계

GitHub 저장소가 준비되면:
1. `QUICK_DEPLOY.md` 참조하여 Railway 배포 시작
2. 또는 `RAILWAY_DEPLOYMENT.md` 참조하여 상세 가이드 따라하기

---

**마지막 업데이트**: 2024-11-17

