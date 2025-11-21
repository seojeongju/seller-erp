# 🔄 Vercel 수동 재배포 가이드

## 문제 상황
- 로컬과 GitHub에는 "WOW Seller ERP"와 로고가 있음
- 배포된 사이트에는 "Seller ERP"로 표시되고 로고가 없음

## 해결 방법

### 방법 1: Vercel 대시보드에서 수동 재배포 (권장)

1. **Vercel 대시보드 접속**
   ```
   https://vercel.com/dashboard
   ```

2. **프로젝트 선택**
   - `seller-erp-web` 또는 설정한 프로젝트 이름 클릭

3. **Deployments 탭 클릭**

4. **최신 배포 찾기**
   - 최신 배포 옆 **...** (점 3개) 클릭

5. **Redeploy 선택**
   - **"Redeploy"** 클릭
   - **"Use existing Build Cache"** 체크 해제 (중요!)
   - **"Redeploy"** 버튼 클릭

6. **배포 완료 대기**
   - 빌드 로그 확인
   - 배포 완료까지 2-5분 소요

### 방법 2: 빌드 캐시 무시하고 재배포

1. **Settings → General**
2. **Build & Development Settings**
3. **"Clear Build Cache"** 클릭
4. **Deployments → 최신 배포 → Redeploy**

### 방법 3: 환경 변수 확인

1. **Settings → Environment Variables**
2. 다음 변수들이 설정되어 있는지 확인:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_API_URL`

## 배포 완료 후 확인

1. **사이트 접속**: `https://seller-erp-web.vercel.app`
2. **강력 새로고침**: `Ctrl + Shift + R` (Windows) 또는 `Cmd + Shift + R` (Mac)
3. **확인 사항**:
   - ✅ 제목: "WOW Seller ERP"
   - ✅ 로고 이미지 표시
   - ✅ 설명: "빛나는 가치를 더 완벽하게 관리하는 법"

## 문제가 계속되면

1. **빌드 로그 확인**
   - Deployments → 최신 배포 → Build Logs
   - 에러 메시지 확인

2. **Root Directory 확인**
   - Settings → General
   - Root Directory: `apps/web` 확인

3. **Build Command 확인**
   - Settings → General
   - Build Command: `npm run build:vercel` 확인

