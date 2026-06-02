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
    const updated = headers.map((h, i) => (i === index ? { ...h, key: value } : h));
    onChange(updated);
  }

  function updateValue(index: number, value: string) {
    const updated = headers.map((h, i) => (i === index ? { ...h, value } : h));
    onChange(updated);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Headers</label>
        <button
          type="button"
          onClick={addHeader}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          + Add Header
        </button>
      </div>
      {headers.map((header, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Key"
            value={header.key}
            onChange={(e) => updateKey(i, e.target.value)}
            className="flex-1 border rounded px-2 py-1 text-sm"
          />
          <input
            type="text"
            placeholder="Value"
            value={header.value}
            onChange={(e) => updateValue(i, e.target.value)}
            className="flex-1 border rounded px-2 py-1 text-sm"
          />
          <button
            type="button"
            onClick={() => removeHeader(i)}
            className="text-red-500 hover:text-red-700 text-sm disabled:opacity-30"
            disabled={headers.length === 1}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
