# 🚀 자동 커밋 및 배포 가이드

파일 변경사항을 자동으로 감지하고 커밋/배포하는 기능입니다.

## 📋 기능

1. **자동 커밋**: 변경된 파일을 자동으로 감지하고 커밋
2. **자동 푸시**: GitHub에 자동으로 푸시
3. **자동 배포**: Vercel이 자동으로 배포 시작
4. **파일 감시**: 실시간으로 파일 변경 감지

## 🎯 사용 방법

### 방법 1: 단일 실행 (수동)

변경사항을 즉시 커밋하고 푸시:

```powershell
# Windows (PowerShell)
npm run commit

# 또는 직접 실행
powershell -ExecutionPolicy Bypass -File ./auto-commit.ps1
```

커스텀 메시지와 함께:

```powershell
npm run commit:message "커스텀 커밋 메시지"
```

### 방법 2: 감시 모드 (자동)

파일 변경을 실시간으로 감지하고 자동 커밋:

```powershell
# Windows (PowerShell)
npm run commit:watch

# 또는 직접 실행
powershell -ExecutionPolicy Bypass -File ./auto-commit.ps1 watch
```

**감시 모드 특징:**
- 30초마다 파일 변경 확인
- 변경사항 발견 시 자동 커밋 및 푸시
- 최소 1분 간격으로 커밋 (너무 자주 커밋하는 것 방지)
- `Ctrl+C`로 중지

### 방법 3: Linux/Mac

```bash
# 실행 권한 부여 (최초 1회)
chmod +x auto-commit.sh

# 단일 실행
./auto-commit.sh

# 감시 모드
./auto-commit.sh watch
```

## ⚙️ 옵션

### PowerShell 스크립트 옵션

```powershell
# 커스텀 메시지
.\auto-commit.ps1 -Message "새로운 기능 추가"

# 푸시 건너뜀 (커밋만)
.\auto-commit.ps1 -SkipPush

# 감시 간격 변경 (기본: 30초)
.\auto-commit.ps1 watch -WatchInterval 60
```

## 🔄 자동 배포 프로세스

```
파일 변경
    ↓
자동 커밋 (auto-commit.ps1)
    ↓
GitHub 푸시
    ↓
Vercel 자동 감지
    ↓
자동 빌드 및 배포
    ↓
배포 완료 (2-5분)
```

## 📝 커밋 메시지 형식

기본 형식:
```
Auto commit: Update files (2024-01-15 14:30:25)
```

커스텀 메시지:
```
커스텀 메시지 (2024-01-15 14:30:25)
```

## ⚠️ 주의사항

1. **자동 커밋은 신중하게 사용하세요**
   - 중요한 변경사항은 수동으로 커밋하는 것을 권장
   - 테스트되지 않은 코드가 자동으로 배포될 수 있음

2. **감시 모드 사용 시**
   - 개발 중에만 사용
   - 프로덕션 배포 전에는 수동 커밋 권장

3. **커밋 전 확인**
   - 변경된 파일 목록을 확인
   - 원치 않는 파일이 포함되지 않았는지 확인

## 🛠️ 문제 해결

### 스크립트 실행 권한 오류

```powershell
# PowerShell 실행 정책 변경
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Git 인증 오류

```powershell
# GitHub 인증 확인
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 푸시 실패

- GitHub 인증 토큰 확인
- 네트워크 연결 확인
- 원격 저장소 URL 확인: `git remote -v`

## 📚 추가 기능

### .gitignore 확인

자동 커밋 전에 `.gitignore`에 중요한 파일이 제외되어 있는지 확인하세요:

```
node_modules/
.env
*.log
dist/
.next/
```

### 선택적 파일 커밋

특정 파일만 커밋하려면 수동으로 커밋하세요:

```powershell
git add apps/web/app/page.tsx
git commit -m "Update landing page"
git push origin main
```

## 🎉 자동 배포 확인

커밋 및 푸시 후:

1. **Vercel 대시보드**: https://vercel.com/dashboard
2. **Deployments** 탭에서 배포 상태 확인
3. 배포 완료 후 사이트에서 변경사항 확인

## 💡 팁

- **개발 중**: 감시 모드 사용 (`npm run commit:watch`)
- **중요 변경**: 수동 커밋 권장
- **배포 전**: 항상 로컬에서 테스트

