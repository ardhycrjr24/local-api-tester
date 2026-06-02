import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { method, url, headers: reqHeaders, body } = await request.json();

    if (!url || !url.trim()) {
      return NextResponse.json({
        status: null,
        statusText: null,
        headers: {},
        body: '',
        responseTimeMs: 0,
        error: 'URL wajib diisi.',
      });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return NextResponse.json({
        status: null,
        statusText: null,
        headers: {},
        body: '',
        responseTimeMs: 0,
        error: 'URL tidak valid. Gunakan http:// atau https://',
      });
    }

    const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    if (!validMethods.includes(method)) {
      return NextResponse.json({
        status: null,
        statusText: null,
        headers: {},
        body: '',
        responseTimeMs: 0,
        error: `Method tidak didukung: ${method}`,
      });
    }

    const fetchOptions: RequestInit = {
      method,
      headers: reqHeaders || {},
      signal: AbortSignal.timeout(30000),
    };

    if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
      fetchOptions.body = body;
    }

    const start = performance.now();
    const response = await fetch(url, fetchOptions);
    const end = performance.now();
    const responseTimeMs = Math.round(end - start);

    const responseBody = await response.text();
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText || '',
      headers: responseHeaders,
      body: responseBody,
      responseTimeMs,
      error: null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      status: null,
      statusText: null,
      headers: {},
      body: '',
      responseTimeMs: 0,
      error: `Network error: ${message}`,
    });
  }
}
