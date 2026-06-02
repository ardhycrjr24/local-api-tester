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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onChange(body, true)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
              isJsonMode ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            JSON
          </button>
          <button
            type="button"
            onClick={() => onChange(body, false)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
              !isJsonMode ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Text
          </button>
        </div>
        {jsonError && (
          <span className="text-[11px] text-red-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Invalid JSON
          </span>
        )}
      </div>
      <div className="flex-1 relative">
        <textarea
          value={body}
          onChange={(e) => onChange(e.target.value, isJsonMode)}
          placeholder={
            isJsonMode
              ? '{\n  "key": "value"\n}'
              : 'Enter request body...'
          }
          className={`w-full h-[180px] border rounded-lg px-4 py-3 text-sm font-mono leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow resize-y bg-slate-50 ${
            jsonError
              ? 'border-red-300 focus:ring-red-500'
              : 'border-slate-200 focus:ring-blue-500'
          }`}
        />
      </div>
    </div>
  );
}
