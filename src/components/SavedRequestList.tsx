'use client';

import { useState, useEffect } from 'react';
import type { SavedRequestData } from '@/lib/types/api';
import { getSavedRequests, deleteSavedRequest } from '@/lib/stores/localStorage';

interface Props {
  onLoad: (req: SavedRequestData) => void;
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

export default function SavedRequestList({ onLoad, refreshKey, searchQuery }: Props) {
  const [items, setItems] = useState<SavedRequestData[]>([]);

  useEffect(() => {
    setItems(getSavedRequests());
  }, [refreshKey]);

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    deleteSavedRequest(id);
    setItems(getSavedRequests());
  }

  const filtered = searchQuery.trim()
    ? items.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.url.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-400 mb-1">No saved requests</p>
        <p className="text-xs text-slate-300">Save a request to reuse it later</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <p className="text-xs text-slate-400 text-center py-8">No results for &ldquo;{searchQuery}&rdquo;</p>
    );
  }

  return (
    <div className="space-y-1">
      {filtered.map((req) => (
        <div
          key={req.id}
          onClick={() => onLoad(req)}
          className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <span className={`inline-flex items-center justify-center w-12 py-0.5 rounded text-[10px] font-bold leading-tight shrink-0 ${methodStyles[req.method] || 'bg-slate-100 text-slate-700'}`}>
            {req.method}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-700 truncate leading-tight">{req.name}</div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">{req.url}</div>
          </div>
          <button
            type="button"
            onClick={(e) => handleDelete(e, req.id)}
            className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-red-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
