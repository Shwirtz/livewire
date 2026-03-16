import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

const PILLARS = ['11pm-search', 'they-get-it-too', 'no-commission', 'set-the-room', 'add-these'] as const;

export async function GET(context: APIContext) {
  const allPosts = (
    await Promise.all(PILLARS.map(p => getCollection(p as any)))
  ).flat().filter((p: any) => !p.data.draft);

  allPosts.sort((a: any, b: any) =>
    (b.data.publishedDate ?? b.data.date).valueOf() -
    (a.data.publishedDate ?? a.data.date).valueOf()
  );

  return rss({
    title: 'LiveWire by SparkMode',
    description: "What's working. What's not. No thought leadership.",
    site: context.site ?? 'https://livewire.sparkmode.com',
    items: allPosts.map((post: any) => ({
      title: post.data.title,
      pubDate: post.data.publishedDate ?? post.data.date,
      description: post.data.description,
      link: `/${post.collection}/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
