import { useInfiniteQuery } from '@tanstack/react-query';
import { searchBooks } from '@/shared/api/kakao-book/searchBooks';
import type { SearchTarget } from '@/shared/api/kakao-book/types';
import { PAGE_SIZE, MAX_PAGE } from '@/shared/config/constants';

interface UseSearchBooksArgs {
  query: string;
  target?: SearchTarget;
  enabled?: boolean;
}

export const useSearchBooksInfinite = ({ query, target, enabled = true }: UseSearchBooksArgs) =>
  useInfiniteQuery({
    queryKey: ['searchBooks', { query, target }] as const,
    enabled,
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      searchBooks(
        { query, target, page: pageParam as number, size: PAGE_SIZE, sort: 'accuracy' },
        signal,
      ),
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      // is_end, 빈 응답, MAX_PAGE 초과 중 하나라도 만족하면 페이지네이션 중단.
      if (lastPage.meta.is_end || lastPage.documents.length === 0) return undefined;
      const next = (lastPageParam as number) + 1;
      return next > MAX_PAGE ? undefined : next;
    },
  });
