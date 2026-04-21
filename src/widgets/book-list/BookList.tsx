import { useEffect, useMemo } from 'react';

import { toast } from 'sonner';

import { useSearchModeStore } from '@/features/search-books/searchModeStore';
import { useSearchBooksInfinite } from '@/features/search-books/useSearchBooksInfinite';
import { BookCard } from '@/entities/book/ui/BookCard';
import type { BookDocument } from '@/shared/api/kakao-book/types';
import { pickIsbn } from '@/shared/lib/format';
import { CountText } from '@/shared/ui/count-text';
import { EmptyState } from '@/shared/ui/empty-state';
import { InfiniteSentinel } from '@/shared/ui/infinite-sentinel';

// 검색 결과 리스트 위젯. 무한 스크롤 페이지네이션 포함.
export const BookList = () => {
  const mode = useSearchModeStore((state) => state.mode);
  const query = useSearchModeStore((state) => state.query);
  const target = useSearchModeStore((state) => state.target);

  const enabled = mode !== 'idle';

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useSearchBooksInfinite({ query, target, enabled });

  useEffect(() => {
    if (!isError) return;
    toast.error((error as Error)?.message ?? '검색 중 오류가 발생했습니다.', {
      id: `search-error:${target ?? 'general'}:${query}`,
    });
  }, [isError, error, query, target]);

  const documents = useMemo<BookDocument[]>(
    () => data?.pages.flatMap((page) => page.documents) ?? [],
    [data],
  );
  const total = data?.pages[0]?.meta.total_count ?? 0;

  return (
    <section className="flex w-[960px] flex-col">
      <CountText label="도서 검색 결과" count={enabled ? total : 0} />

      <div className="mt-[36px]">
        {!enabled || (documents.length === 0 && !isFetching) ? (
          <div className="flex justify-center py-[120px]">
            <EmptyState label="검색된 결과가 없습니다." />
          </div>
        ) : (
          <ul className="flex flex-col">
            {documents.map((book, index) => (
              <li key={`${pickIsbn(book.isbn)}-${index}`}>
                <BookCard book={book} />
              </li>
            ))}
          </ul>
        )}

        {isFetching && !isFetchingNextPage && documents.length === 0 && (
          <p className="py-6 text-center text-cap text-ink-subtitle">불러오는 중…</p>
        )}
        {isFetchingNextPage && (
          <p className="py-4 text-center text-cap text-ink-subtitle">다음 페이지 로드 중…</p>
        )}

        <InfiniteSentinel
          enabled={Boolean(hasNextPage) && !isFetchingNextPage && documents.length > 0}
          onIntersect={() => fetchNextPage()}
        />
      </div>
    </section>
  );
};
