import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        logger.info('✅ [DB] Using existing connection');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000,
            family: 4,
            maxPoolSize: 10,
            minPoolSize: 2,
        });
        logger.info(`✅ [DB] Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ [DB] INITIAL CONNECTION FAILED: ${error.message}`);
        if (process.env.NODE_ENV !== 'production') console.error(error.stack);
    }
};

export default connectDB;
