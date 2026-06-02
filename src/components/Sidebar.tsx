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
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <aside className="w-[300px] border-r border-slate-200 bg-white flex flex-col shrink-0">
      <div className="p-3 pb-2">
        <div className="bg-slate-100 rounded-lg p-0.5 flex">
          <button
            type="button"
            onClick={() => { setActiveTab('saved'); setSearchQuery(''); }}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'saved'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Saved
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('history'); setSearchQuery(''); }}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'history'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <svg className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>
        </div>
      </div>

      <div className="px-3 pb-2">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 transition-shadow"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {activeTab === 'saved' ? (
          <SavedRequestList onLoad={(req) => onLoadSaved(req)} refreshKey={refreshKey} searchQuery={searchQuery} />
        ) : (
          <HistoryList onLoad={(req) => onLoadRequest(req)} refreshKey={refreshKey} searchQuery={searchQuery} />
        )}
      </div>
    </aside>
  );
}
