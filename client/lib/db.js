// lib/db-mongodb.js
import { mongoManager } from './mongodb';
import { 
    Post, 
    Author, 
    Category, 
    Tag, 
    Media, 
    Analytics,
    Subscriber,
    Comment 
} from './schemas';

/**
 * Ensure database connection before operations
 */
async function ensureConnection() {
    if (!mongoManager.isReady()) {
        await mongoManager.connect();
    }
}

/**
 * Posts operations
 */
export const posts = {
    /**
     * Get all posts
     */
    getAll: async () => {
        await ensureConnection();
        return Post.find()
            .sort({ date: -1, createdAt: -1 })
            .lean()
            .exec();
    },

    /**
     * Get published posts only
     */
    getPublished: async () => {
        await ensureConnection();
        return Post.find({ draft: false })
            .sort({ date: -1, createdAt: -1 })
            .lean()
            .exec();
    },

    /**
     * Get post by slug
     */
    getBySlug: async (slug) => {
        await ensureConnection();
        return Post.findOne({ slug })
            .lean()
            .exec();
    },

    /**
     * Create new post
     */
    create: async (postData) => {
        await ensureConnection();
        
        // Prepare data
        const data = {
            ...postData,
            slug: postData.slug || postData.title?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, ''),
            date: postData.date || new Date(),
            draft: postData.draft !== undefined ? postData.draft : true,
            featured: postData.featured || false,
            views: 0
        };

        // Create post
        const post = new Post(data);
        await post.save();

        // Update category and tags statistics
        if (data.category) {
            await Category.findOneAndUpdate(
                { slug: data.category.toLowerCase() },
                { $inc: { postCount: 1 } }
            );
        }

        if (data.tags && data.tags.length > 0) {
            await Tag.updateMany(
                { slug: { $in: data.tags.map(t => t.toLowerCase()) } },
                { $inc: { postCount: 1 } }
            );
        }

        return post.toObject();
    },

    /**
     * Update post
     */
    update: async (slug, updates) => {
        await ensureConnection();
        
        // Get original post for comparison
        const originalPost = await Post.findOne({ slug }).lean();
        if (!originalPost) {
            throw new Error(`Post not found: ${slug}`);
        }

        // Handle category change
        if (updates.category && updates.category !== originalPost.category) {
            // Decrement old category
            if (originalPost.category) {
                await Category.findOneAndUpdate(
                    { slug: originalPost.category.toLowerCase() },
                    { $inc: { postCount: -1 } }
                );
            }
            // Increment new category
            await Category.findOneAndUpdate(
                { slug: updates.category.toLowerCase() },
                { $inc: { postCount: 1 } }
            );
        }

        // Handle tags change
        if (updates.tags) {
            const oldTags = originalPost.tags || [];
            const newTags = updates.tags || [];
            
            // Find removed tags
            const removedTags = oldTags.filter(t => !newTags.includes(t));
            if (removedTags.length > 0) {
                await Tag.updateMany(
                    { slug: { $in: removedTags.map(t => t.toLowerCase()) } },
                    { $inc: { postCount: -1 } }
                );
            }
            
            // Find added tags
            const addedTags = newTags.filter(t => !oldTags.includes(t));
            if (addedTags.length > 0) {
                await Tag.updateMany(
                    { slug: { $in: addedTags.map(t => t.toLowerCase()) } },
                    { $inc: { postCount: 1 } }
                );
            }
        }

        // Update the post
        const updatedPost = await Post.findOneAndUpdate(
            { slug },
            { 
                $set: updates,
            },
            { new: true, lean: true }
        );

        return updatedPost;
    },

    /**
     * Delete post
     */
    delete: async (slug) => {
        await ensureConnection();
        
        // Get post for cleanup
        const post = await Post.findOne({ slug }).lean();
        if (!post) {
            throw new Error(`Post not found: ${slug}`);
        }

        // Update category statistics
        if (post.category) {
            await Category.findOneAndUpdate(
                { slug: post.category.toLowerCase() },
                { $inc: { postCount: -1 } }
            );
        }

        // Update tags statistics
        if (post.tags && post.tags.length > 0) {
            await Tag.updateMany(
                { slug: { $in: post.tags.map(t => t.toLowerCase()) } },
                { $inc: { postCount: -1 } }
            );
        }

        // Delete analytics
        await Analytics.deleteMany({ postSlug: slug });

        // Delete comments
        await Comment.deleteMany({ postSlug: slug });

        // Delete the post
        await Post.deleteOne({ slug });

        return { success: true };
    },

    /**
     * Search posts
     */
    search: async (query) => {
        await ensureConnection();
        
        // Use MongoDB text search
        return Post.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .lean()
        .exec();
    },

    /**
     * Get posts by category
     */
    getByCategory: async (category) => {
        await ensureConnection();
        return Post.find({ 
            category: category.toLowerCase(), 
            draft: false 
        })
        .sort({ date: -1 })
        .lean()
        .exec();
    },

    /**
     * Get posts by tag
     */
    getByTag: async (tag) => {
        await ensureConnection();
        return Post.find({ 
            tags: tag.toLowerCase(), 
            draft: false 
        })
        .sort({ date: -1 })
        .lean()
        .exec();
    },

    /**
     * Get featured posts
     */
    getFeatured: async () => {
        await ensureConnection();
        return Post.find({ 
            featured: true, 
            draft: false 
        })
        .sort({ date: -1 })
        .lean()
        .exec();
    },

    /**
     * Increment post views
     */
    incrementViews: async (slug) => {
        await ensureConnection();
        
        // Increment views
        await Post.findOneAndUpdate(
            { slug },
            { $inc: { views: 1 } }
        );

        // Update analytics
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        await Analytics.findOneAndUpdate(
            { postSlug: slug, date: today },
            { 
                $inc: { views: 1 },
                $setOnInsert: { date: today, postSlug: slug }
            },
            { upsert: true }
        );

        return { success: true };
    },

    /**
     * Get paginated posts
     */
    getPaginated: async (page = 1, limit = 10, filter = {}) => {
        await ensureConnection();
        
        const skip = (page - 1) * limit;
        const query = { ...filter };
        
        const [posts, total] = await Promise.all([
            Post.find(query)
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),
            Post.countDocuments(query)
        ]);

        return {
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
};

/**
 * Authors operations
 */
export const authors = {
    getAll: async () => {
        await ensureConnection();
        return Author.find()
            .sort({ name: 1 })
            .lean()
            .exec();
    },

    getBySlug: async (slug) => {
        await ensureConnection();
        return Author.findOne({ slug })
            .lean()
            .exec();
    },

    create: async (authorData) => {
        await ensureConnection();
        
        const author = new Author({
            ...authorData,
            slug: authorData.slug || authorData.name?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
        });
        
        await author.save();
        return author.toObject();
    },

    update: async (slug, updates) => {
        await ensureConnection();
        return Author.findOneAndUpdate(
            { slug },
            { 
                $set: updates,
            },
            { new: true, lean: true }
        );
    },

    delete: async (slug) => {
        await ensureConnection();
        await Author.deleteOne({ slug });
        return { success: true };
    }
};

/**
 * Categories operations
 */
export const categories = {
    getAll: async () => {
        await ensureConnection();
        return Category.find()
            .sort({ order: 1, name: 1 })
            .lean()
            .exec();
    },

    getBySlug: async (slug) => {
        await ensureConnection();
        return Category.findOne({ slug })
            .lean()
            .exec();
    },

    create: async (categoryData) => {
        await ensureConnection();
        
        const category = new Category({
            ...categoryData,
            slug: categoryData.slug || categoryData.name?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
        });
        
        await category.save();
        return category.toObject();
    },

    update: async (slug, updates) => {
        await ensureConnection();
        return Category.findOneAndUpdate(
            { slug },
            { 
                $set: updates,
            },
            { new: true, lean: true }
        );
    },

    delete: async (slug) => {
        await ensureConnection();
        
        // Reset posts that use this category
        await Post.updateMany(
            { category: slug },
            { $unset: { category: 1 } }
        );
        
        await Category.deleteOne({ slug });
        return { success: true };
    },

    /**
     * Get categories with post count
     */
    getWithStats: async () => {
        await ensureConnection();
        return Category.aggregate([
            {
                $lookup: {
                    from: 'posts',
                    let: { categorySlug: '$slug' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$category', '$$categorySlug'] },
                                        { $eq: ['$draft', false] }
                                    ]
                                }
                            }
                        },
                        { $count: 'count' }
                    ],
                    as: 'postStats'
                }
            },
            {
                $addFields: {
                    postCount: {
                        $ifNull: [{ $arrayElemAt: ['$postStats.count', 0] }, 0]
                    }
                }
            },
            {
                $project: {
                    postStats: 0
                }
            },
            {
                $sort: { order: 1, name: 1 }
            }
        ]);
    }
};

/**
 * Tags operations
 */
export const tags = {
    getAll: async () => {
        await ensureConnection();
        return Tag.find()
            .sort({ name: 1 })
            .lean()
            .exec();
    },

    getBySlug: async (slug) => {
        await ensureConnection();
        return Tag.findOne({ slug })
            .lean()
            .exec();
    },

    create: async (tagData) => {
        await ensureConnection();
        
        const tag = new Tag({
            ...tagData,
            slug: tagData.slug || tagData.name?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
        });
        
        // Use upsert to avoid duplicates
        return Tag.findOneAndUpdate(
            { slug: tag.slug },
            { $setOnInsert: tag.toObject() },
            { upsert: true, new: true, lean: true }
        );
    },

    createMany: async (tagsList) => {
        await ensureConnection();
        
        const operations = tagsList.map(tag => ({
            updateOne: {
                filter: { slug: tag.slug },
                update: { $setOnInsert: tag },
                upsert: true
            }
        }));
        
        await Tag.bulkWrite(operations);
        return { success: true };
    },

    delete: async (slug) => {
        await ensureConnection();
        
        // Remove tag from all posts
        await Post.updateMany(
            { tags: slug },
            { $pull: { tags: slug } }
        );
        
        await Tag.deleteOne({ slug });
        return { success: true };
    },

    search: async (query) => {
        await ensureConnection();
        return Tag.find(
            { name: { $regex: query, $options: 'i' } }
        )
        .limit(10)
        .sort({ name: 1 })
        .lean()
        .exec();
    },

    /**
     * Get popular tags
     */
    getPopular: async (limit = 20) => {
        await ensureConnection();
        return Tag.find({ postCount: { $gt: 0 } })
            .sort({ postCount: -1, name: 1 })
            .limit(limit)
            .lean()
            .exec();
    }
};

/**
 * Media operations
 */
export const media = {
    getAll: async (limit = 50, offset = 0) => {
        await ensureConnection();
        return Media.find()
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .lean()
            .exec();
    },

    count: async (searchQuery = null) => {
        await ensureConnection();
        
        const query = searchQuery 
            ? { 
                $or: [
                    { filename: { $regex: searchQuery, $options: 'i' } },
                    { originalName: { $regex: searchQuery, $options: 'i' } },
                    { altText: { $regex: searchQuery, $options: 'i' } }
                ]
              }
            : {};
            
        return Media.countDocuments(query);
    },

    getById: async (id) => {
        await ensureConnection();
        return Media.findById(id).lean().exec();
    },

    create: async (fileData) => {
        await ensureConnection();
        
        const media = new Media(fileData);
        await media.save();
        return media.toObject();
    },

    update: async (id, updates) => {
        await ensureConnection();
        return Media.findByIdAndUpdate(
            id,
            { 
                $set: updates,
            },
            { new: true, lean: true }
        );
    },

    delete: async (id) => {
        await ensureConnection();
        const file = await Media.findByIdAndDelete(id).lean();
        return file;
    },

    deleteByFilename: async (filename) => {
        await ensureConnection();
        const file = await Media.findOneAndDelete({ filename }).lean();
        return file;
    },

    search: async (query) => {
        await ensureConnection();
        return Media.find(
            {
                $or: [
                    { originalName: { $regex: query, $options: 'i' } },
                    { altText: { $regex: query, $options: 'i' } }
                ]
            }
        )
        .sort({ createdAt: -1 })
        .limit(20)
        .lean()
        .exec();
    }
};

/**
 * Analytics operations (new)
 */
export const analytics = {
    /**
     * Get analytics for a post
     */
    getByPost: async (postSlug, startDate = null, endDate = null) => {
        await ensureConnection();
        
        const query = { postSlug };
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = startDate;
            if (endDate) query.date.$lte = endDate;
        }
        
        return Analytics.find(query)
            .sort({ date: -1 })
            .lean()
            .exec();
    },

    /**
     * Get aggregated analytics
     */
    getAggregated: async (postSlug, period = 'month') => {
        await ensureConnection();
        
        const pipeline = [
            { $match: { postSlug } },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: period !== 'year' ? { $month: '$date' } : null,
                        day: period === 'day' ? { $dayOfMonth: '$date' } : null
                    },
                    totalViews: { $sum: '$views' },
                    uniqueViews: { $sum: '$uniqueViews' },
                    likes: { $sum: '$likes' },
                    shares: { $sum: '$shares' },
                    comments: { $sum: '$comments' }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } }
        ];
        
        return Analytics.aggregate(pipeline);
    },

    /**
     * Record analytics event
     */
    recordEvent: async (postSlug, eventType, data = {}) => {
        await ensureConnection();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const update = { $inc: {} };
        
        switch (eventType) {
            case 'view':
                update.$inc.views = 1;
                if (data.unique) update.$inc.uniqueViews = 1;
                if (data.source) update.$inc[`sources.${data.source}`] = 1;
                if (data.device) update.$inc[`devices.${data.device}`] = 1;
                break;
            case 'like':
                update.$inc.likes = 1;
                break;
            case 'share':
                update.$inc.shares = 1;
                break;
            case 'comment':
                update.$inc.comments = 1;
                break;
        }
        
        return Analytics.findOneAndUpdate(
            { postSlug, date: today },
            {
                ...update,
                $setOnInsert: { date: today, postSlug }
            },
            { upsert: true, new: true }
        );
    }
};

/**
 * Database statistics
 */
export const stats = {
    /**
     * Get overall statistics
     */
    getOverview: async () => {
        await ensureConnection();
        
        const [
            totalPosts,
            publishedPosts,
            draftPosts,
            totalCategories,
            totalTags,
            totalMedia,
            totalAuthors,
            totalSubscribers,
            totalComments
        ] = await Promise.all([
            Post.countDocuments(),
            Post.countDocuments({ draft: false }),
            Post.countDocuments({ draft: true }),
            Category.countDocuments(),
            Tag.countDocuments(),
            Media.countDocuments(),
            Author.countDocuments(),
            Subscriber.countDocuments({ status: 'active' }),
            Comment.countDocuments({ status: 'approved' })
        ]);

        // Get total views
        const viewsResult = await Post.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);
        const totalViews = viewsResult[0]?.totalViews || 0;

        return {
            totalPosts,
            publishedPosts,
            draftPosts,
            totalViews,
            categories: totalCategories,
            tags: totalTags,
            media: totalMedia,
            authors: totalAuthors,
            subscribers: totalSubscribers,
            comments: totalComments
        };
    }
};

/**
 * Initialize default data
 */
export async function initializeDefaultData() {
    await ensureConnection();
    
    // Check if data already exists
    const existingAuthors = await Author.countDocuments();
    if (existingAuthors > 0) {
        console.log('📊 Default data already exists');
        return;
    }

    console.log('🔄 Initializing default data...');

    // Create default authors
    const defaultAuthors = [
        {
            slug: 'alessandro-dantoni',
            name: "Alessandro D'Antoni",
            bio: 'Full-stack developer e technical writer appassionato di tecnologie web.',
            avatar: '/images/authors/alessandro_avatar-min.webp',
            email: 'alessandro@almastack.it',
            twitter: '@alessandro',
            linkedin: 'https://linkedin.com/in/alessandro-dantoni',
            github: 'https://github.com/alessandro'
        },
        {
            slug: 'manfredi-marrone',
            name: 'Manfredi Mauro Marrone',
            bio: 'Developer e specialista in architetture cloud e sistemi distribuiti.',
            avatar: '/images/authors/manfredi_avatar-min.webp',
            email: 'manfredi@almastack.it',
            twitter: '@manfredi',
            linkedin: 'https://linkedin.com/in/manfredi-marrone',
            github: 'https://github.com/manfredi'
        }
    ];

    await Author.insertMany(defaultAuthors);

    // Create default categories
    const defaultCategories = [
        { slug: 'cyber-security', name: 'Cyber Security', description: 'Articoli su sicurezza informatica e best practices', color: '#DC2626', icon: '🔒' },
        { slug: 'web-development', name: 'Web Development', description: 'Guide e tutorial sullo sviluppo web moderno', color: '#3B82F6', icon: '🚀' },
        { slug: 'cloud-computing', name: 'Cloud Computing', description: 'AWS, Azure, GCP e architetture cloud', color: '#10B981', icon: '☁️' },
        { slug: 'ai-ml', name: 'AI & Machine Learning', description: 'Intelligenza artificiale e machine learning', color: '#8B5CF6', icon: '🤖' },
        { slug: 'devops', name: 'DevOps', description: 'CI/CD, containerizzazione e automazione', color: '#F59E0B', icon: '⚙️' },
        { slug: 'database', name: 'Database', description: 'SQL, NoSQL e ottimizzazione database', color: '#06B6D4', icon: '🗄️' },
        { slug: 'mobile-dev', name: 'Mobile Development', description: 'React Native, Flutter e sviluppo mobile', color: '#EC4899', icon: '📱' },
        { slug: 'best-practices', name: 'Best Practices', description: 'Pattern, principi e metodologie', color: '#84CC16', icon: '✨' }
    ];

    await Category.insertMany(defaultCategories);

    console.log('✅ Default data initialized');
}

// Export all collections
export default {
    posts,
    authors,
    categories,
    tags,
    media,
    analytics,
    stats,
    initializeDefaultData
};