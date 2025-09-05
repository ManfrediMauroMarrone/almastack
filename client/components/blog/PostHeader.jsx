import Image from "next/image";

export default function PostHeader({
    title,
    date,
    author,
    authorImage,
    category,
    tags,
    readingTime,
    coverImage,
}) {
    return (
        <header className="mb-12">
            {/* Cover Image with proper container */}
            {coverImage && (
                <div className="relative mb-10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="relative aspect-[21/9]">
                        <Image
                            src={coverImage}
                            alt={title}
                            className="absolute inset-0 w-full h-full object-cover"
                            width={800}
                            height={600}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="max-w-4xl">
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg backdrop-blur-sm">
                                        {category}
                                    </span>
                                    <span className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-white/20 backdrop-blur-sm rounded-full">
                                        {readingTime}
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-2xl">
                                    {title}
                                </h1>

                                <div className="flex items-center gap-4">
                                    {authorImage ? (
                                        <Image
                                            src={authorImage}
                                            alt={author}
                                            className="w-12 h-12 rounded-full ring-4 ring-white/20 shadow-xl"
                                            width={800}
                                            height={600}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg ring-4 ring-white/20 shadow-xl">
                                            {author.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="text-white">
                                        <p className="font-semibold text-lg">{author}</p>
                                        <time className="text-white/80">
                                            {new Date(date).toLocaleDateString('it-IT', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* No cover image header */}
            {!coverImage && (
                <div className="space-y-6 py-8">
                    <div className="flex justify-center gap-3">
                        <span className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                            {category}
                        </span>
                        <span className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full">
                            {readingTime}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {title}
                    </h1>

                    <div className="flex items-center justify-center gap-4">
                        {authorImage ? (
                            <Image
                                src={authorImage}
                                alt={author}
                                className="w-12 h-12 rounded-full ring-4 ring-gray-200 dark:ring-gray-800 shadow-xl"
                                width={800}
                                height={600}
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-xl">
                                {author.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="text-left">
                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{author}</p>
                            <time className="text-gray-600 dark:text-gray-400">
                                {new Date(date).toLocaleDateString('it-IT', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}