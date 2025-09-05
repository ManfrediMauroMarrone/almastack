'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function PreviewPanel({ post }) {
    const renderedContent = useMemo(() => (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
        </ReactMarkdown>
    ), [post.content]);

    return (
        <div className="p-6">
            {/* Cover Image */}
            {post.coverImage && (
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                    layout="responsive"
                    width={500}
                    height={300}
                />
            )}

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                        {post.category}
                    </span>
                    <span>{new Date(post.date).toLocaleDateString('it-IT')}</span>
                    <span>• {post.author}</span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {post.title || 'Titolo articolo'}
                </h1>

                {post.excerpt && (
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {post.excerpt}
                    </p>
                )}
            </div>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
                {renderedContent}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}