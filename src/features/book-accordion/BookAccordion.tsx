import type { BookDocument } from '@/shared/api/kakao-book';
import { BookCover } from '@/entities/book/ui/BookCover';
import { ToggleFavoriteButton } from '@/features/toggle-favorite/ToggleFavoriteButton';
import { formatAuthors } from '@/entities/book/model/selectors';
import { formatKRW, hasDiscount } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';

interface BookAccordionProps {
  book: BookDocument;
}

// 도서 상세 정보 아코디언. 표지/본문/가격·구매 3 컬럼 flex.
// 제목·저자·소개는 세로 스택 — 한국어 긴 제목 대응 위해 figma horizontal 대신 vertical 유지.
export const BookAccordion = ({ book }: BookAccordionProps) => {
  const showDiscount = hasDiscount(book.price, book.sale_price);

  return (
    <div className="flex min-h-[344px] w-[960px] gap-[32px] border-b border-surface-divider pb-[40px] pl-[54px] pr-[16px] pt-[24px]">
      <div className="relative h-[280px] w-[210px] shrink-0">
        <BookCover src={book.thumbnail} alt={book.title} className="h-full w-full" />
        <ToggleFavoriteButton
          book={book}
          size={24}
          className="absolute left-[178px] top-[8px]"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col pt-[20px]">
        <h3 className="break-words text-title3 text-ink-primary">{book.title}</h3>
        <p className="mt-[4px] break-words text-cap text-ink-subtitle">{formatAuthors(book)}</p>
        <p className="mt-[20px] text-cap font-bold text-ink-primary">책 소개</p>
        <p className="mt-[12px] whitespace-pre-wrap break-words text-small font-medium leading-[16px] text-ink-primary">
          {book.contents || '소개 정보가 제공되지 않았습니다.'}
        </p>
      </div>

      <div className="flex w-[240px] shrink-0 flex-col items-end justify-end">
        <div className="flex flex-col items-end gap-[8px]">
          {showDiscount && (
            <div className="flex items-center gap-[8px]">
              <span className="w-[37px] text-right text-tiny text-ink-subtitle">원가</span>
              <span className="w-[76px] font-[350] leading-[26px] text-title3 text-ink-primary line-through">
                {formatKRW(book.price)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-[8px]">
            <span className="w-[37px] text-right text-tiny text-ink-subtitle">
              {showDiscount ? '할인가' : '판매가'}
            </span>
            <span className="whitespace-nowrap text-title3 text-ink-primary">
              {formatKRW(showDiscount ? book.sale_price : book.price)}
            </span>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          className="mt-[28px] w-full text-caption"
          onClick={() => window.open(book.url, '_blank', 'noopener,noreferrer')}
        >
          구매하기
        </Button>
      </div>
    </div>
  );
};
