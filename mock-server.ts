// mock-server.ts
// Simple Express server to mock REST and GraphQL endpoints for testing

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.MOCK_API_PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Logging middleware
app.use((req, _res, next) => {
  console.log(`[MOCK] ${req.method} ${req.path}`);
  next();
});

// Mock data
const products = [
  { id: 'PROD-12345', name: 'Laptop', price: 999, category: 'electronics', inStock: true, description: 'A laptop', rating: 4.8 },
  { id: 'PROD-67890', name: 'Wireless Earbuds', price: 199, category: 'electronics', inStock: true, description: 'Wireless earbuds', rating: 4.2 },
  { id: 'PROD-54321', name: 'Phone Case', price: 29, category: 'accessories', inStock: false, description: 'A phone case', rating: 3.9 },
  { id: 'PROD-11111', name: 'Smartphone', price: 799, category: 'electronics', inStock: true, description: 'A smartphone', rating: 4.7 },
  { id: 'PROD-22222', name: 'Bluetooth Speaker', price: 149, category: 'electronics', inStock: false, description: 'A speaker', rating: 4.1 },
  { id: 'PROD-33333', name: 'Backpack', price: 59, category: 'accessories', inStock: true, description: 'A backpack', rating: 4.3 },
  { id: 'PROD-44444', name: 'Sunglasses', price: 89, category: 'accessories', inStock: true, description: 'Sunglasses', rating: 4.0 },
  { id: 'PROD-55555', name: 'Desk Lamp', price: 39, category: 'home', inStock: true, description: 'A desk lamp', rating: 4.4 },
  { id: 'PROD-66666', name: 'Coffee Maker', price: 129, category: 'home', inStock: false, description: 'A coffee maker', rating: 4.6 },
  { id: 'PROD-77777', name: 'Notebook', price: 9, category: 'stationery', inStock: true, description: 'A notebook', rating: 3.8 }
];

// Helper to add all expected fields to a product
function enrichProduct(product: any) {
  return {
    ...product,
    description: product.description || 'A product',
    rating: typeof product.rating === 'number' ? product.rating : 4.5
  };
}

// REST endpoints
app.get('/products', (req, res) => {
  const { category, limit } = req.query;
  let filtered = products;
  if (category) filtered = filtered.filter(p => p.category === category);
  if (limit) filtered = filtered.slice(0, Number(limit));
  res.json({ products: filtered.map(enrichProduct) });
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(enrichProduct(product));
});

app.post('/products', (req, res) => {
  const { name, price, category, inStock } = req.body;
  const newProduct = { id: `PROD-${Math.floor(Math.random()*100000)}`, name, price, category, inStock, description: name, rating: 4.5 };
  products.push(newProduct);
  res.status(201).json(enrichProduct(newProduct));
});

// Search endpoint (fully match test expectations)
app.get('/search', (req, res) => {
  console.log('=== /search endpoint called ===');
  console.log('Query params:', req.query);
  const { q, minPrice, maxPrice, sortBy, sortOrder, limit, offset } = req.query;
  let results = products.map(enrichProduct);
  if (q) results = results.filter(p => p.name.toLowerCase().includes(String(q).toLowerCase()));
  if (minPrice) results = results.filter(p => p.price >= Number(minPrice));
  if (maxPrice) results = results.filter(p => p.price <= Number(maxPrice));
  if (sortBy === 'price') {
    results = results.sort((a, b) => (sortOrder === 'desc' ? b.price - a.price : a.price - b.price));
  }
  const totalResults = results.length;
  const lim = limit ? Number(limit) : results.length;
  const off = offset ? Number(offset) : 0;
  const paged = results.slice(off, off + lim);
  const response = { results: paged, totalResults, limit: lim, offset: off };
  console.log('Response structure:', { resultCount: paged.length, totalResults, limit: lim, offset: off });
  res.json(response);
});

// GraphQL endpoint (fully match test expectations)
app.post('/graphql', (req, res) => {
  const { query, variables } = req.body;
  function hasOp(op: string) {
    return new RegExp(op + '\\b').test(query);
  }
  // SearchProducts - expects searchTerm variable
  if (hasOp('SearchProducts')) {
    let searchResults = products.map(enrichProduct);
    if (variables && variables.searchTerm) {
      searchResults = searchResults.filter(p => p.name.toLowerCase().includes(String(variables.searchTerm).toLowerCase()));
    }
    const response = { data: { searchProducts: Array.isArray(searchResults) ? searchResults : [], searchResultCount: searchResults.length } };
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
    return;
  }
  // ProductsByCategory - expects category, minPrice, maxPrice variables
  if (hasOp('ProductsByCategory')) {
    let filtered = products.map(enrichProduct);
    if (variables && variables.category) filtered = filtered.filter(p => p.category === variables.category);
    if (variables && variables.minPrice) filtered = filtered.filter(p => p.price >= variables.minPrice);
    if (variables && variables.maxPrice) filtered = filtered.filter(p => p.price <= variables.maxPrice);
    const response = { data: { productsByCategory: Array.isArray(filtered) ? filtered : [], count: filtered.length } };
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
    return;
  }
  // GetProducts - expects limit, offset variables
  if (hasOp('GetProducts')) {
    let result = products.map(enrichProduct);
    const limit = variables && variables.limit ? Number(variables.limit) : result.length;
    const offset = variables && variables.offset ? Number(variables.offset) : 0;
    result = result.slice(offset, offset + limit);
    const response = { data: { products: Array.isArray(result) ? result : [], productCount: result.length } };
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
    return;
  }
  // GetSingleProduct - expects id variable
  if (hasOp('GetSingleProduct')) {
    const product = products.find(p => p.id === (variables && variables.id));
    let response;
    if (product) {
      response = { data: { product: enrichProduct(product) } };
    } else {
      response = { data: { product: null } };
    }
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
    return;
  }
  res.status(400).json({ error: 'Unknown query' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});
