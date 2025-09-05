// components/admin/PostPreview.jsx
'use client';

import { useMemo } from 'react';
import { Calendar, Clock, User, Tag, FolderOpen } from 'lucide-react';

// Simple markdown to HTML converter for preview
const renderMarkdown = (content) => {
    if (!content) return '';
    
    let html = content;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-5">$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*\*(.*)\*\*\*/gim, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:text-blue-700 underline">$1</a>');
    
    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="rounded-lg shadow-lg my-6 w-full" />');
    
    // Code blocks
    html = html.replace(/```([^`]+)```/gim, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">$1</code>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-600 dark:text-gray-400">$1</blockquote>');
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>');
    
    // Wrap consecutive list items in ul/ol tags
    html = html.replace(/(<li class="ml-6 list-disc">.*<\/li>\n?)+/gim, (match) => {
        return `<ul class="my-4 space-y-2">${match}</ul>`;
    });
    html = html.replace(/(<li class="ml-6 list-decimal">.*<\/li>\n?)+/gim, (match) => {
        return `<ol class="my-4 space-y-2">${match}</ol>`;
    });
    
    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr class="my-8 border-gray-300 dark:border-gray-700" />');
    
    // Line breaks and paragraphs
    html = html.split('\n\n').map(paragraph => {
        if (paragraph.trim() && 
            !paragraph.startsWith('<h') && 
            !paragraph.startsWith('<ul') && 
            !paragraph.startsWith('<ol') && 
            !paragraph.startsWith('<blockquote') && 
            !paragraph.startsWith('<pre') &&
            !paragraph.startsWith('<img') &&
            !paragraph.startsWith('<hr')) {
            return `<p class="mb-4 leading-relaxed">${paragraph}</p>`;
        }
        return paragraph;
    }).join('\n');
    
    // Custom MDX Components
    // Note component
    html = html.replace(/<Note type="([^"]+)">([\s\S]*?)<\/Note>/gim, (match, type, content) => {
        const styles = {
            info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-900 dark:text-blue-100',
            warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-900 dark:text-yellow-100',
            danger: 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-100',
            success: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-900 dark:text-green-100',
            tip: 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-900 dark:text-purple-100'
        };
        return `<div class="my-6 p-4 rounded-lg border-l-4 ${styles[type] || styles.info}">${content}</div>`;
    });
    
    // VideoEmbed component
    html = html.replace(/<VideoEmbed src="([^"]+)"[^>]*\/>/gim, (match, src) => {
        const videoId = src.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        if (videoId) {
            return `<div class="my-6 aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe src="https://www.youtube.com/embed/${videoId}" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
            </div>`;
        }
        return '';
    });
    
    return html;
};

export default function PostPreview({ post }) {
    const renderedContent = useMemo(() => renderMarkdown(post.content), [post.content]);
    
    const readingTime = useMemo(() => {
        const wordsPerMinute = 200;
        const wordCount = post.content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min`;
    }, [post.content]);
    
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl">
            {/* Header */}
            <div className="p-8 border-b border-gray-200 dark:border-gray-800">
                {/* Category Badge */}
                {post.category && (
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                            <FolderOpen className="w-3 h-3" />
                            {post.category}
                        </span>
                    </div>
                )}
                
                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {post.title || 'Titolo Articolo'}
                </h1>
                
                {/* Excerpt */}
                {post.excerpt && (
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                        {post.excerpt}
                    </p>
                )}
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        {post.authorImage && (
                            <img 
                                src={post.authorImage} 
                                alt={post.author}
                                className="w-8 h-8 rounded-full"
                            />
                        )}
                        <span className="font-medium">{post.author || 'Autore'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString('it-IT', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{readingTime} di lettura</span>
                    </div>
                </div>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map(tag => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                            >
                                <Tag className="w-3 h-3" />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Cover Image */}
            {post.coverImage && (
                <div className="px-8 pt-8">
                    <img 
                        src={post.coverImage} 
                        alt={post.title}
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>
            )}
            
            {/* Content */}
            <div className="p-8">
                <div 
                    className="prose prose-lg dark:prose-invert max-w-none
                        prose-headings:font-bold prose-headings:tracking-tight
                        prose-p:text-gray-700 dark:prose-p:text-gray-300
                        prose-a:text-blue-600 dark:prose-a:text-blue-400
                        prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                        prose-code:text-blue-600 dark:prose-code:text-blue-400
                        prose-pre:bg-gray-900 prose-pre:text-gray-100"
                    dangerouslySetInnerHTML={{ __html: renderedContent }}
                />
            </div>
            
            {/* Footer */}
            <div className="p-8 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    <div>
                        {post.draft ? (
                            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">
                                Bozza
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                                Pubblicato
                            </span>
                        )}
                        
                        {post.featured && (
                            <span className="ml-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium">
                                ⭐ In Evidenza
                            </span>
                        )}
                    </div>
                    
                    <p className="text-sm text-gray-500">
                        Preview generata in tempo reale
                    </p>
                </div>
            </div>
        </div>
    );
}