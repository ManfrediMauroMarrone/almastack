'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    LayoutDashboard, 
    FileText, 
    Image, 
    Tag,
    FolderOpen,
    Users,
    TrendingUp,
    Clock,
    Eye,
    Edit,
    Trash2,
    Plus,
    Search,
    Filter,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Settings,
    BarChart3,
    Calendar,
    Hash,
    ImageIcon,
    PenTool
} from 'lucide-react';

export default function ModernAdminDashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [stats, setStats] = useState({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalViews: 0,
        categories: 0,
        tags: 0,
        media: 0,
        authors: 2
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');

    const POSTS_PER_PAGE = 10;

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/admin/auth/check');
            if (res.ok) {
                setIsAuthenticated(true);
                await loadDashboardData();
            } else {
                router.push('/admin/login');
            }
        } catch (error) {
            router.push('/admin/login');
        } finally {
            setIsLoading(false);
        }
    };

    const loadDashboardData = async () => {
        try {
            // Load posts
            const postsRes = await fetch('/api/admin/posts');
            const postsData = await postsRes.json();
            setPosts(postsData);

            // Calculate stats from posts
            setStats({
                totalPosts: postsData.length,
                publishedPosts: postsData.filter(p => !p.draft).length,
                draftPosts: postsData.filter(p => p.draft).length,
                totalViews: 0,
                categories: new Set(postsData.map(p => p.category)).size,
                tags: new Set(postsData.flatMap(p => p.tags)).size,
                media: 0,
                authors: 2
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const deletePost = async (slug) => {
        if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return;

        try {
            const res = await fetch(`/api/admin/posts/${slug}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setPosts(posts.filter(p => p.slug !== slug));
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    // Filter and paginate posts
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || 
                            (filterStatus === 'published' && !post.draft) ||
                            (filterStatus === 'draft' && post.draft);
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-gray-500">Caricamento dashboard...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
        { id: 'posts', label: 'Articoli', icon: FileText, href: '/admin/posts' },
        { id: 'media', label: 'Media', icon: ImageIcon, href: '/admin/media' },
        { id: 'categories', label: 'Categorie', icon: FolderOpen, href: '/admin/categories' },
        { id: 'tags', label: 'Tags', icon: Tag, href: '/admin/tags' },
        { id: 'authors', label: 'Autori', icon: Users, href: '/admin/authors' },
        { id: 'settings', label: 'Impostazioni', icon: Settings, href: '/admin/settings' },
    ];

    const statCards = [
        { 
            label: 'Articoli Totali', 
            value: stats.totalPosts, 
            icon: FileText, 
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            textColor: 'text-blue-600 dark:text-blue-400',
            change: '+12%' 
        },
        { 
            label: 'Pubblicati', 
            value: stats.publishedPosts, 
            icon: Eye, 
            color: 'bg-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            textColor: 'text-green-600 dark:text-green-400',
            change: '+8%' 
        },
        { 
            label: 'Bozze', 
            value: stats.draftPosts, 
            icon: PenTool, 
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            textColor: 'text-yellow-600 dark:text-yellow-400',
            change: '0%' 
        },
        { 
            label: 'Media', 
            value: stats.media, 
            icon: ImageIcon, 
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            textColor: 'text-purple-600 dark:text-purple-400',
            change: '+24%' 
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
            {/* Sidebar */}
            <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                Almastack Admin
                            </h2>
                        )}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {sidebarItems.map(item => {
                            const Icon = item.icon;
                            return (
                                <li key={item.id}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                            activeSection === item.id 
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}
                                        onClick={() => setActiveSection(item.id)}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        {!sidebarCollapsed && <span>{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!sidebarCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                                Online
                            </span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/blog"
                                target="_blank"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                Visualizza Blog
                            </Link>
                            
                            <Link
                                href="/admin/posts/new"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Nuovo Articolo
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                                            <Icon className={`w-6 h-6 ${stat.textColor}`} />
                                        </div>
                                        <span className={`text-sm font-medium ${
                                            stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-500'
                                        }`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Recent Posts Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Articoli Recenti
                                </h2>

                                <div className="flex items-center gap-3">
                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Cerca articoli..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Filter */}
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="all">Tutti</option>
                                        <option value="published">Pubblicati</option>
                                        <option value="draft">Bozze</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Posts Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Titolo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Autore
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Categoria
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stato
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Data
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Azioni
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {paginatedPosts.map((post) => (
                                        <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {post.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {post.slug}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-gray-300">
                                                    {post.author}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    post.draft 
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                                                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                }`}>
                                                    {post.draft ? 'Bozza' : 'Pubblicato'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(post.date).toLocaleDateString('it-IT')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        target="_blank"
                                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/posts/${post.slug}`}
                                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => deletePost(post.slug)}
                                                        className="text-gray-400 hover:text-red-600 transition-colors"
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Mostrando {((currentPage - 1) * POSTS_PER_PAGE) + 1} - {Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)} di {filteredPosts.length} risultati
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`px-3 py-1 rounded-lg transition-colors ${
                                                    currentPage === i + 1
                                                        ? 'bg-blue-500 text-white'
                                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(currentPage + 1)}
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
                </main>
            </div>
        </div>
    );
}