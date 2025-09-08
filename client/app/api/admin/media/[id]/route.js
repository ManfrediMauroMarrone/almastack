// app/api/admin/media/[id]/route.js
import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { media } from '../../../../../lib/db';

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const updated = await media.update(parseInt(params.id), data);
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const file = await media.delete(parseInt(params.id));
        
        if (file) {
            // Delete physical file
            try {
                await unlink(file.path);
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
    }
}