'use client';

import { isValidJson } from '@/lib/utils/json';

interface Props {
  body: string;
  isJsonMode: boolean;
  onChange: (body: string, isJsonMode: boolean) => void;
}

export default function BodyEditor({ body, isJsonMode, onChange }: Props) {
  const jsonError = body.trim() && isJsonMode ? !isValidJson(body) : false;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Body</label>
        <button
          type="button"
          onClick={() => onChange(body, !isJsonMode)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          {isJsonMode ? 'Plain Text' : 'JSON Mode'}
        </button>
      </div>
      <textarea
        value={body}
        onChange={(e) => onChange(e.target.value, isJsonMode)}
        placeholder={
          isJsonMode
            ? '{\n  "key": "value"\n}'
            : 'Enter request body...'
        }
        rows={6}
        className={`w-full border rounded px-3 py-2 text-sm font-mono ${jsonError ? 'border-red-400' : ''}`}
      />
      {jsonError && (
        <p className="text-red-500 text-xs">Body JSON tidak valid.</p>
      )}
    </div>
  );
}
