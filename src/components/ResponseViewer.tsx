'use client';

import { useState } from 'react';
import type { ApiResponse } from '@/lib/types/api';
import { formatJson } from '@/lib/utils/json';
import { maskHeaderValue } from '@/lib/utils/maskSensitive';

interface Props {
  data: ApiResponse | null;
}

type Tab = 'body' | 'headers';

export default function ResponseViewer({ data }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('body');

  function getStatusColor(status: number | null): string {
    if (!status) return 'text-gray-500';
    if (status < 300) return 'text-green-600';
    if (status < 400) return 'text-yellow-600';
    return 'text-red-600';
  }

  return (
    <div className="border rounded bg-white flex flex-col">
      <div className="px-4 py-2 border-b bg-gray-50 font-medium text-sm text-gray-700">
        Response
      </div>

      {data ? (
        <>
          <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Status:</span>
              <span className={`font-semibold ${getStatusColor(data.status)}`}>
                {data.status ?? '—'} {data.statusText ?? ''}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Time:</span>
              <span className="font-mono">{data.responseTimeMs} ms</span>
            </div>
          </div>

          {data.error && (
            <div className="px-4 py-3 bg-red-50 border-b text-red-700 text-sm">
              {data.error}
            </div>
          )}

          <div className="flex border-b">
            <button
              type="button"
              onClick={() => setActiveTab('body')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'body'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Body
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('headers')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'headers'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Headers
            </button>
          </div>

          <div className="overflow-auto max-h-96">
            {activeTab === 'body' ? (
              <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-all">
                {formatJson(data.body) || '(empty response)'}
              </pre>
            ) : (
              <div className="p-4 space-y-1">
                {Object.keys(data.headers).length === 0 ? (
                  <p className="text-gray-400 text-sm">No headers</p>
                ) : (
                  Object.entries(data.headers).map(([key, val]) => (
                    <div key={key} className="flex gap-2 text-sm">
                      <span className="font-medium text-gray-600">{key}:</span>
                      <span className="text-gray-800 break-all">
                        {maskHeaderValue(key, val)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-gray-400 text-sm">
          Send a request to see the response
        </div>
      )}
    </div>
  );
}
