import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const POSTS_PATH = path.join(process.cwd(), 'content/blog');

// Helper to ensure directory exists
async function ensureDir() {
    try {
        await fs.access(POSTS_PATH);
    } catch {
        await fs.mkdir(POSTS_PATH, { recursive: true });
    }
}

// GET - List all posts
export async function GET() {
    try {
        await ensureDir();
        const files = await fs.readdir(POSTS_PATH);
        const mdxFiles = files.filter(file => file.endsWith('.mdx'));

        const posts = await Promise.all(
            mdxFiles.map(async (file) => {
                const filePath = path.join(POSTS_PATH, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const { data, content: mdxContent } = matter(content);

                return {
                    slug: file.replace('.mdx', ''),
                    title: data.title || 'Untitled',
                    date: data.date || new Date().toISOString(),
                    excerpt: data.excerpt || '',
                    author: data.author || 'Anonymous',
                    category: data.category || 'Uncategorized',
                    tags: data.tags || [],
                    draft: data.draft || false,
                    featured: data.featured || false,
                    wordCount: mdxContent.split(/\s+/).length,
                };
            })
        );

        // Sort by date
        posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error reading posts:', error);
        return NextResponse.json({ error: 'Failed to read posts' }, { status: 500 });
    }
}

// POST - Create new post
export async function POST(request) {
    try {
        const data = await request.json();

        // Generate frontmatter
        const frontmatter = {
            title: data.title,
            date: data.date || new Date().toISOString().split('T')[0],
            excerpt: data.excerpt || '',
            author: data.author || 'Team AlmaStack',
            authorImage: data.authorImage,
            coverImage: data.coverImage,
            category: data.category || 'Uncategorized',
            tags: data.tags || [],
            draft: data.draft ?? true,
            featured: data.featured || false,
        };

        // Create MDX content
        const fileContent = matter.stringify(data.content || '', frontmatter);

        // Generate filename
        const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const filePath = path.join(POSTS_PATH, `${slug}.mdx`);

        // Check if file exists
        try {
            await fs.access(filePath);
            return NextResponse.json({ error: 'Post already exists' }, { status: 409 });
        } catch {
            // File doesn't exist, proceed
        }

        // Write file
        await ensureDir();
        await fs.writeFile(filePath, fileContent, 'utf-8');

        return NextResponse.json({ slug, message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
