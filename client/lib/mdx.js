import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import readingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { glob } from 'glob';

// Define the root directory for blog posts
const POSTS_PATH = path.join(process.cwd(), 'content/blog');

/**
 * Get all post file paths
 */
export async function getPostFilePaths() {
    const posts = await glob(`${POSTS_PATH}/**/*.mdx`);
    return posts;
}

/**
 * Get post slug from file path
 */
export function getSlugFromFilePath(filePath) {
    const fileName = path.basename(filePath, '.mdx');
    return fileName;
}

/**
 * Get all posts with metadata
 */
export async function getAllPosts() {
    const filePaths = await getPostFilePaths();

    const posts = await Promise.all(
        filePaths.map(async (filePath) => {
            const source = fs.readFileSync(filePath, 'utf-8');
            const { data, content } = matter(source);
            const slug = getSlugFromFilePath(filePath);

            return {
                slug,
                title: data.title || 'Untitled',
                date: data.date || new Date().toISOString(),
                excerpt: data.excerpt || '',
                author: data.author || 'Anonymous',
                authorImage: data.authorImage,
                coverImage: data.coverImage,
                category: data.category || 'Uncategorized',
                tags: data.tags || [],
                draft: data.draft || false,
                featured: data.featured || false,
                readingTime: readingTime(content).text,
            };
        })
    );

    // Filter out drafts in production and sort by date
    return posts
        .filter((post) => process.env.NODE_ENV === 'development' || !post.draft)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single post by slug with compiled MDX
 */
export async function getPostBySlug(slug) {
    const filePaths = await getPostFilePaths();
    const postPath = filePaths.find((path) => getSlugFromFilePath(path) === slug);

    if (!postPath) {
        throw new Error(`Post not found: ${slug}`);
    }

    const source = fs.readFileSync(postPath, 'utf-8');
    const { data, content } = matter(source);

    // Extract table of contents from headings
    const headingLines = content.split('\n').filter((line) => line.match(/^###?\s/));
    const toc = headingLines.map((raw) => {
        const text = raw.replace(/^###?\s/, '');
        const level = raw.startsWith('###') ? 3 : 2;
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        return {
            id,
            title: text,
            level,
        };
    });

    // Bundle MDX with plugins
    const { code } = await bundleMDX({
        source: content,
        mdxOptions(options) {
            options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
            options.rehypePlugins = [
                ...(options.rehypePlugins ?? []),
                rehypeSlug,
                rehypeCodeTitles,
                [rehypePrismPlus, { ignoreMissing: true }],
                [
                    rehypeAutolinkHeadings,
                    {
                        behavior: 'wrap',
                        properties: {
                            className: ['anchor'],
                        },
                    },
                ],
            ];
            return options;
        },
    });

    return {
        slug,
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || '',
        author: data.author || 'Anonymous',
        authorImage: data.authorImage,
        coverImage: data.coverImage,
        category: data.category || 'Uncategorized',
        tags: data.tags || [],
        draft: data.draft || false,
        featured: data.featured || false,
        readingTime: readingTime(content).text,
        content,
        code,
        toc,
    };
}

/**
 * Get all unique categories
 */
export async function getAllCategories() {
    const posts = await getAllPosts();
    const categories = new Set(posts.map((post) => post.category));
    return Array.from(categories).sort();
}

/**
 * Get all unique tags
 */
export async function getAllTags() {
    const posts = await getAllPosts();
    const tags = new Set(posts.flatMap((post) => post.tags));
    return Array.from(tags).sort();
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category) {
    const posts = await getAllPosts();
    return posts.filter((post) => post.category === category);
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag) {
    const posts = await getAllPosts();
    return posts.filter((post) => post.tags.includes(tag));
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts() {
    const posts = await getAllPosts();
    return posts.filter((post) => post.featured);
}

/**
 * Get previous and next posts for navigation
 */
export async function getAdjacentPosts(currentSlug) {
    const posts = await getAllPosts();
    const currentIndex = posts.findIndex((post) => post.slug === currentSlug);

    return {
        previous: currentIndex > 0 ? posts[currentIndex - 1] : null,
        next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    };
}

/**
 * Search posts by query
 */
export async function searchPosts(query) {
    const posts = await getAllPosts();
    const lowercaseQuery = query.toLowerCase();

    return posts.filter((post) => {
        const searchableContent = `
      ${post.title} 
      ${post.excerpt} 
      ${post.category} 
      ${post.tags.join(' ')} 
      ${post.author}
    `.toLowerCase();

        return searchableContent.includes(lowercaseQuery);
    });
}