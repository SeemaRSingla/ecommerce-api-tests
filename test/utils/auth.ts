/**
 * test/utils/auth.ts
 * - Builds authentication headers
 * - Supports API Key authentication
 * - Can be extended for OAuth, JWT, etc.
 */

export function getApiKeyHeader(): string | undefined {
  return process.env.API_KEY;
}

export function buildBearerToken(token: string): string {
  return `Bearer ${token}`;
}

export function buildApiKeyHeader(apiKey: string): Record<string, string> {
  return {
    'X-API-Key': apiKey,
    'Authorization': `Bearer ${apiKey}`
  };
}

export function buildBasicAuthHeader(username: string, password: string): string {
  const credentials = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
  return `Basic ${credentials}`;
}
