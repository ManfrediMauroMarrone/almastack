// lib/netlify-blobs.js
import { getStore } from '@netlify/blobs';

export function getMediaStore() {
    if (process.env.NETLIFY) {
        return getStore('media-uploads');
    }
    
    const siteId = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
    const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_TOKEN;
    
    if (!siteId || !token) {
        console.warn('Netlify Blobs not configured. Using fallback mode.');
        return null;
    }
    
    return getStore({
        name: 'media-uploads',
        siteID: siteId,
        token: token,
        apiURL: process.env.NETLIFY_API_URL || 'https://api.netlify.com'
    });
}

export function isBlobsAvailable() {
    if (process.env.NETLIFY) return true;
    
    const siteId = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
    const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_TOKEN;
    
    return !!(siteId && token);
}

/**
 * Get the public URL for a blob
 * Usa l'API endpoint invece dell'URL diretto del blob
 */
export function getBlobUrl(filename) {
    // Usa sempre l'API endpoint per servire i blob
    if (process.env.NODE_ENV === 'development') {
        return `/api/blob/${encodeURIComponent(filename)}`;
    }
    
    // In produzione, usa l'URL completo
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   process.env.URL || 
                   process.env.DEPLOY_URL || 
                   'https://almastack.it';
    
    return `${baseUrl}/api/blob/${encodeURIComponent(filename)}`;
}