/**
 * Manual tests for CacheService
 * Run with: node server/services/cacheService.test.js
 */

import { cacheService } from './cacheService.js';

// Helper to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test counter
let passed = 0;
let failed = 0;

function assert(condition, testName) {
    if (condition) {
        console.log(`✓ ${testName}`);
        passed++;
    } else {
        console.error(`✗ ${testName}`);
        failed++;
    }
}

async function runTests() {
    console.log('\n=== CacheService Tests ===\n');

    // Reset cache before tests
    cacheService.clear();

    // Test 1: Cache MISS on non-existent key
    const result1 = cacheService.get('test-key');
    assert(result1.status === 'MISS', 'Test 1: Cache MISS on non-existent key');
    assert(result1.data === null, 'Test 1: MISS returns null data');

    // Test 2: Set and get cache (HIT)
    cacheService.set('test-key', { value: 'test-data' }, 300);
    const result2 = cacheService.get('test-key');
    assert(result2.status === 'HIT', 'Test 2: Cache HIT on fresh data');
    assert(result2.data.value === 'test-data', 'Test 2: HIT returns correct data');
    assert(result2.age < 1, 'Test 2: Age is less than 1 second');

    // Test 3: Cache statistics
    const stats1 = cacheService.getStats();
    assert(stats1.hits === 1, 'Test 3: Hits count is correct');
    assert(stats1.misses === 1, 'Test 3: Misses count is correct');
    assert(stats1.size === 1, 'Test 3: Cache size is correct');
    assert(stats1.hitRate === 50, 'Test 3: Hit rate is 50%');

    // Test 4: STALE cache (simulate by setting old timestamp)
    cacheService.set('stale-key', { value: 'stale-data' }, 300);
    // Manually modify timestamp to make it stale (350 seconds old)
    const staleEntry = cacheService.cacheStore.get('stale-key');
    staleEntry.timestamp = Date.now() - (350 * 1000);

    const result3 = cacheService.get('stale-key');
    assert(result3.status === 'STALE', 'Test 4: Cache STALE for data 300-600s old');
    assert(result3.data.value === 'stale-data', 'Test 4: STALE returns data');
    assert(result3.age >= 350, 'Test 4: Age is approximately 350 seconds');

    // Test 5: EXPIRED cache (> 600 seconds)
    cacheService.set('expired-key', { value: 'expired-data' }, 300);
    const expiredEntry = cacheService.cacheStore.get('expired-key');
    expiredEntry.timestamp = Date.now() - (650 * 1000);

    const result4 = cacheService.get('expired-key');
    assert(result4.status === 'MISS', 'Test 5: Cache MISS for expired data (>600s)');
    assert(result4.data === null, 'Test 5: MISS returns null for expired');
    assert(!cacheService.cacheStore.has('expired-key'), 'Test 5: Expired entry is removed');

    // Test 6: Invalidate exact key
    cacheService.set('key1', { value: 'data1' }, 300);
    cacheService.invalidate('key1');
    const result5 = cacheService.get('key1');
    assert(result5.status === 'MISS', 'Test 6: Invalidate removes exact key');

    // Test 7: Wildcard invalidation
    cacheService.set('storefront:products', { value: 'products' }, 300);
    cacheService.set('storefront:categories', { value: 'categories' }, 300);
    cacheService.set('admin:users', { value: 'users' }, 300);

    cacheService.invalidate('storefront:*');

    const result6 = cacheService.get('storefront:products');
    const result7 = cacheService.get('storefront:categories');
    const result8 = cacheService.get('admin:users');

    assert(result6.status === 'MISS', 'Test 7: Wildcard invalidates matching key 1');
    assert(result7.status === 'MISS', 'Test 7: Wildcard invalidates matching key 2');
    assert(result8.status === 'HIT', 'Test 7: Wildcard preserves non-matching key');

    // Test 8: Clear all cache
    cacheService.set('key-a', { value: 'a' }, 300);
    cacheService.set('key-b', { value: 'b' }, 300);
    cacheService.clear();

    const result9 = cacheService.get('key-a');
    const result10 = cacheService.get('key-b');
    assert(result9.status === 'MISS', 'Test 8: Clear removes all entries');
    assert(result10.status === 'MISS', 'Test 8: Clear removes all entries (2)');
    assert(cacheService.cacheStore.size === 0, 'Test 8: Cache size is 0 after clear');

    // Test 9: WarmUp method
    const fetchFunction = async () => {
        await wait(50); // Simulate async fetch
        return { products: [1, 2, 3] };
    };

    try {
        await cacheService.warmUp(fetchFunction, 'warmed-cache', 300);
        const result11 = cacheService.get('warmed-cache');
        assert(result11.status === 'HIT', 'Test 9: WarmUp populates cache');
        assert(result11.data.products.length === 3, 'Test 9: WarmUp stores correct data');
    } catch (error) {
        assert(false, 'Test 9: WarmUp should not throw');
    }

    // Test 10: WarmUp failure handling
    const failingFetch = async () => {
        throw new Error('Fetch failed');
    };

    try {
        await cacheService.warmUp(failingFetch, 'failed-cache', 300);
        assert(false, 'Test 10: WarmUp should throw on failure');
    } catch (error) {
        assert(error.message === 'Fetch failed', 'Test 10: WarmUp propagates error');
    }

    // Test 11: Multiple cache entries
    cacheService.clear();
    cacheService.set('key1', 'value1', 300);
    cacheService.set('key2', 'value2', 300);
    cacheService.set('key3', 'value3', 300);

    const stats2 = cacheService.getStats();
    assert(stats2.size === 3, 'Test 11: Multiple entries stored correctly');

    // Summary
    console.log(`\n=== Test Results ===`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total: ${passed + failed}`);

    if (failed === 0) {
        console.log(`\n✓ All tests passed!\n`);
        process.exit(0);
    } else {
        console.log(`\n✗ Some tests failed\n`);
        process.exit(1);
    }
}

runTests().catch(console.error);
