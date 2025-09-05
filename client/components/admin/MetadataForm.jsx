'use client';

import { useState } from 'react';

export default function MetadataForm({ post, onUpdate, isNew }) {
    const [tagInput, setTagInput] = useState('');

    const categories = [
        'Development',
        'Design',
        'Tutorial',
        'News',
        'Guide',
        'Opinion',
        'Case Study',
        'Annunci',
    ];

    const addTag = () => {
        if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
            onUpdate({ tags: [...post.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const removeTag = (tag) => {
        onUpdate({ tags: post.tags.filter(t => t !== tag) });
    };

    return (
        <div className="space-y-6">
            {/* Slug */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Slug (URL)
                </label>
                <div className="flex items-center gap-2">
                    <span className="text-gray-500">/blog/</span>
                    <input
                        type="text"
                        value={post.slug}
                        onChange={(e) => onUpdate({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="nome-articolo"
                    />
                </div>
            </div>

            {/* Excerpt */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Riassunto (Excerpt)
                </label>
                <textarea
                    value={post.excerpt}
                    onChange={(e) => onUpdate({ excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Breve descrizione dell'articolo..."
                />
                <p className="mt-1 text-xs text-gray-500">
                    {post.excerpt.length}/160 caratteri (ottimale per SEO)
                </p>
            </div>

            {/* Date & Author */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Data pubblicazione
                    </label>
                    <input
                        type="date"
                        value={post.date}
                        onChange={(e) => onUpdate({ date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Autore
                    </label>
                    <input
                        type="text"
                        value={post.author}
                        onChange={(e) => onUpdate({ author: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoria
                </label>
                <select
                    value={post.category}
                    onChange={(e) => onUpdate({ category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Tags */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                </label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag();
                            }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Aggiungi tag..."
                    />
                    <button
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Aggiungi
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm"
                        >
                            {tag}
                            <button
                                onClick={() => removeTag(tag)}
                                className="hover:text-red-600 dark:hover:text-red-400"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={post.draft}
                        onChange={(e) => onUpdate({ draft: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Salva come bozza
                    </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={post.featured}
                        onChange={(e) => onUpdate({ featured: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Articolo in evidenza
                    </span>
                </label>
            </div>
        </div>
    );
}