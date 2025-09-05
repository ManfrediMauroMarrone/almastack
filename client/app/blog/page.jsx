import { getAllPosts, getFeaturedPosts, getAllCategories, getAllTags } from '../../lib/mdx';
import BlogLayout from '../../components/blog/BlogLayout';
import PostCard from '../../components/blog/PostCard';
import SearchBar from '../../components/blog/SearchBar';
import CategoryFilter from '../../components/blog/CategoryFilter';
import TagCloud from '../../components/blog/TagCloud';
import { LetterText, MessageSquare } from 'lucide-react';

export const metadata = {
    title: 'Blog - AlmaStack',
    description: 'Articoli, guide e approfondimenti su sviluppo web, tecnologie e e best practices',
    openGraph: {
        title: 'Blog - AlmaStack',
        description: 'Articoli, guide e approfondimenti su sviluppo web, tecnologie e e best practices',
        type: 'website',
        url: 'https://almastack.it/blog',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog - AlmaStack',
        description: 'Articoli, guide e approfondimenti su sviluppo web, tecnologie e e best practices',
    },
    alternates: {
        canonical: 'https://almastack.it/blog',
        types: {
            'application/rss+xml': 'https://almastack.it/blog/feed.xml',
        },
    },
};

const POSTS_PER_PAGE = 9;

export default async function BlogPage({ searchParams }) {
    searchParams = await searchParams || {};

    let posts = await getAllPosts();
    const featuredPosts = await getFeaturedPosts();
    const categories = await getAllCategories();
    const tags = await getAllTags();

    // Apply filters
    if (searchParams.category) {
        posts = posts.filter((post) => post.category === searchParams.category);
    }

    if (searchParams.tag) {
        posts = posts.filter((post) => post.tags.includes(searchParams.tag));
    }

    if (searchParams.search) {
        const query = searchParams.search.toLowerCase();
        posts = posts.filter((post) => {
            const searchableContent = `
        ${post.title} 
        ${post.excerpt} 
        ${post.category} 
        ${post.tags.join(' ')} 
        ${post.author}
      `.toLowerCase();
            return searchableContent.includes(query);
        });
    }

    // Pagination
    const currentPage = parseInt(searchParams.page || '1');
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    const showFeatured =
        currentPage === 1 &&
        !searchParams.category &&
        !searchParams.tag &&
        !searchParams.search &&
        featuredPosts.length > 0;

    return (
        <BlogLayout>
            <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 py-20">
                {/* Hero Section with animated gradient */}
                <div className="text-center mb-16 relative">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-3xl rounded-full" />
                    </div>

                    <h1 className="text-6xl md:text-7xl font-black mb-6">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Almastack Blog
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Esplora articoli, guide e approfondimenti su sviluppo web,
                        tecnologie e e best practices del settore
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 mt-10">
                        <div className="text-center">
                            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {posts.length}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Articoli</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {categories.length}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Categorie</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                                {tags.length}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Tags</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-12">
                    <SearchBar initialValue={searchParams.search} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar with glass effect */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            {/* Categories */}
                            <div className="rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 p-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    Categorie
                                </h2>
                                <CategoryFilter
                                    categories={categories}
                                    activeCategory={searchParams.category}
                                />
                            </div>

                            {/* Tags */}
                            <div className="rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-gray-800 p-6">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                    Tags
                                </h2>
                                <TagCloud
                                    tags={tags}
                                    activeTag={searchParams.tag}
                                />
                            </div>

                            {/* Newsletter CTA */}
                            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <LetterText className="w-5 h-5" /> Newsletter
                                </h3>
                                <p className="text-sm mb-4 text-white/90">
                                    Ricevi i nostri articoli direttamente nella tua inbox
                                </p>
                                <button className="w-full py-2 px-4 bg-white/20 backdrop-blur-sm rounded-lg font-semibold hover:bg-white/30 transition-colors">
                                    Iscriviti
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {/* Active Filters */}
                        {(searchParams.category || searchParams.tag || searchParams.search) && (
                            <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-300">Filtri attivi:</span>
                                        {searchParams.category && (
                                            <span className="px-3 py-1 text-sm bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                                                📁 {searchParams.category}
                                            </span>
                                        )}
                                        {searchParams.tag && (
                                            <span className="px-3 py-1 text-sm bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full font-medium">
                                                🏷️ {searchParams.tag}
                                            </span>
                                        )}
                                        {searchParams.search && (
                                            <span className="px-3 py-1 text-sm bg-pink-500/20 text-pink-600 dark:text-pink-400 rounded-full font-medium">
                                                🔍 {searchParams.search}
                                            </span>
                                        )}
                                    </div>
                                    <a
                                        href="/blog"
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                                    >
                                        ✕ Rimuovi filtri
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Featured Post */}
                        {showFeatured && (
                            <div className="mb-12 max-w-[860px]">
                                <PostCard post={featuredPosts[0]} featured={true} />
                            </div>
                        )}

                        {/* Posts Grid with stagger animation */}
                        {paginatedPosts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 max-w-[860px]">
                                    {paginatedPosts.map((post, index) => (
                                        <div
                                            key={post.slug}
                                            className="animate-slide-up"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <PostCard post={post} />
                                        </div>
                                    ))}
                                </div>

                                {/*  Pagination */}
                                {totalPages > 1 && (
                                    <nav className="mt-16 flex justify-center">
                                        <div className="flex items-center gap-2">
                                            {currentPage > 1 && (
                                                <a
                                                    href={`/blog?page=${currentPage - 1}`}
                                                    className="px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    ←
                                                </a>
                                            )}

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <a
                                                    key={page}
                                                    href={`/blog?page=${page}`}
                                                    className={`px-4 py-2 rounded-lg transition-all ${page === currentPage
                                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg'
                                                            : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                        }`}
                                                >
                                                    {page}
                                                </a>
                                            ))}

                                            {currentPage < totalPages && (
                                                <a
                                                    href={`/blog?page=${currentPage + 1}`}
                                                    className="px-4 py-2 rounded-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    →
                                                </a>
                                            )}
                                        </div>
                                    </nav>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <div className="inline-block p-8 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    Nessun articolo trovato
                                </p>
                                <p className="text-gray-500 dark:text-gray-500">
                                    Prova a modificare i criteri di ricerca
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </BlogLayout>
    );
}