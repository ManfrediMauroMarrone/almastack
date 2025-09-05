import Database from 'better-sqlite3';
import path from 'path';

// Initialize database
const dbPath = path.join(process.cwd(), 'blog.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
    // Authors table
    db.exec(`
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
    db.exec(`
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
    db.exec(`
        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Media table for tracking uploaded files
    db.exec(`
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

    // Post metadata table (to track post stats and additional data)
    db.exec(`
        CREATE TABLE IF NOT EXISTS post_metadata (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE NOT NULL,
            views INTEGER DEFAULT 0,
            likes INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Insert default authors if they don't exist
    const insertAuthor = db.prepare(`
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
    const insertCategory = db.prepare(`
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

    console.log('✅ Database initialized successfully');
}

// Authors operations
export const authors = {
    getAll: () => {
        return db.prepare('SELECT * FROM authors ORDER BY name').all();
    },

    getBySlug: (slug) => {
        return db.prepare('SELECT * FROM authors WHERE slug = ?').get(slug);
    },

    create: (author) => {
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
    },

    update: (slug, updates) => {
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), slug];
        const stmt = db.prepare(`UPDATE authors SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE slug = ?`);
        stmt.run(values);
        return authors.getBySlug(slug);
    },

    delete: (slug) => {
        const stmt = db.prepare('DELETE FROM authors WHERE slug = ?');
        return stmt.run(slug);
    }
};

// Categories operations
export const categories = {
    getAll: () => {
        return db.prepare('SELECT * FROM categories ORDER BY name').all();
    },

    getBySlug: (slug) => {
        return db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug);
    },

    create: (category) => {
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
    },

    update: (slug, updates) => {
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), slug];
        const stmt = db.prepare(`UPDATE categories SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE slug = ?`);
        stmt.run(values);
        return categories.getBySlug(slug);
    },

    delete: (slug) => {
        const stmt = db.prepare('DELETE FROM categories WHERE slug = ?');
        return stmt.run(slug);
    }
};

// Tags operations
export const tags = {
    getAll: () => {
        return db.prepare('SELECT * FROM tags ORDER BY name').all();
    },

    getBySlug: (slug) => {
        return db.prepare('SELECT * FROM tags WHERE slug = ?').get(slug);
    },

    create: (tag) => {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO tags (slug, name)
            VALUES (?, ?)
        `);
        const result = stmt.run(tag.slug, tag.name);
        return { id: result.lastInsertRowid, ...tag };
    },

    createMany: (tagsList) => {
        const stmt = db.prepare('INSERT OR IGNORE INTO tags (slug, name) VALUES (?, ?)');
        const insertMany = db.transaction((tags) => {
            for (const tag of tags) {
                stmt.run(tag.slug, tag.name);
            }
        });
        insertMany(tagsList);
    },

    delete: (slug) => {
        const stmt = db.prepare('DELETE FROM tags WHERE slug = ?');
        return stmt.run(slug);
    },

    search: (query) => {
        return db.prepare('SELECT * FROM tags WHERE name LIKE ? ORDER BY name LIMIT 10')
            .all(`%${query}%`);
    }
};

// Media operations
export const media = {
    getAll: (limit = 50, offset = 0) => {
        return db.prepare('SELECT * FROM media ORDER BY created_at DESC LIMIT ? OFFSET ?')
            .all(limit, offset);
    },

    getById: (id) => {
        return db.prepare('SELECT * FROM media WHERE id = ?').get(id);
    },

    create: (file) => {
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
    },

    update: (id, updates) => {
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updates), id];
        const stmt = db.prepare(`UPDATE media SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
        stmt.run(values);
        return media.getById(id);
    },

    delete: (id) => {
        const file = media.getById(id);
        if (file) {
            const stmt = db.prepare('DELETE FROM media WHERE id = ?');
            stmt.run(id);
            return file;
        }
        return null;
    },

    search: (query) => {
        return db.prepare(`
            SELECT * FROM media 
            WHERE original_name LIKE ? OR alt_text LIKE ?
            ORDER BY created_at DESC
            LIMIT 20
        `).all(`%${query}%`, `%${query}%`);
    }
};

// Initialize database on module load
initializeDatabase();

export default db;