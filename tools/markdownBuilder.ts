import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml' // Import js-yaml

import { config } from 'dotenv'

import { reporter } from './services/reporter'
import { getBlogPosts } from './services/getBlogPosts'

config()

const rootMarkdownDirectory = path.join(process.cwd(), 'src/content/blog')

;(async () => {
  const command = process.argv[process.argv.length - 1]
  switch (command) {
    case 'build':
      const blogPosts = await getBlogPosts({
        preview: !['true', '1'].includes(process.env.CI ?? ''),
      })

      console.log('writing...')
      await Promise.all(
        blogPosts.map(blogPost => {
          const header = {
            title: blogPost.title,
            subtitle: blogPost.subtitle,
            date: new Date(blogPost.date),
            author: blogPost.author ? blogPost.author.name : 'Unknown Author',
            categories: blogPost.categoryCollection.items.map(o => o.name),
            // Pass the banner as a real object, not a string
            banner: {
              url: blogPost.banner.url,
              width: blogPost.banner.width,
              height: blogPost.banner.height,
              placeholder: blogPost.banner.placeholder.encoded,
              blurhash: blogPost.banner.placeholder.blurhashCode,
            },
            featured: blogPost.featured ? true : false, // boolean is fine
            draft: blogPost.sys.publishedAt === null,
          }

          const frontmatter = yaml.dump(header)

          const builtContent = `---\n${frontmatter}---\n\n${blogPost.content}`

          return fs.promises.writeFile(
            path.join(rootMarkdownDirectory, `${blogPost.slug}.md`),
            builtContent
          )
        })
      )
      break
    case 'clean':
      await Promise.all(
        fs
          .readdirSync(rootMarkdownDirectory)
          .filter(file => ['.md', '.mdx'].some(o => file.endsWith(o)))
          .map(file => fs.promises.rm(path.join(rootMarkdownDirectory, file)))
      )
      break
    default:
      reporter.fail('unrecognized command')
      process.exit(1)
  }
})()

export {}