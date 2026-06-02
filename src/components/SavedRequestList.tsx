'use client';

import type { SavedRequestData } from '@/lib/types/api';
import { getSavedRequests, deleteSavedRequest } from '@/lib/stores/localStorage';
import { maskHeaderValue } from '@/lib/utils/maskSensitive';

interface Props {
  onLoad: (req: SavedRequestData) => void;
  refreshKey: number;
}

export default function SavedRequestList({ onLoad, refreshKey }: Props) {
  const items = getSavedRequests();

  return (
    <div className="space-y-1">
      {items.length === 0 ? (
        <p className="text-xs text-gray-400">No saved requests yet</p>
      ) : (
        items.map((req) => (
          <div
            key={req.id}
            className="group flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 cursor-pointer text-sm"
            onClick={() => onLoad(req)}
          >
            <span className={`text-xs font-mono font-bold w-12 ${
              req.method === 'GET' ? 'text-green-600' :
              req.method === 'POST' ? 'text-blue-600' :
              req.method === 'PUT' ? 'text-orange-600' :
              req.method === 'PATCH' ? 'text-purple-600' :
              'text-red-600'
            }`}>
              {req.method}
            </span>
            <span className="flex-1 truncate text-gray-700">{req.name}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); deleteSavedRequest(req.id); }}
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
