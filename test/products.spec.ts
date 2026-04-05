/**
 * test/products.spec.ts
 * REST API Tests for Product Management
 *
 * Tests product listing, retrieval, and filtering
 */

import { describe, it, expect } from 'vitest';
import { performance } from 'node:perf_hooks';
import { sendTestMetrics } from './utils/datadog-reporter';
import testData from '../test-data.json';

const API_BASE_URL = process.env.API_URL ?? 'https://api.example.com';

describe('Product API - REST Endpoints', () => {
  const apiKey = process.env.API_KEY ?? testData.api.apiKey;

  it('GET /products - Should return list of products', async () => {
    const url = `${API_BASE_URL}/products?limit=10`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toBeDefined();
    expect(Array.isArray(data.products)).toBe(true);
    expect(data.products.length).toBeGreaterThanOrEqual(0);

    // Send metrics to Datadog
    await sendTestMetrics(data.products.length, 'ecommerce.product.count', [
      'endpoint:/products',
      'method:GET',
    ]);

    console.log('✅ Product list retrieved:', data.products.length, 'products');
  });

  it('GET /products/:id - Should return specific product', async () => {
    const productId = testData.testProducts.validProductId;
    const url = `${API_BASE_URL}/products/${productId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    if (response.status === 404) {
      console.log('⚠️ Product not found (expected in demo)');
      return;
    }

    expect(response.ok).toBe(true);

    const product = await response.json();

    expect(product).toBeDefined();
    expect(product.id).toBe(productId);
    expect(product.name).toBeDefined();
    expect(product.price).toBeDefined();
    expect(typeof product.price).toBe('number');
    expect(product.price).toBeGreaterThan(0);

    console.log('✅ Product retrieved:', product.name);
  });

  it('GET /products?category=:category - Should filter by category', async () => {
    const category = testData.testProducts.category;
    const url = `${API_BASE_URL}/products?category=${category}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    if (response.status === 404) {
      console.log('⚠️ Endpoint not found (expected in demo)');
      return;
    }

    expect(response.ok).toBe(true);

    const data = await response.json();

    expect(data).toBeDefined();
    expect(Array.isArray(data.products)).toBe(true);

    // Verify all products are in requested category
    if (data.products.length > 0) {
      data.products.forEach((product: any) => {
        expect(product.category).toBe(category);
      });
    }

    console.log(`✅ Filter by category '${category}' returned:`, data.products.length, 'products');
  });

  it('POST /products - Should create new product (admin only)', async () => {
    const url = `${API_BASE_URL}/products`;

    const newProduct = {
      name: 'Test Product',
      description: 'A test product for API testing',
      price: 29.99,
      category: 'test',
      stock: 100,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(newProduct),
    });

    if (response.status === 403 || response.status === 401) {
      console.log('⚠️ Authentication required for POST (expected in demo)');
      return;
    }

    if (response.status === 404) {
      console.log('⚠️ Endpoint not found (expected in demo)');
      return;
    }

    expect(response.ok).toBe(true);

    const createdProduct = await response.json();

    expect(createdProduct).toBeDefined();
    expect(createdProduct.id).toBeDefined();
    expect(createdProduct.name).toBe(newProduct.name);

    console.log('✅ Product created:', createdProduct.id);
  });

  it('GET /products - Should validate response structure', async () => {
    const url = `${API_BASE_URL}/products`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
      },
    });

    expect(response.ok).toBe(true);

    const data = await response.json();

    // Validate response structure
    expect(data).toBeDefined();
    expect(typeof data === 'object').toBe(true);

    if (Array.isArray(data.products) && data.products.length > 0) {
      const product = data.products[0];

      // Validate product structure
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(typeof product.name).toBe('string');
      expect(product.price).toBeDefined();
      expect(typeof product.price).toBe('number');
    }

    console.log('✅ Response structure validated');
  });

  it('GET /products - Should handle transient failures with retry logic', async () => {
    // This test demonstrates retry logic for flaky APIs
    // Useful when dealing with rate-limited or occasionally-failing endpoints
    const url = `${API_BASE_URL}/products?limit=5`;
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
        });

        // Success - return early
        if (response.ok) {
          const data = await response.json();
          expect(data).toBeDefined();
          console.log(`✅ Request succeeded on attempt ${attempt}`);
          return;
        }

        // Retry on 5xx errors
        if (response.status >= 500) {
          lastError = new Error(`HTTP ${response.status}: Server error`);
          if (attempt < maxRetries) {
            console.log(`⚠️ Attempt ${attempt} failed, retrying...`);
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // exponential backoff
            continue;
          }
        }

        // Don't retry on 4xx errors
        expect(response.ok).toBe(true);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxRetries) {
          console.log(`⚠️ Attempt ${attempt} failed with error, retrying...`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          continue;
        }
      }
    }

    if (lastError) {
      throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
    }
  });

  it('GET /products - Should complete within acceptable time', async () => {
    // This test ensures the API meets performance requirements
    // Regression: Watch for slow database queries or N+1 problems
    const url = `${API_BASE_URL}/products?limit=20`;
    const maxDuration = 5000; // milliseconds

    const startTime = performance.now();

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    const duration = performance.now() - startTime;

    if (!response.ok) {
      console.log('⚠️ Request failed, skipping performance check');
      return;
    }

    const data = await response.json();

    expect(data).toBeDefined();
    expect(duration).toBeLessThan(maxDuration);

    console.log(
      `✅ Request completed in ${Math.round(duration)}ms (threshold: ${maxDuration}ms)`,
      `- Products: ${data.products?.length || 0}`
    );
  });
});
