import type { BookDocument } from '@/shared/api/kakao-book';
import { BookCover } from '@/entities/book/ui/BookCover';
import { ToggleFavoriteButton } from '@/features/toggle-favorite/ToggleFavoriteButton';
import { formatAuthors } from '@/entities/book/model/selectors';
import { formatKRW, hasDiscount } from '@/shared/lib/format';

interface BookAccordionProps {
  book: BookDocument;
}

// 도서 상세 정보 아코디언. 표지/소개/원가/할인가/구매 버튼 노출.
// 제목·저자·소개는 세로 스택 — 길면 줄바꿈. 콘텐츠 길이에 따라 컨테이너 높이 가변.
export const BookAccordion = ({ book }: BookAccordionProps) => {
  const showDiscount = hasDiscount(book.price, book.sale_price);

  return (
    <div className="relative w-[960px] min-h-[344px]">
      <div className="absolute left-[54px] top-[24px] h-[280px] w-[210px]">
        <BookCover src={book.thumbnail} alt={book.title} className="h-full w-full" />
        <div className="absolute left-[178px] top-[8px]">
          <ToggleFavoriteButton book={book} size={24} />
        </div>
      </div>

      <div className="flex flex-col pb-[60px] pl-[296px] pr-[304px] pt-[44px]">
        <h3 className="break-words text-[18px] font-bold leading-[26px] text-ink-primary">
          {book.title}
        </h3>
        <p className="mt-[4px] break-words text-[14px] font-medium leading-[22px] text-ink-subtitle">
          {formatAuthors(book)}
        </p>
        <p className="mt-[20px] text-[14px] font-bold leading-[26px] text-ink-primary">책 소개</p>
        <p className="mt-[12px] whitespace-pre-wrap break-words text-[10px] font-medium leading-[16px] text-ink-primary">
          {book.contents || '소개 정보가 제공되지 않았습니다.'}
        </p>
      </div>

      {showDiscount && (
        <div className="absolute bottom-[150px] right-[20px] flex items-center justify-end gap-[8px]">
          <span className="h-[20px] w-[37px] text-right text-[10px] font-medium leading-[22px] text-ink-subtitle">
            원가
          </span>
          <span className="w-[76px] text-[18px] font-[350] leading-[26px] text-ink-primary line-through">
            {formatKRW(book.price)}
          </span>
        </div>
      )}
      <div className="absolute bottom-[116px] right-[20px] flex items-center justify-end gap-[8px]">
        <span className="h-[20px] w-[37px] text-right text-[10px] font-medium leading-[22px] text-ink-subtitle">
          {showDiscount ? '할인가' : '판매가'}
        </span>
        <span className="whitespace-nowrap text-[18px] font-bold leading-[26px] text-ink-primary">
          {formatKRW(showDiscount ? book.sale_price : book.price)}
        </span>
      </div>

      <button
        type="button"
        className="absolute bottom-[40px] right-[16px] flex h-[48px] w-[240px] items-center justify-center rounded-[8px] bg-brand text-caption text-white hover:bg-brand-hover"
        onClick={() => window.open(book.url, '_blank', 'noopener,noreferrer')}
      >
        구매하기
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-surface-divider" />
    </div>
  );
};
