// app/api/admin/media/[id]/route.js
import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';
import { media } from '../../../../../lib/db';

export async function PUT(request, { params }) {
    try {
        params = await params;
        
        const data = await request.json();
        const updated = await media.update(params.id, data);
        
        return NextResponse.json(updated);
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ 
            error: 'Failed to update media', 
            message: error.message 
        }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        params = await params;
        
        // Get the media record from database first
        const file = await media.getById(params.id);
        
        if (!file) {
            return NextResponse.json({ 
                error: 'Media not found' 
            }, { status: 404 });
        }
        
        // Delete from database
        const deleted = await media.delete(params.id);
        
        if (deleted) {
            // Delete from Netlify Blobs storage
            try {
                const mediaStore = getStore('media-uploads');
                
                // The 'path' field now contains the blob key (filename)
                // If you stored it differently, adjust accordingly
                await mediaStore.delete(file.filename || file.path);
                
                console.log(`Successfully deleted blob: ${file.filename || file.path}`);
            } catch (blobError) {
                // Log the error but don't fail the request
                // The database record is already deleted
                console.error('Error deleting blob from storage:', blobError);
                
                // Optionally, you might want to track failed blob deletions
                // for manual cleanup later
            }
        }
        
        return NextResponse.json({ 
            success: true,
            deletedId: params.id,
            filename: file.filename 
        });
        
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ 
            error: 'Failed to delete media', 
            message: error.message 
        }, { status: 500 });
    }
}

// Optional: Add GET endpoint to retrieve single media item with blob URL
export async function GET(request, { params }) {
    try {
        params = await params;
        
        const file = await media.getById(params.id);
        
        if (!file) {
            return NextResponse.json({ 
                error: 'Media not found' 
            }, { status: 404 });
        }
        
        // If you need to regenerate the blob URL
        // (useful if URLs expire or change)
        try {
            const mediaStore = getStore('media-uploads');
            const blobUrl = await mediaStore.getURL(file.filename || file.path);
            
            // Update the URL if it has changed
            if (blobUrl && blobUrl !== file.url) {
                file.url = blobUrl;
                // Optionally update in database
                await media.update(params.id, { url: blobUrl });
            }
        } catch (blobError) {
            console.error('Error getting blob URL:', blobError);
            // Continue with existing URL from database
        }
        
        return NextResponse.json(file);
        
    } catch (error) {
        console.error('Get error:', error);
        return NextResponse.json({ 
            error: 'Failed to get media', 
            message: error.message 
        }, { status: 500 });
    }
}