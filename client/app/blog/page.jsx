import { getAllPosts, getFeaturedPosts, getAllCategories, getAllTags } from '../../lib/mdx';
import BlogLayout from '../../components/blog/BlogLayout';
import PostCard from '../../components/blog/PostCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'Blog - Almastack',
    description: 'Articoli, guide e approfondimenti su sviluppo web, tecnologie e e best practices',
    openGraph: {
        title: 'Blog - Almastack',
        description: 'Articoli, guide e approfondimenti su sviluppo web, tecnologie e e best practices',
        type: 'website',
        url: 'https://almastack.it/blog',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog - Almastack',
        description: 'Articoli, guide e approfondimenti su sviluppo web, tecnologie e e best practices',
    },
    alternates: {
        canonical: 'https://almastack.it/blog',
        types: {
            'application/rss+xml': 'https://almastack.it/blog/feed.xml',
        },
    },
};

const POSTS_PER_PAGE = 12;

export default async function BlogPage({ searchParams }) {
    searchParams = await searchParams || {};

    let posts = await getAllPosts();
    const featuredPosts = await getFeaturedPosts();
    const categories = await getAllCategories();
    const tags = await getAllTags();

    // Apply multiple filters
    const selectedCategories = searchParams.categories ? searchParams.categories.split(',') : [];
    const selectedTags = searchParams.tags ? searchParams.tags.split(',') : [];
    
    // Filter by categories (OR logic)
    if (selectedCategories.length > 0) {
        posts = posts.filter((post) => selectedCategories.includes(post.category));
    }

    // Filter by tags (OR logic)
    if (selectedTags.length > 0) {
        posts = posts.filter((post) => 
            post.tags.some(tag => selectedTags.includes(tag))
        );
    }

    // Search filter
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

    // Apply sorting
    const sortBy = searchParams.sort || 'date-desc';
    switch (sortBy) {
        case 'date-asc':
            posts.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'popular':
            // Assuming you have a views or popularity field
            posts.sort((a, b) => (b.views || 0) - (a.views || 0));
            break;
        case 'date-desc':
        default:
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
    }

    // Pagination
    const currentPage = parseInt(searchParams.page || '1');
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    const showFeatured =
        currentPage === 1 &&
        selectedCategories.length === 0 &&
        selectedTags.length === 0 &&
        !searchParams.search &&
        featuredPosts.length > 0;

    // Helper function to build URL with filters
    const buildUrl = (params) => {
        const newParams = { ...searchParams, ...params };
        // Remove empty values
        Object.keys(newParams).forEach(key => {
            if (!newParams[key] || newParams[key] === '') {
                delete newParams[key];
            }
        });
        const queryString = new URLSearchParams(newParams).toString();
        return `/blog${queryString ? `?${queryString}` : ''}`;
    };

    return (
        <BlogLayout>
            <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8 py-20">
                {/* Enhanced Hero Section */}
                <div className="relative mb-16">
                    {/* Background gradient effect */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
                        <div className="absolute -bottom-20 right-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
                    </div>

                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 transition-all duration-1000 min-h-[80px]">
                            <span className="inline-block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent min-h-[80px]">
                                Almastack Blog
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
                            Esplora articoli, guide e approfondimenti su sviluppo web e tecnologie moderne
                        </p>

                        {/* Enhanced Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <form action="/blog" method="GET" className="relative group">
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={searchParams.search}
                                    placeholder="Cerca articoli, categorie o tag..."
                                    className="w-full px-6 py-4 pl-14 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 shadow-lg focus:shadow-purple-500/25"
                                />
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                                >
                                    Cerca
                                </button>
                            </form>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap justify-center gap-6 mt-10">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-md transition-transform hover:scale-105">
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{posts.length}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Articoli</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-md transition-transform hover:scale-105">
                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{categories.length}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Categorie</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-md transition-transform hover:scale-105">
                                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">{tags.length}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">Tags</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Sort Bar */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Active Filters Display */}
                    <div className="flex flex-wrap gap-2">
                        {selectedCategories.map(cat => (
                            <span key={cat} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
                                {cat}
                                <a 
                                    href={buildUrl({ categories: selectedCategories.filter(c => c !== cat).join(',') })}
                                    className="hover:text-blue-900 dark:hover:text-blue-100"
                                >
                                    <X className="w-3 h-3" />
                                </a>
                            </span>
                        ))}
                        {selectedTags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm">
                                #{tag}
                                <a 
                                    href={buildUrl({ tags: selectedTags.filter(t => t !== tag).join(',') })}
                                    className="hover:text-purple-900 dark:hover:text-purple-100"
                                >
                                    <X className="w-3 h-3" />
                                </a>
                            </span>
                        ))}
                        {(selectedCategories.length > 0 || selectedTags.length > 0 || searchParams.search) && (
                            <Link 
                                href="/blog" 
                                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ml-2 underline"
                            >
                                Rimuovi tutti i filtri
                            </Link>
                        )}
                    </div>

                    {/* Sort Links */}
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Ordina per:</span>
                        <div className="flex gap-2">
                            <a 
                                href={buildUrl({ sort: 'date-desc', page: 1 })}
                                className={`px-3 py-1 text-sm rounded-lg transition-all ${
                                    sortBy === 'date-desc' 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                Più recenti
                            </a>
                            <a 
                                href={buildUrl({ sort: 'date-asc', page: 1 })}
                                className={`px-3 py-1 text-sm rounded-lg transition-all ${
                                    sortBy === 'date-asc' 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                Meno recenti
                            </a>
                            <a 
                                href={buildUrl({ sort: 'popular', page: 1 })}
                                className={`px-3 py-1 text-sm rounded-lg transition-all ${
                                    sortBy === 'popular' 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                                Più popolari
                            </a>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Enhanced Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Categories with multi-select */}
                            <div className="rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-xl">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    Categorie
                                </h2>
                                <div className="space-y-2">
                                    {categories.map(category => {
                                        const isActive = selectedCategories.includes(category);
                                        const newCategories = isActive 
                                            ? selectedCategories.filter(c => c !== category)
                                            : [...selectedCategories, category];
                                        
                                        return (
                                            <a
                                                key={category}
                                                href={buildUrl({ categories: newCategories.join(','), page: 1 })}
                                                className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
                                                    isActive
                                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                {category}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Tags with multi-select */}
                            <div className="rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-xl">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                    </div>
                                    Tags
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map(tag => {
                                        const isActive = selectedTags.includes(tag);
                                        const newTags = isActive 
                                            ? selectedTags.filter(t => t !== tag)
                                            : [...selectedTags, tag];
                                        
                                        return (
                                            <a
                                                key={tag}
                                                href={buildUrl({ tags: newTags.join(','), page: 1 })}
                                                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                                                    isActive
                                                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md transform scale-110'
                                                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                #{tag}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        {/* Featured Post - New horizontal layout */}
                        {showFeatured && (
                            <div className="mb-16">
                                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    In Evidenza
                                </h2>
                                <article className="group relative rounded-3xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500">
                                    <div className="grid md:grid-cols-2">
                                        {/* Image section */}
                                        <div className="relative h-64 md:h-full min-h-[350px] bg-gray-100 dark:bg-gray-800">
                                            {featuredPosts[0].coverImage ? (
                                                <Image
                                                    src={featuredPosts[0].coverImage} 
                                                    alt={featuredPosts[0].title}
                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    width={400}
                                                    height={400}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-80">
                                                    <div className="flex items-center justify-center h-full">
                                                        <svg className="w-20 h-20 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                            {/* Category badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-sm font-semibold text-purple-700 shadow-lg">
                                                    {featuredPosts[0].category}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Content section */}
                                        <div className="p-8 md:p-10 flex flex-col justify-center">
                                            <div className="mb-4 flex flex-wrap gap-2">
                                                {featuredPosts[0].tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            
                                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                                <Link href={`/blog/${featuredPosts[0].slug}`} className="hover:text-purple-600 transition-colors">
                                                    {featuredPosts[0].title}
                                                </Link>
                                            </h3>
                                            
                                            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 text-lg leading-relaxed">
                                                {featuredPosts[0].excerpt}
                                            </p>
                                            
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-medium">{featuredPosts[0].author}</span>
                                                    <span>•</span>
                                                    <span>{new Date(featuredPosts[0].date).toLocaleDateString('it-IT', { 
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}</span>
                                                    {featuredPosts[0].readingTime && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{featuredPosts[0].readingTime}</span>
                                                        </>
                                                    )}
                                                </div>
                                                
                                                <Link 
                                                    href={`/blog/${featuredPosts[0].slug}`}
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg self-start sm:self-auto"
                                                >
                                                    Leggi
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        )}

                        {/* Posts Grid - 3 columns */}
                        {paginatedPosts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {paginatedPosts.map((post, index) => (
                                        <div
                                            key={post.slug}
                                            className="transition-all duration-500 hover:transform hover:-translate-y-1"
                                        >
                                            <PostCard post={post} />
                                        </div>
                                    ))}
                                </div>

                                {/* Enhanced Pagination */}
                                {totalPages > 1 && (
                                    <nav className="mt-16">
                                        <div className="flex items-center justify-center gap-2">
                                            {/* Previous button */}
                                            {currentPage > 1 && (
                                                <a
                                                    href={buildUrl({ page: currentPage - 1 })}
                                                    className="px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
                                                >
                                                    ← Precedente
                                                </a>
                                            )}

                                            {/* Page numbers with ellipsis */}
                                            <div className="flex items-center gap-1">
                                                {(() => {
                                                    const pages = [];
                                                    const showPages = 5; // Number of page buttons to show
                                                    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                                                    let endPage = Math.min(totalPages, startPage + showPages - 1);
                                                    
                                                    if (endPage - startPage < showPages - 1) {
                                                        startPage = Math.max(1, endPage - showPages + 1);
                                                    }

                                                    // First page
                                                    if (startPage > 1) {
                                                        pages.push(
                                                            <a
                                                                key={1}
                                                                href={buildUrl({ page: 1 })}
                                                                className="w-10 h-10 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center"
                                                            >
                                                                1
                                                            </a>
                                                        );
                                                        if (startPage > 2) {
                                                            pages.push(<span key="ellipsis1" className="px-2">...</span>);
                                                        }
                                                    }

                                                    // Page range
                                                    for (let i = startPage; i <= endPage; i++) {
                                                        pages.push(
                                                            <a
                                                                key={i}
                                                                href={buildUrl({ page: i })}
                                                                className={`w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center font-medium ${
                                                                    i === currentPage
                                                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-110'
                                                                        : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                                }`}
                                                            >
                                                                {i}
                                                            </a>
                                                        );
                                                    }

                                                    // Last page
                                                    if (endPage < totalPages) {
                                                        if (endPage < totalPages - 1) {
                                                            pages.push(<span key="ellipsis2" className="px-2">...</span>);
                                                        }
                                                        pages.push(
                                                            <a
                                                                key={totalPages}
                                                                href={buildUrl({ page: totalPages })}
                                                                className="w-10 h-10 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center"
                                                            >
                                                                {totalPages}
                                                            </a>
                                                        );
                                                    }

                                                    return pages;
                                                })()}
                                            </div>

                                            {/* Next button */}
                                            {currentPage < totalPages && (
                                                <a
                                                    href={buildUrl({ page: currentPage + 1 })}
                                                    className="px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
                                                >
                                                    Successivo →
                                                </a>
                                            )}
                                        </div>
                                        
                                        {/* Page info */}
                                        <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                                            Pagina {currentPage} di {totalPages} • {posts.length} articoli totali
                                        </p>
                                    </nav>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                                    <Search className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Nessun articolo trovato
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Prova a modificare i criteri di ricerca o rimuovi alcuni filtri
                                </p>
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                                >
                                    Torna al Blog
                                </Link>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </BlogLayout>
    );
}