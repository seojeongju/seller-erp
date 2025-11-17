# 🔐 NEXTAUTH_SECRET 생성 가이드

Windows에서 `NEXTAUTH_SECRET`을 생성하는 여러 방법입니다.

## ✅ 방법 1: Node.js 사용 (권장)

Node.js가 설치되어 있다면 (이미 설치되어 있음):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**생성된 값**:
```
ScFK0MVZUr9Vx5X2UhVFuVrPujFNeQvtEJvk7d9xhXo=
```

이 값을 `NEXTAUTH_SECRET` 환경 변수로 사용하세요.

---

## 방법 2: PowerShell 사용

PowerShell에서:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## 방법 3: Git Bash 사용 (Git 설치 시)

Git Bash 터미널에서:

```bash
openssl rand -base64 32
```

---

## 방법 4: 온라인 생성기 (비권장)

보안상 권장하지 않지만, 빠른 테스트용으로:
- https://generate-secret.vercel.app/32

**주의**: 프로덕션 환경에서는 사용하지 마세요!

---

## 📋 Railway에 설정하기

생성된 시크릿을 Railway 백엔드 서비스에 추가:

1. Railway 대시보드 → 백엔드 서비스
2. **"Variables"** 탭
3. **"+ New Variable"** 클릭
4. 설정:
   - **Name**: `NEXTAUTH_SECRET`
   - **Value**: 생성된 값 (예: `ScFK0MVZUr9Vx5X2UhVFuVrPujFNeQvtEJvk7d9xhXo=`)
5. **"Add"** 클릭

---

## 🔒 보안 주의사항

- ✅ 환경 변수로만 저장
- ✅ 코드에 하드코딩하지 않기
- ✅ GitHub에 커밋하지 않기
- ✅ 각 환경(개발/프로덕션)마다 다른 값 사용

---

## 📝 체크리스트

- [ ] NEXTAUTH_SECRET 생성 완료
- [ ] Railway 백엔드 서비스에 추가
- [ ] Vercel 프론트엔드에도 동일한 값 추가 (나중에)

---

**마지막 업데이트**: 2024-11-17

