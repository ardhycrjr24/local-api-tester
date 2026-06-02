'use client';

import { useState, useCallback } from 'react';
import type { RequestData, ApiResponse, SavedRequestData } from '@/lib/types/api';
import { getSavedRequests, saveRequest, updateSavedRequest } from '@/lib/stores/localStorage';
import Sidebar from '@/components/Sidebar';
import RequestBuilder from '@/components/RequestBuilder';
import ResponseViewer from '@/components/ResponseViewer';

export default function Home() {
  const [responseData, setResponseData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialRequest, setInitialRequest] = useState<RequestData | null>(null);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

  function handleResponse(response: ApiResponse, _requestData: RequestData) {
    setResponseData(response);
  }

  function handleLoadingChange(loading: boolean) {
    setIsLoading(loading);
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
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center shrink-0">
        <h1 className="text-lg font-semibold text-gray-800">Local API Tester</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onLoadRequest={handleLoadRequest}
          onLoadSaved={handleLoadSaved}
          refreshKey={sidebarRefreshKey}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <RequestBuilder
            key={initialRequest ? JSON.stringify(initialRequest) : 'default'}
            initialRequest={initialRequest}
            onResponse={handleResponse}
            onLoadingChange={handleLoadingChange}
          />
          <div className="px-4 pb-4">
            <ResponseViewer data={responseData} />
          </div>
        </main>
      </div>
    </div>
  );
}
