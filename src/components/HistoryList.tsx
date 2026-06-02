'use client';

import type { HistoryItem, RequestData } from '@/lib/types/api';
import { getHistory, deleteHistoryItem, clearHistory } from '@/lib/stores/localStorage';

interface Props {
  onLoad: (req: RequestData) => void;
  refreshKey: number;
}

export default function HistoryList({ onLoad, refreshKey }: Props) {
  const items = getHistory();

  return (
    <div className="space-y-1">
      {items.length > 0 && (
        <button
          type="button"
          onClick={clearHistory}
          className="text-xs text-red-500 hover:text-red-700 mb-2"
        >
          Clear all history
        </button>
      )}
      {items.length === 0 ? (
        <p className="text-xs text-gray-400">No history yet</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="group flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer text-sm"
            onClick={() => onLoad({
              method: item.method,
              url: item.url,
              headers: item.requestHeaders,
              body: item.requestBody,
            })}
          >
            <span className={`text-xs font-mono font-bold w-12 ${
              item.method === 'GET' ? 'text-green-600' :
              item.method === 'POST' ? 'text-blue-600' :
              item.method === 'PUT' ? 'text-orange-600' :
              item.method === 'PATCH' ? 'text-purple-600' :
              'text-red-600'
            }`}>
              {item.method}
            </span>
            <div className="flex-1 truncate">
              <div className="text-gray-700 truncate text-xs">{item.url}</div>
              <div className="text-gray-400 text-[10px]">
                {item.response.status ?? 'ERR'} · {item.response.responseTimeMs}ms
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}
              className="text-red-400 hover:text-red-600 text-xs opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  );
}
