import RSS from 'rss';
import { getAllPosts } from '../../../lib/mdx';

export async function GET() {
    const posts = await getAllPosts();
    const siteUrl = 'https://almastack.it';

    const feed = new RSS({
        title: 'AlmaStack Blog',
        description: 'Articoli, guide e approfondimenti su sviluppo web, tecnologie moderne e best practices',
        site_url: siteUrl,
        feed_url: `${siteUrl}/blog/feed.xml`,
        copyright: `Copyright ${new Date().getFullYear()} AlmaStack`,
        language: 'it',
        pubDate: new Date(),
        ttl: 60,
    });

    posts.forEach((post) => {
        feed.item({
            title: post.title,
            description: post.excerpt,
            url: `${siteUrl}/blog/${post.slug}`,
            guid: `${siteUrl}/blog/${post.slug}`,
            categories: [post.category, ...post.tags],
            date: new Date(post.date),
            author: post.author,
        });
    });

    return new Response(feed.xml({ indent: true }), {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}