import Image from 'next/image';
import Link from 'next/link';

export default function PostCard({ post, featured = false }) {
    return (
        <article className={`group relative ${featured ? 'col-span-full' : ''}`}>
            <Link href={`/blog/${post.slug}`} className="block">
                {/* Gradient border effect */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[1px] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    <div className="relative h-full w-full rounded-2xl bg-white dark:bg-gray-950 p-6 transition-all duration-300 group-hover:bg-opacity-90 dark:group-hover:bg-opacity-90">
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
                        </div>

                        {/* Cover Image */}
                        {post.coverImage && (
                            <div className="relative -mx-6 -mt-6 mb-6 aspect-[16/9] overflow-hidden">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    width={800}
                                    height={600}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60" />

                                {/* Category badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                                        {post.category}
                                    </span>
                                </div>

                                {/* Featured badge */}
                                {post.featured && (
                                    <div className="absolute top-4 right-4">
                                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
                                            ⭐ Featured
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div className="relative space-y-4">
                            {/* Date and reading time */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <time className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {new Date(post.date).toLocaleDateString('it-IT', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </time>
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {post.readingTime}
                                </span>
                            </div>

                            {/* Title with gradient on hover */}
                            <h2 className={`font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent ${featured ? 'text-3xl' : 'text-xl'
                                } line-clamp-1`}>
                                {post.title}
                            </h2>

                            {/* Excerpt */}
                            <p className={`text-gray-600 dark:text-gray-300 ${featured ? 'line-clamp-3' : 'line-clamp-2'
                                }`}>
                                {post.excerpt}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Author and CTA */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    {post.authorImage ? (
                                        <Image
                                            src={post.authorImage}
                                            alt={post.author}
                                            className="w-10 h-10 rounded-full ring-2 ring-gray-100 dark:ring-gray-800"
                                            width={800}
                                            height={600}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {post.author.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {post.author}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Author</p>
                                    </div>
                                </div>

                                {/* Read more arrow */}
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium group-hover:gap-3 transition-all">
                                    <span>Leggi</span>
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
}