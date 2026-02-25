import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || (process.env.NODE_ENV === 'development' ? 'mongodb://127.0.0.1:27017/xart' : undefined);

if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
    throw new Error('Please define the MONGODB_URI environment variable inside the Vercel Dashboard');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is undefined. Please set it in your environment variables.');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('MongoDB Connected successfully to:', MONGODB_URI.split('@').pop()); // Log host only for safety
            return mongoose;
        }).catch(err => {
            console.error('MongoDB Connection Error:', err.message);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectToDatabase;
