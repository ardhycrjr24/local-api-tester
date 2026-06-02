'use client';

import { useState, useEffect } from 'react';
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
}

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const methodSelect: Record<string, string> = {
  GET: 'bg-emerald-100 text-emerald-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-amber-100 text-amber-700',
  PATCH: 'bg-violet-100 text-violet-700',
  DELETE: 'bg-red-100 text-red-700',
};

export default function RequestBuilder({ initialRequest, onResponse }: Props) {
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
  const [requestTab, setRequestTab] = useState<'headers' | 'body'>('headers');

  useEffect(() => {
    if (initialRequest) {
      setMethod(initialRequest.method);
      setUrl(initialRequest.url);
      setHeaders(initialRequest.headers);
      setBody(initialRequest.body);
      setUrlError('');
    }
  }, [initialRequest]);

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

    if (isJsonMode && body.trim() && !isValidJson(body)) return;

    setSending(true);

    const headerMap: Record<string, string> = {};
    for (const h of headers) {
      if (h.key.trim()) headerMap[h.key.trim()] = h.value;
    }

    const requestData: RequestData = { method, url: url.trim(), headers, body };

    try {
      const res = await fetch('/api/send-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, url: url.trim(), headers: headerMap, body }),
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
    }
  }

  function handleSave() {
    if (!saveName.trim()) return;
    saveRequest({
      id: crypto.randomUUID(),
      name: saveName.trim(),
      method,
      url: url.trim(),
      headers,
      body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setSaveName('');
    setShowSaveInput(false);
  }

  const needsBody = method === 'POST' || method === 'PUT' || method === 'PATCH';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
      <div className="p-4 pb-0">
        <div className="flex gap-2.5 items-center">
          <div className="relative">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
              className={`appearance-none text-[11px] font-bold px-2.5 py-1.5 pr-7 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                methodSelect[method] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlError(''); }}
              placeholder="https://api.example.com/endpoint"
              className={`w-full border rounded-lg px-3 py-2 text-sm font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${
                urlError ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
              }`}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            {urlError && (
              <p className="absolute -bottom-4.5 left-0 text-[11px] text-red-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {urlError}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[82px] justify-center"
          >
            {sending ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Send
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Send
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowSaveInput(!showSaveInput)}
            className="inline-flex items-center border border-slate-200 text-slate-500 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
            title="Save request"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {showSaveInput && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Give this request a name..."
                className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                autoFocus
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={!saveName.trim()}
                className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 border-t border-slate-100">
        <div className="flex px-4 gap-4">
          <button
            type="button"
            onClick={() => setRequestTab('headers')}
            className={`px-1 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors ${
              requestTab === 'headers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Headers
          </button>
          <button
            type="button"
            onClick={() => setRequestTab('body')}
            className={`px-1 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors ${
              requestTab === 'body'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Body
          </button>
        </div>

        <div className="p-4">
          {requestTab === 'headers' ? (
            <HeaderEditor headers={headers} onChange={setHeaders} />
          ) : needsBody ? (
            <BodyEditor
              body={body}
              isJsonMode={isJsonMode}
              onChange={(b, j) => { setBody(b); setIsJsonMode(j); }}
            />
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <p className="text-xs text-slate-400">Body not available for {method} requests</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
