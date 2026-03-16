# LiveWire Post Guide — Single Source of Truth

## Site
- URL: https://livewire.sparkmode.com
- Repo: https://github.com/Shwirtz/livewire.git
- Local: C:\Jacob\SparkMode\LiveWire\livewire-site\
- Deploy: Vercel, auto-deploys on push to main

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
keywords:                  # 6-10 terms — go into Article JSON-LD schema
  - keyword one
  - keyword two
mentions:                  # One entry per named person in the article
  - name: Full Name
    wikidata: Q######      # Find at wikidata.org/wiki/Special:Search
sources:                   # Renders below share bar, above nav
  - label: "Source Name, Publication"
    url: "https://..."
```

---

## Markdown Conventions

### Blockquotes
Always use full semantic structure with cite:
```html
<blockquote cite="https://source-url.com">
<p>"The exact quote here."</p>
<footer><cite>Person Name, Publication Name</cite></footer>
</blockquote>
```

### Video Embeds
Always use figure/figcaption, never div/p:
```html
<figure class="embed-block">
<iframe width="100%" height="315"
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID?rel=0"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  title="Descriptive title for accessibility">
</iframe>
<figcaption>Caption text here. For YouTube, include timestamp cue if relevant.</figcaption>
</figure>
```

For timestamped starts: `?start=SECONDS&rel=0`

---

## Writing Requirements per Post

1. **Minimum 2 H2 subheadings** — structural section breaks, not just decorative
2. **One direct-answer anchor sentence near the top** — explicit enough for LLM extraction (e.g. "Henry Winkler has dyslexia, which he didn't discover until age 31...")
3. **No em-dashes anywhere** — use commas, periods, or parentheses
4. **No clinical diagnostic language** — never ADHD, dyslexia, IEP, learning disability in copy; describe behaviors instead. Exception: They Get It Too pillar can reference conditions the subject disclosed publicly, in their own words
5. **ADHD/learning differences overlap** — mention naturally if the subject's story connects to attention patterns; expands GEO reach without forcing it
6. **Named source citations in frontmatter** — not inline in markdown body
7. **Entity depth** — include at least one sentence connecting the subject to their most well-known work

---

## SEO/GEO — All Automated by Template

These fire automatically on every post — no action needed:
- `robots` meta with `max-snippet:-1, max-image-preview:large, max-video-preview:-1`
- `og:type: article`, `og:image`, `og:image:width/height`
- `twitter:card`, `twitter:site`, `twitter:creator`, `twitter:image:alt`
- `article:published_time`, `article:modified_time`, `article:section`, `article:tag`
- Article JSON-LD schema with `keywords`, `mentions`, `datePublished`, `dateModified`
- `mentions` Person entity with Wikidata `sameAs` (from frontmatter)
- BreadcrumbList JSON-LD
- Canonical tag
- Sitemap link and RSS link in `<head>`
- RSS feed auto-includes all non-draft posts

---

## Share Text by Platform

- **X / Threads:** `"[title] from @GoSparkMode [url]"` — handle is tappable
- **Facebook:** URL only — FB generates preview from OG tags
- **WhatsApp:** `"[title] [url]"` — no handle, URL is the tap target

---

## Pillars

| Pillar | Slug | Color |
|--------|------|-------|
| The 11pm Search | 11pm-search | #7B2FFF |
| They Get It Too | they-get-it-too | #00D2FF |
| No Commission | no-commission | #F5A623 |
| Set the Room | set-the-room | #00A896 |
| Add These | add-these | #4F3FFF |

---

## Outstanding (as of 2026-03-16)

- [ ] Per-article OG image generator (Python/PIL) — highest priority, tackling separately
- [ ] Mobile share bar at 375px — needs visual check
- [ ] Submit sitemap to Google Search Console — one manual action
- [ ] `loading="eager" fetchpriority="high"` on LCP image — wire into template when OG images are live
- [ ] `pageTitle` for stub posts — low stakes until posts are real
