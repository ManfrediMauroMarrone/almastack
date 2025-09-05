'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Users,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    ArrowLeft,
    Mail,
    Github,
    Linkedin,
    Twitter,
    FileText,
    Calendar,
    User,
    Globe,
    Camera,
    TrendingUp
} from 'lucide-react';

export default function AuthorsManager() {
    const [authors, setAuthors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [newAuthor, setNewAuthor] = useState({
        name: '',
        bio: '',
        avatar: '',
        email: '',
        twitter: '',
        linkedin: '',
        github: ''
    });
    const [authorStats, setAuthorStats] = useState({});

    useEffect(() => {
        loadAuthors();
        loadAuthorStats();
    }, []);

    const loadAuthors = async () => {
        try {
            const res = await fetch('/api/admin/authors');
            const data = await res.json();
            setAuthors(data);
        } catch (error) {
            console.error('Error loading authors:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadAuthorStats = async () => {
        try {
            const res = await fetch('/api/admin/posts');
            const posts = await res.json();
            
            const stats = {};
            posts.forEach(post => {
                if (post.author) {
                    stats[post.author] = (stats[post.author] || 0) + 1;
                }
            });
            setAuthorStats(stats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const createAuthor = async () => {
        if (!newAuthor.name) {
            showNotification('Il nome è obbligatorio', 'error');
            return;
        }

        const slug = newAuthor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        try {
            const res = await fetch('/api/admin/authors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newAuthor, slug })
            });

            if (res.ok) {
                const author = await res.json();
                setAuthors([...authors, author]);
                setShowNewModal(false);
                setNewAuthor({
                    name: '',
                    bio: '',
                    avatar: '',
                    email: '',
                    twitter: '',
                    linkedin: '',
                    github: ''
                });
                showNotification('Autore creato con successo!', 'success');
                loadAuthorStats();
            }
        } catch (error) {
            console.error('Error creating author:', error);
            showNotification('Errore nel creare l\'autore', 'error');
        }
    };

    const updateAuthor = async (slug, updates) => {
        try {
            const res = await fetch(`/api/admin/authors/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (res.ok) {
                const updatedAuthor = await res.json();
                setAuthors(authors.map(author => 
                    author.slug === slug ? updatedAuthor : author
                ));
                setEditingAuthor(null);
                showNotification('Autore aggiornato con successo!', 'success');
            }
        } catch (error) {
            console.error('Error updating author:', error);
            showNotification('Errore nell\'aggiornare l\'autore', 'error');
        }
    };

    const deleteAuthor = async (slug) => {
        const author = authors.find(a => a.slug === slug);
        if (authorStats[author?.name] > 0) {
            showNotification('Non puoi eliminare un autore con articoli pubblicati', 'error');
            return;
        }

        if (!confirm('Sei sicuro di voler eliminare questo autore?')) return;

        try {
            const res = await fetch(`/api/admin/authors/${slug}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setAuthors(authors.filter(author => author.slug !== slug));
                showNotification('Autore eliminato con successo', 'success');
            }
        } catch (error) {
            console.error('Error deleting author:', error);
            showNotification('Errore nell\'eliminare l\'autore', 'error');
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const totalPosts = Object.values(authorStats).reduce((a, b) => a + b, 0);

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
                                Gestione Autori
                            </h1>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                                {authors.length} autori
                            </span>
                        </div>

                        <button
                            onClick={() => setShowNewModal(true)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Nuovo Autore
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {authors.length}
                        </h3>
                        <p className="text-sm text-gray-500">Autori Totali</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <FileText className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {totalPosts}
                        </h3>
                        <p className="text-sm text-gray-500">Articoli Pubblicati</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-8 h-8 text-purple-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {authors.length > 0 ? Math.round(totalPosts / authors.length) : 0}
                        </h3>
                        <p className="text-sm text-gray-500">Media Articoli/Autore</p>
                    </div>
                </div>

                {/* Authors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {authors.map((author) => (
                        <div
                            key={author.slug}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {editingAuthor === author.slug ? (
                                // Edit Mode
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Nome</label>
                                            <input
                                                type="text"
                                                value={author.name}
                                                onChange={(e) => setAuthors(authors.map(a => 
                                                    a.slug === author.slug ? { ...a, name: e.target.value } : a
                                                ))}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={author.email || ''}
                                                onChange={(e) => setAuthors(authors.map(a => 
                                                    a.slug === author.slug ? { ...a, email: e.target.value } : a
                                                ))}
                                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Avatar (filename)</label>
                                        <input
                                            type="text"
                                            value={author.avatar || ''}
                                            onChange={(e) => setAuthors(authors.map(a => 
                                                a.slug === author.slug ? { ...a, avatar: e.target.value } : a
                                            ))}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                            placeholder="es. alessandro_avatar-min.webp"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Bio</label>
                                        <textarea
                                            value={author.bio || ''}
                                            onChange={(e) => setAuthors(authors.map(a => 
                                                a.slug === author.slug ? { ...a, bio: e.target.value } : a
                                            ))}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <input
                                            type="text"
                                            value={author.twitter || ''}
                                            onChange={(e) => setAuthors(authors.map(a => 
                                                a.slug === author.slug ? { ...a, twitter: e.target.value } : a
                                            ))}
                                            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                                            placeholder="Twitter"
                                        />
                                        <input
                                            type="text"
                                            value={author.linkedin || ''}
                                            onChange={(e) => setAuthors(authors.map(a => 
                                                a.slug === author.slug ? { ...a, linkedin: e.target.value } : a
                                            ))}
                                            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                                            placeholder="LinkedIn"
                                        />
                                        <input
                                            type="text"
                                            value={author.github || ''}
                                            onChange={(e) => setAuthors(authors.map(a => 
                                                a.slug === author.slug ? { ...a, github: e.target.value } : a
                                            ))}
                                            className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                                            placeholder="GitHub"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateAuthor(author.slug, author)}
                                            className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-1"
                                        >
                                            <Save className="w-4 h-4" />
                                            Salva
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingAuthor(null);
                                                loadAuthors();
                                            }}
                                            className="px-3 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                                {author.avatar ? (
                                                    <img
                                                        src={`/images/authors/${author.avatar}`}
                                                        alt={author.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {author.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">{author.email}</p>
                                            </div>
                                        </div>

                                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                                            {authorStats[author.name] || 0} articoli
                                        </span>
                                    </div>

                                    {author.bio && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            {author.bio}
                                        </p>
                                    )}

                                    {/* Social Links */}
                                    <div className="flex items-center gap-3 mb-4">
                                        {author.twitter && (
                                            <a
                                                href={author.twitter.startsWith('http') ? author.twitter : `https://twitter.com/${author.twitter}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-blue-500"
                                            >
                                                <Twitter className="w-5 h-5" />
                                            </a>
                                        )}
                                        {author.linkedin && (
                                            <a
                                                href={author.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-blue-600"
                                            >
                                                <Linkedin className="w-5 h-5" />
                                            </a>
                                        )}
                                        {author.github && (
                                            <a
                                                href={author.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-gray-900"
                                            >
                                                <Github className="w-5 h-5" />
                                            </a>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            Aggiunto {formatDate(author.created_at)}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingAuthor(author.slug)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteAuthor(author.slug)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                disabled={authorStats[author.name] > 0}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {authors.length === 0 && (
                    <div className="text-center py-16">
                        <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            Nessun autore
                        </p>
                        <p className="text-gray-500 dark:text-gray-500">
                            Aggiungi il tuo primo autore per iniziare
                        </p>
                    </div>
                )}
            </div>

            {/* New Author Modal */}
            {showNewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg">
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                            Nuovo Autore
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    value={newAuthor.name}
                                    onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Nome Cognome"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={newAuthor.email}
                                    onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="email@esempio.it"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Avatar (filename)
                                </label>
                                <input
                                    type="text"
                                    value={newAuthor.avatar}
                                    onChange={(e) => setNewAuthor({ ...newAuthor, avatar: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="nome_avatar.jpg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    value={newAuthor.bio}
                                    onChange={(e) => setNewAuthor({ ...newAuthor, bio: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Breve biografia..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <input
                                    type="text"
                                    value={newAuthor.twitter}
                                    onChange={(e) => setNewAuthor({ ...newAuthor, twitter: e.target.value })}
                                    className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                                    placeholder="@twitter"
                                />
                                <input
                                    type="text"
                                    value={newAuthor.linkedin}
                                    onChange={(e) => setNewAuthor({ ...newAuthor, linkedin: e.target.value })}
                                    className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                                    placeholder="LinkedIn URL"
                                />
                                <input
                                    type="text"
                                    value={newAuthor.github}
                                    onChange={(e) => setNewAuthor({ ...newAuthor, github: e.target.value })}
                                    className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                                    placeholder="GitHub URL"
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={createAuthor}
                                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Crea Autore
                                </button>
                                <button
                                    onClick={() => {
                                        setShowNewModal(false);
                                        setNewAuthor({
                                            name: '',
                                            bio: '',
                                            avatar: '',
                                            email: '',
                                            twitter: '',
                                            linkedin: '',
                                            github: ''
                                        });
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