'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';

export default function ModernSearchBar({ initialValue = '' }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);

    const debouncedSearch = useCallback(
        debounce((searchQuery) => {
            const params = new URLSearchParams(searchParams.toString());

            if (searchQuery) {
                params.set('search', searchQuery);
                params.delete('page');
            } else {
                params.delete('search');
            }

            router.push(`/blog?${params.toString()}`);
        }, 300),
        [router, searchParams]
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    return (
        <div className="relative max-w-2xl mx-auto">
            <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75"></div>

                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Cerca articoli, categorie, tags..."
                        className="w-full px-6 py-4 pl-14 pr-6 text-gray-900 dark:text-white bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-gray-400"
                    />

                    {/* Search icon with animation */}
                    <div className="absolute left-5 top-1/2 -translate-y-1/2">
                        <svg
                            className={`w-6 h-6 transition-all duration-300 ${isFocused ? 'text-blue-500 scale-110' : 'text-gray-400'
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    {/* Clear button */}
                    {query && (
                        <button
                            onClick={() => {
                                setQuery('');
                                debouncedSearch('');
                            }}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Search suggestions (optional) */}
            {isFocused && query.length > 0 && (
                <div className="absolute top-full mt-2 w-full p-2 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-50">
                    <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
                        Premi Enter per cercare "{query}"
                    </p>
                </div>
            )}
        </div>
    );
}