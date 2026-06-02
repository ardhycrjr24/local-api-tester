# Local API Tester

A lightweight REST API testing tool built with Next.js, TypeScript, and TailwindCSS. Send HTTP requests, view responses, and manage request history — all locally in your browser.

## Features

- Send HTTP requests (GET, POST, PUT, PATCH, DELETE)
- Custom headers key-value editor
- JSON body editor with validation
- Response viewer with status, headers, body, and response time
- Pretty JSON formatting for valid JSON responses
- Request history saved to localStorage
- Saved requests with custom names
- Sensitive header masking (Authorization, Cookie, API-Key, etc.)
- URL validation

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **TailwindCSS**
- **localStorage** for data persistence
- **Next.js Route Handlers** for server-side HTTP requests

## How it works

Requests are sent from your browser to `POST /api/send-request`, which is a Next.js Route Handler that runs on the server. The server then makes the actual HTTP request to the target URL, avoiding CORS issues and keeping the request logic server-side.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm run start
```

## Privacy

- All request data (history and saved requests) is stored **only in your browser's localStorage**.
- No data is sent to any third-party server except the target APIs you explicitly request.
- Sensitive headers (Authorization, Cookie, X-API-Key, etc.) are masked in the UI.
- This application runs entirely on your local machine.

### ⚠️ Security Warning

The `/api/send-request` endpoint acts as an open proxy — it forwards any HTTP request to any URL on your behalf. This is **intended for local development only**. 

**DO NOT** deploy this application to a public server without adding proper authentication and rate limiting. Doing so would create an open proxy that anyone could abuse.

## License

MIT
