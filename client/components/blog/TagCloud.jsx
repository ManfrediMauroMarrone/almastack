import Link from 'next/link';

export default function TagCloud({ tags, activeTag }) {
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all duration-300 hover:scale-110 ${activeTag === tag
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20'
                        }`}
                >
                    <span className="flex items-center gap-1">
                        <span className="text-xs opacity-60">#</span>
                        {tag}
                    </span>
                </Link>
            ))}
        </div>
    );
}