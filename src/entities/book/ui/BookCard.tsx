import { Suspense, lazy, memo } from 'react';
import type { BookDocument } from '@/shared/api/kakao-book/types';
import { BookCover } from './BookCover';
import { ToggleFavoriteButton } from '@/features/toggle-favorite/ToggleFavoriteButton';
import { formatAuthors, displayPrice } from '@/entities/book/model/selectors';
import { formatKRW } from '@/shared/lib/format';
import { ChevronIcon } from '@/shared/ui/icons';
import { Button } from '@/shared/ui/button';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from '@/shared/ui/accordion';

// 상세보기 펼침 시점에만 코드 분할 로드 — 초기 번들에서 제외.
const BookAccordion = lazy(() =>
  import('@/features/book-accordion/BookAccordion').then((m) => ({ default: m.BookAccordion })),
);

interface BookCardProps {
  book: BookDocument;
}

// 도서 한 건 카드. Radix Accordion 으로 상세 펼침 제어. 상세보기 버튼만 Trigger 로 지정.
const BookCardComponent = ({ book }: BookCardProps) => (
  <Accordion type="single" collapsible>
    <AccordionItem value="detail" className="w-[960px] bg-white">
      <div className="flex h-[100px] items-center border-b border-surface-divider">
        <div className="relative ml-[48px] h-[68px] w-[48px] shrink-0">
          <BookCover src={book.thumbnail} alt={book.title} className="h-full w-full" />
          <ToggleFavoriteButton
            book={book}
            size={16}
            className="absolute left-[32px] top-0"
          />
        </div>

        <div className="ml-[48px] flex w-[408px] shrink-0 items-center gap-[16px] whitespace-nowrap">
          <span
            title={book.title}
            className="min-w-0 max-w-[232px] truncate text-title3 text-ink-primary"
          >
            {book.title}
          </span>
          <span
            title={formatAuthors(book)}
            className="min-w-0 max-w-[160px] shrink truncate text-body2 text-ink-secondary"
          >
            {formatAuthors(book)}
          </span>
        </div>

        <p className="ml-auto whitespace-nowrap text-right text-title3 text-ink-primary">
          {formatKRW(displayPrice(book))}
        </p>

        <Button
          variant="primary"
          size="md"
          className="ml-[56px] w-[115px] text-caption"
          onClick={() => window.open(book.url, '_blank', 'noopener,noreferrer')}
        >
          구매하기
        </Button>

        <AccordionHeader className="inline-flex">
          <AccordionTrigger asChild>
            <Button
              variant="subtle"
              size="md"
              className="group ml-[8px] mr-[16px] w-[115px] justify-between pl-[20px] pr-[17px] text-caption"
            >
              <span>상세보기</span>
              <ChevronIcon
                dir="down"
                className="h-[14px] w-[8px] text-ink-secondary group-data-[state=open]:-rotate-90"
              />
            </Button>
          </AccordionTrigger>
        </AccordionHeader>
      </div>

      <AccordionContent>
        <Suspense fallback={null}>
          <BookAccordion book={book} />
        </Suspense>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export const BookCard = memo(BookCardComponent);
BookCard.displayName = 'BookCard';
