export const _viewport = {
    width: 'device-width',
    initialScale: 1,
    userScalable: true,
    themeColor: '#667eea',
};

export const _metadata = {
    it: {
        // Meta Tags Base
        title: {
            default: 'Almastack | Agenzia Web Development - Soluzioni Digitali Innovative',
            template: '%s | Almastack'
        },
        description: 'Almastack è un\'agenzia di sviluppo web specializzata in soluzioni Full Stack, AI Integration, E-commerce e UI/UX Design.',
        keywords: ['sviluppo web', 'web agency', 'full stack development', 'react', 'node.js', 'javascript', 'e-commerce', 'AI integration', 'UI/UX design', 'milano', 'italia', 'sviluppo app', 'siti web professionali'],
        authors: [{ name: 'Almastack', url: 'https://almastack.it' }],
        creator: 'Almastack',
        publisher: 'Almastack',

        // Canonical & Alternates
        metadataBase: new URL('https://almastack.it'),
        alternates: {
            canonical: '/',
            languages: {
                'it-IT': '/?lang=it',
                'en-US': '/?lang=en',
            },
        },

        // Open Graph
        openGraph: {
            type: 'website',
            locale: 'it_IT',
            alternateLocale: 'en_US',
            url: 'https://almastack.it',
            siteName: 'Almastack',
            title: 'Almastack | Agenzia Web Development - Soluzioni Digitali Innovative',
            description: 'Trasformiamo le tue idee in realtà digitali. Sviluppo Full Stack, AI Integration, E-commerce e UI/UX Design professionale.',
            images: [
                {
                    url: '/header-v2-min.webp',
                    width: 1200,
                    height: 630,
                    alt: 'Almastack - Web Development Agency',
                },
                {
                    url: '/header-v2-min.webp',
                    width: 600,
                    height: 600,
                    alt: 'Almastack Logo',
                }
            ],
        },

        // Twitter Card
        twitter: {
            card: 'summary_large_image',
            title: 'Almastack | Agenzia Web Development',
            description: 'Trasformiamo le tue idee in realtà digitali. Sviluppo Full Stack, AI Integration, E-commerce professionale.',
            site: '@almastack',
            creator: '@almastack',
            images: ['/header-v2-min.webp'],
        },

        // Robots & Verification
        robots: {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: false,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },

        // App Metadata
        applicationName: 'Almastack',
        referrer: 'origin-when-cross-origin',
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },

        // Additional metadata
        category: 'technology',
        classification: 'Web Development Agency',

        // Icons & Manifest
        manifest: '/site.webmanifest',

        // Apple Web App
        appleWebApp: {
            capable: true,
            statusBarStyle: 'default',
            title: 'Almastack',
        },

        // Icons
        icons: {
            icon: [
                { url: '/icon.svg' },
                { url: '/icon.svg', sizes: '16x16', type: 'image/svg+xml' },
                { url: '/icon.svg', sizes: '32x32', type: 'image/svg+xml' },
                { url: '/icon.svg', sizes: '192x192', type: 'image/svg+xml' },
                { url: '/icon.svg', sizes: '512x512', type: 'image/svg+xml' },
            ],
            apple: [
                { url: '/icon.svg' },
                { url: '/icon.svg', sizes: '180x180' },
            ],
            other: [
                {
                    rel: 'mask-icon',
                    url: '/icon.svg',
                    color: '#667eea',
                },
            ],
        },

        // Other metadata
        other: {
            'msapplication-TileColor': '#667eea',
            'msapplication-config': '/browserconfig.xml',
            'apple-mobile-web-app-capable': 'yes',
            'mobile-web-app-capable': 'yes',
        },
    },
    en: {
        // Meta Tags Base
        title: {
            default: 'Almastack | Web Development Agency - Innovative Digital Solutions',
            template: '%s | Almastack'
        },
        description: 'Almastack is a web development agency specialized in Full Stack solutions, AI Integration, E-commerce and UI/UX Design.',
        keywords: ['web development', 'web agency', 'full stack development', 'react', 'node.js', 'javascript', 'e-commerce', 'AI integration', 'UI/UX design', 'milan', 'italy', 'app development', 'professional websites'],
        authors: [{ name: 'Almastack', url: 'https://almastack.it' }],
        creator: 'Almastack',
        publisher: 'Almastack',

        // Canonical & Alternates
        metadataBase: new URL('https://almastack.it'),
        alternates: {
            canonical: '/',
            languages: {
                'it-IT': '/?lang=it',
                'en-US': '/?lang=en',
            },
        },

        // Open Graph
        openGraph: {
            type: 'website',
            locale: 'en_US',
            alternateLocale: 'it_IT',
            url: 'https://almastack.it',
            siteName: 'Almastack',
            title: 'Almastack | Web Development Agency - Innovative Digital Solutions',
            description: 'We transform your ideas into digital realities. Full Stack Development, AI Integration, E-commerce and professional UI/UX Design.',
            images: [
                {
                    url: '/header-v2-min.webp',
                    width: 1200,
                    height: 630,
                    alt: 'Almastack - Web Development Agency',
                },
                {
                    url: '/header-v2-min.webp',
                    width: 600,
                    height: 600,
                    alt: 'Almastack Logo',
                }
            ],
        },

        // Twitter Card
        twitter: {
            card: 'summary_large_image',
            title: 'Almastack | Web Development Agency',
            description: 'We transform your ideas into digital realities. Full Stack Development, AI Integration, professional E-commerce.',
            site: '@almastack',
            creator: '@almastack',
            images: ['/header-v2-min.webp'],
        },

        // Robots & Verification
        robots: {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: false,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },

        // App Metadata
        applicationName: 'Almastack',
        referrer: 'origin-when-cross-origin',
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },

        // Additional metadata
        category: 'technology',
        classification: 'Web Development Agency',

        // Icons & Manifest
        manifest: '/site.webmanifest',

        // Apple Web App
        appleWebApp: {
            capable: true,
            statusBarStyle: 'default',
            title: 'Almastack',
        },

        // Icons
        icons: {
            icon: [
                { url: '/icon.svg' },
                { url: '/icon.svg', sizes: '16x16', type: 'image/svg+xml' },
                { url: '/icon.svg', sizes: '32x32', type: 'image/svg+xml' },
                { url: '/icon.svg', sizes: '192x192', type: 'image/svg+xml' },
                { url: '/icon.svg', sizes: '512x512', type: 'image/svg+xml' },
            ],
            apple: [
                { url: '/icon.svg' },
                { url: '/icon.svg', sizes: '180x180' },
            ],
            other: [
                {
                    rel: 'mask-icon',
                    url: '/icon.svg',
                    color: '#667eea',
                },
            ],
        },

        // Other metadata
        other: {
            'msapplication-TileColor': '#667eea',
            'msapplication-config': '/browserconfig.xml',
            'apple-mobile-web-app-capable': 'yes',
            'mobile-web-app-capable': 'yes',
        },
    },
};

// JSON-LD Structured Data
export const jsonLdOrganization = {
    it: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Almastack',
        alternateName: 'Almastack Web Agency',
        url: 'https://almastack.it',
        logo: 'https://almastack.it/logo.png',
        sameAs: [
            'https://www.linkedin.com/company/almastack',
            'https://www.facebook.com/almastack',
            'https://twitter.com/almastack',
            'https://www.instagram.com/almastack',
            'https://github.com/almastack'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+393883986292',
            contactType: 'customer service',
            email: 'info@almastack.it',
            areaServed: ['IT', 'EU'],
            availableLanguage: ['Italian', 'English']
        },
        description: 'Almastack è un\'agenzia di sviluppo web specializzata in soluzioni Full Stack, AI Integration, E-commerce e UI/UX Design.',
        foundingDate: '2025',
        founders: [
            {
                '@type': 'Person',
                name: 'Alessandro D\'Antoni'
            },
            {
                '@type': 'Person',
                name: 'Manfredi Mauro Marrone'
            }
        ],
        numberOfEmployees: {
            '@type': 'QuantitativeValue',
            minValue: 10,
            maxValue: 50
        },
        priceRange: '€€',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '47'
        }
    },
    en: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Almastack',
        alternateName: 'Almastack Web Agency',
        url: 'https://almastack.it/?lang=en',
        logo: 'https://almastack.it/logo.png?lang=en',
        sameAs: [
            'https://www.linkedin.com/company/almastack',
            'https://www.facebook.com/almastack',
            'https://twitter.com/almastack',
            'https://www.instagram.com/almastack',
            'https://github.com/almastack'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+393883986292',
            contactType: 'customer service',
            email: 'info@almastack.it',
            areaServed: ['IT', 'EU'],
            availableLanguage: ['Italian', 'English']
        },
        description: 'Almastack is a web development agency specialized in Full Stack solutions, AI Integration, E-commerce and UI/UX Design.',
        foundingDate: '2025',
        founders: [
            {
                '@type': 'Person',
                name: 'Alessandro D\'Antoni'
            },
            {
                '@type': 'Person',
                name: 'Manfredi Mauro Marrone'
            }
        ],
        numberOfEmployees: {
            '@type': 'QuantitativeValue',
            minValue: 10,
            maxValue: 50
        },
        priceRange: '€€',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '47'
        }
    }
};

export const jsonLdWebSite = {
    it: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: 'https://almastack.it',
        name: 'Almastack',
        description: 'Agenzia di sviluppo web specializzata in soluzioni digitali innovative',
    },
    en: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: 'https://almastack.it/?lang=en',
        name: 'Almastack',
        description: 'Almastack is a web development agency specialized in innovative digital solutions',
    }
};

export const jsonLdService = {
    it : {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Web Development',
        provider: {
            '@type': 'Organization',
            name: 'Almastack'
        },
        areaServed: {
            '@type': 'Country',
            name: 'Italy'
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Web Development Services',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Full Stack Development',
                        description: 'Sviluppo completo di applicazioni web scalabili'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Sviluppo Server',
                        description: 'Sviluppo di applicazioni e API lato server'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Sviluppo Landing Page',
                        description: 'Sviluppo di landing page per campagne di marketing'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Sviluppo Website',
                        description: 'Sviluppo di siti web per vari scopi'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Sviluppo WordPress',
                        description: 'Sviluppo di siti web e plugin WordPress'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Sviluppo E-Commerce',
                        description: 'Piattaforme e-commerce personalizzate'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'AI Integration',
                        description: 'Integrazione di intelligenza artificiale'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Consulenza',
                        description: 'Servizi di consulenza per diverse esigenze aziendali'
                    }
                }
            ]
        }
    },
    en: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Web Development',
        provider: {
            '@type': 'Organization',
            name: 'Almastack'
        },
        areaServed: {
            '@type': 'Country',
            name: 'Italy'
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Web Development Services',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Full Stack Development',
                        description: 'Complete development of scalable web applications'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Server Development',
                        description: 'Development of server-side applications and APIs'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Landing Page Development',
                        description: 'Development of landing pages for marketing campaigns'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Website Development',
                        description: 'Development of websites for various purposes'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'WordPress Development',
                        description: 'Development of WordPress websites and plugins'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'E-Commerce Development',
                        description: 'Custom e-commerce platforms'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'AI Integration',
                        description: 'Artificial intelligence integration'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Consultancy',
                        description: 'Consultancy services for various business needs'
                    }
                }
            ]
        }
    }
};