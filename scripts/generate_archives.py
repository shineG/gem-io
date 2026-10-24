
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "content" / "posts"
ARCHIVES_DIR = ROOT / "content" / "archives"

# 从文章 Front Matter 中提取 date 对应的年月
months = set()

for file in POSTS_DIR.rglob("*.md"):
    content = file.read_text(encoding="utf-8")

    # 只读取 Front Matter
    match = re.match(
        r"\A(?:---|\+\+\+)\s*\n(.*?)\n(?:---|\+\+\+)\s*\n",
        content,
        re.DOTALL,
    )
    if not match:
        continue

    date_match = re.search(
        r"^date:\s*[\"']?(\d{4}-\d{2})-\d{2}",
        match.group(1),
        re.MULTILINE,
    )
    if date_match:
        months.add(date_match.group(1))

created = 0

for month in sorted(months):
    archive_file = ARCHIVES_DIR / month / "_index.md"

    # 已有归档页不覆盖，保留原有设置
    if archive_file.exists():
        continue

    archive_file.parent.mkdir(parents=True, exist_ok=True)
    archive_file.write_text(
        f'---\ntitle: "{month}"\n'
        f'date: {month}-01T00:00:00+08:00\n'
        f'layout: single\n'
        f'_build:\n  render: always\n'
        f'---\n',
        encoding="utf-8",
    )

    print(f"Created: {archive_file.relative_to(ROOT)}")
    created += 1

print(f"Archive generation complete. Created {created} page(s).")
