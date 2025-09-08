// app/api/admin/stats/route.js
import { NextResponse } from 'next/server';
import { categories, tags, media, authors } from '../../../../lib/db';
import { getAllPosts } from '../../../../lib/mdx';

export async function GET() {
    try {
        const posts = await getAllPosts();
        const allCategories = categories.getAll();
        const allTags = tags.getAll();
        const allMedia = media.getAll(1000, 0);
        const allAuthors = authors.getAll();

        const stats = {
            totalPosts: posts.length,
            publishedPosts: posts.filter(p => !p.draft).length,
            draftPosts: posts.filter(p => p.draft).length,
            totalViews: 0, // Can be implemented with analytics
            categories: allCategories.length,
            tags: allTags.length,
            media: allMedia.length,
            authors: allAuthors.length
        };

        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}