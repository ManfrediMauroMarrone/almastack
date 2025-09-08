'use client'

import { useEffect, useState } from "react";

export default function QuickStats() {
    const [stats, setStats] = useState({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0,
        totalViews: 0,
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await fetch('/api/admin/posts');
            if (res.ok) {
                const posts = await res.json();
                setStats({
                    totalPosts: posts.length,
                    publishedPosts: posts.filter(p => !p.draft).length,
                    draftPosts: posts.filter(p => p.draft).length,
                    totalViews: Math.floor(Math.random() * 10000), // Mock data
                });
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const statCards = [
        { label: 'Articoli Totali', value: stats.totalPosts, color: 'blue', icon: '📝' },
        { label: 'Pubblicati', value: stats.publishedPosts, color: 'green', icon: '✅' },
        { label: 'Bozze', value: stats.draftPosts, color: 'yellow', icon: '📋' },
        { label: 'Visualizzazioni', value: stats.totalViews.toLocaleString(), color: 'purple', icon: '👀' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{stat.icon}</span>
                        <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg flex items-center justify-center`}>
                            <div className={`w-3 h-3 bg-${stat.color}-600 rounded-full`} />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                    </p>
                </div>
            ))}
        </div>
    );
}