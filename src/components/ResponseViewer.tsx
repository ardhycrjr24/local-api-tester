'use client';

import { useState } from 'react';
import type { ApiResponse } from '@/lib/types/api';
import { formatJson } from '@/lib/utils/json';
import { maskHeaderValue } from '@/lib/utils/maskSensitive';

interface Props {
  data: ApiResponse | null;
}

type Tab = 'body' | 'headers';

function getStatusBadge(status: number | null): { label: string; classes: string } {
  if (!status) return { label: 'ERROR', classes: 'bg-red-100 text-red-700 ring-red-200' };
  if (status < 200) return { label: `${status}`, classes: 'bg-slate-100 text-slate-700 ring-slate-200' };
  if (status < 300) return { label: `${status} OK`, classes: 'bg-emerald-100 text-emerald-700 ring-emerald-200' };
  if (status < 400) return { label: `${status}`, classes: 'bg-sky-100 text-sky-700 ring-sky-200' };
  if (status < 500) return { label: `${status}`, classes: 'bg-amber-100 text-amber-700 ring-amber-200' };
  return { label: `${status}`, classes: 'bg-red-100 text-red-700 ring-red-200' };
}

export default function ResponseViewer({ data }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('body');

  const isEmpty = !data;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1 min-h-0">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Response</h2>
          {data && data.status && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ring-1 ring-inset ${getStatusBadge(data.status).classes}`}>
              {getStatusBadge(data.status).label}
            </span>
          )}
          {data && data.error && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700 ring-1 ring-red-200">
              ERROR
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {data && !data.error && data.status && (
            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {data.responseTimeMs} ms
            </span>
          )}
          {data && (
            <span className="text-[11px] text-slate-400 font-mono">
              {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())}
            </span>
          )}
        </div>
      </div>

      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-16 text-center min-h-[260px]">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
            <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1.5">Send a request to see the response</p>
          <p className="text-xs text-slate-400">
            Try{' '}
            <span
              className="text-blue-600 hover:text-blue-700 cursor-pointer font-mono"
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>('input[placeholder*="api.example"]');
                if (input) {
                  input.value = 'https://jsonplaceholder.typicode.com/posts/1';
                  input.dispatchEvent(new Event('input', { bubbles: true }));
                  input.focus();
                }
              }}
            >
              GET https://jsonplaceholder.typicode.com/posts/1
            </span>
          </p>
        </div>
      ) : (
        <>
          {data.error && (
            <div className="mx-4 mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 shrink-0">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{data.error}</span>
            </div>
          )}

          <div className="flex border-b border-slate-100 px-5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('body')}
              className={`px-1 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors ${
                activeTab === 'body'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Body
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('headers')}
              className={`px-1 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors ${
                activeTab === 'headers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Headers
              {Object.keys(data.headers).length > 0 && (
                <span className="ml-1.5 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                  {Object.keys(data.headers).length}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-auto min-h-[260px] max-h-[420px]">
            {activeTab === 'body' ? (
              <pre className="p-5 text-sm font-mono leading-relaxed whitespace-pre-wrap break-all bg-slate-900 text-slate-100 min-h-[260px] overflow-x-auto">
                <code>{formatJson(data.body) || <span className="text-slate-500 italic">empty response</span>}</code>
              </pre>
            ) : (
              <div className="p-5">
                {Object.keys(data.headers).length === 0 ? (
                  <p className="text-sm text-slate-400">No response headers</p>
                ) : (
                  <div className="space-y-0">
                    {Object.entries(data.headers).map(([key, val]) => (
                      <div key={key} className="flex gap-4 py-1.5 border-b border-slate-50 last:border-0">
                        <span className="text-xs font-medium text-slate-500 shrink-0 min-w-[160px] break-all">{key}</span>
                        <span className="text-xs text-slate-800 break-all font-mono leading-relaxed">
                          {maskHeaderValue(key, val)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
