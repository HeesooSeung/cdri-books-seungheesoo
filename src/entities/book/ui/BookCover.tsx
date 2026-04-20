import { cn } from '@/shared/lib/cn';
import { BookIcon } from '@/shared/ui/icons';

interface BookCoverProps {
  src?: string;
  alt: string;
  className?: string;
}

// 도서 표지 이미지. URL 없거나 로드 실패 시 책 아이콘 fallback.
export const BookCover = ({ src, alt, className }: BookCoverProps) => {
  if (!src) {
    return (
      <div className={cn('flex items-center justify-center bg-surface-light', className)}>
        <BookIcon className="h-1/2 w-1/2" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={cn('object-cover', className)}
      onError={(event) => {
        (event.currentTarget as HTMLImageElement).style.visibility = 'hidden';
      }}
    />
  );
};
