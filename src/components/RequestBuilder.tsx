'use client';

import { useState } from 'react';
import type {
  HttpMethod,
  KeyValuePair,
  RequestData,
  ApiResponse,
  SavedRequestData,
} from '@/lib/types/api';
import { isValidJson } from '@/lib/utils/json';
import { addHistory, saveRequest } from '@/lib/stores/localStorage';
import HeaderEditor from './HeaderEditor';
import BodyEditor from './BodyEditor';

interface Props {
  initialRequest: RequestData | null;
  onResponse: (response: ApiResponse, requestData: RequestData) => void;
  onLoadingChange: (loading: boolean) => void;
}

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export default function RequestBuilder({ initialRequest, onResponse, onLoadingChange }: Props) {
  const [method, setMethod] = useState<HttpMethod>(initialRequest?.method ?? 'GET');
  const [url, setUrl] = useState(initialRequest?.url ?? '');
  const [headers, setHeaders] = useState<KeyValuePair[]>(
    initialRequest?.headers ?? [{ key: '', value: '' }]
  );
  const [body, setBody] = useState(initialRequest?.body ?? '');
  const [isJsonMode, setIsJsonMode] = useState(true);
  const [urlError, setUrlError] = useState('');
  const [sending, setSending] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  function validateUrl(): boolean {
    if (!url.trim()) {
      setUrlError('URL wajib diisi.');
      return false;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setUrlError('URL tidak valid. Gunakan http:// atau https://');
      return false;
    }
    setUrlError('');
    return true;
  }

  async function handleSend() {
    if (!validateUrl()) return;

    if (isJsonMode && body.trim()) {
      if (!isValidJson(body)) {
        return;
      }
    }

    setSending(true);
    onLoadingChange(true);

    const headerMap: Record<string, string> = {};
    for (const h of headers) {
      if (h.key.trim()) {
        headerMap[h.key.trim()] = h.value;
      }
    }

    const requestData: RequestData = { method, url: url.trim(), headers, body };

    try {
      const res = await fetch('/api/send-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          url: url.trim(),
          headers: headerMap,
          body: isJsonMode ? body : body,
        }),
      });

      const result: ApiResponse = await res.json();

      addHistory({
        id: crypto.randomUUID(),
        method,
        url: url.trim(),
        requestHeaders: headers,
        requestBody: body,
        response: result,
        createdAt: new Date().toISOString(),
      });

      onResponse(result, requestData);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      onResponse(
        {
          status: null,
          statusText: null,
          headers: {},
          body: '',
          responseTimeMs: 0,
          error: `Network error: ${errorMsg}`,
        },
        requestData
      );
    } finally {
      setSending(false);
      onLoadingChange(false);
    }
  }

  function handleSave() {
    if (!saveName.trim()) return;
    const saved: SavedRequestData = {
      id: crypto.randomUUID(),
      name: saveName.trim(),
      method,
      url: url.trim(),
      headers,
      body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveRequest(saved);
    setSaveName('');
    setShowSaveInput(false);
  }

  function needsBody(): boolean {
    return method === 'POST' || method === 'PUT' || method === 'PATCH';
  }

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
      <div className="flex gap-2 items-start">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
          className="border rounded px-3 py-2 text-sm font-medium w-28"
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <div className="flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setUrlError(''); }}
            placeholder="https://api.example.com/endpoint"
            className={`w-full border rounded px-3 py-2 text-sm font-mono ${urlError ? 'border-red-400' : ''}`}
          />
          {urlError && <p className="text-red-500 text-xs mt-1">{urlError}</p>}
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
        <button
          type="button"
          onClick={() => setShowSaveInput(!showSaveInput)}
          className="border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50"
          title="Save request"
        >
          💾
        </button>
      </div>

      {showSaveInput && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Request name..."
            className="border rounded px-3 py-1 text-sm flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={!saveName.trim()}
            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}

      <div className="space-y-4">
        <HeaderEditor headers={headers} onChange={setHeaders} />
        {needsBody() && (
          <BodyEditor
            body={body}
            isJsonMode={isJsonMode}
            onChange={(b, j) => { setBody(b); setIsJsonMode(j); }}
          />
        )}
      </div>
    </div>
  );
}
