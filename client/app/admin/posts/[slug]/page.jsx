'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MediaPicker from '../../../../components/admin/MediaPicker';
import PostPreview from '../../../../components/admin/PostPreview';
import NextImage from 'next/image';
import {
    Bold,
    Italic,
    Underline,
    Code,
    List,
    ListOrdered,
    Link2,
    Image,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    Table,
    Minus,
    AlertCircle,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Lightbulb,
    Youtube,
    Eye,
    Save,
    ArrowLeft,
    Upload,
    Calendar,
    User,
    Tag,
    FolderOpen,
    FileText,
    Settings,
    Trash2,
    Plus,
    X,
    ChevronDown
} from 'lucide-react';

// MDX Component Templates
const MDX_COMPONENTS = {
    note: {
        info: '<Note type="info">\n  Your content here\n</Note>',
        warning: '<Note type="warning">\n  Your content here\n</Note>',
        danger: '<Note type="danger">\n  Your content here\n</Note>',
        success: '<Note type="success">\n  Your content here\n</Note>',
        tip: '<Note type="tip">\n  Your content here\n</Note>'
    },
    video: '<VideoEmbed src="https://youtube.com/watch?v=VIDEO_ID" title="Video Title" />',
    codeBlock: '```javascript\n// Your code here\n```',
    table: '| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |',
    quote: '> Your quote here\n> — Author',
    image: '![Alt text](/images/blog/your-image.jpg)'
};

export default function AdvancedPostEditor() {
    const params = useParams();
    const router = useRouter();
    const isNew = params?.slug === 'new';

    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaTarget, setMediaTarget] = useState('content');
    const [post, setPost] = useState({
        slug: '',
        title: '',
        content: '',
        excerpt: '',
        date: new Date().toISOString().split('T')[0],
        author: 'Alessandro D\'Antoni',
        authorImage: '/images/authors/alessandro_avatar-min.webp',
        coverImage: '',
        category: '',
        tags: [],
        draft: true,
        featured: false
    });

    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', color: '#3B82F6', icon: '📁' });
    const [selectedText, setSelectedText] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);

    const contentRef = useRef(null);

    // Load initial data
    useEffect(() => {
        loadInitialData();
        if (!isNew && params?.slug) {
            loadPost(params.slug);
        }
    }, [isNew, params?.slug]);

    const loadInitialData = async () => {
        try {
            // Load authors
            const authorsRes = await fetch('/api/admin/authors');
            const authorsData = await authorsRes.json();
            setAuthors(authorsData);

            // Load categories
            const categoriesRes = await fetch('/api/admin/categories');
            const categoriesData = await categoriesRes.json();
            setCategories(categoriesData);

            // Load tags
            const tagsRes = await fetch('/api/admin/tags');
            const tagsData = await tagsRes.json();
            setAllTags(tagsData);
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    };

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
                showNotification('Articolo salvato con successo!', 'success');

                if (isNew || post.slug !== params.slug) {
                    router.push(`/admin/posts/${data.slug}`);
                }
            } else {
                throw new Error('Failed to save post');
            }
        } catch (error) {
            console.error('Error saving post:', error);
            showNotification('Errore nel salvare l\'articolo', 'error');
        } finally {
            setIsSaving(false);
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

    const handleAuthorChange = (authorSlug) => {
        const author = authors.find(a => a.slug === authorSlug);
        if (author) {
            updatePost({
                author: author.name,
                authorImage: `/images/authors/${author.avatar}`
            });
        }
    };

    const insertAtCursor = (text) => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = post.content.substring(0, start);
        const after = post.content.substring(end);

        const newContent = before + text + after;
        updatePost({ content: newContent });

        // Reset cursor position after React re-render
        setTimeout(() => {
            textarea.selectionStart = start + text.length;
            textarea.selectionEnd = start + text.length;
            textarea.focus();
        }, 0);
    };

    const wrapSelection = (before, after) => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = post.content.substring(start, end);
        const beforeText = post.content.substring(0, start);
        const afterText = post.content.substring(end);

        const newContent = beforeText + before + selectedText + after + afterText;
        updatePost({ content: newContent });

        // Reset selection after React re-render
        setTimeout(() => {
            textarea.selectionStart = start + before.length;
            textarea.selectionEnd = start + before.length + selectedText.length;
            textarea.focus();
        }, 0);
    };

    const addTag = (tagName) => {
        const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (!post.tags.includes(tagName)) {
            updatePost({ tags: [...post.tags, tagName] });
        }
        setTagInput('');
        setShowTagSuggestions(false);
    };

    const removeTag = (tagToRemove) => {
        updatePost({ tags: post.tags.filter(tag => tag !== tagToRemove) });
    };

    const createNewCategory = async () => {
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
                updatePost({ category: category.name });
                setShowNewCategoryModal(false);
                setNewCategory({ name: '', color: '#3B82F6', icon: '📁' });
                showNotification('Categoria creata con successo!', 'success');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            showNotification('Errore nel creare la categoria', 'error');
        }
    };

    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    const toolbarButtons = [
        { icon: Bold, action: () => wrapSelection('**', '**'), title: 'Grassetto' },
        { icon: Italic, action: () => wrapSelection('*', '*'), title: 'Corsivo' },
        { icon: Underline, action: () => wrapSelection('<u>', '</u>'), title: 'Sottolineato' },
        { icon: Code, action: () => wrapSelection('`', '`'), title: 'Codice inline' },
        { type: 'separator' },
        { icon: Heading1, action: () => insertAtCursor('\n# '), title: 'Heading 1' },
        { icon: Heading2, action: () => insertAtCursor('\n## '), title: 'Heading 2' },
        { icon: Heading3, action: () => insertAtCursor('\n### '), title: 'Heading 3' },
        { type: 'separator' },
        { icon: List, action: () => insertAtCursor('\n- '), title: 'Lista' },
        { icon: ListOrdered, action: () => insertAtCursor('\n1. '), title: 'Lista numerata' },
        { icon: Quote, action: () => insertAtCursor('\n> '), title: 'Citazione' },
        { icon: Minus, action: () => insertAtCursor('\n---\n'), title: 'Separatore' },
        { type: 'separator' },
        { icon: Link2, action: () => wrapSelection('[', '](https://)'), title: 'Link' },
        { icon: Image, action: () => { setMediaTarget('content'); setShowMediaPicker(true); }, title: 'Immagine' },
        { icon: Table, action: () => insertAtCursor(MDX_COMPONENTS.table), title: 'Tabella' },
        { icon: Youtube, action: () => insertAtCursor(MDX_COMPONENTS.video), title: 'Video' },
    ];

    const noteButtons = [
        { type: 'info', icon: AlertCircle, color: 'text-blue-500' },
        { type: 'success', icon: CheckCircle, color: 'text-green-500' },
        { type: 'warning', icon: AlertTriangle, color: 'text-yellow-500' },
        { type: 'danger', icon: XCircle, color: 'text-red-500' },
        { type: 'tip', icon: Lightbulb, color: 'text-purple-500' }
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
                                href="/admin/posts"
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
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
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${showPreview
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <Eye className="w-4 h-4" />
                                Preview
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={isSaving || !hasChanges}
                                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Salvataggio...' : 'Salva'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-[1600px] mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Editor Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <input
                                type="text"
                                placeholder="Titolo dell'articolo..."
                                value={post.title}
                                onChange={(e) => {
                                    updatePost({ title: e.target.value });
                                    if (isNew) {
                                        updatePost({ slug: generateSlug(e.target.value) });
                                    }
                                }}
                                className="w-full text-3xl font-bold bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
                            />
                        </div>

                        {/* Excerpt */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Excerpt (breve descrizione)
                            </label>
                            <textarea
                                placeholder="Una breve descrizione dell'articolo..."
                                value={post.excerpt}
                                onChange={(e) => updatePost({ excerpt: e.target.value })}
                                rows={2}
                                className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Content Editor */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                            {/* Toolbar */}
                            <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {toolbarButtons.map((btn, index) => {
                                        if (btn.type === 'separator') {
                                            return <div key={index} className="w-px h-6 bg-gray-300 dark:bg-gray-700" />;
                                        }
                                        const Icon = btn.icon;
                                        return (
                                            <button
                                                key={index}
                                                onClick={btn.action}
                                                title={btn.title}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                            >
                                                <Icon className="w-4 h-4" />
                                            </button>
                                        );
                                    })}

                                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />

                                    {/* Note Components Dropdown */}
                                    <div className="relative group">
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" />
                                            <ChevronDown className="w-3 h-3" />
                                        </button>
                                        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                            {noteButtons.map((note) => {
                                                const Icon = note.icon;
                                                return (
                                                    <button
                                                        key={note.type}
                                                        onClick={() => insertAtCursor(MDX_COMPONENTS.note[note.type])}
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                                                    >
                                                        <Icon className={`w-4 h-4 ${note.color}`} />
                                                        <span className="text-sm">Note {note.type}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Textarea */}
                            <div className="p-6">
                                <textarea
                                    ref={contentRef}
                                    placeholder="Scrivi il contenuto in Markdown/MDX..."
                                    value={post.content}
                                    onChange={(e) => updatePost({ content: e.target.value })}
                                    className="w-full min-h-[500px] bg-transparent outline-none text-gray-900 dark:text-white font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Metadata */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Publishing Settings */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Impostazioni
                            </h3>

                            {/* Status */}
                            <div>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={!post.draft}
                                        onChange={(e) => updatePost({ draft: !e.target.checked })}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Pubblica articolo
                                    </span>
                                </label>
                            </div>

                            {/* Featured */}
                            <div>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={post.featured}
                                        onChange={(e) => updatePost({ featured: e.target.checked })}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Articolo in evidenza
                                    </span>
                                </label>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Data pubblicazione
                                </label>
                                <input
                                    type="date"
                                    value={post.date}
                                    onChange={(e) => updatePost({ date: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Slug URL
                                </label>
                                <input
                                    type="text"
                                    value={post.slug}
                                    onChange={(e) => updatePost({ slug: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Author */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <User className="w-4 h-4 inline mr-1" />
                                Autore
                            </label>
                            <select
                                value={authors.find(a => a.name === post.author)?.slug || ''}
                                onChange={(e) => handleAuthorChange(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {authors.map(author => (
                                    <option key={author.slug} value={author.slug}>
                                        {author.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <FolderOpen className="w-4 h-4 inline mr-1" />
                                    Categoria
                                </label>
                                <button
                                    onClick={() => setShowNewCategoryModal(true)}
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <select
                                value={post.category}
                                onChange={(e) => updatePost({ category: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleziona categoria...</option>
                                {categories.map(cat => (
                                    <option key={cat.slug} value={cat.name}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tags */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Tag className="w-4 h-4 inline mr-1" />
                                Tags
                            </label>

                            {/* Current Tags */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm flex items-center gap-1"
                                    >
                                        {tag}
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>

                            {/* Tag Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Aggiungi tag..."
                                    value={tagInput}
                                    onChange={(e) => {
                                        setTagInput(e.target.value);
                                        setShowTagSuggestions(e.target.value.length > 0);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && tagInput) {
                                            e.preventDefault();
                                            addTag(tagInput);
                                        }
                                    }}
                                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {/* Tag Suggestions */}
                                {showTagSuggestions && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-40 overflow-y-auto">
                                        {allTags
                                            .filter(tag =>
                                                tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
                                                !post.tags.includes(tag.name)
                                            )
                                            .slice(0, 5)
                                            .map(tag => (
                                                <button
                                                    key={tag.slug}
                                                    onClick={() => addTag(tag.name)}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                                                >
                                                    {tag.name}
                                                </button>
                                            ))}
                                        <button
                                            onClick={() => addTag(tagInput)}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-blue-600"
                                        >
                                            <Plus className="w-3 h-3 inline mr-1" />
                                            Crea &quot;{tagInput}&quot;
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Image className="w-4 h-4 inline mr-1" />
                                Immagine di copertina
                            </label>
                            {
                                post.coverImage && (
                                    <div>
                                        <NextImage src={post.coverImage} width={800} height={400} alt="Cover" className="w-full h-40 object-cover rounded-lg mb-2" />
                                    </div>
                                )
                            }
                            <input
                                type="text"
                                placeholder="/images/blog/cover.jpg"
                                value={post.coverImage}
                                onChange={(e) => updatePost({ coverImage: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            />
                            <button
                                onClick={() => {
                                    setMediaTarget('cover');
                                    setShowMediaPicker(true);
                                }}
                                className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
                            >
                                <Upload className="w-4 h-4 inline mr-1" />
                                Seleziona dai Media
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Category Modal */}
            {showNewCategoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Nuova Categoria</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Nome</label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Colore</label>
                                <input
                                    type="color"
                                    value={newCategory.color}
                                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                                    className="w-full h-10"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Icona</label>
                                <input
                                    type="text"
                                    value={newCategory.icon}
                                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-2 outline-none"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={createNewCategory}
                                    className="flex-1 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                    Crea
                                </button>
                                <button
                                    onClick={() => setShowNewCategoryModal(false)}
                                    className="flex-1 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
                                >
                                    Annulla
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-auto">
                    <div className="min-h-screen py-8 px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                                    <h3 className="text-lg font-semibold">Preview Articolo</h3>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Preview Content */}
                                <PostPreview post={post} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <MediaPicker
                isOpen={showMediaPicker}
                onClose={() => setShowMediaPicker(false)}
                onSelect={(file) => {
                    if (mediaTarget === 'cover') {
                        updatePost({ coverImage: file.url });
                    } else {
                        insertAtCursor(`![${file.alt_text || file.original_name}](${file.url})`);
                    }
                    setShowMediaPicker(false);
                }}
                multiple={false}
            />
        </div>
    );
}