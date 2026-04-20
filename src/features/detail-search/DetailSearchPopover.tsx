import { useState } from 'react';
import type { SearchTarget } from '@/shared/api/kakao-book';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/cn';
import { ChevronIcon } from '@/shared/ui/icons';

interface DetailSearchPopoverProps {
  trigger: React.ReactNode;
  onSubmit: (target: SearchTarget, query: string) => void;
}

const TARGETS: { label: string; value: SearchTarget }[] = [
  { label: '제목', value: 'title' },
  { label: '저자명', value: 'person' },
  { label: '출판사', value: 'publisher' },
];

export const DetailSearchPopover = ({ trigger, onSubmit }: DetailSearchPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<SearchTarget>('title');
  const [query, setQuery] = useState('');
  const [targetOpen, setTargetOpen] = useState(false);

  const activeTarget = TARGETS.find((item) => item.value === target) ?? TARGETS[0];

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    // 팝업 닫힘 시 selectbox 열림 상태 초기화.
    if (!next) setTargetOpen(false);
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    onSubmit(target, query.trim());
    setOpen(false);
    setTargetOpen(false);
    setQuery('');
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={12}
        className="h-[160px] w-[360px] border-0 bg-white p-[24px] shadow-[0px_4px_14px_6px_rgba(151,151,151,0.15)]"
      >
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-end gap-[4px]">
            <div className="relative h-[36px] w-[100px]">
              <button
                type="button"
                aria-expanded={targetOpen}
                onClick={() => setTargetOpen((prev) => !prev)}
                className="flex h-full w-full items-center justify-between border-b border-surface-divider text-body2b text-ink-primary"
              >
                <span>{activeTarget.label}</span>
                <ChevronIcon
                  dir={targetOpen ? 'up' : 'down'}
                  className="h-[14px] w-[8px] text-ink-subtitle"
                />
              </button>
              {targetOpen && (
                <ul className="absolute left-0 top-full z-10 mt-1 w-full overflow-hidden bg-white shadow-[0_0_4px_0_rgba(0,0,0,0.25)]">
                  {TARGETS.filter((item) => item.value !== target).map((item) => (
                    <li key={item.value}>
                      <button
                        type="button"
                        className={cn(
                          'block h-[30px] w-full px-[8px] text-left text-cap text-ink-subtitle hover:bg-surface-light',
                        )}
                        onClick={() => {
                          setTarget(item.value);
                          setTargetOpen(false);
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  // 상위 SearchBar Input 로 Enter 이벤트가 전파돼 전체 검색이 실행되지 않도록 차단.
                  event.preventDefault();
                  event.stopPropagation();
                  handleSubmit();
                }
              }}
              placeholder="검색어 입력"
              className="h-[36px] w-[208px] border-b border-brand px-[4px] text-cap placeholder:text-ink-subtitle"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex h-[36px] w-full items-center justify-center rounded-[8px] bg-brand text-cap text-white hover:bg-brand-hover"
          >
            검색하기
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
