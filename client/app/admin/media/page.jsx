'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Upload,
    Image as ImageIcon,
    Trash2,
    Search,
    Grid,
    List,
    Download,
    Edit,
    Copy,
    Check,
    X,
    ArrowLeft,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    FileText,
    Calendar,
    HardDrive
} from 'lucide-react';
import Image from 'next/image';

export default function MediaManager() {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingFile, setEditingFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [copiedUrl, setCopiedUrl] = useState('');

    const ITEMS_PER_PAGE = 24;

    useEffect(() => {
        loadMedia();
    }, []);

    const loadMedia = async () => {
        try {
            const res = await fetch('/api/admin/media');
            const data = await res.json();
            setMediaFiles(data);
        } catch (error) {
            console.error('Error loading media:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    }, []);

    const handleFiles = async (files) => {
        setIsUploading(true);
        const newFiles = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);

            try {
                // Simulate upload progress
                const fileId = Date.now() + i;
                setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

                // Upload file
                const res = await fetch('/api/admin/media', {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {
                    const data = await res.json();
                    newFiles.push(data);
                    setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
                    
                    // Remove progress after animation
                    setTimeout(() => {
                        setUploadProgress(prev => {
                            const { [fileId]: _, ...rest } = prev;
                            return rest;
                        });
                    }, 1000);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                showNotification(`Errore upload ${file.name}`, 'error');
            }
        }

        if (newFiles.length > 0) {
            setMediaFiles(prev => [...newFiles, ...prev]);
            showNotification(`${newFiles.length} file caricati con successo!`, 'success');
        }

        setIsUploading(false);
    };

    const deleteMedia = async (id) => {
        if (!confirm('Sei sicuro di voler eliminare questo file?')) return;

        try {
            const res = await fetch(`/api/admin/media/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setMediaFiles(prev => prev.filter(f => f.id !== id));
                showNotification('File eliminato con successo', 'success');
                setSelectedFile(null);
            }
        } catch (error) {
            console.error('Error deleting media:', error);
            showNotification('Errore eliminazione file', 'error');
        }
    };

    const deleteSelected = async () => {
        if (!confirm(`Sei sicuro di voler eliminare ${selectedFiles.length} file?`)) return;

        for (const id of selectedFiles) {
            await deleteMedia(id);
        }
        setSelectedFiles([]);
    };

    const updateMediaAltText = async (id, altText) => {
        try {
            const res = await fetch(`/api/admin/media/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alt_text: altText })
            });

            if (res.ok) {
                setMediaFiles(prev => prev.map(f => 
                    f.id === id ? { ...f, alt_text: altText } : f
                ));
                setEditingFile(null);
                showNotification('Alt text aggiornato', 'success');
            }
        } catch (error) {
            console.error('Error updating alt text:', error);
        }
    };

    const copyUrl = (url) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(''), 2000);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-slide-up`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };

    // Filter media
    const filteredMedia = mediaFiles.filter(file =>
        file.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (file.alt_text && file.alt_text.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Paginate
    const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE);
    const paginatedMedia = filteredMedia.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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
                                Gestione Media
                            </h1>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                                {mediaFiles.length} file
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cerca file..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                />
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700' : ''}`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700' : ''}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Delete Selected */}
                            {selectedFiles.length > 0 && (
                                <button
                                    onClick={deleteSelected}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Elimina ({selectedFiles.length})
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex h-[calc(100vh-64px)]">
                {/* Main Content */}
                <div className="flex-1 p-6 overflow-auto">
                    {/* Upload Area */}
                    <div
                        className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                            dragActive
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                            Trascina qui i file o clicca per selezionare
                        </p>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFiles(e.target.files)}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors"
                        >
                            Seleziona File
                        </label>

                        {isUploading && (
                            <div className="mt-4 space-y-2">
                                {Object.entries(uploadProgress).map(([id, progress]) => (
                                    <div key={id} className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Media Grid/List */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {paginatedMedia.map((file) => (
                                <div
                                    key={file.id}
                                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                        selectedFiles.includes(file.id)
                                            ? 'border-blue-500'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                                    }`}
                                    onClick={() => setSelectedFile(file)}
                                >
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selectedFiles.includes(file.id)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            if (e.target.checked) {
                                                setSelectedFiles([...selectedFiles, file.id]);
                                            } else {
                                                setSelectedFiles(selectedFiles.filter(id => id !== file.id));
                                            }
                                        }}
                                        className="absolute top-2 left-2 z-10"
                                    />

                                    {/* Image */}
                                    <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                                        <Image
                                            src={file.url}
                                            alt={file.alt_text || file.original_name}
                                            className="w-full h-full object-cover"
                                            width={400}
                                            height={400}
                                        />
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyUrl(file.url);
                                                }}
                                                className="p-2 bg-white rounded-lg hover:bg-gray-100"
                                            >
                                                {copiedUrl === file.url ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteMedia(file.id);
                                                }}
                                                className="p-2 bg-white rounded-lg hover:bg-red-100"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* File info */}
                                    <div className="p-2 bg-white dark:bg-gray-900">
                                        <p className="text-xs truncate text-gray-700 dark:text-gray-300">
                                            {file.original_name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="w-10 px-4 py-3">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedFiles(paginatedMedia.map(f => f.id));
                                                    } else {
                                                        setSelectedFiles([]);
                                                    }
                                                }}
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Preview
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Nome File
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Alt Text
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Dimensione
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Data
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                            Azioni
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {paginatedMedia.map((file) => (
                                        <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFiles.includes(file.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedFiles([...selectedFiles, file.id]);
                                                        } else {
                                                            setSelectedFiles(selectedFiles.filter(id => id !== file.id));
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Image
                                                    src={file.url}
                                                    alt={file.alt_text || ''}
                                                    className="w-12 h-12 object-cover rounded"
                                                    width={400}
                                                    height={400}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {file.original_name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {file.width && file.height && `${file.width}x${file.height}px`}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                {editingFile === file.id ? (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            defaultValue={file.alt_text}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    updateMediaAltText(file.id, e.target.value);
                                                                }
                                                            }}
                                                            className="px-2 py-1 text-sm border rounded"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => setEditingFile(null)}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600"
                                                        onClick={() => setEditingFile(file.id)}
                                                    >
                                                        {file.alt_text || 'Clicca per aggiungere'}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {formatFileSize(file.size)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(file.created_at)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedFile(file)}
                                                        className="text-gray-400 hover:text-blue-600"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => copyUrl(file.url)}
                                                        className="text-gray-400 hover:text-blue-600"
                                                    >
                                                        {copiedUrl === file.url ? (
                                                            <Check className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteMedia(file.id)}
                                                        className="text-gray-400 hover:text-red-600"
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
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Pagina {currentPage} di {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar - File Details */}
                {selectedFile && (
                    <aside className="w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-6 overflow-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">Dettagli File</h2>
                            <button
                                onClick={() => setSelectedFile(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Preview */}
                        <div className="mb-6">
                            <Image
                                src={selectedFile.url}
                                alt={selectedFile.alt_text || selectedFile.original_name}
                                className="w-full rounded-lg"
                                width={400}
                                height={400}
                            />
                        </div>

                        {/* File Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nome File
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedFile.original_name}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    URL
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={selectedFile.url}
                                        readOnly
                                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                                    />
                                    <button
                                        onClick={() => copyUrl(selectedFile.url)}
                                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                                    >
                                        {copiedUrl === selectedFile.url ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Alt Text
                                </label>
                                <input
                                    type="text"
                                    defaultValue={selectedFile.alt_text || ''}
                                    onBlur={(e) => updateMediaAltText(selectedFile.id, e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                                    placeholder="Descrizione immagine..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        <ImageIcon className="w-4 h-4 inline mr-1" />
                                        Dimensioni
                                    </label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedFile.width} × {selectedFile.height} px
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        <HardDrive className="w-4 h-4 inline mr-1" />
                                        Dimensione
                                    </label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatFileSize(selectedFile.size)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <FileText className="w-4 h-4 inline mr-1" />
                                    Tipo File
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedFile.mime_type}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Data Caricamento
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(selectedFile.created_at).toLocaleString('it-IT')}
                                </p>
                            </div>

                            <button
                                onClick={() => deleteMedia(selectedFile.id)}
                                className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Elimina File
                            </button>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}