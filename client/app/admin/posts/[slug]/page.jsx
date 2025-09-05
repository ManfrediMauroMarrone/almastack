'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import MarkdownEditor from '../../../../components/admin/MarkdownEditor';
import MetadataForm from '../../../../components/admin/MetadataForm';
import ImageUploader from '../../../../components/admin/ImageUploader';
import PreviewPanel from '../../../../components/admin/PreviewPanel';

export default function PostEditor() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.slug === 'new';

    const [post, setPost] = useState({
        slug: '',
        title: '',
        content: '',
        excerpt: '',
        date: new Date().toISOString().split('T')[0],
        author: 'Team AlmaStack',
        authorImage: '/images/authors/team.jpg',
        coverImage: '',
        category: 'Uncategorized',
        tags: [],
        draft: true,
        featured: false,
    });

    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [activeTab, setActiveTab] = useState('editor');
    const [hasChanges, setHasChanges] = useState(false);

    const loadPost = async (slug) => {
        try {
            const res = await fetch(`/api/admin/posts/${slug}`);
            if (res.ok) {
                const data = await res.json();
                setPost(data);
            } else {
                router.push('/admin/posts');
            }
        } catch (error) {
            console.error('Error loading post:', error);
            router.push('/admin/posts');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!post.title || !post.content) {
            alert('Titolo e contenuto sono obbligatori!');
            return;
        }

        setIsSaving(true);
        try {
            const endpoint = isNew
                ? '/api/admin/posts'
                : `/api/admin/posts/${params.slug}`;

            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(post),
            });

            if (res.ok) {
                const data = await res.json();
                setHasChanges(false);

                // Show success message
                const message = document.createElement('div');
                message.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                message.textContent = 'Articolo salvato con successo!';
                document.body.appendChild(message);
                setTimeout(() => message.remove(), 3000);

                // Redirect to the new slug if it changed
                if (isNew || post.slug !== params.slug) {
                    router.push(`/admin/posts/${data.slug}`);
                }
            } else {
                throw new Error('Failed to save post');
            }
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Errore nel salvare l\'articolo');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return;

        try {
            const res = await fetch(`/api/admin/posts/${params.slug}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.push('/admin/posts');
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Errore nell\'eliminare l\'articolo');
        }
    };

    const updatePost = useCallback((updates) => {
        setPost(prev => ({ ...prev, ...updates }));
        setHasChanges(true);
    }, []);

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    // Load existing post if editing
    useEffect(() => {
        if (!isNew && params.slug) {
            loadPost(params.slug);
        }
    }, [params.slug, isNew]);

    // Warn before leaving with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasChanges]);

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
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/admin/posts')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {isNew ? 'Nuovo Articolo' : 'Modifica Articolo'}
                            </h1>

                            {hasChanges && (
                                <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
                                    Modifiche non salvate
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Preview Toggle */}
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${showPreview
                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="hidden sm:inline">Preview</span>
                            </button>

                            {/* Status Badge */}
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${post.draft
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                }`}>
                                {post.draft ? 'Bozza' : 'Pubblicato'}
                            </div>

                            {/* Delete Button */}
                            {!isNew && (
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !hasChanges}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                        Salvataggio...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Salva
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Editor Side */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                        {/* Tabs */}
                        <div className="border-b border-gray-200 dark:border-gray-800">
                            <div className="flex">
                                <button
                                    onClick={() => setActiveTab('editor')}
                                    className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'editor'
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    Editor
                                    {activeTab === 'editor' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('metadata')}
                                    className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'metadata'
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    Metadata
                                    {activeTab === 'metadata' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('images')}
                                    className={`px-6 py-3 font-medium transition-colors relative ${activeTab === 'images'
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    Immagini
                                    {activeTab === 'images' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'editor' && (
                                <MarkdownEditor
                                    title={post.title}
                                    content={post.content}
                                    onTitleChange={(title) => {
                                        updatePost({ title });
                                        if (isNew && !post.slug) {
                                            updatePost({ slug: generateSlug(title) });
                                        }
                                    }}
                                    onContentChange={(content) => updatePost({ content })}
                                />
                            )}

                            {activeTab === 'metadata' && (
                                <MetadataForm
                                    post={post}
                                    onUpdate={updatePost}
                                    isNew={isNew}
                                />
                            )}

                            {activeTab === 'images' && (
                                <ImageUploader
                                    coverImage={post.coverImage}
                                    onCoverImageChange={(url) => updatePost({ coverImage: url })}
                                    onImageInsert={(url) => {
                                        // Insert image markdown at cursor position
                                        const newContent = post.content + `\n\n![](${url})\n`;
                                        updatePost({ content: newContent });
                                        setActiveTab('editor');
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Preview Side */}
                    {showPreview && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                            <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-3">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Live Preview</h3>
                            </div>
                            <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                                <PreviewPanel post={post} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}