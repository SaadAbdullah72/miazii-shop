import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const migrateReviews = async () => {
    try {
        console.log('--- REVIEW DATA CLEANUP INITIATED ---');
        
        const products = await Product.find({});
        console.log(`Auditing ${products.length} products...`);

        let fixCount = 0;
        for (const product of products) {
            // Logic: Set numReviews strictly to reviews array length
            // Logic: Recalculate average rating based on actual reviews
            const actualNumReviews = product.reviews.length;
            const actualRating = actualNumReviews > 0 
                ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / actualNumReviews 
                : 0;

            if (product.numReviews !== actualNumReviews || product.rating !== actualRating) {
                product.numReviews = actualNumReviews;
                product.rating = actualRating;
                await product.save();
                fixCount++;
                console.log(`✅ FIXED: ${product.name} (Actual Reviews: ${actualNumReviews})`);
            }
        }

        console.log(`\n🎉 Cleanup Complete! Fixed ${fixCount} products.`);
        process.exit();
    } catch (error) {
        console.error(`❌ Cleanup Failed: ${error.message}`);
        process.exit(1);
    }
};

migrateReviews();
