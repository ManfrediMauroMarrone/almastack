// app/api/admin/authors/[slug]/route.js
import { NextResponse } from 'next/server';
import { authors } from '../../../../../lib/db';

export async function GET(request, { params }) {
    try {
        params = await params;

        const author = authors.getBySlug(params.slug);
        if (!author) {
            return NextResponse.json({ error: 'Author not found' }, { status: 404 });
        }
        return NextResponse.json(author);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch author' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        params = await params;
        
        const data = await request.json();
        const author = authors.update(params.slug, data);
        return NextResponse.json(author);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update author' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        authors.delete(params.slug);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete author' }, { status: 500 });
    }
}