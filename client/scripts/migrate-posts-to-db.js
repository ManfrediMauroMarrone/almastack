#!/usr/bin/env node

/**
 * Migration script to import existing MDX posts from files to database
 * Run with: node scripts/migrate-posts-to-db.js
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';
import readingTime from 'reading-time';
import { posts, tags as tagsDb } from '../lib/db.js';

const POSTS_PATH = path.join(process.cwd(), 'content/blog');

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function getPostFilePaths() {
    try {
        const posts = await glob(`${POSTS_PATH}/**/*.mdx`);
        return posts;
    } catch (error) {
        log(`Warning: Could not find posts directory at ${POSTS_PATH}`, 'yellow');
        return [];
    }
}

function getSlugFromFilePath(filePath) {
    const fileName = path.basename(filePath, '.mdx');
    return fileName;
}

async function migratePost(filePath) {
    try {
        const source = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(source);
        const slug = getSlugFromFilePath(filePath);
        
        log(`  Processing: ${slug}...`, 'dim');
        
        // Check if post already exists
        const existingPost = await posts.getBySlug(slug);
        if (existingPost) {
            log(`  ⚠️  Post "${slug}" already exists in database, skipping...`, 'yellow');
            return { status: 'skipped', slug };
        }
        
        // Calculate reading time
        const calculatedReadingTime = readingTime(content).text;
        
        // Create tags if they don't exist
        if (data.tags && Array.isArray(data.tags)) {
            for (const tagName of data.tags) {
                const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                await tagsDb.create({ slug: tagSlug, name: tagName });
            }
        }
        
        // Prepare post data
        const postData = {
            slug,
            title: data.title || 'Untitled',
            content: content,
            excerpt: data.excerpt || '',
            date: data.date || new Date().toISOString().split('T')[0],
            author: data.author || 'Anonymous',
            authorImage: data.authorImage || null,
            coverImage: data.coverImage || null,
            category: data.category || 'Uncategorized',
            tags: data.tags || [],
            draft: data.draft || false,
            featured: data.featured || false,
            readingTime: calculatedReadingTime
        };
        
        // Create post in database
        await posts.create(postData);
        log(`  ✅ Successfully migrated: ${slug}`, 'green');
        
        return { status: 'success', slug };
    } catch (error) {
        log(`  ❌ Error migrating ${filePath}: ${error.message}`, 'red');
        return { status: 'error', slug: getSlugFromFilePath(filePath), error: error.message };
    }
}

async function main() {
    log('\n🚀 Starting MDX to Database Migration\n', 'bright');
    log('=' .repeat(50), 'dim');
    
    try {
        // Get all post file paths
        const filePaths = await getPostFilePaths();
        
        if (filePaths.length === 0) {
            log('\n📭 No MDX files found to migrate.\n', 'yellow');
            log('If you have posts in a different location, please update the POSTS_PATH in this script.\n', 'dim');
            return;
        }
        
        log(`\n📂 Found ${filePaths.length} MDX files to process\n`, 'cyan');
        
        // Track migration results
        const results = {
            success: [],
            skipped: [],
            error: []
        };
        
        // Migrate each post
        for (const filePath of filePaths) {
            const result = await migratePost(filePath);
            results[result.status].push(result.slug);
        }
        
        // Print summary
        log('\n' + '=' .repeat(50), 'dim');
        log('\n📊 Migration Summary\n', 'bright');
        
        if (results.success.length > 0) {
            log(`✅ Successfully migrated: ${results.success.length} posts`, 'green');
            results.success.forEach(slug => log(`   - ${slug}`, 'dim'));
        }
        
        if (results.skipped.length > 0) {
            log(`\n⚠️  Skipped (already exists): ${results.skipped.length} posts`, 'yellow');
            results.skipped.forEach(slug => log(`   - ${slug}`, 'dim'));
        }
        
        if (results.error.length > 0) {
            log(`\n❌ Failed: ${results.error.length} posts`, 'red');
            results.error.forEach(slug => log(`   - ${slug}`, 'dim'));
        }
        
        log('\n✨ Migration complete!\n', 'bright');
        
        // Provide next steps
        if (results.success.length > 0) {
            log('Next steps:', 'cyan');
            log('1. Verify the migrated posts in your admin panel', 'dim');
            log('2. Once verified, you can safely delete the content/blog directory', 'dim');
            log('3. Update any deployment scripts to remove MDX file dependencies\n', 'dim');
        }
        
    } catch (error) {
        log(`\n❌ Migration failed: ${error.message}\n`, 'red');
        console.error(error);
        process.exit(1);
    }
}

// Run migration
main().catch(console.error);