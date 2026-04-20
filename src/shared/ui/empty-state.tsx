import { cn } from '@/shared/lib/cn';
import { BookIcon } from '@/shared/ui/icons';

interface EmptyStateProps {
  label: string;
  className?: string;
}

// 검색/찜 빈 상태 공통 컴포넌트.
export const EmptyState = ({ label, className }: EmptyStateProps) => (
  <div className={cn('flex h-[120px] w-[160px] flex-col items-center', className)}>
    <BookIcon className="h-[80px] w-[80px]" />
    <p className="mt-[24px] whitespace-nowrap text-center text-caption text-ink-secondary">
      {label}
    </p>
  </div>
);
