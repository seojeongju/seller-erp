# 로고 파일 설정 가이드

## 📁 로고 파일 위치

로고 파일을 다음 위치에 저장하세요:

```
apps/web/public/logo.png
```

또는 다른 확장자를 사용하는 경우:
- `apps/web/public/logo.svg` (SVG 파일인 경우)
- `apps/web/public/logo.jpg` (JPG 파일인 경우)

## ✅ 적용된 위치

로고가 다음 위치에 적용되었습니다:

1. **랜딩 페이지** (`apps/web/app/page.tsx`)
   - 상단 중앙에 120x120 크기로 표시

2. **사이드바** (`apps/web/components/layout/sidebar.tsx`)
   - 좌측 상단에 32x32 크기로 표시

3. **로그인 페이지** (`apps/web/app/auth/signin/page.tsx`)
   - 상단 중앙에 80x80 크기로 표시

## 🔄 프로그램명 변경

프로그램명이 "WOW Seller ERP"로 변경되었습니다:

- ✅ 랜딩 페이지 타이틀
- ✅ 사이드바 로고 옆 텍스트
- ✅ 메타데이터 (브라우저 탭 제목)
- ✅ 로그인 페이지 타이틀

## 📝 다음 단계

1. 로고 파일을 `apps/web/public/logo.png`에 저장
2. 파일이 올바르게 저장되었는지 확인
3. 로컬에서 테스트: `pnpm dev`
4. GitHub에 커밋 및 푸시
5. Vercel에서 자동 배포 확인

## 🎨 로고 파일 권장 사양

- **형식**: PNG (투명 배경) 또는 SVG
- **크기**: 최소 512x512px (고해상도 디스플레이 대응)
- **비율**: 1:1 (정사각형)
- **파일 크기**: 500KB 이하 (빠른 로딩)

