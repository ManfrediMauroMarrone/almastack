// app/api/blob/[filename]/route.js
import { NextResponse } from 'next/server';
import { getMediaStore, isBlobsAvailable } from '../../../../lib/netlify-blobs';

export async function GET(request, { params }) {
    try {
        const { filename } = await params;
        
        if (!filename) {
            return new NextResponse('Filename required', { status: 400 });
        }
        
        // Determina il content type dal filename
        const ext = filename.split('.').pop()?.toLowerCase();
        const contentTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml'
        };
        const contentType = contentTypes[ext] || 'application/octet-stream';
        
        // In sviluppo, servi il file locale
        if (!isBlobsAvailable()) {
            const fs = await import('fs/promises');
            const path = await import('path');
            
            try {
                const filePath = path.join(process.cwd(), 'public/images/blog', filename);
                const file = await fs.readFile(filePath);
                
                return new NextResponse(file, {
                    headers: {
                        'Content-Type': contentType,
                        'Cache-Control': 'public, max-age=31536000'
                    }
                });
            } catch (error) {
                console.error('Local file not found:', error);
                return new NextResponse('File not found', { status: 404 });
            }
        }
        
        // In produzione, recupera dal blob store
        const mediaStore = getMediaStore();
        
        try {
            // IMPORTANTE: usa 'arrayBuffer' o 'stream' come tipo
            // Non usare il default che potrebbe restituire JSON o text
            const blobData = await mediaStore.get(filename, { 
                type: 'arrayBuffer' // o 'blob' se disponibile
            });
            
            if (!blobData) {
                return new NextResponse('Not found', { status: 404 });
            }
            
            // Converti ArrayBuffer in Uint8Array se necessario
            const buffer = blobData instanceof ArrayBuffer 
                ? new Uint8Array(blobData) 
                : blobData;
            
            // Crea la risposta con i dati binari corretti
            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    'Content-Type': contentType,
                    'Content-Length': buffer.byteLength?.toString() || buffer.length?.toString(),
                    'Cache-Control': 'public, max-age=31536000, immutable',
                    'Access-Control-Allow-Origin': '*'
                }
            });
            
        } catch (blobError) {
            console.error('Error fetching from blob store:', blobError);
            
            // Prova metodo alternativo
            try {
                // Alcuni sistemi blob potrebbero usare metodi diversi
                const blobStream = await mediaStore.get(filename, { type: 'stream' });
                
                if (blobStream) {
                    // Converti stream in buffer
                    const chunks = [];
                    const reader = blobStream.getReader();
                    
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        chunks.push(value);
                    }
                    
                    const buffer = new Uint8Array(
                        chunks.reduce((acc, chunk) => acc + chunk.length, 0)
                    );
                    let offset = 0;
                    for (const chunk of chunks) {
                        buffer.set(chunk, offset);
                        offset += chunk.length;
                    }
                    
                    return new NextResponse(buffer, {
                        headers: {
                            'Content-Type': contentType,
                            'Cache-Control': 'public, max-age=31536000'
                        }
                    });
                }
            } catch (streamError) {
                console.error('Stream method also failed:', streamError);
            }
            
            return new NextResponse('Error retrieving file', { status: 500 });
        }
        
    } catch (error) {
        console.error('Error serving blob:', error);
        return new NextResponse('Internal server error', { status: 500 });
    }
}