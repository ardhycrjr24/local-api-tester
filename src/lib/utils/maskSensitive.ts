const SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'x-api-key',
  'api-key',
  'proxy-authorization',
];

export function maskHeaderValue(key: string, value: string): string {
  if (SENSITIVE_HEADERS.includes(key.toLowerCase())) {
    if (value.length <= 8) return '*'.repeat(value.length);
    return value.slice(0, 4) + '*'.repeat(Math.min(value.length - 4, 12)) + value.slice(-4);
  }
  return value;
}

export function isSensitiveHeader(key: string): boolean {
  return SENSITIVE_HEADERS.includes(key.toLowerCase());
}
