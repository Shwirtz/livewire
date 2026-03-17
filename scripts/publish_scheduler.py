"""
publish_scheduler.py
Checks all content files for scheduledDate.
If scheduledDate <= today and draft: true, flips to draft: false.
Only operates on frontmatter — never touches post body.
Run by GitHub Actions daily. Also safe to run locally.
"""
import os, re
from datetime import date

CONTENT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content')
today = date.today()
published = []

for pillar in os.listdir(CONTENT_DIR):
    pillar_path = os.path.join(CONTENT_DIR, pillar)
    if not os.path.isdir(pillar_path):
        continue
    for fn in os.listdir(pillar_path):
        if not fn.endswith('.md'):
            continue
        fp = os.path.join(pillar_path, fn)
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()

        # Parse frontmatter only — split on --- delimiters
        parts = content.split('---', 2)
        if len(parts) < 3:
            continue
        frontmatter = parts[1]
        body = parts[2]

        # Only process files with draft: true in frontmatter
        if 'draft: true' not in frontmatter:
            continue

        # Check for scheduledDate in frontmatter
        sd_match = re.search(r'scheduledDate:\s*(\d{4}-\d{2}-\d{2})', frontmatter)
        if not sd_match:
            continue

        scheduled = date.fromisoformat(sd_match.group(1))
        if scheduled > today:
            print(f'  Pending: {pillar}/{fn[:-3]} scheduled for {scheduled}')
            continue

        # Flip draft: true -> draft: false in frontmatter only
        new_frontmatter = frontmatter.replace('draft: true', 'draft: false')

        # Set publishedDate if missing
        if 'publishedDate:' not in new_frontmatter:
            new_frontmatter = new_frontmatter.replace(
                f'scheduledDate: {sd_match.group(1)}',
                f'publishedDate: {scheduled}\nscheduledDate: {sd_match.group(1)}'
            )

        # Update updatedDate to match scheduledDate (not today, which could be before publishedDate)
        new_frontmatter = re.sub(
            r'updatedDate:\s*\d{4}-\d{2}-\d{2}',
            f'updatedDate: {scheduled}',
            new_frontmatter
        )

        updated = f'---{new_frontmatter}---{body}'

        with open(fp, 'w', encoding='utf-8') as f:
            f.write(updated)

        published.append(f'{pillar}/{fn[:-3]}')
        print(f'  PUBLISHED: {pillar}/{fn[:-3]} (scheduled {scheduled})')

if published:
    print(f'\n{len(published)} post(s) published: {", ".join(published)}')
else:
    print('No posts due for publishing today.')
