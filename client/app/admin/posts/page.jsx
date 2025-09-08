'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FileText,
    Plus,
    Edit,
    Trash2,
    Eye,
    Search,
    Filter,
    Calendar,
    User,
    Tag,
    FolderOpen,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Star,
    Clock,
    CheckCircle,
    XCircle,
    TrendingUp,
    ArrowUpDown
} from 'lucide-react';

export default function PostsListPage() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterAuthor, setFilterAuthor] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);

    const POSTS_PER_PAGE = 15;

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        applyFiltersAndSort();
    }, [posts, searchQuery, filterStatus, filterCategory, filterAuthor, sortBy, sortOrder]);

    const loadData = async () => {
        try {
            // Load posts
            const postsRes = await fetch('/api/admin/posts');
            const postsData = await postsRes.json();
            setPosts(postsData);

            // Load categories
            const categoriesRes = await fetch('/api/admin/categories');
            const categoriesData = await categoriesRes.json();
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);

            // Load authors
            const authorsRes = await fetch('/api/admin/authors');
            const authorsData = await authorsRes.json();
            setAuthors(Array.isArray(authorsData) ? authorsData : []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFiltersAndSort = () => {
        let filtered = [...posts];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.excerpt.toLowerCase().includes(query) ||
                p.slug.toLowerCase().includes(query) ||
                p.tags.some(t => t.toLowerCase().includes(query))
            );
        }

        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(p => {
                if (filterStatus === 'published') return !p.draft;
                if (filterStatus === 'draft') return p.draft;
                if (filterStatus === 'featured') return p.featured;
                return true;
            });
        }

        // Apply category filter
        if (filterCategory !== 'all') {
            filtered = filtered.filter(p => p.category === filterCategory);
        }

        // Apply author filter
        if (filterAuthor !== 'all') {
            filtered = filtered.filter(p => p.author === filterAuthor);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'date':
                    comparison = new Date(b.date) - new Date(a.date);
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'author':
                    comparison = a.author.localeCompare(b.author);
                    break;
                case 'category':
                    comparison = (a.category || '').localeCompare(b.category || '');
                    break;
                case 'status':
                    comparison = (a.draft ? 1 : 0) - (b.draft ? 1 : 0);
                    break;
                default:
                    comparison = 0;
            }
            
            return sortOrder === 'desc' ? -comparison : comparison;
        });

        setFilteredPosts(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const deletePost = async (slug) => {
        if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return;

        try {
            const res = await fetch(`/api/admin/posts/${slug}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setPosts(posts.filter(p => p.slug !== slug));
                showNotification('Articolo eliminato con successo', 'success');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            showNotification('Errore nell\'eliminare l\'articolo', 'error');
        }
    };

    const deleteSelected = async () => {
        if (!confirm(`Sei sicuro di voler eliminare ${selectedPosts.length} articoli?`)) return;

        for (const slug of selectedPosts) {
            await deletePost(slug);
        }
        setSelectedPosts([]);
    };

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    // Pagination
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    // Stats
    const stats = {
        total: posts.length,
        published: posts.filter(p => !p.draft).length,
        drafts: posts.filter(p => p.draft).length,
        featured: posts.filter(p => p.featured).length
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin"
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Gestione Articoli
                            </h1>
                        </div>

                        <Link
                            href="/admin/posts/new"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Nuovo Articolo
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                                <p className="text-sm text-gray-500">Totali</p>
                            </div>
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                                <p className="text-sm text-gray-500">Pubblicati</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">{stats.drafts}</p>
                                <p className="text-sm text-gray-500">Bozze</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-400" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold text-purple-600">{stats.featured}</p>
                                <p className="text-sm text-gray-500">In Evidenza</p>
                            </div>
                            <Star className="w-8 h-8 text-purple-400" />
                        </div>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cerca articoli..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tutti gli stati</option>
                            <option value="published">Pubblicati</option>
                            <option value="draft">Bozze</option>
                            <option value="featured">In Evidenza</option>
                        </select>

                        {/* Category Filter */}
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tutte le categorie</option>
                            {categories.map(cat => (
                                <option key={cat.slug} value={cat.name}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>

                        {/* Author Filter */}
                        <select
                            value={filterAuthor}
                            onChange={(e) => setFilterAuthor(e.target.value)}
                            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tutti gli autori</option>
                            {authors.map(author => (
                                <option key={author.slug} value={author.name}>
                                    {author.name}
                                </option>
                            ))}
                        </select>

                        {/* Delete Selected */}
                        {selectedPosts.length > 0 && (
                            <button
                                onClick={deleteSelected}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Elimina ({selectedPosts.length})
                            </button>
                        )}
                    </div>
                </div>

                {/* Posts Table */}
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="w-12 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedPosts.length === paginatedPosts.length && paginatedPosts.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedPosts(paginatedPosts.map(p => p.slug));
                                                } else {
                                                    setSelectedPosts([]);
                                                }
                                            }}
                                            className="rounded"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() => toggleSort('title')}
                                            className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
                                        >
                                            Titolo
                                            <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() => toggleSort('author')}
                                            className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
                                        >
                                            Autore
                                            <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() => toggleSort('category')}
                                            className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
                                        >
                                            Categoria
                                            <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Tags
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() => toggleSort('status')}
                                            className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
                                        >
                                            Stato
                                            <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-left">
                                        <button
                                            onClick={() => toggleSort('date')}
                                            className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
                                        >
                                            Data
                                            <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Azioni
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {paginatedPosts.map((post) => (
                                    <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedPosts.includes(post.slug)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedPosts([...selectedPosts, post.slug]);
                                                    } else {
                                                        setSelectedPosts(selectedPosts.filter(s => s !== post.slug));
                                                    }
                                                }}
                                                className="rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {post.title}
                                                    </p>
                                                    {post.featured && (
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{post.slug}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-900 dark:text-gray-300">
                                                    {post.author}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {post.category && (
                                                <div className="flex items-center gap-2">
                                                    <FolderOpen className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                        {post.category}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {post.tags.slice(0, 3).map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {post.tags.length > 3 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{post.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                post.draft 
                                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            }`}>
                                                {post.draft ? 'Bozza' : 'Pubblicato'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(post.date).toLocaleDateString('it-IT', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Visualizza"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/posts/${post.slug}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Modifica"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => deletePost(post.slug)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Elimina"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {paginatedPosts.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">Nessun articolo trovato</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Mostrando {((currentPage - 1) * POSTS_PER_PAGE) + 1} - {Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)} di {filteredPosts.length} risultati
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex gap-1">
                                        {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = idx + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = idx + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + idx;
                                            } else {
                                                pageNum = currentPage - 2 + idx;
                                            }

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`px-3 py-1 rounded-lg transition-colors ${
                                                        currentPage === pageNum
                                                            ? 'bg-blue-500 text-white'
                                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}