// app/api/admin/tags/route.js
import { NextResponse } from 'next/server';
import { tags } from '../../../../lib/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        
        if (query) {
            const results = await tags.search(query);
            return NextResponse.json(results);
        }
        
        const allTags = await tags.getAll();
        return NextResponse.json(allTags);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        
        // Handle single tag or multiple tags
        if (Array.isArray(data)) {
            await tags.createMany(data);
            return NextResponse.json({ success: true, count: data.length });
        } else {
            const tag = await tags.create(data);
            return NextResponse.json(tag);
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create tags' }, { status: 500 });
    }
}