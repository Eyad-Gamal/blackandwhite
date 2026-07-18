import Product from '../models/Product.js';
import Category from '../models/Category.js';

/**
 * Create database indexes for optimized query performance
 */
export async function createIndexes() {
    try {
        console.log('Creating database indexes...');
        const startTime = Date.now();

        // Product indexes
        await Product.collection.createIndex(
            { status: 1, order: 1, _id: 1 },
            { name: 'status_order_id_compound' }
        );
        console.log('✓ Created compound index on products: { status: 1, order: 1, _id: 1 }');

        await Product.collection.createIndex(
            { categoryId: 1 },
            { name: 'categoryId_index' }
        );
        console.log('✓ Created index on products: { categoryId: 1 }');

        await Product.collection.createIndex(
            { order: 1 },
            { name: 'order_index' }
        );
        console.log('✓ Created index on products: { order: 1 }');

        // Category indexes
        await Category.collection.createIndex(
            { order: 1 },
            { name: 'category_order_index' }
        );
        console.log('✓ Created index on categories: { order: 1 }');

        const duration = Date.now() - startTime;
        console.log(`✓ All indexes created successfully in ${duration}ms`);

        return { success: true, duration };
    } catch (error) {
        // Check if error is because indexes already exist
        if (error.code === 85 || error.message.includes('already exists')) {
            console.log('ℹ Indexes already exist, skipping creation');
            return { success: true, skipped: true };
        }

        console.error('✗ Error creating indexes:', error.message);
        return { success: false, error: error.message };
    }
}
