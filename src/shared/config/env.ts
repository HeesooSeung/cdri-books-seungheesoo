const KAKAO_REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY;

if (!KAKAO_REST_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[env] VITE_KAKAO_REST_KEY 누락 — Kakao 호출이 401 로 실패함.');
}

export const env = {
  KAKAO_REST_KEY: KAKAO_REST_KEY ?? '',
};
