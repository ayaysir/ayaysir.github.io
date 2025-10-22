#!/bin/bash

# 사용법: ./remove_resized_images.sh [대상폴더경로]
# 예시: ./remove_resized_images.sh ./assets/images

TARGET_DIR="${1:-.}" # 인자가 없으면 현재 디렉터리(.)
TRASH_DIR="$HOME/.Trash"

echo "🔍 Searching under: $TARGET_DIR"
echo "🗑️  Files matching '*[0-9]x[0-9]*.*' pattern will be moved to Trash"
echo

find "$TARGET_DIR" -type f | while read -r file; do
  # 파일명에서 확장자 제거
  basename_noext=$(basename "$file" | sed 's/\.[^.]*$//')

  # "숫자x숫자"로 끝나는지 검사
  if [[ $basename_noext =~ [0-9]+x[0-9]+$ ]]; then
    echo "→ Moving to Trash: $file"
    mv "$file" "$TRASH_DIR/"
  fi
done

echo
echo "✅ Done. All matched files moved to Trash."