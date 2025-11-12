#!/bin/zsh

# 기준 디렉토리 (현재 디렉토리)
base_dir="."

# 하위 폴더까지 탐색하며 이름에 '복사본'이 포함된 파일을 찾음
find "$base_dir" -type f -name "*복사본*" | while read -r file; do
  # 새로운 파일명 생성
  new_file=$(echo "$file" | sed 's/복사본/copy/g')

  # 파일 이름 변경
  mv "$file" "$new_file"

  echo "✅ renamed:"
  echo "  $file"
  echo "  → $new_file"
done

echo "----"
echo "완료되었습니다."