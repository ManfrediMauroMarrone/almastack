// scripts/migrate-to-mongodb.js
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { mongoManager } from '../lib/mongodb.js';
import { 
    Post, 
    Author, 
    Category, 
    Tag, 
    Media 
} from '../lib/schemas/index.js';

// Load environment variables
dotenv.config();

// Get current directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Migration script from SQLite to MongoDB
 */
class SqliteToMongoMigration {
    constructor() {
        this.sqliteDb = null;
        this.stats = {
            posts: { total: 0, migrated: 0, failed: 0 },
            authors: { total: 0, migrated: 0, failed: 0 },
            categories: { total: 0, migrated: 0, failed: 0 },
            tags: { total: 0, migrated: 0, failed: 0 },
            media: { total: 0, migrated: 0, failed: 0 }
        };
        this.errors = [];
    }

    /**
     * Connect to SQLite database
     */
    connectToSqlite() {
        const dbPath = path.join(dirname(__dirname), 'blog.db');
        console.log(`📂 Opening SQLite database: ${dbPath}`);
        
        try {
            this.sqliteDb = new Database(dbPath, { readonly: true });
            console.log('✅ SQLite database connected');
            return true;
        } catch (error) {
            console.error('❌ Failed to connect to SQLite:', error.message);
            return false;
        }
    }

    /**
     * Connect to MongoDB
     */
    async connectToMongoDB() {
        console.log('🔄 Connecting to MongoDB...');
        try {
            await mongoManager.connect();
            console.log('✅ MongoDB connected');
            return true;
        } catch (error) {
            console.error('❌ Failed to connect to MongoDB:', error.message);
            return false;
        }
    }

    /**
     * Clear MongoDB collections (optional)
     */
    async clearMongoDB() {
        console.log('🗑️ Clearing MongoDB collections...');
        
        try {
            await Promise.all([
                Post.deleteMany({}),
                Author.deleteMany({}),
                Category.deleteMany({}),
                Tag.deleteMany({}),
                Media.deleteMany({})
            ]);
            console.log('✅ MongoDB collections cleared');
        } catch (error) {
            console.error('❌ Failed to clear MongoDB:', error.message);
        }
    }

    /**
     * Migrate authors
     */
    async migrateAuthors() {
        console.log('\n📚 Migrating Authors...');
        
        try {
            const authors = this.sqliteDb.prepare('SELECT * FROM authors').all();
            this.stats.authors.total = authors.length;

            for (const author of authors) {
                try {
                    const mongoAuthor = new Author({
                        slug: author.slug,
                        name: author.name,
                        bio: author.bio,
                        avatar: author.avatar,
                        email: author.email,
                        twitter: author.twitter,
                        linkedin: author.linkedin,
                        github: author.github,
                        createdAt: author.created_at ? new Date(author.created_at) : new Date(),
                        updatedAt: author.updated_at ? new Date(author.updated_at) : new Date()
                    });

                    await mongoAuthor.save();
                    this.stats.authors.migrated++;
                    console.log(`  ✅ Author migrated: ${author.name}`);
                } catch (error) {
                    this.stats.authors.failed++;
                    this.errors.push(`Author ${author.name}: ${error.message}`);
                    console.error(`  ❌ Failed to migrate author ${author.name}:`, error.message);
                }
            }
        } catch (error) {
            console.error('❌ Error reading authors:', error.message);
        }
    }

    /**
     * Migrate categories
     */
    async migrateCategories() {
        console.log('\n📁 Migrating Categories...');
        
        try {
            const categories = this.sqliteDb.prepare('SELECT * FROM categories').all();
            this.stats.categories.total = categories.length;

            for (const category of categories) {
                try {
                    const mongoCategory = new Category({
                        slug: category.slug,
                        name: category.name,
                        description: category.description,
                        color: category.color || '#3B82F6',
                        icon: category.icon,
                        order: 0,
                        createdAt: category.created_at ? new Date(category.created_at) : new Date(),
                        updatedAt: category.updated_at ? new Date(category.updated_at) : new Date()
                    });

                    await mongoCategory.save();
                    this.stats.categories.migrated++;
                    console.log(`  ✅ Category migrated: ${category.name}`);
                } catch (error) {
                    this.stats.categories.failed++;
                    this.errors.push(`Category ${category.name}: ${error.message}`);
                    console.error(`  ❌ Failed to migrate category ${category.name}:`, error.message);
                }
            }
        } catch (error) {
            console.error('❌ Error reading categories:', error.message);
        }
    }

    /**
     * Migrate tags
     */
    async migrateTags() {
        console.log('\n🏷️ Migrating Tags...');
        
        try {
            const tags = this.sqliteDb.prepare('SELECT * FROM tags').all();
            this.stats.tags.total = tags.length;

            for (const tag of tags) {
                try {
                    const mongoTag = new Tag({
                        slug: tag.slug,
                        name: tag.name,
                        createdAt: tag.created_at ? new Date(tag.created_at) : new Date()
                    });

                    await mongoTag.save();
                    this.stats.tags.migrated++;
                    console.log(`  ✅ Tag migrated: ${tag.name}`);
                } catch (error) {
                    this.stats.tags.failed++;
                    this.errors.push(`Tag ${tag.name}: ${error.message}`);
                    console.error(`  ❌ Failed to migrate tag ${tag.name}:`, error.message);
                }
            }
        } catch (error) {
            console.error('❌ Error reading tags:', error.message);
        }
    }

    /**
     * Migrate media
     */
    async migrateMedia() {
        console.log('\n🖼️ Migrating Media...');
        
        try {
            const mediaItems = this.sqliteDb.prepare('SELECT * FROM media').all();
            this.stats.media.total = mediaItems.length;

            for (const item of mediaItems) {
                try {
                    const mongoMedia = new Media({
                        filename: item.filename,
                        originalName: item.original_name,
                        path: item.path,
                        url: item.url,
                        mimeType: item.mime_type,
                        size: item.size,
                        width: item.width,
                        height: item.height,
                        altText: item.alt_text,
                        createdAt: item.created_at ? new Date(item.created_at) : new Date(),
                        updatedAt: item.updated_at ? new Date(item.updated_at) : new Date()
                    });

                    await mongoMedia.save();
                    this.stats.media.migrated++;
                    console.log(`  ✅ Media migrated: ${item.filename}`);
                } catch (error) {
                    this.stats.media.failed++;
                    this.errors.push(`Media ${item.filename}: ${error.message}`);
                    console.error(`  ❌ Failed to migrate media ${item.filename}:`, error.message);
                }
            }
        } catch (error) {
            console.error('❌ Error reading media:', error.message);
        }
    }

    /**
     * Migrate posts
     */
    async migratePosts() {
        console.log('\n📝 Migrating Posts...');
        
        try {
            const posts = this.sqliteDb.prepare('SELECT * FROM posts').all();
            this.stats.posts.total = posts.length;

            for (const post of posts) {
                try {
                    // Parse tags if stored as JSON string
                    let tags = [];
                    if (post.tags) {
                        try {
                            tags = JSON.parse(post.tags);
                        } catch {
                            // If not JSON, split by comma
                            tags = post.tags.split(',').map(t => t.trim());
                        }
                    }

                    // Convert date string to Date object
                    let postDate = new Date();
                    if (post.date) {
                        // Handle different date formats
                        if (post.date.includes('T')) {
                            postDate = new Date(post.date);
                        } else {
                            postDate = new Date(post.date + 'T00:00:00');
                        }
                    }

                    const mongoPost = new Post({
                        slug: post.slug,
                        title: post.title,
                        content: post.content,
                        excerpt: post.excerpt || '',
                        date: postDate,
                        author: post.author,
                        authorImage: post.author_image || post.authorImage,
                        coverImage: post.cover_image || post.coverImage,
                        category: post.category,
                        tags: tags,
                        draft: Boolean(post.draft),
                        featured: Boolean(post.featured),
                        readingTime: post.reading_time || post.readingTime,
                        views: post.views || 0,
                        createdAt: post.created_at ? new Date(post.created_at) : postDate,
                        updatedAt: post.updated_at ? new Date(post.updated_at) : postDate
                    });

                    await mongoPost.save();
                    this.stats.posts.migrated++;
                    console.log(`  ✅ Post migrated: ${post.title}`);

                    // Update category post count
                    if (post.category) {
                        await Category.findOneAndUpdate(
                            { slug: post.category.toLowerCase() },
                            { $inc: { postCount: 1 } }
                        );
                    }

                    // Update tags post count
                    if (tags.length > 0) {
                        await Tag.updateMany(
                            { slug: { $in: tags.map(t => t.toLowerCase()) } },
                            { $inc: { postCount: 1 } }
                        );
                    }

                } catch (error) {
                    this.stats.posts.failed++;
                    this.errors.push(`Post ${post.title}: ${error.message}`);
                    console.error(`  ❌ Failed to migrate post ${post.title}:`, error.message);
                }
            }
        } catch (error) {
            console.error('❌ Error reading posts:', error.message);
        }
    }

    /**
     * Print migration report
     */
    printReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 MIGRATION REPORT');
        console.log('='.repeat(60));

        const collections = ['authors', 'categories', 'tags', 'media', 'posts'];
        
        for (const collection of collections) {
            const stat = this.stats[collection];
            const emoji = stat.failed === 0 ? '✅' : '⚠️';
            console.log(`${emoji} ${collection.toUpperCase()}: ${stat.migrated}/${stat.total} migrated${stat.failed > 0 ? `, ${stat.failed} failed` : ''}`);
        }

        if (this.errors.length > 0) {
            console.log('\n❌ ERRORS:');
            this.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        }

        console.log('='.repeat(60));
    }

    /**
     * Run the migration
     */
    async run(clearFirst = false) {
        console.log('🚀 Starting SQLite to MongoDB migration...\n');

        // Connect to databases
        if (!this.connectToSqlite()) {
            console.error('Migration aborted: Cannot connect to SQLite');
            return;
        }

        if (!(await this.connectToMongoDB())) {
            console.error('Migration aborted: Cannot connect to MongoDB');
            return;
        }

        // Clear MongoDB if requested
        if (clearFirst) {
            await this.clearMongoDB();
        }

        // Run migrations in order
        await this.migrateAuthors();
        await this.migrateCategories();
        await this.migrateTags();
        await this.migrateMedia();
        await this.migratePosts();

        // Print report
        this.printReport();

        // Close connections
        this.sqliteDb.close();
        await mongoManager.disconnect();

        console.log('\n✨ Migration completed!');
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const clearFirst = args.includes('--clear') || args.includes('-c');
const help = args.includes('--help') || args.includes('-h');

if (help) {
    console.log(`
SQLite to MongoDB Migration Script

Usage: node scripts/migrate-to-mongodb.js [options]

Options:
  --clear, -c    Clear MongoDB collections before migration
  --help, -h     Show this help message

Environment Variables:
  MONGODB_URI    MongoDB connection string (required)
  NODE_ENV       Set to 'development' for debug logging

Example:
  node scripts/migrate-to-mongodb.js --clear
    `);
    process.exit(0);
}

// Check for MongoDB URI
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
    console.error('❌ Error: MONGODB_URI environment variable is not set');
    console.log('Please set MONGODB_URI in your .env file or environment');
    console.log('Example: MONGODB_URI=mongodb://localhost:27017/almastack_blog');
    process.exit(1);
}

// Run migration
const migration = new SqliteToMongoMigration();
migration.run(clearFirst).catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});