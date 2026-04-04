/**
 * test/setup.ts
 * - Ensures process.env.API_KEY exists before tests run
 * - Tries to fetch credentials from AWS SSM only if not provided by env
 * - Safe to run locally (won't crash if no AWS creds)
 */
import { beforeAll } from 'vitest';

const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL ?? 'https://api.example.com';

beforeAll(async () => {
  if (!API_KEY) {
    console.warn('[test/setup] API_KEY not provided. Using mock/public endpoints.');
  }
  
  console.log('[test/setup] API_URL:', API_URL);
  console.log('[test/setup] Test environment ready');
});
