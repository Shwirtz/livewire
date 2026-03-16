import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

const PILLARS = ['11pm-search', 'they-get-it-too', 'no-commission', 'set-the-room', 'add-these'] as const;
const SITE = 'https://livewire.sparkmode.com';

export async function GET(_ctx: APIContext) {
  const allPosts = (
    await Promise.all(PILLARS.map(p => getCollection(p as any)))
  ).flat().filter((p: any) => !p.data.draft);

  const staticPages = [
    { url: SITE, priority: '1.0', changefreq: 'weekly' },
    { url: `${SITE}/11pm-search`, priority: '0.8', changefreq: 'weekly' },
    { url: `${SITE}/they-get-it-too`, priority: '0.8', changefreq: 'weekly' },
    { url: `${SITE}/no-commission`, priority: '0.8', changefreq: 'weekly' },
    { url: `${SITE}/set-the-room`, priority: '0.8', changefreq: 'weekly' },
    { url: `${SITE}/add-these`, priority: '0.8', changefreq: 'weekly' },
    { url: `${SITE}/about`, priority: '0.5', changefreq: 'monthly' },
  ];

  const postPages = allPosts.map((post: any) => ({
    url: `${SITE}/${post.collection}/${post.slug}/`,
    lastmod: post.data.updatedDate.toISOString().split('T')[0],
    priority: '0.7',
    changefreq: 'monthly',
  }));

  const allPages = [...staticPages, ...postPages];

  const toEntry = (p: any) => {
    const lastmod = 'lastmod' in p ? `\n    <lastmod>${p.lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${p.url}</loc>${lastmod}\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`;
  };

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(toEntry).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
