/** @type {import('next').NextConfig} */
const nextConfig = {
    htmlLimitedBots: '.*',
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },

    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    experimental: {
        mdxRs: true,
    },

    // Compression
    compress: true,

    // Headers for caching
    async headers() {
        return [
            {
                source: '/blog/feed.xml',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/xml; charset=utf-8',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, s-maxage=3600',
                    },
                ],
            },
        ];
    },
}

module.exports = nextConfig
