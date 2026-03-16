import { defineCollection, z } from 'astro:content';

const embedSchema = z.object({
  type: z.enum(['youtube', 'spotify', 'tweet', 'tiktok', 'instagram', 'facebook']),
  id: z.string(),                        // video ID, tweet ID, TikTok video ID, etc.
  start: z.number().optional(),          // YouTube timestamp in seconds
  caption: z.string().optional(),        // text shown below the embed
  url: z.string().optional(),            // full URL (for tweet/TikTok/Instagram/Facebook)
});

const postSchema = z.object({
  title: z.string(),
  pageTitle: z.string().optional(),           // shorter title for <title> tag / SERP (~58 chars max)
  updatedDate: z.coerce.date(),               // last modified — updates freely on edits
  publishedDate: z.coerce.date().optional(),  // original publish date — set once, never change
  pillar: z.enum(['11pm-search', 'they-get-it-too', 'no-commission', 'set-the-room', 'add-these']),
  description: z.string(),
  tryThisTonightPrompt: z.string(),
  author: z.string().default('SparkMode Team'),
  draft: z.boolean().default(false),
  sources: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  keywords: z.array(z.string()).optional(),
  mentions: z.array(z.object({ name: z.string(), wikidata: z.string().optional() })).optional(),
  embeds: z.array(embedSchema).optional(),   // ordered list of embeds for the post
});

export const collections = {
  '11pm-search':     defineCollection({ type: 'content', schema: postSchema }),
  'they-get-it-too': defineCollection({ type: 'content', schema: postSchema }),
  'no-commission':   defineCollection({ type: 'content', schema: postSchema }),
  'set-the-room':    defineCollection({ type: 'content', schema: postSchema }),
  'add-these':       defineCollection({ type: 'content', schema: postSchema }),
};
