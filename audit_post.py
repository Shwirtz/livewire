"""
LiveWire Post Audit Script
Run before committing any new post to catch issues before they reach review.

Usage:
  python audit_post.py they-get-it-too/barbara-corcoran
  python audit_post.py --all
"""
import sys, os, re

CONTENT_DIR = r"C:\Jacob\SparkMode\LiveWire\livewire-site\src\content"
OG_DIR      = r"C:\Jacob\SparkMode\LiveWire\livewire-site\public\og"

PASS = "[PASS]"
FAIL = "[FAIL]"
WARN = "[WARN]"

def audit(slug_path):
    parts = slug_path.strip("/").split("/")
    if len(parts) == 2:
        pillar, slug = parts
    else:
        print(f"Invalid path: {slug_path}. Use pillar/slug format.")
        return False

    md_path = os.path.join(CONTENT_DIR, pillar, f"{slug}.md")
    if not os.path.exists(md_path):
        print(f"{FAIL} File not found: {md_path}")
        return False

    with open(md_path, "r", encoding="utf-8") as f:
        raw = f.read()

    # Split frontmatter and body
    parts = raw.split("---", 2)
    if len(parts) < 3:
        print(f"{FAIL} Could not parse frontmatter")
        return False
    frontmatter = parts[1]
    body = parts[2]

    results = []
    passed = 0
    failed = 0
    warned = 0

    def check(status, message):
        nonlocal passed, failed, warned
        results.append(f"  {status} {message}")
        if status == PASS: passed += 1
        elif status == FAIL: failed += 1
        else: warned += 1

    # ── FRONTMATTER CHECKS ────────────────────────────────────────────────────

    def fm(key): return key in frontmatter

    check(PASS if fm("title:") else FAIL, "title present")
    check(PASS if fm("updatedDate:") else FAIL, "updatedDate present")
    check(PASS if fm("publishedDate:") else FAIL, "publishedDate present")
    check(PASS if fm("pillar:") else FAIL, "pillar present")
    check(PASS if fm("description:") else FAIL, "description present")
    check(PASS if fm("tryThisTonightPrompt:") else FAIL, "tryThisTonightPrompt present")
    check(PASS if fm("keywords:") else FAIL, "keywords present")
    check(PASS if fm("mentions:") else FAIL, "mentions present (Wikidata entity linking)")
    check(PASS if fm("sources:") else FAIL, "sources present")
    check(PASS if fm("wikidata:") else WARN, "wikidata Q-number in mentions")

    # pageTitle length check
    pt_match = re.search(r'pageTitle:\s*"([^"]+)"', frontmatter)
    if pt_match:
        pt = pt_match.group(1)
        if len(pt) > 60:
            check(WARN, f"pageTitle is {len(pt)} chars (ideal <60): '{pt}'")
        else:
            check(PASS, f"pageTitle length OK ({len(pt)} chars)")

    # description length
    desc_match = re.search(r'description:\s*"([^"]+)"', frontmatter)
    if desc_match:
        desc = desc_match.group(1)
        if len(desc) < 100 or len(desc) > 160:
            check(WARN, f"description is {len(desc)} chars (ideal 100-160)")
        else:
            check(PASS, f"description length OK ({len(desc)} chars)")

    # ── BODY CHECKS ───────────────────────────────────────────────────────────

    # No em-dashes — strip URLs first to avoid false positives
    body_no_urls = re.sub(r'https?://\S+', '', body)
    body_no_urls = re.sub(r'cite="[^"]+"', '', body_no_urls)
    emdash_count = body_no_urls.count("\u2014") + body_no_urls.count(" \u2013 ")
    if emdash_count > 0:
        check(FAIL, f"em-dashes found ({emdash_count} instances) — replace with commas or periods")
    else:
        check(PASS, "no em-dashes")

    # H2 count
    h2s = re.findall(r'^## .+', body, re.MULTILINE)
    if len(h2s) < 2:
        check(FAIL, f"only {len(h2s)} H2 heading(s) — minimum 2 required")
    elif len(h2s) == 2:
        check(WARN, f"2 H2 headings — consider a 3rd for the closing section")
    else:
        check(PASS, f"{len(h2s)} H2 headings")

    # LLM anchor sentence (direct factual statement near top)
    first_500 = body[:500]
    has_anchor = bool(re.search(r'\b(has|have|was|were|is|are)\b.{10,60}\b(dyslexia|ADHD|learning|diagnosis)\b', first_500, re.IGNORECASE))
    check(PASS if has_anchor else WARN, "LLM anchor sentence (direct factual statement) near top")

    # blockquote with cite
    blockquotes = re.findall(r'<blockquote', body)
    cites = re.findall(r'<footer><cite>', body)
    if blockquotes and len(cites) < len(blockquotes):
        check(FAIL, f"{len(blockquotes)} blockquote(s) but only {len(cites)} <footer><cite> attribution(s)")
    elif blockquotes:
        check(PASS, f"{len(blockquotes)} blockquote(s) with proper <cite> attribution")
    else:
        check(WARN, "no blockquotes — consider adding a direct quote")

    # figure/figcaption embeds (not div/p)
    div_embeds = re.findall(r'<div class="embed-block">', body)
    if div_embeds:
        check(FAIL, f"{len(div_embeds)} old-style div embed(s) found — use <figure><figcaption>")
    fig_embeds = re.findall(r'<figure class="embed-block">', body)
    if fig_embeds:
        check(PASS, f"{len(fig_embeds)} embed(s) using correct <figure><figcaption>")

    # youtube-nocookie
    yt_embeds = re.findall(r'youtube\.com/embed', body)
    nocookie = re.findall(r'youtube-nocookie\.com/embed', body)
    if yt_embeds:
        check(FAIL, f"{len(yt_embeds)} youtube.com embed(s) — use youtube-nocookie.com")
    if nocookie:
        check(PASS, f"{len(nocookie)} youtube-nocookie embed(s)")

    # Internal links
    internal_links = re.findall(r'\[.+?\]\(/[^h].+?\)', body)
    if len(internal_links) < 1:
        check(FAIL, "no internal links — add 2-3 contextual links to other posts or pillar pages")
    elif len(internal_links) < 2:
        check(WARN, f"only {len(internal_links)} internal link — add 1-2 more")
    else:
        check(PASS, f"{len(internal_links)} internal link(s)")

    # ADHD/learning differences mention
    adhd_mention = bool(re.search(r'\b(ADHD|attention|learning differences|learning differently)\b', body, re.IGNORECASE))
    check(PASS if adhd_mention else WARN, "ADHD or learning differences mentioned (expands GEO reach)")

    # Word count
    words = len(re.findall(r'\b\w+\b', body))
    if words < 500:
        check(FAIL, f"word count is {words} — minimum 500 for SEO viability")
    elif words < 700:
        check(WARN, f"word count is {words} — 700+ preferred for topical authority")
    else:
        check(PASS, f"word count: {words} words")

    # Forbidden words — strip URLs and HTML attributes first
    body_clean = re.sub(r'https?://\S+', '', body)
    body_clean = re.sub(r'(cite|href|src|title)="[^"]+"', '', body_clean)
    forbidden = ["delve", "unlock", "leverage", "streamline", "empower", "pivotal",
                 "vibrant", "transformative", "groundbreaking", "robust", "seamless",
                 "meticulous", "unprecedented", "tapestry", "journey", "testament",
                 "game-changer", "ecosystem", "paradigm", "synergy", "elevate"]
    found_forbidden = [w for w in forbidden if re.search(r'\b' + w + r'\b', body_clean, re.IGNORECASE)]
    if found_forbidden:
        check(FAIL, f"forbidden words found: {', '.join(found_forbidden)}")
    else:
        check(PASS, "no forbidden words")

    # No clinical labels in copy (rough check)
    clinical = re.findall(r'\b(IEP|learning disability|sensory processing disorder)\b', body)
    if clinical:
        check(FAIL, f"clinical language found: {', '.join(clinical)} — describe behaviors instead")
    else:
        check(PASS, "no banned clinical labels")

    # ── FILE CHECKS ───────────────────────────────────────────────────────────

    # OG image exists
    og_path = os.path.join(OG_DIR, f"{slug}.png")
    check(PASS if os.path.exists(og_path) else FAIL, f"OG image exists at public/og/{slug}.png")

    # ── SUMMARY ───────────────────────────────────────────────────────────────

    print(f"\nAudit: {pillar}/{slug}")
    print("=" * 50)
    for r in results:
        print(r)
    print("=" * 50)
    print(f"  {passed} passed  |  {warned} warnings  |  {failed} failed")
    if failed > 0:
        print(f"\n  DO NOT COMMIT — fix {failed} failure(s) first.")
    elif warned > 0:
        print(f"\n  OK to commit — review {warned} warning(s) if time allows.")
    else:
        print(f"\n  All checks passed. Good to commit.")
    print()
    return failed == 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python audit_post.py pillar/slug")
        print("       python audit_post.py --all")
        sys.exit(1)

    if sys.argv[1] == "--all":
        all_pass = True
        for pillar in os.listdir(CONTENT_DIR):
            pd = os.path.join(CONTENT_DIR, pillar)
            if not os.path.isdir(pd): continue
            for fn in os.listdir(pd):
                if fn.endswith(".md"):
                    slug = fn[:-3]
                    ok = audit(f"{pillar}/{slug}")
                    if not ok: all_pass = False
        sys.exit(0 if all_pass else 1)
    else:
        ok = audit(sys.argv[1])
        sys.exit(0 if ok else 1)
