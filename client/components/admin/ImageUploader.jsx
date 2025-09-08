'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ImageUploader({
    coverImage,
    onCoverImageChange,
    onImageInsert,
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleUpload = async (file) => {
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const { url } = await res.json();
                setUploadedImages(prev => [url, ...prev]);
                return url;
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Errore nel caricamento dell\'immagine');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = await handleUpload(file);
        if (url) {
            onCoverImageChange(url);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;

        const url = await handleUpload(file);
        if (url) {
            onCoverImageChange(url);
        }
    };

    return (
        <div className="space-y-6">
            {/* Cover Image */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Immagine di copertina
                </label>

                {coverImage ? (
                    <div className="relative rounded-lg overflow-hidden">
                        <Image
                            src={coverImage}
                            alt="Cover"
                            layout="fill"
                            objectFit="cover"
                            width={500}
                            height={300}
                            className="w-full h-48 object-cover"
                        />
                        <button
                            onClick={() => onCoverImageChange('')}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                    >
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>

                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Trascina un&apos;immagine qui o
                        </p>

                        <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer inline-block transition-colors">
                            Seleziona file
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </label>
                    </div>
                )}
            </div>

            {/* Image Gallery */}
            <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Galleria immagini
                </h3>

                {/* Upload button */}
                <div className="mb-4">
                    <label className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer inline-flex items-center gap-2 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Carica immagine
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) await handleUpload(file);
                            }}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Uploaded images grid */}
                <div className="grid grid-cols-3 gap-3">
                    {uploadedImages.map((url) => (
                        <div
                            key={url}
                            className="relative group rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500"
                            onClick={() => onImageInsert(url)}
                        >
                            <Image
                                src={url}
                                alt=""
                                className="w-full h-24 object-cover"
                                layout="fill"
                                objectFit="cover"
                                width={500}
                                height={300}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 text-xs">
                                    Inserisci
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {isUploading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
                    </div>
                )}
            </div>
        </div>
    );
}