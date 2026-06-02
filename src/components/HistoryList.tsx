'use client';

import { useState, useEffect } from 'react';
import type { HistoryItem, RequestData } from '@/lib/types/api';
import { getHistory, deleteHistoryItem, clearHistory } from '@/lib/stores/localStorage';

interface Props {
  onLoad: (req: RequestData) => void;
  refreshKey: number;
  searchQuery: string;
}

const methodStyles: Record<string, string> = {
  GET: 'bg-emerald-100 text-emerald-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-amber-100 text-amber-700',
  PATCH: 'bg-violet-100 text-violet-700',
  DELETE: 'bg-red-100 text-red-700',
};

function statusStyle(status: number | null): string {
  if (!status) return 'text-red-500';
  if (status < 300) return 'text-emerald-600';
  if (status < 400) return 'text-sky-600';
  if (status < 500) return 'text-amber-600';
  return 'text-red-600';
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export default function HistoryList({ onLoad, refreshKey, searchQuery }: Props) {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, [refreshKey]);

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    deleteHistoryItem(id);
    setItems(getHistory());
  }

  function handleClear() {
    clearHistory();
    setItems([]);
  }

  const filtered = searchQuery.trim()
    ? items.filter(
        (h) =>
          h.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          h.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(h.response.status ?? '').includes(searchQuery)
      )
    : items;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-400 mb-1">No history yet</p>
        <p className="text-xs text-slate-300">Requests you send will appear here</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <p className="text-xs text-slate-400 text-center py-8">No results for &ldquo;{searchQuery}&rdquo;</p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-medium text-slate-400">{filtered.length} request{filtered.length > 1 ? 's' : ''}</span>
        <button
          type="button"
          onClick={handleClear}
          className="text-[11px] text-red-500 hover:text-red-700 transition-colors"
        >
          Clear all
        </button>
      </div>
      <div className="space-y-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              onLoad({
                method: item.method,
                url: item.url,
                headers: item.requestHeaders,
                body: item.requestBody,
              })
            }
            className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <span className={`inline-flex items-center justify-center w-12 py-0.5 rounded text-[10px] font-bold leading-tight shrink-0 ${methodStyles[item.method] || 'bg-slate-100 text-slate-700'}`}>
              {item.method}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-700 truncate leading-tight font-mono">{item.url}</div>
              <div className="flex items-center gap-2.5 mt-0.5">
                <span className={`text-[10px] font-semibold ${statusStyle(item.response.status)}`}>
                  {item.response.status ?? 'ERR'}
                </span>
                <span className="text-[10px] text-slate-400">{item.response.responseTimeMs}ms</span>
                <span className="text-[10px] text-slate-300 ml-auto">{timeAgo(item.createdAt)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => handleDelete(e, item.id)}
              className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-red-50"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
