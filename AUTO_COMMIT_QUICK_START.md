# 🚀 빠른 시작: 자동 커밋 및 배포

## 현재 상태

**❌ 완전 자동 아님**: 파일 저장만으로는 자동 커밋되지 않습니다.

**✅ 반자동**: `npm run commit:watch` 실행 후 자동으로 작동합니다.

---

## 🎯 사용 방법

### 방법 1: 감시 모드 (개발 중 권장)

터미널에서 한 번만 실행:

```powershell
npm run commit:watch
```

**이후 동작:**
- 파일 저장 → 자동 감지 → 자동 커밋 → 자동 푸시 → Vercel 자동 배포
- 30초마다 변경사항 확인
- 최소 1분 간격으로 커밋 (너무 자주 커밋 방지)
- `Ctrl+C`로 중지

### 방법 2: 수동 커밋 (중요한 변경사항)

```powershell
# 변경사항 즉시 커밋 및 푸시
npm run commit

# 커스텀 메시지와 함께
npm run commit:message "새로운 기능 추가"
```

---

## 🔄 전체 프로세스

```
1. 파일 수정 및 저장
   ↓
2. npm run commit:watch 실행 중이면
   ↓
3. 자동 감지 (30초마다 확인)
   ↓
4. 자동 커밋
   ↓
5. 자동 GitHub 푸시
   ↓
6. Vercel 자동 감지
   ↓
7. 자동 빌드 및 배포 (2-5분)
   ↓
8. 사이트에 자동 반영 ✅
```

---

## ⚠️ 주의사항

1. **감시 모드 사용 시**
   - 개발 중에만 사용
   - 테스트되지 않은 코드가 자동 배포될 수 있음
   - 프로덕션 배포 전에는 수동 커밋 권장

2. **완전 자동이 아닌 이유**
   - Git Hook을 사용하면 파일 저장할 때마다 자동 커밋 가능하지만
   - 너무 위험할 수 있어서 반자동 방식 채택

3. **배포 확인**
   - Vercel 대시보드: https://vercel.com/dashboard
   - Deployments 탭에서 배포 상태 확인

---

## 💡 팁

- **개발 중**: `npm run commit:watch` 실행 후 작업
- **중요 변경**: 수동 커밋 (`npm run commit`)
- **배포 전**: 항상 로컬에서 테스트

---

## 🛠️ 문제 해결

### 스크립트 실행 오류

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

