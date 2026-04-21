import type { BookDocument } from '@/shared/api/kakao-book/types';
import { hasDiscount } from '@/shared/lib/format';

// 저자 + 역자 콤마 결합.
export const formatAuthors = (book: BookDocument): string => {
  const all = [...book.authors, ...book.translators];
  return all.length ? all.join(', ') : '-';
};

// 카드 대표가 (할인 시 sale_price, 아니면 price).
export const displayPrice = (book: BookDocument): number =>
  hasDiscount(book.price, book.sale_price) ? book.sale_price : book.price;
