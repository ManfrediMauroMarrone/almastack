// app/api/admin/media/route.js
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { getMediaStore, isBlobsAvailable, getBlobUrl } from '../../../../lib/netlify-blobs';
import { media } from '../../../../lib/db';

/**
 * Helper function to ensure blob URLs are valid and up-to-date
 */
async function refreshBlobUrls(mediaItems) {
    // Check if Blobs is available
    if (!isBlobsAvailable()) {
        console.log('Netlify Blobs not available, using local URLs');
        return mediaItems;
    }
    
    const mediaStore = getMediaStore();
    if (!mediaStore) {
        return mediaItems;
    }
    
    const updatedItems = [];
    
    for (const item of mediaItems) {
        try {
            // Check if this is an old local file URL or needs updating
            const isLocalFile = item.url && (
                item.url.startsWith('/images/') || 
                item.url.startsWith('/public/') ||
                !item.url.startsWith('http')
            );
            
            if (isLocalFile || !item.url) {
                // Check if blob exists
                try {
                    const blobData = await mediaStore.get(item.filename);
                    
                    if (blobData) {
                        // Blob exists, construct the URL
                        const blobUrl = getBlobUrl(item.filename);
                        
                        // Update the URL in the database for future requests
                        await media.update(item.id, { url: blobUrl });
                        item.url = blobUrl;
                    } else {
                        // In development, keep local URL
                        if (!process.env.NETLIFY) {
                            item.url = item.url || `/images/blog/${item.filename}`;
                        } else {
                            item.missing = true;
                        }
                    }
                } catch (blobError) {
                    console.error(`Blob not found for ${item.filename}:`, blobError.message);
                    // In development, use local URL as fallback
                    if (!process.env.NETLIFY) {
                        item.url = item.url || `/images/blog/${item.filename}`;
                    } else {
                        item.missing = true;
                    }
                }
            }
            
            updatedItems.push(item);
        } catch (error) {
            console.error(`Error processing media item ${item.id}:`, error);
            item.error = true;
            updatedItems.push(item);
        }
    }
    
    return updatedItems;
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const query = searchParams.get('q');
        const skipUrlRefresh = searchParams.get('skipRefresh') === 'true';
        
        const offset = (page - 1) * limit;
        
        let files;
        
        if (query) {
            files = await media.search(query);
        } else {
            files = await media.getAll(limit, offset);
        }
        
        // Refresh blob URLs unless explicitly skipped
        if (!skipUrlRefresh && files && files.length > 0) {
            files = await refreshBlobUrls(files);
        }
        
        // Get total count for pagination
        const totalCount = await media.count(query);
        
        return NextResponse.json({
            files,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error('GET media error:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch media', 
            message: error.message 
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const ext = path.extname(file.name);
        const nameWithoutExt = path.basename(file.name, ext);
        const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-');
        const filename = `${timestamp}-${safeName}${ext}`;

        // Get file buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Process image with sharp
        let processedBuffer = buffer;
        let metadata = {};

        if (file.type !== 'image/svg+xml') {
            const image = sharp(buffer);
            metadata = await image.metadata();

            // Resize if too large
            if (metadata.width > 1920) {
                image.resize(1920, null, { 
                    withoutEnlargement: true,
                    fit: 'inside'
                });
            }

            // Optimize based on format
            if (file.type === 'image/jpeg') {
                processedBuffer = await image
                    .jpeg({ quality: 85, progressive: true })
                    .toBuffer();
            } else if (file.type === 'image/png') {
                processedBuffer = await image
                    .png({ compressionLevel: 9 })
                    .toBuffer();
            } else if (file.type === 'image/webp') {
                processedBuffer = await image
                    .webp({ quality: 85 })
                    .toBuffer();
            } else {
                processedBuffer = await image.toBuffer();
            }
        }

        let fileUrl;
        let storagePath;

        // Check if Netlify Blobs is available
        if (isBlobsAvailable()) {
            try {
                // Use Netlify Blobs
                const mediaStore = getMediaStore();
                
                // Set the blob with metadata
                await mediaStore.set(filename, processedBuffer, {
                    metadata: {
                        contentType: file.type,
                        originalName: file.name,
                        size: processedBuffer.length,
                        width: metadata.width || null,
                        height: metadata.height || null
                    }
                });

                // Construct the blob URL
                fileUrl = getBlobUrl(filename);
                storagePath = filename; // Store blob key
                
                console.log('File uploaded to Netlify Blobs:', filename);
                console.log('Blob URL:', fileUrl);
                
            } catch (blobError) {
                console.error('Blob upload error:', blobError);
                
                // Fallback to local storage if blob upload fails
                if (!process.env.NETLIFY) {
                    console.log('Falling back to local storage...');
                    
                    const uploadDir = path.join(process.cwd(), 'public/images/blog');
                    await mkdir(uploadDir, { recursive: true });
                    
                    const filepath = path.join(uploadDir, filename);
                    await writeFile(filepath, processedBuffer);
                    
                    fileUrl = `/images/blog/${filename}`;
                    storagePath = filepath;
                } else {
                    throw blobError; // Re-throw in production
                }
            }
        } else {
            // Fallback to local storage for development
            console.log('Using local storage fallback for development');
            
            const uploadDir = path.join(process.cwd(), 'public/images/blog');
            await mkdir(uploadDir, { recursive: true });
            
            const filepath = path.join(uploadDir, filename);
            await writeFile(filepath, processedBuffer);
            
            fileUrl = `/images/blog/${filename}`;
            storagePath = filepath;
            
            console.log('File saved locally:', filepath);
        }

        // Save metadata to database
        const mediaEntry = await media.create({
            filename: filename,
            originalName: file.name,
            path: storagePath,
            url: fileUrl,
            mimeType: file.type,
            size: processedBuffer.length,
            width: metadata.width || null,
            height: metadata.height || null,
            altText: formData.get('altText') || null
        });

        return NextResponse.json({
            ...mediaEntry,
            storageType: isBlobsAvailable() ? 'netlify-blobs' : 'local'
        });
        
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ 
            error: 'Failed to upload file', 
            message: error.message 
        }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename) {
            return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
        }

        // Try to delete from Netlify Blobs if available
        if (isBlobsAvailable()) {
            try {
                const mediaStore = getMediaStore();
                await mediaStore.delete(filename);
                console.log('Deleted from Netlify Blobs:', filename);
            } catch (blobError) {
                console.error('Error deleting from blobs:', blobError);
                // Continue to delete from database even if blob deletion fails
            }
        } else {
            // In development, try to delete local file
            try {
                const { unlink } = await import('fs/promises');
                const filepath = path.join(process.cwd(), 'public/images/blog', filename);
                await unlink(filepath);
                console.log('Deleted local file:', filepath);
            } catch (fsError) {
                console.error('Error deleting local file:', fsError);
            }
        }

        // Delete from database
        await media.deleteByFilename(filename);

        return NextResponse.json({ 
            success: true,
            storageType: isBlobsAvailable() ? 'netlify-blobs' : 'local'
        });
        
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ 
            error: 'Failed to delete file', 
            message: error.message 
        }, { status: 500 });
    }
}