import { BookList } from '@/widgets/book-list/BookList';
import { SearchBar } from '@/widgets/search-bar/SearchBar';

// 도서 검색 페이지.
export const SearchPage = () => (
  <div className="mx-auto flex w-[960px] flex-col items-start pt-[80px]">
    <SearchBar />
    <div className="mt-[24px] w-full">
      <BookList />
    </div>
  </div>
);
