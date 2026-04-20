import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BookDocument } from '@/shared/api/kakao-book';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { pickIsbn } from '@/shared/lib/format';

interface FavoriteState {
  items: BookDocument[];
  toggle: (book: BookDocument) => void;
  remove: (isbn: string) => void;
  has: (isbn: string) => boolean;
}

// 찜 목록 스토어. ISBN 기준 중복 제거, localStorage 영속. 클릭 시점 BookDocument 스냅샷 저장.
export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (book) =>
        set((state) => {
          const key = pickIsbn(book.isbn);
          const exists = state.items.some((item) => pickIsbn(item.isbn) === key);
          return {
            items: exists
              ? state.items.filter((item) => pickIsbn(item.isbn) !== key)
              : [book, ...state.items],
          };
        }),
      remove: (isbn) =>
        set((state) => ({ items: state.items.filter((item) => pickIsbn(item.isbn) !== isbn) })),
      has: (isbn) => get().items.some((item) => pickIsbn(item.isbn) === isbn),
    }),
    { name: STORAGE_KEYS.favorites },
  ),
);
