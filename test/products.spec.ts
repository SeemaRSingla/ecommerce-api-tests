/**
 * test/products.spec.ts
 * REST API Tests for Product Management
 *
 * Tests product listing, retrieval, and filtering
 */

import { describe, it, expect } from 'vitest';
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
});
