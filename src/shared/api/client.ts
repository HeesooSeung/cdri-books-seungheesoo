import { env } from '@/shared/config/env';

const BASE_URL = 'https://dapi.kakao.com';

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST';
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

// Kakao REST fetch 래퍼.
export const kakaoFetch = async <T>({ url, method = 'GET', params, signal }: RequestOptions): Promise<T> => {
  const search = params
    ? '?' +
      new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value !== undefined && value !== '')
          .map(([key, value]) => [key, String(value)]),
      ).toString()
    : '';

  const response = await fetch(`${BASE_URL}${url}${search}`, {
    method,
    headers: {
      Authorization: `KakaoAK ${env.KAKAO_REST_KEY}`,
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message ?? `요청 실패 (${response.status})`);
  }
  return response.json() as Promise<T>;
};
