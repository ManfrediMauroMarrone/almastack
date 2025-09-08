// lib/schemas/index.js
import pkg from 'mongoose';
const { Schema, model, models } = pkg;

/**
 * Post Schema
 */
const postSchema = new Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    },
    author: {
        type: String,
        required: true,
        default: "Alessandro D'Antoni"
    },
    authorImage: {
        type: String,
        default: '/images/authors/alessandro_avatar-min.webp'
    },
    coverImage: String,
    category: {
        type: String,
        index: true
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    draft: {
        type: Boolean,
        default: true,
        index: true
    },
    featured: {
        type: Boolean,
        default: false,
        index: true
    },
    readingTime: String,
    views: {
        type: Number,
        default: 0
    },
    // SEO fields
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
    // Social media
    ogImage: String,
    twitterImage: String
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
postSchema.index({ title: 'text', content: 'text', excerpt: 'text' }); // Text search
postSchema.index({ category: 1, draft: 1 }); // Category queries
postSchema.index({ tags: 1, draft: 1 }); // Tag queries
postSchema.index({ featured: 1, draft: 1, date: -1 }); // Featured posts
postSchema.index({ draft: 1, date: -1 }); // Published posts

// Virtual for formatted date
postSchema.virtual('formattedDate').get(function() {
    return this.date?.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Pre-save middleware to generate slug if not provided
postSchema.pre('save', function(next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

/**
 * Author Schema
 */
const authorSchema = new Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    bio: String,
    avatar: String,
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    twitter: String,
    linkedin: String,
    github: String,
    website: String,
    // Statistics
    postCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for searching authors
authorSchema.index({ name: 'text', bio: 'text' });

/**
 * Category Schema
 */
const categorySchema = new Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    color: {
        type: String,
        default: '#3B82F6'
    },
    icon: String,
    // Statistics
    postCount: {
        type: Number,
        default: 0
    },
    // Hierarchy support
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for hierarchical queries
categorySchema.index({ parent: 1, order: 1 });

/**
 * Tag Schema
 */
const tagSchema = new Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    // Statistics
    postCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for searching tags
tagSchema.index({ name: 'text' });

/**
 * Media Schema
 */
const mediaSchema = new Schema({
    filename: {
        type: String,
        required: true,
        index: true
    },
    originalName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true,
        index: true
    },
    size: {
        type: Number,
        required: true
    },
    width: Number,
    height: Number,
    altText: String,
    caption: String,
    // Storage type (local, netlify-blobs, cloudinary, s3, etc.)
    storageType: {
        type: String,
        default: 'local'
    },
    // Metadata
    metadata: {
        type: Map,
        of: Schema.Types.Mixed
    },
    // Relations
    usedIn: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    uploadedBy: String,
    // Image variations (thumbnails, etc.)
    variations: {
        thumbnail: String,
        medium: String,
        large: String
    }
}, {
    timestamps: true
});

// Indexes for media queries
mediaSchema.index({ mimeType: 1, createdAt: -1 });
mediaSchema.index({ originalName: 'text', altText: 'text' });
mediaSchema.index({ size: 1 });
mediaSchema.index({ storageType: 1 });

// Virtual for file extension
mediaSchema.virtual('extension').get(function() {
    return this.filename?.split('.').pop();
});

// Virtual for human-readable size
mediaSchema.virtual('humanSize').get(function() {
    const bytes = this.size;
    if (!bytes) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

/**
 * Analytics Schema (new feature)
 */
const analyticsSchema = new Schema({
    postSlug: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    views: {
        type: Number,
        default: 0
    },
    uniqueViews: {
        type: Number,
        default: 0
    },
    // Reading metrics
    avgReadingTime: Number, // in seconds
    completionRate: Number, // percentage
    // Engagement metrics
    likes: {
        type: Number,
        default: 0
    },
    shares: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    // Traffic sources
    sources: {
        direct: { type: Number, default: 0 },
        search: { type: Number, default: 0 },
        social: { type: Number, default: 0 },
        referral: { type: Number, default: 0 }
    },
    // Device types
    devices: {
        desktop: { type: Number, default: 0 },
        mobile: { type: Number, default: 0 },
        tablet: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
analyticsSchema.index({ postSlug: 1, date: -1 });
analyticsSchema.index({ date: -1 });

/**
 * Subscriber Schema (new feature)
 */
const subscriberSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    name: String,
    status: {
        type: String,
        enum: ['pending', 'active', 'unsubscribed'],
        default: 'pending'
    },
    preferences: {
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            default: 'weekly'
        },
        categories: [String],
        tags: [String]
    },
    confirmationToken: String,
    confirmedAt: Date,
    unsubscribedAt: Date,
    lastEmailSent: Date,
    // Tracking
    source: String, // Where they subscribed from
    ip: String,
    userAgent: String
}, {
    timestamps: true
});

// Index for subscriber queries
subscriberSchema.index({ status: 1, confirmedAt: 1 });
subscriberSchema.index({ confirmationToken: 1 });

/**
 * Comment Schema (new feature)
 */
const commentSchema = new Schema({
    postSlug: {
        type: String,
        required: true,
        index: true
    },
    author: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        website: String,
        avatar: String
    },
    content: {
        type: String,
        required: true
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'spam', 'deleted'],
        default: 'pending',
        index: true
    },
    likes: {
        type: Number,
        default: 0
    },
    // Moderation
    moderatedBy: String,
    moderatedAt: Date,
    moderationNotes: String,
    // Anti-spam
    ip: String,
    userAgent: String,
    spamScore: Number
}, {
    timestamps: true
});

// Indexes for comment queries
commentSchema.index({ postSlug: 1, status: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ 'author.email': 1 });

/**
 * Create models
 * Using models object to prevent re-compilation in serverless environments
 */
export const Post = models.Post || model('Post', postSchema);
export const Author = models.Author || model('Author', authorSchema);
export const Category = models.Category || model('Category', categorySchema);
export const Tag = models.Tag || model('Tag', tagSchema);
export const Media = models.Media || model('Media', mediaSchema);
export const Analytics = models.Analytics || model('Analytics', analyticsSchema);
export const Subscriber = models.Subscriber || model('Subscriber', subscriberSchema);
export const Comment = models.Comment || model('Comment', commentSchema);

// Export all models as default
export default {
    Post,
    Author,
    Category,
    Tag,
    Media,
    Analytics,
    Subscriber,
    Comment
};