// lib/mongodb.js
import mongoose from 'mongoose';

/**
 * MongoDB Connection Manager
 * Handles connection pooling, retries, and environment-specific configurations
 */
class MongoDBManager {
    constructor() {
        this.isConnected = false;
        this.connectionPromise = null;
    }

    /**
     * Get MongoDB URI from environment variables
     */
    getMongoUri() {
        // Check for different environment variable names
        const uri = process.env.MONGODB_URI || 
                   process.env.MONGO_URI || 
                   process.env.DATABASE_URL ||
                   process.env.MONGODB_URL;

        if (!uri) {
            // Default to local MongoDB if no environment variable is set
            console.warn('⚠️ No MongoDB URI found in environment variables, using local instance');
            return 'mongodb://localhost:27017/almastack_blog';
        }

        return uri;
    }

    /**
     * Configure mongoose options based on environment
     */
    getConnectionOptions() {
        const options = {
            // Connection pool settings
            maxPoolSize: parseInt(process.env.MONGODB_POOL_SIZE || '10'),
            minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '2'),
            
            // Timeout settings
            serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_TIMEOUT || '5000'),
            socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT || '45000'),
            
            // Write concern
            w: 'majority',
            retryWrites: true,
            
            // Connection settings
            family: 4, // Use IPv4
        };

        // Add authentication if provided
        if (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD) {
            options.auth = {
                username: process.env.MONGODB_USER,
                password: process.env.MONGODB_PASSWORD
            };
        }

        // Database name (can be overridden)
        if (process.env.MONGODB_DATABASE) {
            options.dbName = process.env.MONGODB_DATABASE;
        }

        return options;
    }

    /**
     * Connect to MongoDB with retry logic
     */
    async connect() {
        // Return existing connection if already connected
        if (this.isConnected && mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        // Return existing connection promise if connection is in progress
        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        // Start new connection
        this.connectionPromise = this._doConnect();
        return this.connectionPromise;
    }

    async _doConnect() {
        const maxRetries = 3;
        const retryDelay = 1000; // Start with 1 second
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔄 MongoDB connection attempt ${attempt}/${maxRetries}`);

                const uri = this.getMongoUri();
                const options = this.getConnectionOptions();

                // Set mongoose options
                mongoose.set('strictQuery', false); // Prepare for Mongoose 7
                
                // Development mode logging
                if (process.env.NODE_ENV === 'development') {
                    mongoose.set('debug', true);
                }

                // Connect to MongoDB
                await mongoose.connect(uri, options);

                this.isConnected = true;
                console.log('✅ MongoDB connected successfully');
                console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
                console.log(`🔗 Host: ${mongoose.connection.host}`);

                // Setup connection event handlers
                this.setupEventHandlers();

                return mongoose.connection;

            } catch (error) {
                lastError = error;
                console.error(`❌ MongoDB connection attempt ${attempt} failed:`, error.message);

                // Disconnect if partially connected
                if (mongoose.connection.readyState !== 0) {
                    await mongoose.disconnect();
                }

                if (attempt < maxRetries) {
                    const delay = retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
                    console.log(`⏳ Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    this.connectionPromise = null;
                    throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts: ${lastError.message}`);
                }
            }
        }
    }

    /**
     * Setup MongoDB connection event handlers
     */
    setupEventHandlers() {
        const db = mongoose.connection;

        db.on('connected', () => {
            console.log('📡 MongoDB connected');
            this.isConnected = true;
        });

        db.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
            this.isConnected = false;
        });

        db.on('disconnected', () => {
            console.log('🔌 MongoDB disconnected');
            this.isConnected = false;
            this.connectionPromise = null;
        });

        db.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected');
            this.isConnected = true;
        });

        // Handle application termination
        process.on('SIGINT', this.gracefulShutdown.bind(this));
        process.on('SIGTERM', this.gracefulShutdown.bind(this));
    }

    /**
     * Gracefully close MongoDB connection
     */
    async gracefulShutdown() {
        try {
            await mongoose.connection.close();
            console.log('📊 MongoDB connection closed through app termination');
            process.exit(0);
        } catch (error) {
            console.error('Error during graceful shutdown:', error);
            process.exit(1);
        }
    }

    /**
     * Check if connected to MongoDB
     */
    isReady() {
        return mongoose.connection.readyState === 1;
    }

    /**
     * Get connection state string
     */
    getConnectionState() {
        const states = {
            0: 'Disconnected',
            1: 'Connected',
            2: 'Connecting',
            3: 'Disconnecting',
        };
        return states[mongoose.connection.readyState];
    }

    /**
     * Execute operation with connection check
     */
    async executeWithConnection(callback) {
        if (!this.isReady()) {
            await this.connect();
        }
        return callback();
    }

    /**
     * Close connection (for testing or manual control)
     */
    async disconnect() {
        if (this.isReady()) {
            await mongoose.disconnect();
            this.isConnected = false;
            this.connectionPromise = null;
            console.log('📊 MongoDB disconnected manually');
        }
    }

    /**
     * Drop database (use with caution!)
     */
    async dropDatabase() {
        if (!this.isReady()) {
            throw new Error('Not connected to MongoDB');
        }
        
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Cannot drop database in production');
        }

        await mongoose.connection.db.dropDatabase();
        console.log('🗑️ Database dropped');
    }

    /**
     * Get database statistics
     */
    async getStats() {
        if (!this.isReady()) {
            throw new Error('Not connected to MongoDB');
        }

        const stats = await mongoose.connection.db.stats();
        return {
            database: mongoose.connection.db.databaseName,
            collections: stats.collections,
            documents: stats.objects,
            dataSize: stats.dataSize,
            storageSize: stats.storageSize,
            indexes: stats.indexes,
            indexSize: stats.indexSize,
        };
    }
}

// Create singleton instance
const mongoManager = new MongoDBManager();

// Auto-connect in non-serverless environments
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    // Connect immediately in development or traditional hosting
    mongoManager.connect().catch(console.error);
}

// Export manager and mongoose
export { mongoManager, mongoose };
export default mongoManager;