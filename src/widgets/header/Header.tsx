import { NavLink } from 'react-router-dom';

import { cn } from '@/shared/lib/cn';

// GNB. 로고 + 검색/찜 탭 2개. 활성 탭 하단에 brand 색 1px 바.
const navClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative whitespace-nowrap text-b1 text-ink-primary transition-colors',
    'after:absolute after:-bottom-[6px] after:left-0 after:right-0 after:h-[1px] after:bg-brand after:origin-center after:transition-transform',
    isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100',
  );

export const Header = () => (
  <header className="h-20 w-full bg-white">
    <div className="mx-auto flex h-full max-w-[1920px] items-center px-[160px]">
      <NavLink to="/search" className="text-t1 font-bold text-ink-primary">
        CERTICOS BOOKS
      </NavLink>
      <nav className="ml-[400px] flex items-center gap-[56px]">
        <NavLink to="/search" className={navClasses}>
          도서 검색
        </NavLink>
        <NavLink to="/favorites" className={navClasses}>
          내가 찜한 책
        </NavLink>
      </nav>
    </div>
  </header>
);
