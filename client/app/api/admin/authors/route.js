// app/api/admin/authors/route.js
import { NextResponse } from 'next/server';
import { authors } from '../../../../lib/db';

export async function GET() {
    try {
        const allAuthors = authors.getAll();
        return NextResponse.json(allAuthors);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const author = authors.create(data);
        return NextResponse.json(author);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create author' }, { status: 500 });
    }
}
