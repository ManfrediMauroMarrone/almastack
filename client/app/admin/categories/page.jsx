'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FolderOpen,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    ArrowLeft,
    Palette,
    Hash,
    FileText,
    TrendingUp,
    Calendar,
    Search,
    Filter
} from 'lucide-react';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        color: '#3B82F6',
        icon: '📁'
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryStats, setCategoryStats] = useState({});

    useEffect(() => {
        loadCategories();
        loadCategoryStats();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCategoryStats = async () => {
        try {
            const res = await fetch('/api/admin/posts');
            const posts = await res.json();
            
            const stats = {};
            posts.forEach(post => {
                if (post.category) {
                    stats[post.category] = (stats[post.category] || 0) + 1;
                }
            });
            setCategoryStats(stats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const createCategory = async () => {
        if (!newCategory.name) {
            showNotification('Il nome è obbligatorio', 'error');
            return;
        }

        const slug = newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newCategory, slug })
            });

            if (res.ok) {
                const category = await res.json();
                setCategories([...categories, category]);
                setShowNewModal(false);
                setNewCategory({ name: '', description: '', color: '#3B82F6', icon: '📁' });
                showNotification('Categoria creata con successo!', 'success');
                loadCategoryStats();
            }
        } catch (error) {
            console.error('Error creating category:', error);
            showNotification('Errore nel creare la categoria', 'error');
        }
    };

    const updateCategory = async (slug, updates) => {
        try {
            const res = await fetch(`/api/admin/categories/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (res.ok) {
                const updatedCategory = await res.json();
                setCategories(categories.map(cat => 
                    cat.slug === slug ? updatedCategory : cat
                ));
                setEditingCategory(null);
                showNotification('Categoria aggiornata con successo!', 'success');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            showNotification('Errore nell\'aggiornare la categoria', 'error');
        }
    };

    const deleteCategory = async (slug) => {
        const category = categories.find(c => c.slug === slug);
        if (categoryStats[category?.name] > 0) {
            showNotification('Non puoi eliminare una categoria con articoli', 'error');
            return;
        }

        if (!confirm('Sei sicuro di voler eliminare questa categoria?')) return;

        try {
            const res = await fetch(`/api/admin/categories/${slug}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setCategories(categories.filter(cat => cat.slug !== slug));
                showNotification('Categoria eliminata con successo', 'success');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            showNotification('Errore nell\'eliminare la categoria', 'error');
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

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const defaultIcons = ['📁', '🚀', '💻', '📱', '🎨', '📊', '🔒', '☁️', '🤖', '⚡', '🎯', '💡'];
    const defaultColors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
        '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];

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
                                Gestione Categorie
                            </h1>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                                {categories.length} categorie
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cerca categorie..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                            </div>

                            <button
                                onClick={() => setShowNewModal(true)}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Nuova Categoria
                            </button>
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
                            <FolderOpen className="w-8 h-8 text-blue-500" />
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {categories.length}
                        </h3>
                        <p className="text-sm text-gray-500">Categorie Totali</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <FileText className="w-8 h-8 text-green-500" />
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {Object.values(categoryStats).reduce((a, b) => a + b, 0)}
                        </h3>
                        <p className="text-sm text-gray-500">Articoli Totali</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Hash className="w-8 h-8 text-purple-500" />
                            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full">
                                Media
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {categories.length > 0 
                                ? Math.round(Object.values(categoryStats).reduce((a, b) => a + b, 0) / categories.length)
                                : 0
                            }
                        </h3>
                        <p className="text-sm text-gray-500">Articoli per Categoria</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Calendar className="w-8 h-8 text-yellow-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {categories.filter(c => !categoryStats[c.name]).length}
                        </h3>
                        <p className="text-sm text-gray-500">Categorie Vuote</p>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.slug}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Category Header */}
                            <div
                                className="h-2"
                                style={{ backgroundColor: category.color }}
                            />
                            
                            <div className="p-6">
                                {editingCategory === category.slug ? (
                                    // Edit Mode
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={category.name}
                                            onChange={(e) => setCategories(categories.map(c => 
                                                c.slug === category.slug ? { ...c, name: e.target.value } : c
                                            ))}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                            placeholder="Nome categoria"
                                        />
                                        
                                        <textarea
                                            value={category.description || ''}
                                            onChange={(e) => setCategories(categories.map(c => 
                                                c.slug === category.slug ? { ...c, description: e.target.value } : c
                                            ))}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                            placeholder="Descrizione"
                                            rows={2}
                                        />
                                        
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={category.icon || ''}
                                                onChange={(e) => setCategories(categories.map(c => 
                                                    c.slug === category.slug ? { ...c, icon: e.target.value } : c
                                                ))}
                                                className="w-20 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
                                                placeholder="Icon"
                                            />
                                            
                                            <input
                                                type="color"
                                                value={category.color}
                                                onChange={(e) => setCategories(categories.map(c => 
                                                    c.slug === category.slug ? { ...c, color: e.target.value } : c
                                                ))}
                                                className="w-20 h-10 rounded cursor-pointer"
                                            />
                                            
                                            <button
                                                onClick={() => updateCategory(category.slug, category)}
                                                className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-1"
                                            >
                                                <Save className="w-4 h-4" />
                                                Salva
                                            </button>
                                            
                                            <button
                                                onClick={() => {
                                                    setEditingCategory(null);
                                                    loadCategories(); // Reset changes
                                                }}
                                                className="px-3 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{category.icon || '📁'}</span>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {category.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {category.slug}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                                                {categoryStats[category.name] || 0} articoli
                                            </span>
                                        </div>

                                        {category.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                {category.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                                                    style={{ backgroundColor: category.color }}
                                                    title="Colore categoria"
                                                />
                                                <span className="text-xs text-gray-500">
                                                    {category.color}
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingCategory(category.slug)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteCategory(category.slug)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    disabled={categoryStats[category.name] > 0}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCategories.length === 0 && (
                    <div className="text-center py-16">
                        <FolderOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            Nessuna categoria trovata
                        </p>
                        <p className="text-gray-500 dark:text-gray-500">
                            Crea la tua prima categoria per organizzare i contenuti
                        </p>
                    </div>
                )}
            </div>

            {/* New Category Modal */}
            {showNewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                            Nuova Categoria
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Es. Web Development"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Descrizione
                                </label>
                                <textarea
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Breve descrizione della categoria..."
                                    rows={3}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Icona
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={newCategory.icon}
                                            onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center text-2xl"
                                        />
                                        <div className="flex flex-wrap gap-1">
                                            {defaultIcons.map(icon => (
                                                <button
                                                    key={icon}
                                                    onClick={() => setNewCategory({ ...newCategory, icon })}
                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-xl"
                                                >
                                                    {icon}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Colore
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="color"
                                            value={newCategory.color}
                                            onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                                            className="w-full h-10 rounded cursor-pointer"
                                        />
                                        <div className="grid grid-cols-5 gap-1">
                                            {defaultColors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setNewCategory({ ...newCategory, color })}
                                                    className="h-8 rounded border-2 border-gray-300 hover:border-gray-500"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={createCategory}
                                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Crea Categoria
                                </button>
                                <button
                                    onClick={() => {
                                        setShowNewModal(false);
                                        setNewCategory({ name: '', description: '', color: '#3B82F6', icon: '📁' });
                                    }}
                                    className="flex-1 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                                >
                                    Annulla
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}