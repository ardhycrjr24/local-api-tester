import type { HistoryItem, SavedRequestData } from '@/lib/types/api';

const HISTORY_KEY = 'local-api-tester:history';
const SAVED_KEY = 'local-api-tester:saved-requests';

function getItems<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setItems<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function getHistory(): HistoryItem[] {
  return getItems<HistoryItem>(HISTORY_KEY);
}

export function addHistory(item: HistoryItem): void {
  const items = getHistory();
  items.unshift(item);
  setItems(HISTORY_KEY, items.slice(0, 100));
}

export function deleteHistoryItem(id: string): void {
  const items = getHistory().filter((h) => h.id !== id);
  setItems(HISTORY_KEY, items);
}

export function clearHistory(): void {
  setItems(HISTORY_KEY, []);
}

export function getSavedRequests(): SavedRequestData[] {
  return getItems<SavedRequestData>(SAVED_KEY);
}

export function saveRequest(item: SavedRequestData): void {
  const items = getSavedRequests();
  const idx = items.findIndex((r) => r.id === item.id);
  if (idx >= 0) {
    items[idx] = item;
  } else {
    items.push(item);
  }
  setItems(SAVED_KEY, items);
}

export function deleteSavedRequest(id: string): void {
  const items = getSavedRequests().filter((r) => r.id !== id);
  setItems(SAVED_KEY, items);
}

export function updateSavedRequest(id: string, data: Partial<SavedRequestData>): void {
  const items = getSavedRequests();
  const idx = items.findIndex((r) => r.id === id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
    setItems(SAVED_KEY, items);
  }
}
