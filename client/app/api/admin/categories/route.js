// app/api/admin/categories/route.js
import { NextResponse } from 'next/server';
import { categories } from '../../../../lib/db';

export async function GET() {
    try {
        const allCategories = await categories.getAll();
        return NextResponse.json(allCategories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const category = await categories.create(data);
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}