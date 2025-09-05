import { getAllPosts } from './mdx';
import Fuse from 'fuse.js';

// Install fuse.js for fuzzy search: npm install fuse.js

/**
 * Initialize search index
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
 */
export async function searchPostsAdvanced(query) {
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