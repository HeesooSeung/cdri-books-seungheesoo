import { useMemo, useState, useEffect } from 'react';
import { BookCard } from '@/entities/book/ui/BookCard';
import { CountText } from '@/shared/ui/count-text';
import { EmptyState } from '@/shared/ui/empty-state';
import { InfiniteSentinel } from '@/shared/ui/infinite-sentinel';
import { useFavoriteStore } from '@/features/toggle-favorite/favoriteStore';
import { PAGE_SIZE } from '@/shared/config/constants';
import { pickIsbn } from '@/shared/lib/format';

// 찜 목록 페이지. 스토어 스냅샷을 클라이언트에서 PAGE_SIZE 단위로 슬라이싱.
export const FavoritesPage = () => {
  const items = useFavoriteStore((state) => state.items);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisible((current) => Math.min(Math.max(current, PAGE_SIZE), Math.max(items.length, PAGE_SIZE)));
  }, [items.length]);

  const slice = useMemo(() => items.slice(0, visible), [items, visible]);
  const hasMore = visible < items.length;

  return (
    <div className="mx-auto w-[960px] pt-[80px]">
      <h1 className="text-h2 text-ink-title">내가 찜한 책</h1>
      <div className="mt-[12px]">
        <CountText label="찜한 책" count={items.length} />
      </div>

      <div className="mt-[36px]">
        {items.length === 0 ? (
          <div className="flex justify-center py-[120px]">
            <EmptyState label="찜한 책이 없습니다." />
          </div>
        ) : (
          <ul className="flex flex-col">
            {slice.map((book, index) => (
              <li key={`${pickIsbn(book.isbn)}-${index}`}>
                <BookCard book={book} />
              </li>
            ))}
          </ul>
        )}

        <InfiniteSentinel
          enabled={hasMore}
          onIntersect={() => setVisible((current) => current + PAGE_SIZE)}
        />
      </div>
    </div>
  );
};
