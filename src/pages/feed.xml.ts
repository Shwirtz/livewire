import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

const PILLARS = ['11pm-search', 'they-get-it-too', 'no-commission', 'set-the-room', 'add-these'] as const;

export async function GET(context: APIContext) {
  const allPosts = (
    await Promise.all(PILLARS.map(p => getCollection(p as any)))
  ).flat().filter((p: any) => !p.data.draft);

  allPosts.sort((a: any, b: any) =>
    (b.data.publishedDate ?? b.data.updatedDate).valueOf() -
    (a.data.publishedDate ?? a.data.updatedDate).valueOf()
  );

  return rss({
    title: 'LiveWire by SparkMode',
    description: "What's working. What's not. No thought leadership.",
    site: context.site ?? 'https://livewire.sparkmode.com',
    items: allPosts.map((post: any) => ({
      title: post.data.title,
      pubDate: post.data.publishedDate ?? post.data.updatedDate,
      description: post.data.description,
      link: `/${post.collection}/${post.slug}/`,
      author: 'go@sparkmode.com (LiveWire Editorial)',
      categories: post.data.keywords ?? [],
    })),
    customData: `
      <language>en-us</language>
      <image>
        <url>https://livewire.sparkmode.com/livewire-wordmark-solo.png</url>
        <title>LiveWire by SparkMode</title>
        <link>https://livewire.sparkmode.com</link>
      </image>
    `.trim(),
  });
}
