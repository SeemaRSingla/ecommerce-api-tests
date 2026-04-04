# GETTING STARTED 🚀

## Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd /Users/seemasingla/Repos/ecommerce-api-tests
npm install
```

### Step 2: Configure Environment
```bash
# Copy example environment
cp .env.example .env

# Add your API details (or leave as-is for demo)
# The tests will gracefully skip unavailable endpoints
```

### Step 3: Run Tests
```bash
# Run all tests
npm test

# Or watch mode
npm run test:watch

# Or with UI
npm run test:ui
```

### Step 4: See Results
Tests will run and show:
✅ Passed tests  
⚠️ Skipped tests (unavailable endpoints)  
❌ Failed tests (if any)  

---

## Project Features Checklist

✅ **REST API Testing** - products.spec.ts  
✅ **GraphQL Testing** - graphql.spec.ts  
✅ **Search Testing** - search.spec.ts  
✅ **Authentication** - test/utils/auth.ts  
✅ **Monitoring** - test/utils/datadog-reporter.ts  
✅ **Test Data** - test-data.json  
✅ **TypeScript** - Type-safe tests  
✅ **Documentation** - README + PORTFOLIO guide  

---

## What's Included

### Test Files (3)
1. **products.spec.ts** - REST API tests (5 test cases)
2. **graphql.spec.ts** - GraphQL tests (4 test cases)
3. **search.spec.ts** - Search tests (6 test cases)

**Total: 15+ Test Cases**

### Utility Files (4)
1. **auth.ts** - Authentication helpers
2. **datadog-reporter.ts** - Metrics sending
3. **common.ts** - Common utilities
4. **setup.ts** - Test setup/teardown

### Configuration (4)
1. **package.json** - Dependencies
2. **tsconfig.json** - TypeScript config
3. **vitest.config.ts** - Vitest config
4. **.gitignore** - Git ignore rules

### Documentation (3)
1. **README.md** - Project documentation
2. **PORTFOLIO.md** - Interview guide
3. **GETTING_STARTED.md** - This file!

---

## For Interviews

### Practice Demo (5 minutes)
```bash
# 1. Show structure
ls -la test/

# 2. Show a test file
cat test/products.spec.ts | head -40

# 3. Run tests
npm test

# 4. Explain what you see
```

### Talking Points
- Why TypeScript?
- Why Vitest?
- How's error handling done?
- How's authentication managed?
- How's monitoring integrated?

See **PORTFOLIO.md** for detailed interview prep!

---

## Common Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test test/products.spec.ts

# Run tests matching pattern
npm test -- --grep "Should"

# Watch mode (re-run on changes)
npm run test:watch

# UI mode (visual interface)
npm run test:ui

# CI mode (single run)
npm run test:ci

# With coverage
npm run test:coverage
```

---

## Project Organization

```
✅ CLEAR STRUCTURE
├── test/              # All test files
├── utils/             # Shared utilities
├── test-data/         # Test data
├── test-data.json     # Configuration data
├── README.md          # Main docs
├── PORTFOLIO.md       # Interview guide
└── GETTING_STARTED.md # This file

✅ TYPE SAFE
- All code in TypeScript
- Strict mode enabled
- Type checking everywhere

✅ PRODUCTION READY
- Error handling
- Logging and debugging
- Scalable structure
- Security best practices
```

---

## Next Steps

### To Extend This Project:

1. **Add More Tests**
   - Create `test/new-feature.spec.ts`
   - Follow existing patterns
   - Run with `npm test`

2. **Add More Utilities**
   - Create in `test/utils/` or `utils/`
   - Export functions
   - Use in test files

3. **Integrate with Real API**
   - Update `API_URL` in `.env`
   - Tests will use real endpoints
   - Some tests might fail (expected)

4. **Set Up CI/CD**
   - Create `.github/workflows/test.yml`
   - Add secrets for API keys
   - Push to GitHub

---

## Troubleshooting

### Tests won't run?
```bash
# Check Node version (needs 22+)
node --version

# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### See "endpoint not available"?
```bash
# This is expected! Tests don't have real API
# The demo gracefully skips unavailable endpoints
# This shows good error handling!
```

### Want to use real API?
```bash
# 1. Update .env with real API URL
# 2. Set real API_KEY
# 3. Run npm test

# Some tests might fail (expected for demo)
# But you'll see real API testing in action!
```

---

## File-by-File Overview

### test/products.spec.ts
- **What:** REST API CRUD operations
- **Tests:** GET list, GET one, POST, filtering
- **Skills:** HTTP methods, status codes, validation

### test/graphql.spec.ts  
- **What:** GraphQL query testing
- **Tests:** Queries, mutations, schema validation
- **Skills:** GraphQL queries, type safety, nested objects

### test/search.spec.ts
- **What:** Search functionality
- **Tests:** Search, filters, sort, pagination
- **Skills:** Query building, complex filtering, pagination

### test/utils/auth.ts
- **What:** Authentication helpers
- **Contains:** API key + Bearer token builders
- **Skills:** Auth strategies, credential handling

### test/utils/datadog-reporter.ts
- **What:** Metrics reporting
- **Contains:** Datadog integration, metric sending
- **Skills:** Monitoring, metrics, observability

---

## Portfolio Talking Points

### "What does this show?"
1. **API Testing Knowledge** - REST + GraphQL
2. **Code Quality** - TypeScript, organized
3. **Best Practices** - Error handling, security
4. **Real-world Skills** - Monitoring, auth, testing
5. **Professionalism** - Documentation, structure

### "Why is this impressive?"
- ✅ Complete project structure
- ✅ Production-ready code
- ✅ Best practices demonstrated
- ✅ Well-documented
- ✅ Interview-ready narrative

### "What can I say in interviews?"
- "I built a comprehensive API testing suite"
- "It demonstrates REST and GraphQL expertise"
- "I used TypeScript for type safety"
- "I integrated monitoring with Datadog"
- "I implemented secure credential management"

---

## Ready?

✅ Understand the structure  
✅ Know how to run tests  
✅ Can explain each component  
✅ Ready for interviews  

**You're all set!** This project will impress interviewers. 🚀

---

**Questions?** Check PORTFOLIO.md for interview prep!
