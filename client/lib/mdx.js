import { bundleMDX } from 'mdx-bundler';
import readingTime from 'reading-time';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrismPlus from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { posts as postsDb } from './db';

/**
 * Get all posts from database
 */
export async function getAllPosts() {
    try {
        // Get all posts from database (including drafts in development)
        const allPosts = await postsDb.getAll();
        
        // Filter out drafts in production
        const filteredPosts = allPosts.filter(
            post => process.env.NODE_ENV === 'development' || !post.draft
        );
        
        // Calculate reading time for each post
        const postsWithReadingTime = filteredPosts.map(post => ({
            ...post,
            readingTime: post.reading_time || readingTime(post.content).text,
            // Ensure consistent field names
            authorImage: post.author_image || post.authorImage,
            coverImage: post.cover_image || post.coverImage,
        }));
        
        // Sort by date (newest first)
        return postsWithReadingTime.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    } catch (error) {
        console.error('Error getting posts from database:', error);
        return [];
    }
}

/**
 * Compile MDX content to JavaScript
 */
async function compileMDX(content) {
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
    
    return code;
}

/**
 * Extract table of contents from MDX content
 */
function extractTableOfContents(content) {
    const headingLines = content.split('\n').filter((line) => line.match(/^###?\s/));
    
    return headingLines.map((raw) => {
        const text = raw.replace(/^###?\s/, '');
        const level = raw.startsWith('###') ? 3 : 2;
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        return {
            id,
            title: text,
            level,
        };
    });
}

/**
 * Get a single post by slug with compiled MDX
 */
export async function getPostBySlug(slug) {
    try {
        // Get post from database
        const post = await postsDb.getBySlug(slug);
        
        if (!post) {
            throw new Error(`Post not found: ${slug}`);
        }
        
        // Check if post is draft and we're not in development
        if (post.draft && process.env.NODE_ENV !== 'development') {
            throw new Error(`Post is draft: ${slug}`);
        }
        
        // Extract table of contents
        const toc = extractTableOfContents(post.content);
        
        // Compile MDX content
        const code = await compileMDX(post.content);
        
        // Calculate reading time if not already set
        const postReadingTime = post.reading_time || readingTime(post.content).text;
        
        return {
            ...post,
            readingTime: postReadingTime,
            code,
            toc,
            // Ensure consistent field names
            authorImage: post.author_image || post.authorImage,
            coverImage: post.cover_image || post.coverImage,
        };
    } catch (error) {
        console.error(`Error getting post ${slug}:`, error);
        throw error;
    }
}

/**
 * Get all unique categories from posts
 */
export async function getAllCategories() {
    try {
        const posts = await getAllPosts();
        const categories = new Set(posts.map((post) => post.category).filter(Boolean));
        return Array.from(categories).sort();
    } catch (error) {
        console.error('Error getting categories:', error);
        return [];
    }
}

/**
 * Get all unique tags from posts
 */
export async function getAllTags() {
    try {
        const posts = await getAllPosts();
        const tags = new Set(posts.flatMap((post) => post.tags || []));
        return Array.from(tags).sort();
    } catch (error) {
        console.error('Error getting tags:', error);
        return [];
    }
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category) {
    try {
        // Use database method for better performance
        const posts = await postsDb.getByCategory(category);
        
        // Calculate reading time for each post
        return posts.map(post => ({
            ...post,
            readingTime: post.reading_time || readingTime(post.content).text,
            // Ensure consistent field names
            authorImage: post.author_image || post.authorImage,
            coverImage: post.cover_image || post.coverImage,
        }));
    } catch (error) {
        console.error(`Error getting posts by category ${category}:`, error);
        return [];
    }
}

/**
 * Get posts by tag
 */
export async function getPostsByTag(tag) {
    try {
        // Use database method for better performance
        const posts = await postsDb.getByTag(tag);
        
        // Calculate reading time for each post
        return posts.map(post => ({
            ...post,
            readingTime: post.reading_time || readingTime(post.content).text,
            // Ensure consistent field names
            authorImage: post.author_image || post.authorImage,
            coverImage: post.cover_image || post.coverImage,
        }));
    } catch (error) {
        console.error(`Error getting posts by tag ${tag}:`, error);
        return [];
    }
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts() {
    try {
        // Use database method for better performance
        const posts = await postsDb.getFeatured();
        
        // Calculate reading time for each post
        return posts.map(post => ({
            ...post,
            readingTime: post.reading_time || readingTime(post.content).text,
            // Ensure consistent field names
            authorImage: post.author_image || post.authorImage,
            coverImage: post.cover_image || post.coverImage,
        }));
    } catch (error) {
        console.error('Error getting featured posts:', error);
        return [];
    }
}

/**
 * Get previous and next posts for navigation
 */
export async function getAdjacentPosts(currentSlug) {
    try {
        const posts = await getAllPosts();
        const currentIndex = posts.findIndex((post) => post.slug === currentSlug);

        return {
            previous: currentIndex > 0 ? posts[currentIndex - 1] : null,
            next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
        };
    } catch (error) {
        console.error(`Error getting adjacent posts for ${currentSlug}:`, error);
        return { previous: null, next: null };
    }
}

/**
 * Search posts by query
 */
export async function searchPosts(query) {
    try {
        // Use database search method for better performance
        const posts = await postsDb.search(query);
        
        // Calculate reading time for each post
        return posts.map(post => ({
            ...post,
            readingTime: post.reading_time || readingTime(post.content).text,
            // Ensure consistent field names
            authorImage: post.author_image || post.authorImage,
            coverImage: post.cover_image || post.coverImage,
        }));
    } catch (error) {
        console.error(`Error searching posts with query "${query}":`, error);
        return [];
    }
}

/**
 * Increment post views (new feature with database)
 */
export async function incrementPostViews(slug) {
    try {
        await postsDb.incrementViews(slug);
    } catch (error) {
        console.error(`Error incrementing views for post ${slug}:`, error);
    }
}