import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  // 从 src/content/blog/ 加载 .md 和 .mdx 文件
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      pubDate: z.coerce.date(),
      time: z.string().optional(),
      updatedDate: z.coerce.date().optional(),
      image: z.optional(image()),
      tags: z.array(z.string()).optional(),
      author: z.string().optional(),
    }),
});

export const collections = { blog };
