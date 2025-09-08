'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Tag,
    Plus,
    Trash2,
    ArrowLeft,
    Search,
    Hash,
    TrendingUp,
    Calendar,
    Edit2,
    X,
    Check
} from 'lucide-react';

export default function TagsPage() {
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [tagStats, setTagStats] = useState({});
    const [newTagName, setNewTagName] = useState('');
    const [editingTag, setEditingTag] = useState(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        loadTags();
        loadTagStats();
    }, []);

    const loadTags = async () => {
        try {
            const res = await fetch('/api/admin/tags');
            const data = await res.json();
            setTags(data);
        } catch (error) {
            console.error('Error loading tags:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadTagStats = async () => {
        try {
            const res = await fetch('/api/admin/posts');
            const posts = await res.json();
            
            const stats = {};
            posts.forEach(post => {
                post.tags?.forEach(tag => {
                    stats[tag] = (stats[tag] || 0) + 1;
                });
            });
            setTagStats(stats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const createTag = async () => {
        if (!newTagName.trim()) return;

        const slug = newTagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        try {
            const res = await fetch('/api/admin/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newTagName, slug })
            });

            if (res.ok) {
                await loadTags();
                setNewTagName('');
                showNotification('Tag creato con successo!', 'success');
            }
        } catch (error) {
            console.error('Error creating tag:', error);
            showNotification('Errore nel creare il tag', 'error');
        }
    };

    const deleteTag = async (slug) => {
        const tag = tags.find(t => t.slug === slug);
        if (tagStats[tag?.name] > 0) {
            showNotification('Non puoi eliminare un tag utilizzato', 'error');
            return;
        }

        if (!confirm('Sei sicuro di voler eliminare questo tag?')) return;

        try {
            const res = await fetch(`/api/admin/tags/${slug}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setTags(tags.filter(tag => tag.slug !== slug));
                showNotification('Tag eliminato con successo', 'success');
            }
        } catch (error) {
            console.error('Error deleting tag:', error);
            showNotification('Errore nell\'eliminare il tag', 'error');
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

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort tags by usage
    const sortedTags = [...filteredTags].sort((a, b) => 
        (tagStats[b.name] || 0) - (tagStats[a.name] || 0)
    );

    // Get tag size class based on usage
    const getTagSizeClass = (count) => {
        if (count >= 10) return 'text-2xl font-bold';
        if (count >= 5) return 'text-xl font-semibold';
        if (count >= 2) return 'text-lg font-medium';
        return 'text-base';
    };

    // Get tag color based on usage
    const getTagColorClass = (count) => {
        if (count >= 10) return 'text-blue-600 dark:text-blue-400';
        if (count >= 5) return 'text-purple-600 dark:text-purple-400';
        if (count >= 2) return 'text-green-600 dark:text-green-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    // Calculate stats
    const totalTags = tags.length;
    const totalUsage = Object.values(tagStats).reduce((a, b) => a + b, 0);
    const averageUsage = totalTags > 0 ? Math.round(totalUsage / totalTags) : 0;
    const unusedTags = tags.filter(t => !tagStats[t.name]).length;
    const popularTags = Object.entries(tagStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

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
                                Gestione Tags
                            </h1>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                                {tags.length} tags
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cerca tags..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Tag className="w-8 h-8 text-blue-500" />
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {totalTags}
                        </h3>
                        <p className="text-sm text-gray-500">Tags Totali</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Hash className="w-8 h-8 text-green-500" />
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                                Utilizzo
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {totalUsage}
                        </h3>
                        <p className="text-sm text-gray-500">Utilizzi Totali</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-8 h-8 text-purple-500" />
                            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full">
                                Media
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {averageUsage}
                        </h3>
                        <p className="text-sm text-gray-500">Utilizzo Medio</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Calendar className="w-8 h-8 text-yellow-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {unusedTags}
                        </h3>
                        <p className="text-sm text-gray-500">Tags Non Utilizzati</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tags Cloud */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Cloud Tags
                                </h2>
                                
                                {/* Add Tag */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nuovo tag..."
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                createTag();
                                            }
                                        }}
                                        className="px-3 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <button
                                        onClick={createTag}
                                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {sortedTags.map((tag) => {
                                    const count = tagStats[tag.name] || 0;
                                    const isEditing = editingTag === tag.slug;
                                    
                                    return (
                                        <div
                                            key={tag.slug}
                                            className={`inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group ${
                                                getTagSizeClass(count)
                                            } ${getTagColorClass(count)}`}
                                        >
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="w-24 px-2 py-0 bg-white dark:bg-gray-900 rounded text-sm outline-none"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                // Update tag logic here
                                                                setEditingTag(null);
                                                            } else if (e.key === 'Escape') {
                                                                setEditingTag(null);
                                                            }
                                                        }}
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => setEditingTag(null)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{tag.name}</span>
                                                    {count > 0 && (
                                                        <span className="text-xs bg-white/20 dark:bg-black/20 px-2 py-0.5 rounded-full">
                                                            {count}
                                                        </span>
                                                    )}
                                                    <div className="hidden group-hover:flex items-center gap-1">
                                                        <button
                                                            onClick={() => {
                                                                setEditingTag(tag.slug);
                                                                setEditValue(tag.name);
                                                            }}
                                                            className="text-gray-400 hover:text-blue-600"
                                                        >
                                                            <Edit2 className="w-3 h-3" />
                                                        </button>
                                                        {count === 0 && (
                                                            <button
                                                                onClick={() => deleteTag(tag.slug)}
                                                                className="text-gray-400 hover:text-red-600"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredTags.length === 0 && (
                                <div className="text-center py-12">
                                    <Tag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-500">Nessun tag trovato</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Popular Tags */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Tags Popolari
                            </h2>

                            <div className="space-y-3">
                                {popularTags.map(([tagName, count], index) => (
                                    <div key={tagName} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {tagName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">
                                                {count} articoli
                                            </span>
                                            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                                    style={{ width: `${(count / Math.max(...popularTags.map(([,c]) => c))) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {popularTags.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        Nessun tag utilizzato ancora
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Unused Tags */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Tags Non Utilizzati
                            </h2>

                            <div className="space-y-2">
                                {tags.filter(t => !tagStats[t.name]).slice(0, 10).map(tag => (
                                    <div key={tag.slug} className="flex items-center justify-between py-1">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {tag.name}
                                        </span>
                                        <button
                                            onClick={() => deleteTag(tag.slug)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}

                                {unusedTags === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        Tutti i tags sono utilizzati! 🎉
                                    </p>
                                )}

                                {unusedTags > 10 && (
                                    <p className="text-xs text-gray-500 text-center pt-2">
                                        ...e altri {unusedTags - 10} tags
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}