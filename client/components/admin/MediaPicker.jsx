// components/admin/MediaPicker.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    X,
    Search,
    Upload,
    Check,
    Grid,
    List,
    Image,
    Plus
} from 'lucide-react';

export default function MediaPicker({ isOpen, onClose, onSelect, multiple = false }) {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadMedia();
        }
    }, [isOpen]);

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
                const res = await fetch('/api/admin/media', {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {
                    const data = await res.json();
                    newFiles.push(data);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }

        if (newFiles.length > 0) {
            setMediaFiles(prev => [...newFiles, ...prev]);
        }

        setIsUploading(false);
    };

    const toggleSelect = (file) => {
        if (multiple) {
            setSelectedFiles(prev => {
                const isSelected = prev.some(f => f.id === file.id);
                if (isSelected) {
                    return prev.filter(f => f.id !== file.id);
                } else {
                    return [...prev, file];
                }
            });
        } else {
            setSelectedFiles([file]);
        }
    };

    const handleConfirm = () => {
        if (selectedFiles.length > 0) {
            onSelect(multiple ? selectedFiles : selectedFiles[0]);
            onClose();
            setSelectedFiles([]);
        }
    };

    const filteredMedia = mediaFiles.filter(file =>
        file.original_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (file.alt_text && file.alt_text.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-5xl h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Seleziona Media</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cerca file..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm w-64"
                                />
                            </div>

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

                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Upload Area */}
                <div
                    className={`mx-4 mt-4 border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        dragActive
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-700'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Trascina qui i file o{' '}
                        <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                            seleziona dal computer
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleFiles(e.target.files)}
                                className="hidden"
                            />
                        </label>
                    </p>
                    {isUploading && (
                        <p className="text-sm text-blue-500 mt-2">Caricamento in corso...</p>
                    )}
                </div>

                {/* Media Grid/List */}
                <div className="flex-1 overflow-auto p-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                            {filteredMedia.map((file) => {
                                const isSelected = selectedFiles.some(f => f.id === file.id);
                                return (
                                    <div
                                        key={file.id}
                                        onClick={() => toggleSelect(file)}
                                        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                            isSelected
                                                ? 'border-blue-500 shadow-lg'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                                        }`}
                                    >
                                        <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                                            <Image
                                                src={file.url}
                                                alt={file.alt_text || file.original_name}
                                                className="w-full h-full object-cover"
                                                width={400}
                                                height={400}
                                            />
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredMedia.map((file) => {
                                const isSelected = selectedFiles.some(f => f.id === file.id);
                                return (
                                    <div
                                        key={file.id}
                                        onClick={() => toggleSelect(file)}
                                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                                            isSelected
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-500'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                                        }`}
                                    >
                                        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            <Image
                                                src={file.url}
                                                alt={file.alt_text || file.original_name}
                                                className="w-full h-full object-cover"
                                                width={400}
                                                height={400}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{file.original_name}</p>
                                            <p className="text-xs text-gray-500">
                                                {file.width}x{file.height} • {Math.round(file.size / 1024)}KB
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <Check className="w-5 h-5 text-blue-500" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {filteredMedia.length === 0 && (
                        <div className="text-center py-12">
                            <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500">Nessun media trovato</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            {selectedFiles.length} file selezionati
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={selectedFiles.length === 0}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg"
                            >
                                Seleziona
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}