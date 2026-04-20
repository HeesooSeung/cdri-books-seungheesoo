// KRW 원화 포맷.
export const formatKRW = (value?: number | null): string => {
  if (value == null || Number.isNaN(value)) return '-';
  return `${value.toLocaleString('ko-KR')}원`;
};

// Kakao isbn 필드("isbn10 isbn13")에서 마지막 토큰 반환.
export const pickIsbn = (raw: string): string => raw.split(' ').filter(Boolean).pop() ?? raw;

// 실제 할인 존재 여부.
export const hasDiscount = (price: number, salePrice: number): boolean =>
  salePrice > 0 && salePrice !== price;
