import { useSearchHistoryStore } from './searchHistoryStore';
import { CloseIcon } from '@/shared/ui/icons';

interface SearchHistoryDropdownProps {
  onPick: (query: string) => void;
}

// 최근 검색 기록 드롭다운. 항목 클릭 시 검색 실행, X 버튼으로 개별 삭제.
export const SearchHistoryDropdown = ({ onPick }: SearchHistoryDropdownProps) => {
  const items = useSearchHistoryStore((state) => state.items);
  const remove = useSearchHistoryStore((state) => state.remove);

  if (items.length === 0) {
    return (
      <div className="flex h-[80px] items-center justify-center text-caption text-ink-subtitle">
        최근 검색 기록이 없습니다.
      </div>
    );
  }

  return (
    <ul className="flex flex-col py-[12px]">
      {items.map((item) => (
        <li key={item} className="flex h-[40px] items-center justify-between px-[24px]">
          <button
            type="button"
            onClick={() => onPick(item)}
            className="flex-1 truncate text-left text-caption text-ink-subtitle hover:text-ink-primary"
          >
            {item}
          </button>
          <button
            type="button"
            aria-label={`${item} 검색 기록 삭제`}
            onClick={() => remove(item)}
            className="ml-3 flex h-[24px] w-[24px] items-center justify-center text-ink-subtitle hover:text-ink-primary"
          >
            <CloseIcon className="h-[16px] w-[16px]" />
          </button>
        </li>
      ))}
    </ul>
  );
};
