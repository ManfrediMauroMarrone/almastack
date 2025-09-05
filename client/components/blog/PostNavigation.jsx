import Link from 'next/link';

export default function PostNavigation({ previous, next }) {
    if (!previous && !next) return null;

    return (
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previous ? (
                <Link
                    href={`/blog/${previous.slug}`}
                    className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">← Precedente</p>
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {previous.title}
                    </p>
                </Link>
            ) : (
                <div />
            )}

            {next && (
                <Link
                    href={`/blog/${next.slug}`}
                    className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-right"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Successivo →</p>
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {next.title}
                    </p>
                </Link>
            )}
        </nav>
    );
}