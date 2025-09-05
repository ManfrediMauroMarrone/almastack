import Image from 'next/image';
import Link from 'next/link';
import PostCard from './PostCard';

export default function RelatedPosts({ posts }) {
    return (
        <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Articoli correlati
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostCard post={post} key={post.slug} featured={false} />
                ))}
            </div>
        </section>
    );
}