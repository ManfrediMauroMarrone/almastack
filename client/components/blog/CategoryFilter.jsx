import Link from 'next/link';

export default function CategoryFilter({ categories, activeCategory }) {
    return (
        <div className="space-y-2">
            <Link
                href="/blog"
                className={`block px-4 py-3 rounded-xl transition-all duration-300 ${!activeCategory
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg transform scale-105'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:pl-6'
                    }`}
            >
                <span className="flex items-center justify-between">
                    Tutte le categorie
                    {!activeCategory && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </span>
            </Link>

            {categories.map((category) => (
                <Link
                    key={category}
                    href={`/blog?category=${encodeURIComponent(category)}`}
                    className={`block px-4 py-3 rounded-xl transition-all duration-300 ${activeCategory === category
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg transform scale-105'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:pl-6'
                        }`}
                >
                    <span className="flex items-center justify-between">
                        {category}
                        {activeCategory === category && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </span>
                </Link>
            ))}
        </div>
    );
}