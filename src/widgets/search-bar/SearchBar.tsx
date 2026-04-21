import { useState, useCallback } from 'react';
import { Input } from '@/shared/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '@/shared/ui/popover';
import { SearchHistoryDropdown } from '@/features/search-history/SearchHistoryDropdown';
import { DetailSearchPopover } from '@/features/detail-search/DetailSearchPopover';
import { useSearchHistoryStore } from '@/features/search-history/searchHistoryStore';
import { useSearchModeStore } from '@/features/search-books/searchModeStore';
import { SearchIcon } from '@/shared/ui/icons';

// 검색창 위젯. Enter 시 일반 검색, 상세검색 버튼 시 상세 검색 팝업 노출.
export const SearchBar = () => {
  const [value, setValue] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);

  const historyItems = useSearchHistoryStore((state) => state.items);
  const addHistory = useSearchHistoryStore((state) => state.add);
  const setGeneral = useSearchModeStore((state) => state.setGeneral);
  const setDetail = useSearchModeStore((state) => state.setDetail);
  const resetMode = useSearchModeStore((state) => state.reset);

  const runGeneral = useCallback(
    (query: string) => {
      addHistory(query);
      setGeneral(query);
      setValue(query);
      setHistoryOpen(false);
    },
    [addHistory, setGeneral],
  );

  const runDetail = useCallback(
    (target: Parameters<typeof setDetail>[0], query: string) => {
      setValue('');
      if (!query) {
        resetMode();
        return;
      }
      setDetail(target, query);
    },
    [setDetail, resetMode],
  );

  const popoverOpen = historyOpen && historyItems.length > 0;

  return (
    <div className="relative flex h-[103px] w-[568px] flex-col">
      <h1 className="text-t2 text-ink-title">도서 검색</h1>

      <Popover open={popoverOpen} onOpenChange={setHistoryOpen}>
        <PopoverAnchor asChild>
          <div data-search-row className="absolute bottom-0 left-0 right-0 flex items-center">
            <div className="flex h-[51px] w-[480px] items-center gap-[11px] rounded-[100px] bg-surface-light pl-[10px] pr-[10px]">
              <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center">
                <SearchIcon className="h-[20px] w-[20px] text-ink-primary" />
              </span>
              <Input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                onFocus={() => setHistoryOpen(true)}
                onBlur={(event) => {
                  const next = event.relatedTarget as HTMLElement | null;
                  if (next?.closest('[data-history-popover]')) return;
                  setHistoryOpen(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') runGeneral(value);
                  if (event.key === 'Escape') setHistoryOpen(false);
                }}
                placeholder="검색어를 입력하세요"
                className="h-full flex-1 bg-transparent text-caption"
              />
            </div>

            <DetailSearchPopover
              trigger={
                <button
                  type="button"
                  className="ml-[16px] flex h-[35px] w-[72px] items-center justify-center rounded-[8px] border border-ink-subtitle bg-white text-body2 text-ink-subtitle"
                >
                  상세검색
                </button>
              }
              onSubmit={runDetail}
            />
          </div>
        </PopoverAnchor>

        <PopoverContent
          data-history-popover
          className="w-[480px] rounded-[24px] border-0 bg-surface-light p-0 shadow-none"
          sideOffset={4}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            const target = event.target as Element;
            if (target.closest('[data-search-row]')) event.preventDefault();
          }}
          onFocusOutside={(event) => {
            const target = event.target as Element;
            if (target.closest('[data-search-row]')) event.preventDefault();
          }}
        >
          <SearchHistoryDropdown onPick={(query) => runGeneral(query)} />
        </PopoverContent>
      </Popover>
    </div>
  );
};
