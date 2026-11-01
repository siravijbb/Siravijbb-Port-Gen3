import { defineConfig } from 'astro/config'

/* Astro plugins */
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { unified } from '@astrojs/markdown-remark'

/* Remark plugins */
import { iframeParser } from './src/modules/remark/iframeParser.mjs'
import { imageParser } from './src/modules/remark/imageParser.mjs'
import { readingTime } from './src/modules/remark/readingTime.mjs'

// https://astro.build/config
export default defineConfig({
  site: 'https://siravijbb.me/',
  compressHTML: true,
  integrations: [
    sitemap({
      filter: page => !page.includes('/pages/'),
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [iframeParser, imageParser, readingTime],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
