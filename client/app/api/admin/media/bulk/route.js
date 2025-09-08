// app/api/admin/media/bulk/route.js
import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';
import { media } from '../../../../../lib/db';

export async function DELETE(request) {
    try {
        const { ids } = await request.json();
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ 
                error: 'Invalid ids array' 
            }, { status: 400 });
        }
        
        const mediaStore = getStore('media-uploads');
        const results = [];
        
        for (const id of ids) {
            try {
                const file = await media.getById(id);
                if (file) {
                    // Delete from blob storage
                    await mediaStore.delete(file.filename || file.path);
                    // Delete from database
                    await media.delete(id);
                    results.push({ id, success: true });
                }
            } catch (error) {
                results.push({ id, success: false, error: error.message });
            }
        }
        
        return NextResponse.json({ results });
        
    } catch (error) {
        console.error('Bulk delete error:', error);
        return NextResponse.json({ 
            error: 'Failed to delete media items', 
            message: error.message 
        }, { status: 500 });
    }
}