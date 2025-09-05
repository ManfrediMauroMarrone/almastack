'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PostsList({ limit = 5 }) {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const res = await fetch('/api/admin/posts');
            if (res.ok) {
                const data = await res.json();
                setPosts(data.slice(0, limit));
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Caricamento...</div>;
    }

    return (
        <div className="space-y-3">
            {posts.map((post) => (
                <Link
                    key={post.slug}
                    href={`/admin/posts/${post.slug}`}
                    className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                                {post.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {post.author} • {new Date(post.date).toLocaleDateString('it-IT')}
                            </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${post.draft
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            }`}>
                            {post.draft ? 'Bozza' : 'Pubblicato'}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}