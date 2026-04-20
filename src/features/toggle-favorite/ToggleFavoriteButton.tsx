import type { BookDocument } from '@/shared/api/kakao-book';
import { pickIsbn } from '@/shared/lib/format';
import { useFavoriteStore } from './favoriteStore';
import { cn } from '@/shared/lib/cn';
import { HeartFillIcon, HeartLineIcon } from '@/shared/ui/icons';

interface ToggleFavoriteButtonProps {
  book: BookDocument;
  size?: 16 | 24;
  className?: string;
}

// 찜 토글 버튼. 하트 아이콘 on/off.
export const ToggleFavoriteButton = ({ book, size = 24, className }: ToggleFavoriteButtonProps) => {
  const has = useFavoriteStore((state) => state.has(pickIsbn(book.isbn)));
  const toggle = useFavoriteStore((state) => state.toggle);

  const box = size === 16 ? 'h-[16px] w-[16px]' : 'h-[24px] w-[24px]';
  const icon = size === 16 ? 'h-[14px] w-[14px]' : 'h-[20px] w-[20px]';

  return (
    <button
      type="button"
      aria-label={has ? '찜 해제' : '찜하기'}
      aria-pressed={has}
      onClick={(event) => {
        event.stopPropagation();
        toggle(book);
      }}
      className={cn('inline-flex items-center justify-center transition-colors', box, className)}
    >
      {has ? (
        <HeartFillIcon className={cn(icon, 'text-danger')} />
      ) : (
        <HeartLineIcon className={cn(icon, 'text-surface-gray')} />
      )}
    </button>
  );
};
