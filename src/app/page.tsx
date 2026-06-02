'use client';

import { useState, useCallback } from 'react';
import type { RequestData, ApiResponse, SavedRequestData } from '@/lib/types/api';
import Sidebar from '@/components/Sidebar';
import RequestBuilder from '@/components/RequestBuilder';
import ResponseViewer from '@/components/ResponseViewer';

export default function Home() {
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  const [initialRequest, setInitialRequest] = useState<RequestData | null>(null);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

  function handleResponse(response: ApiResponse, _requestData: RequestData) {
    setResponseData(response);
  }

  const handleLoadRequest = useCallback((req: RequestData) => {
    setInitialRequest({ ...req });
    setSidebarRefreshKey((k) => k + 1);
  }, []);

  const handleLoadSaved = useCallback((req: SavedRequestData) => {
    setInitialRequest({
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
    });
    setSidebarRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold shadow-xs">
          L
        </div>
        <div className="flex items-baseline gap-3">
          <h1 className="text-[15px] font-semibold text-slate-800 tracking-tight">Local API Tester</h1>
          <span className="text-[11px] text-slate-400 hidden sm:inline">Lightweight REST client</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
            Local-first
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onLoadRequest={handleLoadRequest}
          onLoadSaved={handleLoadSaved}
          refreshKey={sidebarRefreshKey}
        />

        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
            <RequestBuilder
              key={initialRequest ? JSON.stringify(initialRequest) : 'default'}
              initialRequest={initialRequest}
              onResponse={handleResponse}
            />
            <div className="flex-1 flex flex-col min-h-0">
              <ResponseViewer data={responseData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
