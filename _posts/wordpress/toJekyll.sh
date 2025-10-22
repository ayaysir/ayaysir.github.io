find . -type f -name "index.md" | while read file; do
  folder=$(dirname "$file")
  name=$(basename "$folder")
  mv "$file" "./${name}.md"
done

# 빈 폴더 정리
find . -type d -empty -delete