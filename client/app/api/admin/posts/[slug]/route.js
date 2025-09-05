import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const POSTS_PATH = path.join(process.cwd(), 'content/blog');

// GET - Get single post
export async function GET(request, { params }) {
    try {
        params = await params;

        const filePath = path.join(POSTS_PATH, `${params.slug}.mdx`);
        const content = await fs.readFile(filePath, 'utf-8');
        const { data, content: mdxContent } = matter(content);

        return NextResponse.json({
            slug: params.slug,
            title: data.title || '',
            content: mdxContent,
            excerpt: data.excerpt || '',
            date: data.date || new Date().toISOString().split('T')[0],
            author: data.author || 'Team AlmaStack',
            authorImage: data.authorImage || '',
            coverImage: data.coverImage || '',
            category: data.category || 'Uncategorized',
            tags: data.tags || [],
            draft: data.draft ?? false,
            featured: data.featured || false,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
}

// PUT - Update post
export async function PUT(request, { params }) {
    try {
        params = await params;

        const data = await request.json();
        const oldPath = path.join(POSTS_PATH, `${params.slug}.mdx`);

        // Check if file exists
        try {
            await fs.access(oldPath);
        } catch {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Generate frontmatter
        const frontmatter = {
            title: data.title,
            date: data.date,
            excerpt: data.excerpt,
            author: data.author,
            authorImage: data.authorImage,
            coverImage: data.coverImage,
            category: data.category,
            tags: data.tags,
            draft: data.draft,
            featured: data.featured,
        };

        // Create MDX content
        const fileContent = matter.stringify(data.content, frontmatter);

        // If slug changed, rename file
        const newSlug = data.slug || params.slug;
        const newPath = path.join(POSTS_PATH, `${newSlug}.mdx`);

        if (oldPath !== newPath) {
            // Check if new file already exists
            try {
                await fs.access(newPath);
                return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
            } catch {
                // New file doesn't exist, proceed
            }

            // Write new file and delete old
            await fs.writeFile(newPath, fileContent, 'utf-8');
            await fs.unlink(oldPath);
        } else {
            // Just update the file
            await fs.writeFile(oldPath, fileContent, 'utf-8');
        }

        return NextResponse.json({ slug: newSlug, message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

// DELETE - Delete post
export async function DELETE(request, { params }) {
    try {
        params = await params;
        
        const filePath = path.join(POSTS_PATH, `${params.slug}.mdx`);
        await fs.unlink(filePath);
        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
