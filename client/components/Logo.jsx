'use client';

const Logo = () => (
    <svg width="180" height="40" viewBox="0 0 180 40" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#f093fb', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f093fb', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#f5576c', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <g id="stack-symbol">
            <rect x="0" y="6" width="40" height="8" rx="2" fill="url(#gradient1)" />
            <rect x="3" y="18" width="34" height="8" rx="2" fill="url(#gradient2)" />
            <rect x="6" y="30" width="28" height="8" rx="2" fill="url(#gradient3)" />
        </g>
        <text x="52" y="32" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto" fontSize="28" fontWeight="600" fill="url(#textGradient)" letterSpacing="-0.5">
            Almastack
        </text>
    </svg>
);

export default Logo;