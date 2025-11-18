#!/bin/bash
# 자동 커밋 및 배포 스크립트 (Linux/Mac)
# 파일 변경을 감지하고 자동으로 커밋 및 푸시합니다

MESSAGE="${1:-Auto commit: Update files}"
SKIP_PUSH="${2:-false}"
WATCH_INTERVAL="${3:-30}"

echo "🚀 자동 커밋 및 배포 스크립트 시작"
echo "📁 작업 디렉토리: $(pwd)"

# Git 상태 확인
if [ ! -d .git ]; then
    echo "❌ Git 저장소가 아닙니다."
    exit 1
fi

# 변경된 파일 확인
get_changed_files() {
    git status --porcelain | awk '{print $2}'
}

# 자동 커밋 실행
auto_commit() {
    local changed_files=$(get_changed_files)
    
    if [ -z "$changed_files" ]; then
        echo "✅ 변경된 파일이 없습니다."
        return 1
    fi
    
    echo "📝 변경된 파일:"
    echo "$changed_files" | while read file; do
        echo "   - $file"
    done
    
    # 파일 추가
    echo "📦 파일 추가 중..."
    git add -A
    
    # 커밋 메시지 생성
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    local commit_message="$MESSAGE ($timestamp)"
    
    # 커밋
    echo "💾 커밋 중..."
    git commit -m "$commit_message"
    
    if [ $? -ne 0 ]; then
        echo "⚠️  커밋 실패 (변경사항이 없거나 이미 커밋됨)"
        return 1
    fi
    
    echo "✅ 커밋 완료: $commit_message"
    
    # 푸시
    if [ "$SKIP_PUSH" != "true" ]; then
        echo "🚀 GitHub에 푸시 중..."
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo "✅ 푸시 완료! Vercel에서 자동 배포가 시작됩니다."
            echo "🌐 배포 상태: https://vercel.com/dashboard"
        else
            echo "❌ 푸시 실패"
            return 1
        fi
    else
        echo "⏭️  푸시 건너뜀"
    fi
    
    return 0
}

# 파일 감시 모드
watch_mode() {
    echo "👀 파일 감시 모드 시작 (간격: ${WATCH_INTERVAL}초)"
    echo "⏹️  중지하려면 Ctrl+C를 누르세요"
    echo ""
    
    local last_commit_time=$(date +%s)
    
    while true; do
        sleep $WATCH_INTERVAL
        
        local changed_files=$(get_changed_files)
        
        if [ -n "$changed_files" ]; then
            local current_time=$(date +%s)
            local time_since_last_commit=$((current_time - last_commit_time))
            
            # 최소 1분 간격으로 커밋
            if [ $time_since_last_commit -ge 60 ]; then
                echo "🔄 변경사항 감지됨 - 자동 커밋 시작..."
                
                if auto_commit; then
                    last_commit_time=$(date +%s)
                fi
                
                echo ""
            else
                local remaining=$((60 - time_since_last_commit))
                echo "⏳ 최소 간격 대기 중... (${remaining}초 남음)"
            fi
        fi
    done
}

# 메인 실행
if [ "$1" = "watch" ]; then
    watch_mode
else
    echo "🔄 단일 실행 모드"
    auto_commit
fi

