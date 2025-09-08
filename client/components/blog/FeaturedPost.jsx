import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedPost({ post }) {
    return (
        <article className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 p-1">
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8">
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-semibold bg-yellow-400 text-gray-900 rounded-full">
                        ⭐ Featured
                    </span>
                </div>

                <Link href={`/blog/${post.slug}`}>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {post.coverImage && (
                            <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                    width={800}
                                    height={600}
                                />
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className="text-blue-600 dark:text-blue-400 font-medium">
                                    {post.category}
                                </span>
                                <span>•</span>
                                <time>
                                    {new Date(post.date).toLocaleDateString('it-IT', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </time>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {post.title}
                            </h2>

                            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {post.authorImage && (
                                        <Image
                                            src={post.authorImage}
                                            alt={post.author}
                                            className="w-10 h-10 rounded-full"
                                            width={40}
                                            height={40}
                                        />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {post.author}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {post.readingTime}
                                        </p>
                                    </div>
                                </div>

                                <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                                    Leggi →
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </article>
    );
}