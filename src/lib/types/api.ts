export interface KeyValuePair {
  key: string;
  value: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestData {
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  body: string;
}

export interface ApiResponse {
  status: number | null;
  statusText: string | null;
  headers: Record<string, string>;
  body: string;
  responseTimeMs: number;
  error: string | null;
}

export interface HistoryItem {
  id: string;
  method: HttpMethod;
  url: string;
  requestHeaders: KeyValuePair[];
  requestBody: string;
  response: ApiResponse;
  createdAt: string;
}

export interface SavedRequestData {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: KeyValuePair[];
  body: string;
  createdAt: string;
  updatedAt: string;
}
