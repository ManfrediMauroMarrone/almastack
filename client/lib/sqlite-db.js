import Database from 'better-sqlite3';
import path from 'path';
import { promises as fs } from 'fs';
import os from 'os';

/**
 * Database Configuration and Connection Manager
 * Handles permissions, serverless environments, and connection pooling
 */
class DatabaseManager {
    constructor() {
        this.db = null;
        this.dbPath = null;
        this.isInitialized = false;
        this.initPromise = null;
    }

    /**
     * Get the appropriate database path based on environment
     */
    getDatabasePath() {
        // Check for custom path in environment variables
        if (process.env.DATABASE_PATH || process.env.NETLIFY) {
            return process.env.DATABASE_PATH;
        }

        // Serverless environments (Vercel, Netlify, AWS Lambda)
        if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
            // Use /tmp directory for serverless
            return path.join('/tmp', 'blog.db');
        }

        // Docker container check
        if (process.env.RUNNING_IN_DOCKER === 'true') {
            return path.join('/data', 'blog.db');
        }

        // Development or traditional hosting
        if (process.env.NODE_ENV === 'production') {
            // Try to use a writable directory in production
            const dataDir = path.join(process.cwd(), '/');
            return path.join(dataDir, 'blog.db');
        }

        // Default for development
        return path.join(process.cwd(), 'blog.db');
    }

    /**
     * Ensure database directory exists and is writable
     */
    async ensureDirectory() {
        const dir = path.dirname(this.dbPath);
        
        try {
            // Check if directory exists
            await fs.access(dir);
            
            // Check write permissions
            await fs.access(dir, fs.constants.W_OK);
            
            console.log(`✅ Database directory is ready: ${dir}`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Directory doesn't exist, create it
                try {
                    await fs.mkdir(dir, { recursive: true, mode: 0o755 });
                    console.log(`📁 Created database directory: ${dir}`);
                } catch (mkdirError) {
                    // If creation fails, try temp directory
                    console.error(`❌ Failed to create directory: ${mkdirError.message}`);
                    this.dbPath = path.join(os.tmpdir(), 'blog.db');
                    console.log(`🔄 Fallback to temp directory: ${this.dbPath}`);
                }
            } else if (error.code === 'EACCES') {
                // Permission denied, use temp directory
                console.warn(`⚠️ No write permission for ${dir}`);
                this.dbPath = path.join(os.tmpdir(), 'blog.db');
                console.log(`🔄 Using temp directory: ${this.dbPath}`);
            }
        }
    }

    /**
     * Copy existing database to new location if needed
     */
    async migrateDatabase(oldPath, newPath) {
        try {
            // Check if old database exists
            await fs.access(oldPath);
            
            // Check if new database already exists
            try {
                await fs.access(newPath);
                console.log('📊 Database already exists at new location');
                return;
            } catch {
                // New database doesn't exist, copy it
                console.log(`📋 Migrating database from ${oldPath} to ${newPath}`);
                await fs.copyFile(oldPath, newPath);
                console.log('✅ Database migrated successfully');
            }
        } catch {
            // Old database doesn't exist, will be created
            console.log('📊 No existing database to migrate');
        }
    }

    /**
     * Initialize database connection with retry logic
     */
    async initialize() {
        // Prevent multiple initialization
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = this._doInitialize();
        return this.initPromise;
    }

    async _doInitialize() {
        if (this.isInitialized && this.db) {
            return this.db;
        }

        const maxRetries = 3;
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔄 Database initialization attempt ${attempt}/${maxRetries}`);
                
                // Determine database path
                this.dbPath = this.getDatabasePath();
                console.log(`📍 Database path: ${this.dbPath}`);
                
                // Ensure directory exists
                await this.ensureDirectory();
                
                // Check for database migration needs
                const originalPath = path.join(process.cwd(), 'blog.db');
                if (this.dbPath !== originalPath) {
                    await this.migrateDatabase(originalPath, this.dbPath);
                }
                
                // Open database connection
                this.db = new Database(this.dbPath, {
                    verbose: process.env.NODE_ENV === 'development' ? console.log : null,
                    fileMustExist: false,
                    timeout: parseInt(process.env.SQLITE_TIMEOUT || '5000'),
                });

                // Configure database for better performance and concurrency
                this.db.pragma('journal_mode = WAL'); // Write-Ahead Logging
                this.db.pragma('busy_timeout = 5000'); // 5 second timeout
                this.db.pragma('synchronous = NORMAL'); // Balance between speed and safety
                this.db.pragma('cache_size = -2000'); // 2MB cache
                this.db.pragma('foreign_keys = ON'); // Enable foreign keys
                this.db.pragma('temp_store = MEMORY'); // Use memory for temp tables
                
                // Test write capability
                await this.testWriteCapability();
                
                // Initialize schema
                this.initializeSchema();
                
                this.isInitialized = true;
                console.log('✅ Database initialized successfully');
                
                return this.db;
            } catch (error) {
                lastError = error;
                console.error(`❌ Initialization attempt ${attempt} failed:`, error.message);
                
                if (attempt < maxRetries) {
                    // Wait before retry (exponential backoff)
                    const delay = Math.pow(2, attempt) * 1000;
                    console.log(`⏳ Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw new Error(`Failed to initialize database after ${maxRetries} attempts: ${lastError.message}`);
    }

    /**
     * Test database write capability
     */
    async testWriteCapability() {
        try {
            // Create test table
            this.db.prepare(`
                CREATE TABLE IF NOT EXISTS _write_test (
                    id INTEGER PRIMARY KEY,
                    timestamp INTEGER
                )
            `).run();

            // Insert test record
            const stmt = this.db.prepare('INSERT INTO _write_test (timestamp) VALUES (?)');
            const result = stmt.run(Date.now());
            
            // Clean up
            this.db.prepare('DELETE FROM _write_test WHERE id = ?').run(result.lastInsertRowid);
            this.db.prepare('DROP TABLE IF EXISTS _write_test').run();
            
            console.log('✅ Database write test passed');
        } catch (error) {
            throw new Error(`Database is not writable: ${error.message}`);
        }
    }

    /**
     * Initialize database schema
     */
    initializeSchema() {
        // Use transaction for atomic schema creation
        const createSchema = this.db.transaction(() => {
            // Posts table - NEW
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    slug TEXT UNIQUE NOT NULL,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    excerpt TEXT,
                    date TEXT DEFAULT CURRENT_TIMESTAMP,
                    author TEXT NOT NULL,
                    author_image TEXT,
                    cover_image TEXT,
                    category TEXT,
                    tags TEXT, -- JSON array stored as text
                    draft INTEGER DEFAULT 1,
                    featured INTEGER DEFAULT 0,
                    reading_time TEXT,
                    views INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Authors table
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS authors (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    slug TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    bio TEXT,
                    avatar TEXT,
                    email TEXT,
                    twitter TEXT,
                    linkedin TEXT,
                    github TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Categories table
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    slug TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    description TEXT,
                    color TEXT DEFAULT '#3B82F6',
                    icon TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Tags table
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS tags (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    slug TEXT UNIQUE NOT NULL,
                    name TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Media table
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS media (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    filename TEXT NOT NULL,
                    original_name TEXT NOT NULL,
                    path TEXT NOT NULL,
                    url TEXT NOT NULL,
                    mime_type TEXT NOT NULL,
                    size INTEGER NOT NULL,
                    width INTEGER,
                    height INTEGER,
                    alt_text TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Post metadata table
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS post_metadata (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    slug TEXT UNIQUE NOT NULL,
                    views INTEGER DEFAULT 0,
                    likes INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Create indexes for better performance
            this.db.exec(`
                CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
                CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);
                CREATE INDEX IF NOT EXISTS idx_posts_draft ON posts(draft);
                CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
                CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
                CREATE INDEX IF NOT EXISTS idx_authors_slug ON authors(slug);
                CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
                CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
                CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);
                CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);
                CREATE INDEX IF NOT EXISTS idx_post_metadata_slug ON post_metadata(slug);
            `);
        });

        createSchema();
        this.insertDefaultData();
    }

    /**
     * Insert default data
     */
    insertDefaultData() {
        const insertDefaultData = this.db.transaction(() => {
            // Insert default authors
            const insertAuthor = this.db.prepare(`
                INSERT OR IGNORE INTO authors (slug, name, bio, avatar, email, twitter, linkedin, github)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            insertAuthor.run(
                'alessandro-dantoni',
                "Alessandro D'Antoni",
                'Full-stack developer e technical writer appassionato di tecnologie web.',
                'alessandro_avatar-min.webp',
                'alessandro@almastack.it',
                '@alessandro',
                'https://linkedin.com/in/alessandro-dantoni',
                'https://github.com/alessandro'
            );

            insertAuthor.run(
                'manfredi-marrone',
                'Manfredi Mauro Marrone',
                'Developer e specialista in architetture cloud e sistemi distribuiti.',
                'manfredi_avatar-min.webp',
                'manfredi@almastack.it',
                '@manfredi',
                'https://linkedin.com/in/manfredi-marrone',
                'https://github.com/manfredi'
            );

            // Insert default categories
            const insertCategory = this.db.prepare(`
                INSERT OR IGNORE INTO categories (slug, name, description, color, icon)
                VALUES (?, ?, ?, ?, ?)
            `);

            const defaultCategories = [
                ['cyber-security', 'Cyber Security', 'Articoli su sicurezza informatica e best practices', '#DC2626', '🔒'],
                ['web-development', 'Web Development', 'Guide e tutorial sullo sviluppo web moderno', '#3B82F6', '🚀'],
                ['cloud-computing', 'Cloud Computing', 'AWS, Azure, GCP e architetture cloud', '#10B981', '☁️'],
                ['ai-ml', 'AI & Machine Learning', 'Intelligenza artificiale e machine learning', '#8B5CF6', '🤖'],
                ['devops', 'DevOps', 'CI/CD, containerizzazione e automazione', '#F59E0B', '⚙️'],
                ['database', 'Database', 'SQL, NoSQL e ottimizzazione database', '#06B6D4', '🗄️'],
                ['mobile-dev', 'Mobile Development', 'React Native, Flutter e sviluppo mobile', '#EC4899', '📱'],
                ['best-practices', 'Best Practices', 'Pattern, principi e metodologie', '#84CC16', '✨']
            ];

            defaultCategories.forEach(cat => {
                insertCategory.run(...cat);
            });
        });

        insertDefaultData();
    }

    /**
     * Get database instance (ensures initialization)
     */
    async getDb() {
        if (!this.isInitialized || !this.db) {
            await this.initialize();
        }
        return this.db;
    }

    /**
     * Execute a query with automatic retry on lock
     */
    async executeWithRetry(callback, maxRetries = 3) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const db = await this.getDb();
                return callback(db);
            } catch (error) {
                lastError = error;
                
                // Check if it's a locking error
                if (error.code === 'SQLITE_BUSY' || error.code === 'SQLITE_LOCKED') {
                    console.warn(`⚠️ Database locked, attempt ${attempt}/${maxRetries}`);
                    
                    if (attempt < maxRetries) {
                        // Wait with exponential backoff
                        const delay = Math.pow(2, attempt) * 100;
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                }
                
                throw error;
            }
        }
        
        throw lastError;
    }

    /**
     * Close database connection
     */
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
            this.isInitialized = false;
            this.initPromise = null;
            console.log('📊 Database connection closed');
        }
    }
}

// Create singleton instance
const dbManager = new DatabaseManager();

// Initialize database on first import
let initializationPromise = null;

/**
 * Ensure database is initialized before any operation
 */
async function ensureInitialized() {
    if (!initializationPromise) {
        initializationPromise = dbManager.initialize();
    }
    return initializationPromise;
}

// Posts operations - NEW
export const posts = {
    getAll: async () => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const rows = db.prepare(`
                SELECT * FROM posts 
                ORDER BY date DESC, created_at DESC
            `).all();
            
            // Parse JSON tags
            return rows.map(row => ({
                ...row,
                tags: row.tags ? JSON.parse(row.tags) : [],
                draft: Boolean(row.draft),
                featured: Boolean(row.featured)
            }));
        });
    },

    getPublished: async () => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const rows = db.prepare(`
                SELECT * FROM posts 
                WHERE draft = 0 
                ORDER BY date DESC, created_at DESC
            `).all();
            
            // Parse JSON tags
            return rows.map(row => ({
                ...row,
                tags: row.tags ? JSON.parse(row.tags) : [],
                draft: false,
                featured: Boolean(row.featured)
            }));
        });
    },

    getBySlug: async (slug) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const row = db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug);
            if (!row) return null;
            
            return {
                ...row,
                tags: row.tags ? JSON.parse(row.tags) : [],
                draft: Boolean(row.draft),
                featured: Boolean(row.featured)
            };
        });
    },

    create: async (post) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const stmt = db.prepare(`
                INSERT INTO posts (
                    slug, title, content, excerpt, date, author, 
                    author_image, cover_image, category, tags, 
                    draft, featured, reading_time
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            const result = stmt.run(
                post.slug,
                post.title,
                post.content,
                post.excerpt || '',
                post.date || new Date().toISOString().split('T')[0],
                post.author,
                post.authorImage || post.author_image || null,
                post.coverImage || post.cover_image || null,
                post.category || null,
                JSON.stringify(post.tags || []),
                post.draft ? 1 : 0,
                post.featured ? 1 : 0,
                post.readingTime || post.reading_time || null
            );
            
            return { id: result.lastInsertRowid, ...post };
        });
    },

    update: async (slug, updates) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            // Prepare the update object
            const updateData = { ...updates };
            
            // Handle special fields
            if ('tags' in updateData && Array.isArray(updateData.tags)) {
                updateData.tags = JSON.stringify(updateData.tags);
            }
            if ('draft' in updateData) {
                updateData.draft = updateData.draft ? 1 : 0;
            }
            if ('featured' in updateData) {
                updateData.featured = updateData.featured ? 1 : 0;
            }
            if ('authorImage' in updateData) {
                updateData.author_image = updateData.authorImage;
                delete updateData.authorImage;
            }
            if ('coverImage' in updateData) {
                updateData.cover_image = updateData.coverImage;
                delete updateData.coverImage;
            }
            if ('readingTime' in updateData) {
                updateData.reading_time = updateData.readingTime;
                delete updateData.readingTime;
            }
            
            const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(updateData), slug];
            
            const stmt = db.prepare(`
                UPDATE posts 
                SET ${fields}, updated_at = CURRENT_TIMESTAMP 
                WHERE slug = ?
            `);
            stmt.run(values);
            
            return posts.getBySlug(slug);
        });
    },

    delete: async (slug) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const stmt = db.prepare('DELETE FROM posts WHERE slug = ?');
            return stmt.run(slug);
        });
    },

    search: async (query) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const searchPattern = `%${query}%`;
            const rows = db.prepare(`
                SELECT * FROM posts 
                WHERE title LIKE ? 
                   OR excerpt LIKE ? 
                   OR content LIKE ?
                   OR category LIKE ?
                   OR tags LIKE ?
                ORDER BY date DESC
            `).all(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
            
            return rows.map(row => ({
                ...row,
                tags: row.tags ? JSON.parse(row.tags) : [],
                draft: Boolean(row.draft),
                featured: Boolean(row.featured)
            }));
        });
    },

    getByCategory: async (category) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const rows = db.prepare(`
                SELECT * FROM posts 
                WHERE category = ? AND draft = 0
                ORDER BY date DESC
            `).all(category);
            
            return rows.map(row => ({
                ...row,
                tags: row.tags ? JSON.parse(row.tags) : [],
                draft: false,
                featured: Boolean(row.featured)
            }));
        });
    },

    getByTag: async (tag) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const searchPattern = `%"${tag}"%`;
            const rows = db.prepare(`
                SELECT * FROM posts 
                WHERE tags LIKE ? AND draft = 0
                ORDER BY date DESC
            `).all(searchPattern);
            
            return rows.map(row => ({
                ...row,
                tags: row.tags ? JSON.parse(row.tags) : [],
                draft: false,
                featured: Boolean(row.featured)
            }));
        });
    },

    getFeatured: async () => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const rows = db.prepare(`
                SELECT * FROM posts 
                WHERE featured = 1 AND draft = 0
                ORDER BY date DESC
            `).all();
            
            return rows.map(row => ({
                ...row,
                tags: row.tags ? JSON.parse(row.tags) : [],
                draft: false,
                featured: true
            }));
        });
    },

    incrementViews: async (slug) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const stmt = db.prepare(`
                UPDATE posts 
                SET views = views + 1 
                WHERE slug = ?
            `);
            return stmt.run(slug);
        });
    }
};

// Authors operations
export const authors = {
    getAll: async () => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => 
            db.prepare('SELECT * FROM authors ORDER BY name').all()
        );
    },

    getBySlug: async (slug) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => 
            db.prepare('SELECT * FROM authors WHERE slug = ?').get(slug)
        );
    },

    create: async (author) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const stmt = db.prepare(`
                INSERT INTO authors (slug, name, bio, avatar, email, twitter, linkedin, github)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            const result = stmt.run(
                author.slug,
                author.name,
                author.bio,
                author.avatar,
                author.email,
                author.twitter,
                author.linkedin,
                author.github
            );
            return { id: result.lastInsertRowid, ...author };
        });
    },

    update: async (slug, updates) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(updates), slug];
            const stmt = db.prepare(`UPDATE authors SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE slug = ?`);
            stmt.run(values);
            return db.prepare('SELECT * FROM authors WHERE slug = ?').get(slug);
        });
    },

    delete: async (slug) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const stmt = db.prepare('DELETE FROM authors WHERE slug = ?');
            return stmt.run(slug);
        });
    }
};

// Categories operations
export const categories = {
    getAll: async () => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => 
            db.prepare('SELECT * FROM categories ORDER BY name').all()
        );
    },

    getBySlug: async (slug) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => 
            db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug)
        );
    },

    create: async (category) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const stmt = db.prepare(`
                INSERT INTO categories (slug, name, description, color, icon)
                VALUES (?, ?, ?, ?, ?)
            `);
            const result = stmt.run(
                category.slug,
                category.name,
                category.description,
                category.color || '#3B82F6',
                category.icon
            );
            return { id: result.lastInsertRowid, ...category };
        });
    },

    update: async (slug, updates) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(updates), slug];
            const stmt = db.prepare(`UPDATE categories SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE slug = ?`);
            stmt.run(values);
            return db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug);
        });
    },

    delete: async (slug) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const stmt = db.prepare('DELETE FROM categories WHERE slug = ?');
            return stmt.run(slug);
        });
    }
};

// Tags operations
export const tags = {
    getAll: async () => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => 
            db.prepare('SELECT * FROM tags ORDER BY name').all()
        );
    },

    getBySlug: async (slug) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => 
            db.prepare('SELECT * FROM tags WHERE slug = ?').get(slug)
        );
    },

    create: async (tag) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const stmt = db.prepare(`
                INSERT OR IGNORE INTO tags (slug, name)
                VALUES (?, ?)
            `);
            const result = stmt.run(tag.slug, tag.name);
            return { id: result.lastInsertRowid, ...tag };
        });
    },

    createMany: async (tagsList) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const stmt = db.prepare('INSERT OR IGNORE INTO tags (slug, name) VALUES (?, ?)');
            const insertMany = db.transaction((tags) => {
                for (const tag of tags) {
                    stmt.run(tag.slug, tag.name);
                }
            });
            insertMany(tagsList);
        });
    },

    delete: async (slug) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const stmt = db.prepare('DELETE FROM tags WHERE slug = ?');
            return stmt.run(slug);
        });
    },

    search: async (query) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => 
            db.prepare('SELECT * FROM tags WHERE name LIKE ? ORDER BY name LIMIT 10')
                .all(`%${query}%`)
        );
    }
};

// Media operations
export const media = {
    getAll: async (limit = 50, offset = 0) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db =>
            db.prepare('SELECT * FROM media ORDER BY created_at DESC LIMIT ? OFFSET ?')
                .all(limit, offset)
        );
    },

    /**
     * Count total media items (for pagination)
     * @param {string|null} searchQuery - Optional search query
     */
    count: async (searchQuery = null) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            if (searchQuery) {
                const searchPattern = `%${searchQuery}%`;
                const stmt = db.prepare(`
                    SELECT COUNT(*) as total FROM media 
                    WHERE filename LIKE ? 
                       OR original_name LIKE ? 
                       OR alt_text LIKE ?
                `);
                const result = stmt.get(searchPattern, searchPattern, searchPattern);
                return result.total;
            }

            const result = db.prepare('SELECT COUNT(*) as total FROM media')
                .get()
            return result.total;
        });
    },

    getById: async (id) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => 
            db.prepare('SELECT * FROM media WHERE id = ?').get(id)
        );
    },

    create: async (file) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const stmt = db.prepare(`
                INSERT INTO media (filename, original_name, path, url, mime_type, size, width, height, alt_text)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            const result = stmt.run(
                file.filename,
                file.originalName,
                file.path,
                file.url,
                file.mimeType,
                file.size,
                file.width || null,
                file.height || null,
                file.altText || null
            );
            return { id: result.lastInsertRowid, ...file };
        });
    },

    update: async (id, updates) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(updates), id];
            const stmt = db.prepare(`UPDATE media SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
            stmt.run(values);
            return db.prepare('SELECT * FROM media WHERE id = ?').get(id);
        });
    },

    delete: async (id) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => {
            const file = db.prepare('SELECT * FROM media WHERE id = ?').get(id);
            if (file) {
                const stmt = db.prepare('DELETE FROM media WHERE id = ?');
                stmt.run(id);
                return file;
            }
            return null;
        });
    },

    search: async (query) => {
        await ensureInitialized();
        return dbManager.executeWithRetry(db => 
            db.prepare(`
                SELECT * FROM media 
                WHERE original_name LIKE ? OR alt_text LIKE ?
                ORDER BY created_at DESC
                LIMIT 20
            `).all(`%${query}%`, `%${query}%`)
        );
    }
};

// Export manager for advanced usage
export { dbManager };

// Handle process termination gracefully
if (typeof process !== 'undefined') {
    process.on('SIGINT', () => {
        dbManager.close();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        dbManager.close();
        process.exit(0);
    });
}

// Default export for backward compatibility
export default {
    posts,
    authors,
    categories,
    tags,
    media
};