import { NextResponse } from 'next/server';
import { posts, tags as tagsDb } from '../../../../lib/db';
import readingTime from 'reading-time';

// GET all posts
export async function GET(request) {
    try {
        const allPosts = await posts.getAll();
        
        // Format posts for response
        const formattedPosts = allPosts.map(post => ({
            ...post,
            // Ensure consistent field names
            authorImage: post.author_image || post.authorImage,
            coverImage: post.cover_image || post.coverImage,
            readingTime: post.reading_time || readingTime(post.content || '').text,
        }));
        
        return NextResponse.json(formattedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST create new post
export async function POST(request) {
    try {
        const data = await request.json();
        
        // Validate required fields
        if (!data.title || !data.content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }
        
        // Generate slug if not provided
        if (!data.slug) {
            data.slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }
        
        // Check if slug already exists
        const existingPost = await posts.getBySlug(data.slug);
        if (existingPost) {
            return NextResponse.json(
                { error: 'A post with this slug already exists' },
                { status: 409 }
            );
        }
        
        // Calculate reading time
        const calculatedReadingTime = readingTime(data.content).text;
        
        // Create tags if they don't exist
        if (data.tags && Array.isArray(data.tags)) {
            for (const tagName of data.tags) {
                const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                await tagsDb.create({ slug: tagSlug, name: tagName });
            }
        }
        
        // Prepare post data
        const postData = {
            slug: data.slug,
            title: data.title,
            content: data.content,
            excerpt: data.excerpt || '',
            date: data.date || new Date().toISOString().split('T')[0],
            author: data.author || 'Alessandro D\'Antoni',
            authorImage: data.authorImage || '/images/authors/alessandro_avatar-min.webp',
            coverImage: data.coverImage || null,
            category: data.category || null,
            tags: data.tags || [],
            draft: data.draft !== undefined ? data.draft : true,
            featured: data.featured || false,
            readingTime: calculatedReadingTime
        };
        
        // Create post
        const newPost = await posts.create(postData);
        
        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post', details: error.message },
            { status: 500 }
        );
    }
}