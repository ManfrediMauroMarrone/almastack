import fs from 'fs';
import path from 'path';

const directories = [
  'content/blog',
  'app/blog',
  'app/blog/[slug]',
  'app/api/search',
  'components/blog',
  'lib',
  'styles',
  'public/images/blog',
  'public/images/authors',
];

// Create directories
directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`⏭️  Directory already exists: ${dir}`);
  }
});

// Create a sample blog post
const samplePost = `---
title: "Benvenuto sul nostro Blog"
date: "${new Date().toISOString().split('T')[0]}"
excerpt: "Scopri il nuovo blog di AlmaStack, dove condividiamo conoscenze e best practices sullo sviluppo web moderno."
author: "Team AlmaStack"
authorImage: "/images/authors/team.jpg"
coverImage: "/images/blog/welcome-cover.jpg"
category: "Annunci"
tags: ["Blog", "AlmaStack", "Welcome"]
featured: true
draft: false
---

# Benvenuto sul Blog di AlmaStack!

Siamo entusiasti di lanciare il nostro nuovo blog, uno spazio dedicato alla condivisione di conoscenze, esperienze e best practices nel mondo dello sviluppo web moderno.

## Cosa troverai qui

Sul nostro blog pubblicheremo regolarmente:

- **Tutorial tecnici approfonditi** su Next.js, React, TypeScript e altre tecnologie moderne
- **Case study** dei nostri progetti più interessanti
- **Best practices** per lo sviluppo di applicazioni web performanti e scalabili
- **Novità dal mondo del web development** e analisi delle ultime tendenze

<Note type="info">
Iscriviti al nostro feed RSS per non perdere nessun articolo!
</Note>

## Il nostro stack tecnologico

Questo blog è costruito con le stesse tecnologie che utilizziamo nei nostri progetti:

\`\`\`javascript
const techStack = {
  framework: 'Next.js 15',
  content: 'MDX',
  styling: 'TailwindCSS',
  language: 'TypeScript',
  deployment: 'Vercel'
};
\`\`\`

## Resta connesso

Seguici per rimanere aggiornato:

- [GitHub](https://github.com/almastack)
- [LinkedIn](https://linkedin.com/company/almastack)
- [RSS Feed](/blog/feed.xml)

Buona lettura e happy coding! 🚀
`;

// Write sample post
const samplePostPath = path.join(process.cwd(), 'content/blog/welcome.mdx');
if (!fs.existsSync(samplePostPath)) {
  fs.writeFileSync(samplePostPath, samplePost);
  console.log('✅ Created sample blog post: content/blog/welcome.mdx');
} else {
  console.log('⏭️  Sample post already exists');
}

console.log('\n📝 Setup completed! Next steps:');
console.log('1. Run: npm install');
console.log('2. Update your app/layout.tsx file');
console.log('3. Import the prism theme CSS in your global styles');
console.log('4. Start creating MDX posts in content/blog/');

// app/layout.tsx - Updated main layout with blog support
export const layoutCode = `
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../styles/prism-theme.css'; // Add syntax highlighting theme

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'AlmaStack',
    template: '%s | AlmaStack'
  },
  description: 'Sviluppo web moderno con Next.js, React e TypeScript',
  keywords: ['web development', 'Next.js', 'React', 'TypeScript', 'blog'],
  authors: [{ name: 'AlmaStack Team' }],
  creator: 'AlmaStack',
  publisher: 'AlmaStack',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://almastack.it'),
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://almastack.it',
    siteName: 'AlmaStack',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AlmaStack',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@almastack',
    creator: '@almastack',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <link rel="alternate" type="application/rss+xml" title="AlmaStack Blog" href="/blog/feed.xml" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
`;

// app/globals.css - Global styles with typography support
export const globalStyles = `
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import modern prism theme */
@import './prism-modern.css';

/* Custom font import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

/* Base styles */
@layer base {
  :root {
    --gradient-blue-purple: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --gradient-purple-pink: linear-gradient(135deg, #764ba2 0%, #f093fb 100%);
    --gradient-blue-pink: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
  }

  body {
    font-family: 'Inter', sans-serif;
    @apply antialiased;
  }
}

/* Animation utilities */
@layer utilities {
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }

  /* Text gradient animation */
  @keyframes gradient-shift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
  }

  /* Slide up animation */
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-slide-up {
    opacity: 0;
    animation: slide-up 0.6s ease-out forwards;
  }

  /* Float animation for decorative elements */
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
}

/* Smooth scrollbar */
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-900;
}

::-webkit-scrollbar-thumb {
  @apply bg-gradient-to-b from-blue-500 to-purple-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply from-blue-600 to-purple-700;
}

/* Selection styles */
::selection {
  @apply bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-100;
}

/* Focus styles */
*:focus-visible {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900;
}

/* Prose customization for MDX */
.prose pre {
  @apply bg-transparent p-0 m-0;
}

.prose pre code {
  @apply text-sm;
  white-space: pre !important;
  word-break: normal !important;
  overflow-wrap: normal !important;
}

/* Code block scrolling fix */
.prose pre {
  overflow-x: auto !important;
  max-width: 100%;
}

/* Ensure code doesn't wrap */
.prose code {
  white-space: pre !important;
}

/* Glass morphism */
.glass {
  @apply bg-white/10 backdrop-blur-lg border border-white/20;
}

.dark .glass {
  @apply bg-gray-900/10 border-gray-700/20;
}

/* Gradient borders */
.gradient-border {
  position: relative;
  background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899);
  padding: 1px;
  border-radius: 1rem;
}

.gradient-border > * {
  @apply bg-white dark:bg-gray-950 rounded-2xl;
}

/* Neon glow effect */
.neon-glow {
  box-shadow: 
    0 0 20px rgba(139, 92, 246, 0.5),
    0 0 40px rgba(139, 92, 246, 0.3),
    0 0 60px rgba(139, 92, 246, 0.1);
}

/* Hover lift effect */
.hover-lift {
  @apply transition-all duration-300;
}

.hover-lift:hover {
  @apply -translate-y-1 shadow-xl;
}
`;