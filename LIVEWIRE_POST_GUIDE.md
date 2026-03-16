# LiveWire Post Guide — Single Source of Truth
# Last updated: 2026-03-16

---

## Complete New Post Workflow (in order)

1. **Switch to drafts branch:** `git checkout drafts`
2. Write the markdown file in `src/content/[pillar]/[slug].md`
   - `draft: true` is the default — leave it
   - Set `scheduledDate: YYYY-MM-DD` for when it should go live
3. Add entry to `POSTS` in `og_image_gen.py`, run generator
4. Run `python C:\Jacob\SparkMode\LiveWire\audit_post.py [pillar]/[slug]` — fix all FAILs
5. Commit and push to `drafts`: `git add . && git commit -m "draft: [slug]" && git push`
6. **Review on Vercel preview URL** (password protected — see Vercel dashboard)
7. Once approved, merge to `main`: `git checkout main && git merge drafts && git push`
8. GitHub Action publishes automatically on `scheduledDate` at 8am UTC
9. For immediate publish: set `draft: false` manually before merging

## Scheduling Frontmatter

```yaml
draft: true                # always start as draft
scheduledDate: 2026-04-01  # GitHub Action publishes this automatically
publishedDate: 2026-04-01  # set same as scheduledDate — never change after
```

## Preview URL (bookmark this)

**`https://livewire-git-drafts-spark-mode.vercel.app`**

- Always shows the latest `drafts` branch build
- Requires Vercel login (protected)
- Shows all draft posts with amber DRAFT banner + scheduled date
- GA4 analytics suppressed — preview visits don't pollute data
- Scheduled dates shown under each post headline

## Known Rules and Conflicts

- **Never add internal links to draft posts** — the link will 404 on the live site. Only link to posts with `draft: false`.
- **Sitemap** — draft posts are excluded automatically (build filter removes them)
- **RSS feed** — draft posts excluded via `!p.data.draft` filter in feed.xml.ts
- **GA4** — fires only on `livewire.sparkmode.com`, suppressed on all preview/staging URLs

## Audit Script

Script: `C:\Jacob\SparkMode\LiveWire\audit_post.py`

Checks automatically:
- All required frontmatter fields present
- No em-dashes in copy
- Minimum 2 H2 headings (3 recommended)
- LLM anchor sentence near top
- Blockquotes have `<footer><cite>` attribution
- Embeds use `<figure><figcaption>` not `<div><p>`
- YouTube uses youtube-nocookie.com
- Minimum 2 internal links
- ADHD/learning differences mentioned
- Word count 500+ (700+ preferred)
- No forbidden words
- No banned clinical labels
- OG image file exists

Run on all posts: `python C:\Jacob\SparkMode\LiveWire\audit_post.py --all`

---

## Frontmatter — Required for Every Post

```yaml
title: ""                  # Full headline — used as H1 on page
pageTitle: ""              # Shorter SERP title, ~55 chars max, always end with "— LiveWire"
updatedDate: YYYY-MM-DD    # Last modified — update freely on edits
publishedDate: YYYY-MM-DD  # Set ONCE on launch day. Never change again.
pillar: they-get-it-too    # One of: 11pm-search, they-get-it-too, no-commission, set-the-room, add-these
description: ""            # Meta description, ~150 chars, written for parent search intent
tryThisTonightPrompt: ""   # Specific, actionable, first-person, no em-dashes
author: SparkMode Team
draft: false
keywords:                  # 6-10 terms — populate Article JSON-LD schema
  - keyword one
  - keyword two
mentions:                  # One entry per named person
  - name: Full Name
    wikidata: Q######      # Find at wikidata.org/wiki/Special:Search
sources:                   # Renders below share bar, above nav
  - label: "Source Name, Publication"
    url: "https://..."
```

---

## Markdown Conventions

### Blockquotes — always full semantic structure
```html
<blockquote cite="https://source-url.com">
<p>"The exact quote here."</p>
<footer><cite>Person Name, Publication Name</cite></footer>
</blockquote>
```

### Video Embeds — always figure/figcaption
```html
<figure class="embed-block">
<iframe width="100%" height="315"
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID?rel=0"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  title="Descriptive title for accessibility">
</iframe>
<figcaption>Caption. Include timestamp cue if relevant.</figcaption>
</figure>
```
For timestamped starts: `?start=SECONDS&rel=0`

---

## Writing Requirements

1. Min 2 H2 subheadings — structural section breaks
2. One direct-answer LLM anchor sentence near the top (e.g. "Henry Winkler has dyslexia, which he didn't discover until age 31...")
3. No em-dashes anywhere — use commas, periods, or parentheses
4. No clinical diagnostic language in copy — describe behaviors, not conditions. Exception: They Get It Too can reference conditions the subject disclosed publicly in their own words
5. Natural mention of ADHD/learning differences overlap where relevant — expands GEO reach
6. Named source citations in frontmatter sources array — not inline in markdown body
7. Entity depth sentence — connect subject to their most well-known work

---

## OG Image Generator

Script: `C:\Jacob\SparkMode\LiveWire\og_image_gen.py`
Output: `livewire-site/public/og/[slug].png`

### Design spec (locked)
- 1200x630px, RGB mode throughout (no RGBA — alpha silently fails on RGB PIL images)
- Background: #0D0D14 + subtle hex line grid (lines only, no fill, adds max 18 brightness units)
- Radial orbs: accent color bottom-right (s=0.06), indigo top-left (s=0.04)
- Top bar: 6px gradient indigo→electric. Bottom bar: 6px gradient spark→dark amber
- Top-left: LIVEWIRE wordmark PNG at 32px height + "by SparkMode" in Outfit Bold 17pt muted below
- Headline: BigShoulders Bold, auto-sized (62pt <55 chars, 54pt <75 chars, 46pt longer), white, left accent bar in accent color
- Bottom-left: livewire.sparkmode.com in Outfit Bold 20pt muted
- No pill, no category label

### Adding a new post to the generator
```python
# In POSTS list at bottom of og_image_gen.py:
{"slug": "rick-riordan", "pillar": "they-get-it-too",
 "title": "Rick Riordan wrote Percy Jackson because his son couldn't find himself in books."},
```

### Critical PIL note
Never use alpha tuples (e.g. `fill=(0,45,65,30)`) on an RGB image — they silently fail.
Use solid RGB colors only: `fill=(0,45,65)`.

---

## SEO/GEO — Automatic via Template

Every post gets these automatically — no action needed:
- `robots` meta: `index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`
- `og:type: article`, `og:image` pointing to `/og/[slug].png`, `og:image:width/height`
- `twitter:card`, `twitter:site @GoSparkMode`, `twitter:creator @GoSparkMode`, `twitter:image:alt`
- `article:published_time` (from publishedDate), `article:modified_time` (from updatedDate)
- Article JSON-LD: `keywords`, `mentions` with Wikidata `sameAs`, `datePublished`, `dateModified`
- BreadcrumbList JSON-LD, canonical tag, sitemap link, RSS link
- RSS feed auto-includes all non-draft posts across all pillars

---

## Share Text by Platform

- **X / Threads:** `"[title] from @GoSparkMode [url]"` — handle is tappable
- **Facebook:** URL only — FB generates preview from OG tags
- **WhatsApp:** `"[title] [url]"` — no handle, URL is the tap target

---

## Pillars

| Pillar | Slug | Accent Color |
|--------|------|-------------|
| The 11pm Search | 11pm-search | #7B2FFF |
| They Get It Too | they-get-it-too | #00D2FF |
| No Commission | no-commission | #F5A623 |
| Set the Room | set-the-room | #00A896 |
| Add These | add-these | #4F3FFF |

---

## They Get It Too — Post Calendar

| # | Person | Status |
|---|--------|--------|
| 1 | Henry Winkler | LIVE |
| 2 | Rick Riordan | Next |
| 3 | Simone Biles | |
| 4 | will.i.am | |
| 5 | Barbara Corcoran | |
| 6 | Channing Tatum | |
| 7 | Michael Phelps | |
| 8 | Connor DeWolfe | |

Research bank: https://docs.google.com/spreadsheets/d/1ESNHyLRn-NVS-TrYSR_-yG5jIIFCoQkZr7KM7vpshHk
YouTube transcript scanner: C:\Jacob\SparkMode\yt_transcript.py

---

## Outstanding

- [ ] Mobile share bar check at 375px viewport
- [ ] Google Search Console — submit sitemap on launch day
- [ ] `loading="eager" fetchpriority="high"` on LCP image — wire into template when hero images added
