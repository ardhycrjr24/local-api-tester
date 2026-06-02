'use client';

import { useState } from 'react';
import type { RequestData, SavedRequestData } from '@/lib/types/api';
import SavedRequestList from './SavedRequestList';
import HistoryList from './HistoryList';

interface Props {
  onLoadRequest: (req: RequestData) => void;
  onLoadSaved: (req: SavedRequestData) => void;
  refreshKey: number;
}

type Tab = 'saved' | 'history';

export default function Sidebar({ onLoadRequest, onLoadSaved, refreshKey }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('saved');

  return (
    <aside className="w-64 border-r bg-white flex flex-col shrink-0">
      <div className="flex border-b">
        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'saved'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Saved
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          History
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'saved' ? (
          <SavedRequestList
            onLoad={(req) => onLoadSaved(req)}
            refreshKey={refreshKey}
          />
        ) : (
          <HistoryList
            onLoad={(req) => onLoadRequest(req)}
            refreshKey={refreshKey}
          />
        )}
      </div>
    </aside>
  );
}
