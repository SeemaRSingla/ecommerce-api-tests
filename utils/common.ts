/**
 * utils/common.ts
 * - Common utility functions for tests
 */

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function normalizeContent(content: string): string {
  return content.replace(/\r\n/g, '\n').trim();
}

export function buildQueryString(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
}
