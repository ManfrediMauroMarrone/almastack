// app/api/admin/media/route.js
import { NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { media } from '../../../../lib/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const query = searchParams.get('q');
        
        const offset = (page - 1) * limit;
        
        if (query) {
            const results = await media.search(query);
            return NextResponse.json(results);
        }
        
        const files = await media.getAll(limit, offset);
        return NextResponse.json(files);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch media', message: error.message }, { status: 500 });
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

        // Create upload directory
        const uploadDir = path.join(process.cwd(), 'public/images/blog');
        await mkdir(uploadDir, { recursive: true, mode: "777" });

        // Generate unique filename
        const timestamp = Date.now();
        const ext = path.extname(file.name);
        const nameWithoutExt = path.basename(file.name, ext);
        const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-');
        const filename = `${timestamp}-${safeName}${ext}`;
        const filepath = path.join(uploadDir, filename);

        // Get file buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Optimize image with sharp
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
            }
        }

        // Save file
        await writeFile(filepath, processedBuffer, { mode: "777" });

        // Save to database
        const mediaEntry = await media.create({
            filename: filename,
            originalName: file.name,
            path: filepath,
            url: `/images/blog/${filename}`,
            mimeType: file.type,
            size: processedBuffer.length,
            width: metadata.width || null,
            height: metadata.height || null,
            altText: formData.get('altText') || null
        });

        return NextResponse.json(mediaEntry);
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}