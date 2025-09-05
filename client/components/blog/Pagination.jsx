import Link from 'next/link';

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }) {
    const getPageUrl = (page) => {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value && key !== 'page') {
                params.set(key, value);
            }
        });
        if (page > 1) {
            params.set('page', page.toString());
        }
        const queryString = params.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    };

    const pageNumbers = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="flex items-center justify-center space-x-2">
            {/* Previous button */}
            {currentPage > 1 && (
                <Link
                    href={getPageUrl(currentPage - 1)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    ← Precedente
                </Link>
            )}

            {/* First page */}
            {startPage > 1 && (
                <>
                    <Link
                        href={getPageUrl(1)}
                        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        1
                    </Link>
                    {startPage > 2 && <span className="text-gray-500">...</span>}
                </>
            )}

            {/* Page numbers */}
            {pageNumbers.map((page) => (
                <Link
                    key={page}
                    href={getPageUrl(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                >
                    {page}
                </Link>
            ))}

            {/* Last page */}
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
                    <Link
                        href={getPageUrl(totalPages)}
                        className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        {totalPages}
                    </Link>
                </>
            )}

            {/* Next button */}
            {currentPage < totalPages && (
                <Link
                    href={getPageUrl(currentPage + 1)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    Successivo →
                </Link>
            )}
        </nav>
    );
}