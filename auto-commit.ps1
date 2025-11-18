# 자동 커밋 및 배포 스크립트
# 파일 변경을 감지하고 자동으로 커밋 및 푸시합니다

param(
    [string]$Message = "Auto commit: Update files",
    [switch]$SkipPush = $false,
    [int]$WatchInterval = 30  # 초 단위
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 자동 커밋 및 배포 스크립트 시작" -ForegroundColor Green
Write-Host "📁 작업 디렉토리: $(Get-Location)" -ForegroundColor Cyan

# Git 상태 확인
function Test-GitRepository {
    if (-not (Test-Path .git)) {
        Write-Host "❌ Git 저장소가 아닙니다." -ForegroundColor Red
        exit 1
    }
}

# 변경된 파일 확인
function Get-ChangedFiles {
    $status = git status --porcelain
    if ($status) {
        $files = $status | ForEach-Object { ($_ -split '\s+')[1] }
        return $files
    }
    return @()
}

# 자동 커밋 실행
function Invoke-AutoCommit {
    $changedFiles = Get-ChangedFiles
    
    if ($changedFiles.Count -eq 0) {
        Write-Host "✅ 변경된 파일이 없습니다." -ForegroundColor Yellow
        return $false
    }
    
    Write-Host "📝 변경된 파일:" -ForegroundColor Cyan
    $changedFiles | ForEach-Object { Write-Host "   - $_" -ForegroundColor Gray }
    
    # 파일 추가
    Write-Host "📦 파일 추가 중..." -ForegroundColor Cyan
    git add -A
    
    # 커밋 메시지 생성
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $commitMessage = "$Message ($timestamp)"
    
    # 커밋
    Write-Host "💾 커밋 중..." -ForegroundColor Cyan
    git commit -m $commitMessage
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  커밋 실패 (변경사항이 없거나 이미 커밋됨)" -ForegroundColor Yellow
        return $false
    }
    
    Write-Host "✅ 커밋 완료: $commitMessage" -ForegroundColor Green
    
    # 푸시
    if (-not $SkipPush) {
        Write-Host "🚀 GitHub에 푸시 중..." -ForegroundColor Cyan
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ 푸시 완료! Vercel에서 자동 배포가 시작됩니다." -ForegroundColor Green
            Write-Host "🌐 배포 상태: https://vercel.com/dashboard" -ForegroundColor Cyan
        } else {
            Write-Host "❌ 푸시 실패" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "⏭️  푸시 건너뜀 (--SkipPush 옵션)" -ForegroundColor Yellow
    }
    
    return $true
}

# 파일 감시 모드
function Start-FileWatcher {
    Write-Host "👀 파일 감시 모드 시작 (간격: ${WatchInterval}초)" -ForegroundColor Green
    Write-Host "⏹️  중지하려면 Ctrl+C를 누르세요" -ForegroundColor Yellow
    Write-Host ""
    
    $lastCommitTime = Get-Date
    
    while ($true) {
        Start-Sleep -Seconds $WatchInterval
        
        $changedFiles = Get-ChangedFiles
        
        if ($changedFiles.Count -gt 0) {
            $timeSinceLastCommit = (Get-Date) - $lastCommitTime
            
            # 최소 1분 간격으로 커밋 (너무 자주 커밋하는 것 방지)
            if ($timeSinceLastCommit.TotalSeconds -ge 60) {
                Write-Host "🔄 변경사항 감지됨 - 자동 커밋 시작..." -ForegroundColor Cyan
                
                if (Invoke-AutoCommit) {
                    $lastCommitTime = Get-Date
                }
                
                Write-Host ""
            } else {
                Write-Host "⏳ 최소 간격 대기 중... ($([math]::Round(60 - $timeSinceLastCommit.TotalSeconds))초 남음)" -ForegroundColor Yellow
            }
        }
    }
}

# 메인 실행
Test-GitRepository

# 단일 실행 모드
if ($args.Count -eq 0 -or $args[0] -ne "watch") {
    Write-Host "🔄 단일 실행 모드" -ForegroundColor Cyan
    Invoke-AutoCommit
} else {
    # 감시 모드
    Start-FileWatcher
}

