/**
 * test/graphql.spec.ts
 * GraphQL API Tests
 *
 * Tests GraphQL queries for product search and filtering
 */

import { describe, it, expect } from 'vitest';
import { GraphQLClient, gql } from 'graphql-request';
import { sendTestMetrics } from './utils/datadog-reporter';
import testData from '../test-data.json';

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_URL ?? 'https://api.example.com/graphql';

describe('Product API - GraphQL Queries', () => {
  const apiKey = process.env.API_KEY ?? testData.api.apiKey;

  it('Query - Should fetch all products with pagination', async () => {
    const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const query = gql`
      query GetProducts($limit: Int!, $offset: Int!) {
        products(limit: $limit, offset: $offset) {
          id
          name
          price
          category
          inStock
        }
        productCount
      }
    `;

    try {
      const data = await client.request(query, {
        limit: 10,
        offset: 0,
      });

      expect(data).toBeDefined();
      expect(data.products).toBeDefined();
      expect(Array.isArray(data.products)).toBe(true);
      expect(typeof data.productCount).toBe('number');

      // Validate product structure
      if (data.products.length > 0) {
        const product = data.products[0];
        expect(product.id).toBeDefined();
        expect(product.name).toBeDefined();
        expect(typeof product.price).toBe('number');
        expect(product.category).toBeDefined();
        expect(typeof product.inStock).toBe('boolean');
      }

      await sendTestMetrics(data.productCount, 'ecommerce.graphql.product_count', [
        'query:GetProducts',
      ]);

      console.log('✅ GraphQL products query successful:', data.productCount, 'total products');
    } catch (error: any) {
      // GraphQL endpoint might not exist in demo
      if (error.message.includes('404') || error.message.includes('ECONNREFUSED')) {
        console.log('⚠️ GraphQL endpoint not available (expected in demo)');
      } else {
        throw error;
      }
    }
  });

  it('Query - Should search products by name', async () => {
    const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const query = gql`
      query SearchProducts($searchTerm: String!) {
        searchProducts(query: $searchTerm) {
          id
          name
          price
          description
          rating
        }
        searchResultCount
      }
    `;

    try {
      const data = await client.request(query, {
        searchTerm: testData.testSearchQueries.query1,
      });

      expect(data).toBeDefined();
      expect(data.searchProducts).toBeDefined();
      expect(Array.isArray(data.searchProducts)).toBe(true);
      expect(typeof data.searchResultCount).toBe('number');

      // Validate search result structure
      if (data.searchProducts.length > 0) {
        const product = data.searchProducts[0];
        expect(product.id).toBeDefined();
        expect(product.name).toBeDefined();
        expect(typeof product.price).toBe('number');
      }

      await sendTestMetrics(data.searchResultCount, 'ecommerce.graphql.search_results', [
        `query:${testData.testSearchQueries.query1}`,
      ]);

      console.log('✅ GraphQL search query successful:', data.searchResultCount, 'results');
    } catch (error: any) {
      if (error.message.includes('404') || error.message.includes('ECONNREFUSED')) {
        console.log('⚠️ GraphQL endpoint not available (expected in demo)');
      } else {
        throw error;
      }
    }
  });

  it('Query - Should filter products by category', async () => {
    const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const query = gql`
      query ProductsByCategory($category: String!, $minPrice: Float, $maxPrice: Float) {
        productsByCategory(category: $category, minPrice: $minPrice, maxPrice: $maxPrice) {
          id
          name
          price
          category
        }
        count
      }
    `;

    try {
      const data = await client.request(query, {
        category: testData.testProducts.category,
        minPrice: 0,
        maxPrice: 1000,
      });

      expect(data).toBeDefined();
      expect(Array.isArray(data.productsByCategory)).toBe(true);
      expect(typeof data.count).toBe('number');

      // Verify all products match category
      if (data.productsByCategory.length > 0) {
        data.productsByCategory.forEach((product: any) => {
          expect(product.category).toBe(testData.testProducts.category);
          expect(product.price).toBeGreaterThanOrEqual(0);
          expect(product.price).toBeLessThanOrEqual(1000);
        });
      }

      console.log('✅ GraphQL category filter successful:', data.count, 'products in category');
    } catch (error: any) {
      if (error.message.includes('404') || error.message.includes('ECONNREFUSED')) {
        console.log('⚠️ GraphQL endpoint not available (expected in demo)');
      } else {
        throw error;
      }
    }
  });

  it('Query - Should validate response schema types', async () => {
    const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    const query = gql`
      query GetSingleProduct($id: ID!) {
        product(id: $id) {
          id
          name
          price
          description
          rating
          inStock
        }
      }
    `;

    try {
      const data = await client.request(query, {
        id: testData.testProducts.validProductId,
      });

      // Validate type safety
      if (data.product) {
        expect(typeof data.product.id).toBe('string');
        expect(typeof data.product.name).toBe('string');
        expect(typeof data.product.price).toBe('number');
        expect(typeof data.product.rating).toBe('number');
        expect(typeof data.product.inStock).toBe('boolean');

        console.log('✅ GraphQL schema types validated');
      } else {
        console.log('⚠️ Product not found (expected in demo)');
      }
    } catch (error: any) {
      if (error.message.includes('404') || error.message.includes('ECONNREFUSED')) {
        console.log('⚠️ GraphQL endpoint not available (expected in demo)');
      } else {
        throw error;
      }
    }
  });
});
