"""
publish_scheduler.py
Checks all content files for scheduledDate.
If scheduledDate <= today and draft: true, flips to draft: false.
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

        # Only process files with draft: true
        if 'draft: true' not in content:
            continue

        # Check for scheduledDate
        sd_match = re.search(r'scheduledDate:\s*(\d{4}-\d{2}-\d{2})', content)
        if not sd_match:
            continue

        scheduled = date.fromisoformat(sd_match.group(1))
        if scheduled > today:
            print(f'  Pending: {pillar}/{fn[:-3]} scheduled for {scheduled}')
            continue

        # Flip draft: true -> draft: false and set publishedDate if missing
        updated = content.replace('draft: true', 'draft: false')
        if 'publishedDate:' not in updated:
            updated = updated.replace(
                f'scheduledDate: {sd_match.group(1)}',
                f'publishedDate: {scheduled}\nscheduledDate: {sd_match.group(1)}'
            )

        with open(fp, 'w', encoding='utf-8') as f:
            f.write(updated)

        published.append(f'{pillar}/{fn[:-3]}')
        print(f'  PUBLISHED: {pillar}/{fn[:-3]} (scheduled {scheduled})')

if published:
    print(f'\n{len(published)} post(s) published: {", ".join(published)}')
else:
    print('No posts due for publishing today.')
