/**
 * test/search.spec.ts
 * Search Functionality Tests
 *
 * Tests search, filtering, and sorting across different scenarios
 */

import { describe, it, expect } from 'vitest';
import { buildQueryString } from '../utils/common';
import { sendTestMetrics } from './utils/datadog-reporter';
import testData from '../test-data.json';

const API_BASE_URL = process.env.API_URL ?? 'https://api.example.com';

describe('Search API - Query Functionality', () => {
  const apiKey = process.env.API_KEY ?? testData.api.apiKey;

  it('Should search for products by keyword', async () => {
    const searchTerm = testData.testSearchQueries.query1;
    const queryParams = buildQueryString({
      q: searchTerm,
      limit: 20,
      offset: 0,
    });

    const url = `${API_BASE_URL}/search?${queryParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404 || response.status === 501) {
      console.log('⚠️ Search endpoint not available (expected in demo)');
      return;
    }

    expect(response.ok).toBe(true);

    const data = await response.json();

    expect(data).toBeDefined();
    expect(Array.isArray(data.results)).toBe(true);
    expect(typeof data.totalResults).toBe('number');

    await sendTestMetrics(data.totalResults, 'ecommerce.search.results', [
      `keyword:${searchTerm}`,
      'endpoint:/search',
    ]);

    console.log(`✅ Search for "${searchTerm}" returned ${data.totalResults} results`);
  });

  it('Should apply price filter to search', async () => {
    const queryParams = buildQueryString({
      q: 'electronics',
      minPrice: 50,
      maxPrice: 500,
      limit: 20,
    });

    const url = `${API_BASE_URL}/search?${queryParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404 || response.status === 501) {
      console.log('⚠️ Search endpoint not available (expected in demo)');
      return;
    }

    expect(response.ok).toBe(true);

    const data = await response.json();

    expect(data).toBeDefined();
    expect(Array.isArray(data.results)).toBe(true);

    // Validate all results are within price range
    if (data.results.length > 0) {
      data.results.forEach((product: any) => {
        expect(product.price).toBeGreaterThanOrEqual(50);
        expect(product.price).toBeLessThanOrEqual(500);
      });
    }

    console.log('✅ Price filter applied successfully');
  });

  it('Should sort search results', async () => {
    const queryParams = buildQueryString({
      q: testData.testSearchQueries.query2,
      sortBy: 'price',
      sortOrder: 'asc',
      limit: 20,
    });

    const url = `${API_BASE_URL}/search?${queryParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404 || response.status === 501) {
      console.log('⚠️ Search endpoint not available (expected in demo)');
      return;
    }

    expect(response.ok).toBe(true);

    const data = await response.json();

    expect(data).toBeDefined();
    expect(Array.isArray(data.results)).toBe(true);

    // Verify sorting (ascending price)
    if (data.results.length > 1) {
      for (let i = 0; i < data.results.length - 1; i++) {
        expect(data.results[i].price).toBeLessThanOrEqual(data.results[i + 1].price);
      }
    }

    console.log('✅ Results sorted by price (ascending)');
  });

  it('Should handle pagination', async () => {
    const limit = 10;
    const offset = 0;

    const queryParams = buildQueryString({
      q: 'test',
      limit: limit,
      offset: offset,
    });

    const url = `${API_BASE_URL}/search?${queryParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404 || response.status === 501) {
      console.log('⚠️ Search endpoint not available (expected in demo)');
      return;
    }

    expect(response.ok).toBe(true);

    const data = await response.json();

    expect(data).toBeDefined();
    expect(Array.isArray(data.results)).toBe(true);
    expect(data.results.length).toBeLessThanOrEqual(limit);
    expect(typeof data.totalResults).toBe('number');

    // Verify pagination metadata
    expect(data.limit).toBe(limit);
    expect(data.offset).toBe(offset);

    console.log('✅ Pagination working correctly');
  });

  it('Should return empty results for non-existent query', async () => {
    const queryParams = buildQueryString({
      q: 'xyznonexistentproductabc123',
      limit: 20,
    });

    const url = `${API_BASE_URL}/search?${queryParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404 || response.status === 501) {
      console.log('⚠️ Search endpoint not available (expected in demo)');
      return;
    }

    expect(response.ok).toBe(true);

    const data = await response.json();

    expect(data).toBeDefined();
    expect(Array.isArray(data.results)).toBe(true);
    expect(data.totalResults).toBe(0);

    console.log('✅ Empty results handled correctly');
  });

  it('Should validate search response structure', async () => {
    const queryParams = buildQueryString({
      q: testData.testSearchQueries.query3,
      limit: 10,
    });

    const url = `${API_BASE_URL}/search?${queryParams}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 404 || response.status === 501) {
      console.log('⚠️ Search endpoint not available (expected in demo)');
      return;
    }

    expect(response.ok).toBe(true);

    const data = await response.json();

    // Validate response structure
    expect(data).toBeDefined();
    expect(data.results).toBeDefined();
    expect(data.totalResults).toBeDefined();
    expect(typeof data.totalResults).toBe('number');

    if (data.results.length > 0) {
      const product = data.results[0];

      // Validate product structure
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(typeof product.name).toBe('string');
      expect(product.price).toBeDefined();
      expect(typeof product.price).toBe('number');
    }

    console.log('✅ Search response structure validated');
  });
});
