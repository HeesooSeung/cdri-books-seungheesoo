export interface BookDocument {
  title: string;
  contents: string;
  url: string;
  isbn: string;
  datetime: string;
  authors: string[];
  publisher: string;
  translators: string[];
  price: number;
  sale_price: number;
  thumbnail: string;
  status: string;
}

export interface BookSearchMeta {
  total_count: number;
  pageable_count: number;
  is_end: boolean;
}

export interface BookSearchResponse {
  meta: BookSearchMeta;
  documents: BookDocument[];
}

export type SearchTarget = 'title' | 'isbn' | 'publisher' | 'person';

export interface SearchBooksParams {
  query: string;
  sort?: 'accuracy' | 'latest';
  page?: number;
  size?: number;
  target?: SearchTarget;
}
