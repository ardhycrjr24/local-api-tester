'use client';

import type { KeyValuePair } from '@/lib/types/api';

interface Props {
  headers: KeyValuePair[];
  onChange: (headers: KeyValuePair[]) => void;
}

export default function HeaderEditor({ headers, onChange }: Props) {
  function addHeader() {
    onChange([...headers, { key: '', value: '' }]);
  }

  function removeHeader(index: number) {
    onChange(headers.filter((_, i) => i !== index));
  }

  function updateKey(index: number, value: string) {
    onChange(headers.map((h, i) => (i === index ? { ...h, key: value } : h)));
  }

  function updateValue(index: number, value: string) {
    onChange(headers.map((h, i) => (i === index ? { ...h, value } : h)));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Key</span>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider -ml-12">Value</span>
        <button
          type="button"
          onClick={addHeader}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>
      <div className="space-y-1.5">
        {headers.map((header, i) => (
          <div key={i} className="flex gap-2 items-center group">
            <input
              type="text"
              placeholder="Key"
              value={header.key}
              onChange={(e) => updateKey(i, e.target.value)}
              className="flex-1 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
            <input
              type="text"
              placeholder="Value"
              value={header.value}
              onChange={(e) => updateValue(i, e.target.value)}
              className="flex-1 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
            <button
              type="button"
              onClick={() => removeHeader(i)}
              className="p-1.5 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-20 rounded-md hover:bg-red-50"
              disabled={headers.length === 1}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
