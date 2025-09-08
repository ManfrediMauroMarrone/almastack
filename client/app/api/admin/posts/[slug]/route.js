import { NextResponse } from 'next/server';
import { posts, tags as tagsDb } from '../../../../../lib/db';
import readingTime from 'reading-time';

// GET single post by slug
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        
        if (!slug) {
            return NextResponse.json(
                { error: 'Slug is required' },
                { status: 400 }
            );
        }
        
        const post = await posts.getBySlug(slug);
        
        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }
        
        // Format post for response
        const formattedPost = {
            ...post,
            // Ensure consistent field names
            authorImage: post.author_image || post.authorImage,
            coverImage: post.cover_image || post.coverImage,
            readingTime: post.reading_time || readingTime(post.content || '').text,
        };
        
        return NextResponse.json(formattedPost);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
}

// PUT update post
export async function PUT(request, { params }) {
    try {
        const { slug } = await params;
        const data = await request.json();
        
        if (!slug) {
            return NextResponse.json(
                { error: 'Slug is required' },
                { status: 400 }
            );
        }
        
        // Check if post exists
        const existingPost = await posts.getBySlug(slug);
        if (!existingPost) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }
        
        // If slug is being changed, check if new slug already exists
        if (data.slug && data.slug !== slug) {
            const postWithNewSlug = await posts.getBySlug(data.slug);
            if (postWithNewSlug) {
                return NextResponse.json(
                    { error: 'A post with the new slug already exists' },
                    { status: 409 }
                );
            }
        }
        
        // Calculate reading time if content has changed
        if (data.content) {
            data.readingTime = readingTime(data.content).text;
        }
        
        // Create tags if they don't exist
        if (data.tags && Array.isArray(data.tags)) {
            for (const tagName of data.tags) {
                const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                await tagsDb.create({ slug: tagSlug, name: tagName });
            }
        }
        
        // Update post
        const updatedPost = await posts.update(slug, data);
        
        // Format post for response
        const formattedPost = {
            ...updatedPost,
            // Ensure consistent field names
            authorImage: updatedPost.author_image || updatedPost.authorImage,
            coverImage: updatedPost.cover_image || updatedPost.coverImage,
            readingTime: updatedPost.reading_time || readingTime(updatedPost.content || '').text,
        };
        
        return NextResponse.json(formattedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { error: 'Failed to update post', details: error.message },
            { status: 500 }
        );
    }
}

// DELETE post
export async function DELETE(request, { params }) {
    try {
        const { slug } = await params;
        
        if (!slug) {
            return NextResponse.json(
                { error: 'Slug is required' },
                { status: 400 }
            );
        }
        
        // Check if post exists
        const existingPost = await posts.getBySlug(slug);
        if (!existingPost) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }
        
        // Delete post
        await posts.delete(slug);
        
        return NextResponse.json(
            { message: 'Post deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}