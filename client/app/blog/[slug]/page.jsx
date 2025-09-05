import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts, getAdjacentPosts } from '../../../lib/mdx';
import BlogLayout from '../../../components/blog/BlogLayout';
import PostHeader from '../../../components/blog/PostHeader';
import PostContent from '../../../components/blog/PostContent';
import ShareButtons from '../../../components/blog/ShareButtons';
import TableOfContents from '../../../components/blog/TableOfContents';
import PostNavigation from '../../../components/blog/PostNavigation';
import RelatedPosts from '../../../components/blog/RelatedPosts';

import '../../../styles/global.css';
import '../../../styles/prism-theme.css';
import Image from 'next/image';
import StickySidebar from '../../../components/blog/StickySidebar';

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }) {
    params = await params;

    try {
        const post = await getPostBySlug(params.slug);

        return {
            title: `${post.title} - AlmaStack Blog`,
            description: post.excerpt,
            authors: [{ name: post.author }],
            openGraph: {
                title: post.title,
                description: post.excerpt,
                type: 'article',
                publishedTime: post.date,
                authors: [post.author],
                url: `https://almastack.it/blog/${post.slug}`,
                images: post.coverImage ? [
                    {
                        url: post.coverImage,
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    }
                ] : [],
                siteName: 'AlmaStack',
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.excerpt,
                images: post.coverImage ? [post.coverImage] : [],
                creator: '@almastack',
            },
            alternates: {
                canonical: `https://almastack.it/blog/${post.slug}`,
            },
            keywords: post.tags.join(', '),
        };
    } catch (error) {
        return {
            title: 'Post Not Found - AlmaStack Blog',
            description: 'The requested blog post could not be found.',
        };
    }
}

export default async function PostPage({ params }) {
    params = await params;

    let post;

    try {
        post = await getPostBySlug(params.slug);
    } catch (error) {
        notFound();
    }

    const { previous, next } = await getAdjacentPosts(params.slug);

    const allPosts = await getAllPosts();
    const relatedPosts = allPosts
        .filter((p) =>
            p.slug !== post.slug &&
            (p.category === post.category ||
                p.tags.some((tag) => post.tags.includes(tag)))
        )
        .slice(0, 3);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        author: {
            '@type': 'Person',
            name: post.author,
            image: post.authorImage,
        },
        datePublished: post.date,
        dateModified: post.date,
        image: post.coverImage,
        publisher: {
            '@type': 'Organization',
            name: 'AlmaStack',
            logo: {
                '@type': 'ImageObject',
                url: 'https://almastack.it/logo.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://almastack.it/blog/${post.slug}`,
        },
        keywords: post.tags.join(', '),
        articleSection: post.category,
        wordCount: post.content.split(/\s+/).length,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <BlogLayout>
                <article className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8">
                    {/* Three column layout with proper spacing */}
                    <div className="grid grid-cols-12 gap-8">

                        {/* Left Sidebar - Share Buttons (Desktop) */}
                        <aside className="hidden lg:block col-span-1">
                            <StickySidebar
                                offsetTop={128}
                                scrollThreshold={0}
                                className="transition-all duration-200"
                            >
                                <ShareButtons
                                    url={`https://almastack.it/blog/${post.slug}`}
                                    title={post.title}
                                />
                            </StickySidebar>
                        </aside>

                        {/* Main Content - Centered with proper spacing */}
                        <main className="col-span-12 lg:col-span-8 xl:col-span-7">
                            {/* Post Header */}
                            <PostHeader
                                title={post.title}
                                date={post.date}
                                author={post.author}
                                authorImage={post.authorImage}
                                category={post.category}
                                tags={post.tags}
                                readingTime={post.readingTime}
                                coverImage={post.coverImage}
                            />

                            {/* Share Buttons (Mobile) */}
                            <div className="lg:hidden mb-8">
                                <ShareButtons
                                    url={`https://almastack.it/blog/${post.slug}`}
                                    title={post.title}
                                    direction="horizontal"
                                />
                            </div>

                            {/* Post Content with proper prose styling */}
                            <div className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                prose-p:text-gray-700 dark:prose-p:text-gray-300
                prose-a:text-blue-600 dark:prose-a:text-blue-400
                prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                prose-code:text-blue-600 dark:prose-code:text-blue-400
                prose-pre:bg-gray-900 prose-pre:text-gray-100">
                                <PostContent code={post.code} />
                            </div>

                            {/* Post Footer */}
                            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {post.tags.map((tag) => (
                                        <a
                                            key={tag}
                                            href={`/blog?tag=${encodeURIComponent(tag)}`}
                                            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            #{tag}
                                        </a>
                                    ))}
                                </div>

                                {/* Author Bio */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-8">
                                    <div className="flex items-start space-x-4">
                                        {post.authorImage && (
                                            <Image
                                                src={post.authorImage}
                                                alt={post.author}
                                                width={800}
                                                height={600}
                                                className="w-16 h-16 rounded-full"
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {post.author}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                                                Full-stack developer e technical writer appassionato di tecnologie web e.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Navigation */}
                                <PostNavigation previous={previous} next={next} />
                            </div>
                        </main>

                        {/* Right Sidebar - Table of Contents (Desktop) */}
                        <aside className="hidden xl:block col-span-3 lg:col-span-3">
                            <StickySidebar 
                                offsetTop={128} 
                                scrollThreshold={0}
                                className="transition-all duration-200"
                            >
                                <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                                        Sommario
                                    </h3>
                                    <TableOfContents items={post.toc} />
                                </div>
                            </StickySidebar>
                        </aside>
                    </div>

                    {/* Related Posts - Full Width */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-700">
                            <RelatedPosts posts={relatedPosts} />
                        </div>
                    )}
                </article>
            </BlogLayout>
        </>
    );
}