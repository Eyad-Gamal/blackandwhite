/**
 * Skeleton Loader Components for loading states
 * Provides visual feedback while content is being fetched
 */

/**
 * Product card skeleton for product grid
 */
export const ProductCardSkeleton = () => (
    <div className="product-card skeleton-card">
        <div className="skeleton skeleton-image" style={{ height: '300px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '60%', height: '16px', marginTop: '12px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '80%', height: '20px', marginTop: '8px' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '40%', height: '24px', marginTop: '12px' }}></div>
    </div>
);

/**
 * Hero section skeleton
 */
export const HeroSkeleton = () => (
    <section className="hero skeleton-hero" style={{ minHeight: '500px', display: 'flex', alignItems: 'center' }}>
        <div className="hero-content" style={{ width: '100%', padding: '40px 20px' }}>
            <div className="hero-text" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="skeleton skeleton-text" style={{ width: '200px', height: '40px', marginBottom: '20px' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '80%', height: '60px', marginTop: '20px' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '60%', height: '20px', marginTop: '12px' }}></div>
            </div>
            <div className="hero-visual" style={{ marginTop: '30px' }}>
                <div className="skeleton skeleton-image" style={{ width: '100%', height: '400px' }}></div>
            </div>
        </div>
    </section>
);

/**
 * Product grid skeleton - renders multiple product card skeletons
 * @param {number} count - Number of skeleton cards to render (default: 8)
 */
export const ProductGridSkeleton = ({ count = 8 }) => (
    <div className="products-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        padding: '20px'
    }}>
        {Array(count).fill(null).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
        ))}
    </div>
);

/**
 * Category filter skeleton
 */
export const CategoryFilterSkeleton = () => (
    <div style={{ display: 'flex', gap: '10px', padding: '20px', flexWrap: 'wrap' }}>
        {Array(5).fill(null).map((_, idx) => (
            <div
                key={idx}
                className="skeleton skeleton-text"
                style={{
                    width: `${80 + Math.random() * 40}px`,
                    height: '36px',
                    borderRadius: '18px'
                }}
            ></div>
        ))}
    </div>
);
