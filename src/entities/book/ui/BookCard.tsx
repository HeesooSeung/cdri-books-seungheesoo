import { useState } from 'react';
import type { BookDocument } from '@/shared/api/kakao-book';
import { BookCover } from './BookCover';
import { ToggleFavoriteButton } from '@/features/toggle-favorite/ToggleFavoriteButton';
import { BookAccordion } from '@/features/book-accordion/BookAccordion';
import { formatAuthors, displayPrice } from '@/entities/book/model/selectors';
import { formatKRW } from '@/shared/lib/format';
import { cn } from '@/shared/lib/cn';
import { ChevronIcon } from '@/shared/ui/icons';

interface BookCardProps {
  book: BookDocument;
}

// 도서 한 건 카드. 상세보기 토글 시 BookAccordion 펼침.
export const BookCard = ({ book }: BookCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-[960px] bg-white">
      <div className="relative h-[100px]">
        <div className="absolute left-[48px] top-[16px] h-[68px] w-[48px]">
          <BookCover src={book.thumbnail} alt={book.title} className="h-full w-full" />
          <div className="absolute left-[32px] top-0">
            <ToggleFavoriteButton book={book} size={16} />
          </div>
        </div>

        <div className="absolute left-[144px] top-[41px] flex w-[408px] items-center gap-[16px] whitespace-nowrap">
          <span
            title={book.title}
            className="min-w-0 flex-1 truncate text-[18px] font-bold leading-[18px] text-ink-primary"
          >
            {book.title}
          </span>
          <span
            title={formatAuthors(book)}
            className="max-w-[160px] shrink-0 truncate text-body2 text-ink-secondary"
          >
            {formatAuthors(book)}
          </span>
        </div>

        <p className="absolute right-[310px] top-[41px] whitespace-nowrap text-right text-[18px] font-bold leading-[18px] text-ink-primary">
          {formatKRW(displayPrice(book))}
        </p>

        <button
          type="button"
          className="absolute right-[139px] top-[26px] flex h-[48px] w-[115px] items-center justify-center rounded-[8px] bg-brand text-caption text-white hover:bg-brand-hover"
          onClick={() => window.open(book.url, '_blank', 'noopener,noreferrer')}
        >
          구매하기
        </button>

        <button
          type="button"
          aria-expanded={open}
          className="absolute right-[16px] top-[26px] flex h-[48px] w-[115px] items-center justify-between rounded-[8px] bg-surface-light pl-[20px] pr-[17px] text-caption text-ink-secondary hover:bg-surface-light/70"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>상세보기</span>
          <ChevronIcon
            dir={open ? 'up' : 'down'}
            className={cn('h-[14px] w-[8px] text-ink-secondary transition-transform')}
          />
        </button>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-surface-divider" />
      </div>

      {open && <BookAccordion book={book} />}
    </div>
  );
};
