import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { metaSite } from '@/config/config.json';

export async function get(context) {
  const allPosts = await getCollection('blog', (post) => {
    return !post.data.draft && post.data.date <= new Date();
  });
  const sortedPosts = allPosts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const posts = sortedPosts.slice(0, 10);

  return rss({
    xmlns: { h: 'http://www.w3.org/TR/html4/' },
    title: metaSite.title,
    description: metaSite.description,
    site: context.site,
    customData: '<language>en-us</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description:
        post.data.description || post.data.excerpt || post.data.content || '',
      link: post.data.canonical,
    })),
  });
}