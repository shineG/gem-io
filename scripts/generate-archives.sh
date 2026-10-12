
#!/bin/bash
set -euo pipefail

# 定位 Hugo 项目根目录
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONTENT="$ROOT/content"
ARCHIVES="$CONTENT/archives"

mkdir -p "$ARCHIVES"

# 扫描 posts 下的 Markdown 文章，提取日期对应的月份
find "$CONTENT/posts" -type f -name '*.md' -print0 |
while IFS= read -r -d '' file; do

  month="$(grep -m 1 -E '^[[:space:]]*date:[[:space:]]*' "$file" |
    sed -E 's/^[[:space:]]*date:[[:space:]]*["'\'']?([0-9]{4}-[0-9]{2}).*/\1/')"

  # 只处理 YYYY-MM 格式的月份
  if [[ "$month" =~ ^[0-9]{4}-[0-9]{2}$ ]]; then

    dir="$ARCHIVES/$month"
    mkdir -p "$dir"

    # 已有页面不覆盖
    if [[ ! -f "$dir/_index.md" ]]; then
      cat > "$dir/_index.md" <<EOF
---
title: "$month"
layout: single
_build:
  render: always
---
EOF

      echo "Created: content/archives/$month/_index.md"
    fi
  fi
done

echo "月份归档页面检查完成。"
