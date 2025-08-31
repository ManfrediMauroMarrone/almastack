import Head from 'next/head'
import Script from 'next/script';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

import './globals.css';
import { _metadata, _viewport, jsonLdOrganization, jsonLdService, jsonLdWebSite } from '../config/meta';
import SplashScreen from '../components/SplashScreen';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({ searchParams }) {
    const lang = searchParams?.lang || 'it';
    
    return {
        ..._metadata[lang],
        alternates: {
            ..._metadata[lang].alternates,
            canonical: lang === 'en' ? '/?lang=en' : '/',
        }
    };
}

export const viewport = { ..._viewport };

export default function RootLayout({
    children,
    searchParams,
}) {

    const lang = searchParams?.lang || 'it';

    return (
        <html lang={lang}>
            <Head>
                {/* Primary Meta Tags */}
                <link rel="icon" href="/icon.svg" type="image/svg+xml" />
                <link rel="alternate icon" href="/icon.svg" />
                
                {/* Preconnect to external domains */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="//scripts.simpleanalyticscdn.com" />

                {/* DNS Prefetch */}
                <link rel="dns-prefetch" href="//fonts.googleapis.com" />
                <link rel="dns-prefetch" href="//scripts.simpleanalyticscdn.com" />

                {/* Preload */}
                <link rel="preload" fetchpriority="high" as="image" href="/hero-v2-min.webp" type="image/webp" />
                <link rel="preload" fetchpriority="high" as="image" href="/alessandro_avatar-min.webp" type="image/webp" />
                <link rel="preload" fetchpriority="high" as="image" href="/manfredi_avatar-min.webp" type="image/webp" />

                {/* JSON-LD Structured Data */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization[lang] || jsonLdOrganization["it"]) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite[lang] || jsonLdWebSite["it"]) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService[lang] || jsonLdService["it"]) }} />
            </Head>
            <body className={`${inter.className} w-screen overflow-x-hidden`}>
                <SplashScreen 
                    duration={2000}        // Durata in millisecondi
                    showOnce={true}        // Mostra solo una volta per sessione
                >
                    <Providers>{children}</Providers>
                </SplashScreen>
                <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
            </body>
        </html>
    )
}
