# GitHub 저장소 설정 스크립트 (PowerShell)

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "  GitHub 저장소 설정" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# 1. Git 초기화 확인
if (Test-Path .git) {
    Write-Host "✓ Git 저장소가 이미 초기화되어 있습니다." -ForegroundColor Green
} else {
    Write-Host "Git 저장소를 초기화합니다..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✓ Git 저장소 초기화 완료" -ForegroundColor Green
}

Write-Host ""

# 2. .gitignore 확인
if (Test-Path .gitignore) {
    Write-Host "✓ .gitignore 파일이 존재합니다." -ForegroundColor Green
} else {
    Write-Host "⚠ .gitignore 파일이 없습니다. 생성하세요." -ForegroundColor Yellow
}

Write-Host ""

# 3. 변경사항 확인
Write-Host "변경사항을 확인합니다..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
    Write-Host "다음 파일들이 커밋되지 않았습니다:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    $add = Read-Host "모든 파일을 추가하시겠습니까? (y/n)"
    if ($add -eq "y" -or $add -eq "Y") {
        git add .
        Write-Host "✓ 파일 추가 완료" -ForegroundColor Green
    }
} else {
    Write-Host "✓ 모든 변경사항이 커밋되었습니다." -ForegroundColor Green
}

Write-Host ""

# 4. 커밋 확인
$lastCommit = git log -1 --oneline 2>$null
if ($lastCommit) {
    Write-Host "✓ 최근 커밋: $lastCommit" -ForegroundColor Green
} else {
    Write-Host "⚠ 커밋이 없습니다." -ForegroundColor Yellow
    $commit = Read-Host "초기 커밋을 생성하시겠습니까? (y/n)"
    if ($commit -eq "y" -or $commit -eq "Y") {
        git add .
        git commit -m "Initial commit: Seller ERP system"
        Write-Host "✓ 초기 커밋 완료" -ForegroundColor Green
    }
}

Write-Host ""

# 5. 원격 저장소 확인
$remote = git remote -v 2>$null
if ($remote) {
    Write-Host "✓ 원격 저장소가 설정되어 있습니다:" -ForegroundColor Green
    git remote -v
} else {
    Write-Host "⚠ 원격 저장소가 설정되지 않았습니다." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "GitHub에서 저장소를 먼저 생성하세요:" -ForegroundColor Cyan
    Write-Host "1. https://github.com/new 접속" -ForegroundColor White
    Write-Host "2. 저장소 이름 입력 (예: seller-erp)" -ForegroundColor White
    Write-Host "3. Private 또는 Public 선택" -ForegroundColor White
    Write-Host "4. 'Create repository' 클릭" -ForegroundColor White
    Write-Host ""
    $repoUrl = Read-Host "GitHub 저장소 URL을 입력하세요 (예: https://github.com/username/seller-erp.git)"
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Host "✓ 원격 저장소 추가 완료" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "  다음 단계" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. GitHub 저장소 생성 (아직 안 했다면)" -ForegroundColor White
Write-Host "2. 다음 명령어로 푸시:" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Railway 배포 시작:" -ForegroundColor White
Write-Host "   QUICK_DEPLOY.md 파일 참조" -ForegroundColor Yellow
Write-Host ""

