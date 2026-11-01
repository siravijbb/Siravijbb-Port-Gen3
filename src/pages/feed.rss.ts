import { getCollectionBlog } from '$core/services/getCollectionBlog'
import rss from '@astrojs/rss'

import type { APIRoute } from 'astro'

export const GET: APIRoute = async context => {
  const blogs = await getCollectionBlog()

  const rssItems = blogs
    .filter(item => !item.data.draft)
    .map(({ data, id }) => ({
      title: data.title,
      description: data.subtitle ?? '',
      link: `/blog/${id}/`,
      pubDate: new Date(data.date),
      categories: data.categories,
    }))

  return rss({
    title: 'Siravij Blog',
    description: 'The Siravij Blog',
    site: context.site ?? 'https://siravijbb.me/',
    items: rssItems,
    customData: '<language>th</language>',
  })
}
