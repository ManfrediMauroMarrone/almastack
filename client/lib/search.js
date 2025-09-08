import { getAllPosts, searchPosts as searchPostsDb } from './mdx';
import Fuse from 'fuse.js';

// Install fuse.js for fuzzy search: npm install fuse.js

/**
 * Initialize search index with posts from database
 */
export async function initSearchIndex() {
    const posts = await getAllPosts();

    const fuseOptions = {
        keys: [
            { name: 'title', weight: 0.4 },
            { name: 'excerpt', weight: 0.3 },
            { name: 'category', weight: 0.15 },
            { name: 'tags', weight: 0.1 },
            { name: 'author', weight: 0.05 },
        ],
        threshold: 0.3,
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 3,
        shouldSort: true,
        ignoreLocation: true,
        useExtendedSearch: true,
    };

    return new Fuse(posts, fuseOptions);
}

/**
 * Search posts with fuzzy matching and highlighting
 * Uses database search as primary method, with Fuse.js for advanced matching
 */
export async function searchPostsAdvanced(query) {
    // First try database search for exact matches
    const dbResults = await searchPostsDb(query);
    
    // If we have good results from database, use those
    if (dbResults.length >= 5) {
        return dbResults.map(post => ({
            item: post,
            score: 0, // Database results are considered perfect matches
            highlights: {}
        }));
    }
    
    // Otherwise, use Fuse.js for fuzzy matching
    const index = await initSearchIndex();
    const results = index.search(query);

    return results.map((result) => {
        const highlights = {};

        // Extract highlights from matches
        result.matches?.forEach((match) => {
            if (match.key === 'title' || match.key === 'excerpt') {
                const text = match.value || '';
                const indices = match.indices || [];

                let highlightedText = '';
                let lastIndex = 0;

                indices.forEach(([start, end]) => {
                    highlightedText += text.slice(lastIndex, start);
                    highlightedText += `<mark class="bg-yellow-200 dark:bg-yellow-800">${text.slice(start, end + 1)}</mark>`;
                    lastIndex = end + 1;
                });

                highlightedText += text.slice(lastIndex);
                highlights[match.key] = highlightedText;
            }
        });

        return {
            item: result.item,
            score: result.score || 0,
            highlights,
        };
    });
}

/**
 * Quick search using database
 * Faster than fuzzy search for autocomplete/suggestions
 */
export async function quickSearch(query, limit = 5) {
    const results = await searchPostsDb(query);
    return results.slice(0, limit);
}

/**
 * Search posts by multiple criteria
 */
export async function advancedSearch(criteria) {
    const posts = await getAllPosts();
    
    let filtered = [...posts];
    
    // Filter by category
    if (criteria.category) {
        filtered = filtered.filter(post => 
            post.category?.toLowerCase() === criteria.category.toLowerCase()
        );
    }
    
    // Filter by tags
    if (criteria.tags && criteria.tags.length > 0) {
        filtered = filtered.filter(post => 
            criteria.tags.some(tag => 
                post.tags?.some(postTag => 
                    postTag.toLowerCase() === tag.toLowerCase()
                )
            )
        );
    }
    
    // Filter by author
    if (criteria.author) {
        filtered = filtered.filter(post => 
            post.author?.toLowerCase().includes(criteria.author.toLowerCase())
        );
    }
    
    // Filter by date range
    if (criteria.startDate || criteria.endDate) {
        filtered = filtered.filter(post => {
            const postDate = new Date(post.date);
            if (criteria.startDate && postDate < new Date(criteria.startDate)) {
                return false;
            }
            if (criteria.endDate && postDate > new Date(criteria.endDate)) {
                return false;
            }
            return true;
        });
    }
    
    // Filter by draft status
    if (criteria.includeDrafts === false) {
        filtered = filtered.filter(post => !post.draft);
    }
    
    // Apply text search if provided
    if (criteria.query) {
        const fuseOptions = {
            keys: ['title', 'excerpt', 'content'],
            threshold: 0.3,
        };
        const fuse = new Fuse(filtered, fuseOptions);
        const searchResults = fuse.search(criteria.query);
        filtered = searchResults.map(result => result.item);
    }
    
    // Sort results
    if (criteria.sortBy) {
        filtered.sort((a, b) => {
            switch (criteria.sortBy) {
                case 'date':
                    return criteria.sortOrder === 'asc' 
                        ? new Date(a.date) - new Date(b.date)
                        : new Date(b.date) - new Date(a.date);
                case 'title':
                    return criteria.sortOrder === 'asc'
                        ? a.title.localeCompare(b.title)
                        : b.title.localeCompare(a.title);
                case 'views':
                    return criteria.sortOrder === 'asc'
                        ? (a.views || 0) - (b.views || 0)
                        : (b.views || 0) - (a.views || 0);
                default:
                    return 0;
            }
        });
    }
    
    return filtered;
}