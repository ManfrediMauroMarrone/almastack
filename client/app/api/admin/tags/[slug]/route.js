// app/api/admin/tags/[slug]/route.js
import { NextResponse } from 'next/server';
import { tags } from '../../../../../lib/db';

export async function DELETE(request, { params }) {
    try {
        params = await params;
        
        tags.delete(params.slug);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
    }
}