'use client'

export default function RecentActivity() {
    const activities = [
        { type: 'post', action: 'pubblicato', item: 'Getting Started with Next.js', time: '2 ore fa' },
        { type: 'image', action: 'caricata', item: 'hero-banner.jpg', time: '3 ore fa' },
        { type: 'post', action: 'modificato', item: 'React Best Practices', time: '5 ore fa' },
        { type: 'comment', action: 'ricevuto', item: 'Great article!', time: '1 giorno fa' },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Attività Recente
            </h3>
            <div className="space-y-3">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            {activity.type === 'post' && '📝'}
                            {activity.type === 'image' && '🖼️'}
                            {activity.type === 'comment' && '💬'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-white">
                                <span className="font-medium">{activity.item}</span>
                                {' '}
                                <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {activity.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}