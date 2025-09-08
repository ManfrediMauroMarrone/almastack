import { getAllPosts, getAllCategories, getAllTags } from '../lib/mdx';

export default async function sitemap() {
    const posts = await getAllPosts();
    const categories = await getAllCategories();
    const tags = await getAllTags();

    const siteUrl = 'https://almastack.it';

    // Static pages
    const staticPages = [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${siteUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
    ];

    // Blog posts
    const postPages = posts.map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    // Category pages
    const categoryPages = categories.map((category) => ({
        url: `${siteUrl}/blog?category=${encodeURIComponent(category)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    // Tag pages
    const tagPages = tags.map((tag) => ({
        url: `${siteUrl}/blog?tag=${encodeURIComponent(tag)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    return [...staticPages, ...postPages, ...categoryPages, ...tagPages];
}