// app/api/admin/categories/[slug]/route.js
import { NextResponse } from 'next/server';
import { categories } from '../../../../../lib/db';

export async function GET(request, { params }) {
    try {
        params = await params;

        const category = categories.getBySlug(params.slug);
        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        params = await params;

        const data = await request.json();
        const category = categories.update(params.slug, data);
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        params = await params;
        
        categories.delete(params.slug);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}