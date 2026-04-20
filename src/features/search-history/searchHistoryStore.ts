import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MAX_HISTORY, STORAGE_KEYS } from '@/shared/config/constants';

interface SearchHistoryState {
  items: string[];
  add: (query: string) => void;
  remove: (query: string) => void;
  clear: () => void;
}

// 검색 기록 스토어. 최대 8개, 중복 제거, 오래된 순 삭제, localStorage 영속.
export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      items: [],
      add: (query) =>
        set((state) => {
          const trimmed = query.trim();
          if (!trimmed) return state;
          const next = [trimmed, ...state.items.filter((item) => item !== trimmed)].slice(0, MAX_HISTORY);
          return { items: next };
        }),
      remove: (query) =>
        set((state) => ({ items: state.items.filter((item) => item !== query) })),
      clear: () => set({ items: [] }),
    }),
    { name: STORAGE_KEYS.history },
  ),
);
