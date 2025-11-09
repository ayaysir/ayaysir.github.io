#!/bin/bash
# 모든 하위 폴더를 포함해 파일명을 재귀적으로 탐색 및 변경
# "스크린샷" → "screenshot", "오후" → "pm", "오전" → "am"

find . -type f | while read -r file; do
  dir=$(dirname "$file")
  base=$(basename "$file")

  # 새 파일명으로 변환
  newbase=$(echo "$base" | sed \
    -e 's/스크린샷/screenshot/g' \
    -e 's/오후/pm/g' \
    -e 's/오전/am/g')

  # 파일명이 변경될 필요가 있는 경우만 실행
  if [[ "$base" != "$newbase" ]]; then
    echo "Renaming: $base → $newbase"
    mv "$dir/$base" "$dir/$newbase"
  fi
done

echo "✅ 파일명 변경 완료."