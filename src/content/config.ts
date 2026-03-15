import { defineCollection, z } from 'astro:content';

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  pillar: z.enum(['11pm-search', 'they-get-it-too', 'no-commission', 'set-the-room', 'add-these']),
  description: z.string(),
  tryThisTonightPrompt: z.string(),
  author: z.string().default('SparkMode Team'),
  draft: z.boolean().default(false),
});

export const collections = {
  '11pm-search':     defineCollection({ type: 'content', schema: postSchema }),
  'they-get-it-too': defineCollection({ type: 'content', schema: postSchema }),
  'no-commission':   defineCollection({ type: 'content', schema: postSchema }),
  'set-the-room':    defineCollection({ type: 'content', schema: postSchema }),
  'add-these':       defineCollection({ type: 'content', schema: postSchema }),
};
