import { create } from 'zustand';
import type { SearchTarget } from '@/shared/api/kakao-book';

export type SearchMode = 'idle' | 'general' | 'detail';

interface SearchModeState {
  mode: SearchMode;
  query: string;
  target?: SearchTarget;
  setGeneral: (query: string) => void;
  setDetail: (target: SearchTarget, query: string) => void;
  reset: () => void;
}

// 검색 모드 스토어. 일반/상세 검색 상호 배타 — 한 쪽 실행 시 반대편 초기화.
export const useSearchModeStore = create<SearchModeState>((set) => ({
  mode: 'idle',
  query: '',
  target: undefined,
  setGeneral: (query) => set({ mode: 'general', query, target: undefined }),
  setDetail: (target, query) => set({ mode: 'detail', target, query }),
  reset: () => set({ mode: 'idle', query: '', target: undefined }),
}));
