import { cn } from '@/shared/lib/cn';

interface CountTextProps {
  label: string;
  count: number;
  className?: string;
}

// 카운트 텍스트. "라벨 + 총 N건" 포맷, N 은 brand 색.
export const CountText = ({ label, count, className }: CountTextProps) => (
  <div className={cn('flex items-start gap-4 text-ink-primary', className)}>
    <span className="text-b2">{label}</span>
    <span className="text-b2">
      총 <span className="text-brand">{count.toLocaleString('ko-KR')}</span>건
    </span>
  </div>
);
