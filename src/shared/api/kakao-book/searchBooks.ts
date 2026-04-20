import { kakaoFetch } from '@/shared/api/client';
import type { BookSearchResponse, SearchBooksParams } from './types';

// Kakao /v3/search/book.
export const searchBooks = (params: SearchBooksParams, signal?: AbortSignal) =>
  kakaoFetch<BookSearchResponse>({
    method: 'GET',
    url: '/v3/search/book',
    params: { ...params },
    signal,
  });
