import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

import { blogSchema } from './content/schemas/_blog'

export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: blogSchema,
  }),
  local: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/local' }),
    schema: blogSchema,
  }),
}
