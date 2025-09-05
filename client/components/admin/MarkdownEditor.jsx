'use client';

import { useState, useRef } from 'react';

export default function MarkdownEditor({
    title,
    content,
    onTitleChange,
    onContentChange,
}) {
    const textareaRef = useRef(null);
    const [cursorPosition, setCursorPosition] = useState(0);

    // Toolbar actions
    const insertMarkdown = (before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);

        onContentChange(newText);

        // Reset cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + before.length,
                start + before.length + selectedText.length
            );
        }, 0);
    };

    const toolbarButtons = [
        { icon: 'B', label: 'Bold', action: () => insertMarkdown('**', '**') },
        { icon: 'I', label: 'Italic', action: () => insertMarkdown('*', '*') },
        { icon: 'H1', label: 'Heading 1', action: () => insertMarkdown('# ', '') },
        { icon: 'H2', label: 'Heading 2', action: () => insertMarkdown('## ', '') },
        { icon: 'H3', label: 'Heading 3', action: () => insertMarkdown('### ', '') },
        { icon: '"', label: 'Quote', action: () => insertMarkdown('> ', '') },
        { icon: '•', label: 'List', action: () => insertMarkdown('- ', '') },
        { icon: '1.', label: 'Numbered List', action: () => insertMarkdown('1. ', '') },
        { icon: '{}', label: 'Code', action: () => insertMarkdown('`', '`') },
        { icon: '[]', label: 'Code Block', action: () => insertMarkdown('```\n', '\n```') },
        { icon: '🔗', label: 'Link', action: () => insertMarkdown('[', '](url)') },
        { icon: '📷', label: 'Image', action: () => insertMarkdown('![alt text](', ')') },
        { icon: '—', label: 'Divider', action: () => insertMarkdown('\n---\n', '') },
        { icon: '📦', label: 'Note', action: () => insertMarkdown('<Note type="info">\n', '\n</Note>') },
    ];

    return (
        <div className="space-y-4">
            {/* Title Input */}
            <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Titolo dell'articolo..."
                className="w-full px-4 py-3 text-2xl font-bold bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-400"
            />

            {/* Markdown Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {toolbarButtons.map((button) => (
                    <button
                        key={button.label}
                        onClick={button.action}
                        title={button.label}
                        className="px-3 py-2 text-sm font-mono hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-gray-700 dark:text-gray-300"
                    >
                        {button.icon}
                    </button>
                ))}
            </div>

            {/* Content Textarea */}
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => {
                        onContentChange(e.target.value);
                        setCursorPosition(e.target.selectionStart);
                    }}
                    onKeyDown={(e) => {
                        // Tab key inserts spaces
                        if (e.key === 'Tab') {
                            e.preventDefault();
                            insertMarkdown('  ', '');
                        }
                    }}
                    placeholder="Scrivi il contenuto in Markdown..."
                    className="w-full min-h-[500px] p-4 font-mono text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400"
                    style={{ tabSize: 2 }}
                />

                {/* Character/Word count */}
                <div className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none">
                    {content.length} caratteri • {content.split(/\s+/).filter(w => w).length} parole
                </div>
            </div>

            {/* Markdown Cheatsheet */}
            <details className="text-sm text-gray-600 dark:text-gray-400">
                <summary className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
                    Markdown Cheatsheet
                </summary>
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-1 font-mono text-xs">
                    <div># H1 | ## H2 | ### H3</div>
                    <div>**bold** | *italic* | `code`</div>
                    <div>[link](url) | ![image](url)</div>
                    <div>&gt; blockquote | - list | 1. numbered</div>
                    <div>```language code block ```</div>
                    <div>&lt;Note type="info|warning|danger|success"&gt;content&lt;/Note&gt;</div>
                </div>
            </details>
        </div>
    );
}
