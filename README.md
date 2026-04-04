# E-Commerce API Test Suite 🚀

A comprehensive, production-ready API testing suite for e-commerce platforms. Demonstrates expertise in REST API testing, GraphQL validation, test automation, and QA best practices.

## Overview

This project showcases:
- ✅ **REST API Testing** - Complete CRUD operations validation
- ✅ **GraphQL Testing** - Query validation and schema type checking
- ✅ **Search Functionality** - Filtering, sorting, and pagination
- ✅ **Test Infrastructure** - Setup, utilities, and reusable components
- ✅ **Secure Credential Management** - Environment-based configuration
- ✅ **Monitoring Integration** - Datadog metrics reporting
- ✅ **Best Practices** - Structured assertions, error handling, logging

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Vitest** | Modern test framework |
| **TypeScript** | Type-safe testing code |
| **GraphQL Request** | GraphQL client testing |
| **Node.js 22+** | Runtime |

## Project Structure

```
ecommerce-api-tests/
├── test/
│   ├── utils/
│   │   ├── auth.ts              # Authentication utilities
│   │   └── datadog-reporter.ts  # Metrics reporting
│   ├── setup.ts                 # Global test setup
│   ├── products.spec.ts         # REST API tests
│   ├── graphql.spec.ts          # GraphQL tests
│   └── search.spec.ts           # Search functionality tests
├── utils/
│   └── common.ts                # Common utilities
├── test-data/                   # Test data files
├── test-data.json               # Test credentials and data
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vitest.config.ts             # Vitest configuration
└── README.md                    # Documentation
```

## Installation

```bash
# Clone or create project
cd ecommerce-api-tests

# Install dependencies
npm install

# Verify installation
npm test -- --help
```

## Configuration

### Environment Variables

Create `.env` file or set environment variables:

```bash
# API Configuration
API_URL=https://api.example.com
GRAPHQL_URL=https://api.example.com/graphql
API_KEY=your-api-key-here

# Datadog Integration (Optional)
DATADOG_API_URL=https://api.datadoghq.com
DATADOG_API_KEY=your-datadog-key
```

### Using test-data.json

Test data is stored in `test-data.json` for easy reference:

```json
{
  "api": {
    "apiKey": "demo-api-key",
    "username": "testuser",
    "password": "testpassword"
  },
  "testProducts": {
    "validProductId": "PROD-12345",
    "category": "electronics"
  },
  "testSearchQueries": {
    "query1": "laptop",
    "query2": "wireless earbuds"
  }
}
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- test/products.spec.ts
```

### Run Tests Matching Pattern
```bash
npm test -- --grep "Should return"
```

### CI/CD - Single Run
```bash
npm run test:ci
```

## Test Suites

### 1. REST API Tests (`test/products.spec.ts`)

Tests core REST API functionality:

```typescript
✅ GET /products - List all products
✅ GET /products/:id - Get specific product
✅ GET /products?category - Filter by category
✅ POST /products - Create new product
✅ Response structure validation
```

**Key Features:**
- Parameterized requests
- Error handling (404, 403 responses)
- Data type validation
- Metrics reporting

### 2. GraphQL Tests (`test/graphql.spec.ts`)

Tests GraphQL queries and mutations:

```typescript
✅ Query GetProducts - Fetch with pagination
✅ Query SearchProducts - Full-text search
✅ Query ProductsByCategory - Category filtering
✅ Schema type validation
```

**Key Features:**
- Parameterized GraphQL queries
- Response schema validation
- Type safety checks
- Error scenario handling

### 3. Search Tests (`test/search.spec.ts`)

Tests search, filtering, and sorting:

```typescript
✅ Keyword search
✅ Price range filtering
✅ Sorting (ascending/descending)
✅ Pagination
✅ Empty result handling
✅ Response structure validation
```

**Key Features:**
- Query string building
- Filter validation
- Sort order verification
- Pagination metadata checks

## Test Coverage

| Scenario | REST | GraphQL | Search |
|----------|------|---------|--------|
| Basic Operations | ✅ | ✅ | ✅ |
| Filtering | ✅ | ✅ | ✅ |
| Pagination | ✅ | ✅ | ✅ |
| Sorting | ✅ | ✅ | ✅ |
| Type Validation | ✅ | ✅ | ✅ |
| Error Handling | ✅ | ✅ | ✅ |

## Authentication

The project supports multiple authentication methods:

### API Key
```typescript
const headers = buildApiKeyHeader(apiKey);
```

### Bearer Token
```typescript
const token = buildBearerToken(jwtToken);
```

### Basic Auth
```typescript
const auth = buildBasicAuthHeader(username, password);
```

## Monitoring & Reporting

### Datadog Integration

Send test metrics to Datadog:

```typescript
await sendTestMetrics(
  count,                    // Metric value
  'ecommerce.product.count', // Metric name
  ['endpoint:/products']    // Tags
);
```

Visualize metrics for:
- Product counts over time
- Search result trends
- API performance monitoring
- Anomaly detection

## Best Practices Implemented

### ✅ Code Organization
- Separated concerns (auth, reporting, common)
- Reusable utilities
- DRY principles

### ✅ Test Structure
- Clear test names
- Comprehensive assertions
- Step-by-step validation

### ✅ Error Handling
- Graceful degradation
- Meaningful error messages
- Demo-safe endpoints (handles 404s)

### ✅ Security
- No hardcoded credentials
- Environment-based config
- Secure secrets management

### ✅ Maintainability
- TypeScript for type safety
- Well-documented code
- Modular design

## Common Issues & Solutions

### Issue: Connection Refused
**Cause:** API server not running
**Solution:** 
```bash
# Check if API is running
curl https://api.example.com/health
```

### Issue: 401 Unauthorized
**Cause:** Invalid API key
**Solution:**
```bash
# Check environment variables
echo $API_KEY
# Update .env with correct credentials
```

### Issue: Tests Timeout
**Cause:** API is slow or not responding
**Solution:**
- Increase timeout in `vitest.config.ts`
- Check API performance
- Reduce number of parallel tests

## Extending the Tests

### Add New Test Suite

1. Create new file in `test/`:
```typescript
// test/new-feature.spec.ts
import { describe, it, expect } from 'vitest';

describe('New API Feature', () => {
  it('should test new feature', async () => {
    // Test code
  });
});
```

2. Run tests:
```bash
npm test -- test/new-feature.spec.ts
```

### Add New Utility

1. Create utility in `utils/` or `test/utils/`
2. Export function
3. Import in test files

Example:
```typescript
// utils/validators.ts
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 22
      - run: npm install
      - run: npm run test:ci
```

### Environment Variables in CI

Set in GitHub Secrets, then:

```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
  DATADOG_API_KEY: ${{ secrets.DATADOG_API_KEY }}
```

## Performance Tips

- Run tests in parallel (default)
- Use `test:ci` for production pipelines
- Set appropriate timeout values
- Batch API requests when possible

## Contributing

Guidelines for extending:
1. Follow TypeScript conventions
2. Add comprehensive test cases
3. Update documentation
4. Include error scenarios
5. Add logging for debugging

## QA Interview Talking Points

This project demonstrates:

**1. API Testing Expertise**
- REST API lifecycle (GET/POST/PUT/DELETE)
- GraphQL query validation
- Response structure validation

**2. Test Infrastructure**
- TypeScript for type safety
- Vitest framework
- Test setup and configuration

**3. Best Practices**
- Parametrized testing
- Error scenario handling
- Clear assertions

**4. Secure Development**
- Environment-based credentials
- No hardcoded secrets
- Secure auth strategies

**5. Monitoring**
- Datadog metrics integration
- Performance tracking
- Real-time visibility

**6. Code Quality**
- Modular architecture
- Reusable utilities
- Well-documented code

## Troubleshooting

### Tests won't run
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### TypeScript errors
```bash
# Check TypeScript config
npm run test -- --version

# Validate tsconfig.json
npx tsc --noEmit
```

### Port already in use
```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [GraphQL Request](https://github.com/jasonkuhrt/graphql-request)
- [Testing Best Practices](https://github.com/agronholm/pytest)
- [Datadog API](https://docs.datadoghq.com/api/)

## License

MIT License - Feel free to use for portfolio or learning purposes

## Author

Created as a portfolio project demonstrating QA automation expertise

---

**Ready to impress?** This project shows real-world API testing capabilities! 🚀
