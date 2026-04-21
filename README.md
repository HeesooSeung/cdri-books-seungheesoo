# CERTICOS BOOKS

Kakao 책 검색 API 기반 SPA. 검색, 무한 스크롤, 찜 목록, 검색 기록.

---

## 프로젝트 개요

- **목표**: Kakao Open API 로 도서를 검색·조회하고 관심 도서를 로컬에 저장·관리하는 SPA.
- **주요 플로우**
  1. 일반 / 상세 검색(제목·저자·출판사·ISBN) 전환
  2. 무한 스크롤 페이지네이션
  3. 카드 → 아코디언 확장 → 상세 + 구매 링크
  4. 찜 토글 → `localStorage` 영속 → `/favorites` 에서 확인
  5. 최근 검색어 저장(최대 8개), 드롭다운으로 재사용
- **화면**: `/search` (검색), `/favorites` (찜 목록)

---

## 실행 방법 및 환경 설정

요구: Node 18+, npm 9+.

```bash
npm install
cp .env.example .env.local
# .env.local 에 VITE_KAKAO_REST_KEY 입력
npm run dev        # http://localhost:5173
```

| 환경 변수 | 용도 | 필수 |
|-----|------|------|
| `VITE_KAKAO_REST_KEY` | Kakao Developers REST API 키 | ✓ |

Kakao 키: https://developers.kakao.com → 앱 생성 → REST API 키.

> **주의**: `VITE_` 환경 변수는 클라이언트 번들에 인라인된다. 공개 배포 시 프록시 서버로 키 은닉 권장.

### 스크립트
| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입체크 + 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 로컬 프리뷰 |
| `npm run typecheck` | 타입체크만 |

---

## 폴더 구조 및 주요 코드 설명

Feature-Sliced Design. 상위 → 하위 단방향 의존.

```
src/
├── app/                # Router, providers, globals.css
├── pages/
│   ├── search/         # 검색 페이지
│   └── favorites/      # 찜 목록 페이지
├── widgets/
│   ├── header/         # GNB
│   ├── search-bar/     # 검색창 + 히스토리/상세검색 앵커
│   └── book-list/      # 무한 스크롤 리스트
├── features/
│   ├── search-books/       # useInfiniteQuery + searchMode 스토어
│   ├── detail-search/      # 상세 검색 팝업
│   ├── search-history/     # 최근 검색어 스토어 + 드롭다운
│   ├── toggle-favorite/    # 찜 토글 + 스토어
│   └── book-accordion/     # 상세 정보 (lazy chunk)
├── entities/book/          # BookCard, BookCover, formatter
└── shared/
    ├── api/                # Kakao 클라이언트 + 타입
    ├── config/             # env, constants
    ├── lib/                # cn, format
    └── ui/                 # Button, Popover, Accordion, Input, Icons
```

| 파일 | 역할 |
|------|------|
| `shared/api/kakao-book/searchBooks.ts` | Kakao `/v3/search/book` 호출 |
| `features/search-books/useSearchBooksInfinite.ts` | `useInfiniteQuery` 래퍼. `is_end` 또는 50페이지 초과 시 중단 |
| `features/search-books/searchModeStore.ts` | 일반 ↔ 상세 검색 상호 배타 상태 |
| `features/toggle-favorite/favoriteStore.ts` | 찜 스냅샷 + `localStorage` 영속 |
| `features/detail-search/DetailSearchPopover.tsx` | 일반검색 실행 시 store 구독으로 필터·입력값 자동 리셋 |
| `widgets/book-list/BookList.tsx` | IntersectionObserver 기반 페이지네이션 |
| `shared/ui/infinite-sentinel.tsx` | 콜백을 latest-ref 로 보관해 observer 재구성 방지 |
| `shared/lib/cn.ts` | `tailwind-merge` 커스텀 토큰 group 확장 |

---

## 라이브러리 선택 이유

| 라이브러리 | 이유 |
|------------|------|
| React 18 + TypeScript | 생태계 안정기. Radix / Zustand / react-query v5 모두 18 기준 검증 |
| Vite 6 | HMR / 빌드 속도, Node 18 호환 |
| Tailwind CSS v3 | Figma 토큰을 `theme.extend` 에 1:1 매핑. 유틸리티 기반 |
| Radix UI (Popover, Accordion, Slot) | 접근성·키보드 인터랙션 검증된 headless primitive |
| class-variance-authority | 컴포넌트 variant 관리 표준 |
| tailwind-merge + clsx | 조건부 클래스 + Tailwind 충돌 해결 |
| @tanstack/react-query | `useInfiniteQuery` 로 캐시·중복요청·loading/error 선언적 처리 |
| Zustand + persist | 최소 보일러플레이트, `localStorage` 동기화 한 줄 |
| React Router v6 | SPA 라우팅 표준. data router 불필요 |
| Sonner | 간결한 토스트 API |
| tailwindcss-animate | Radix `data-[state]` 애니메이션 유틸 |

---

## 강조하고 싶은 기능

1. **무한 스크롤** — IntersectionObserver 센티넬. `is_end` / MAX_PAGE 초과 시 자동 중단. 콜백은 latest-ref 로 보관해 observer 재생성 방지. react-query 캐시로 뒤로가기 즉시 복원.
2. **일반 / 상세 검색 상호 배타** — `searchModeStore` 액션 내부에서 반대편 상태 초기화. 상세 popover 는 store 구독으로 general 실행마다 필터·입력값 자동 리셋. 렌더에 불필요한 리렌더 없음.
3. **찜 스냅샷** — 찜 시점 `BookDocument` 전체 저장 → Kakao API 응답 변동과 무관하게 찜 목록은 사용자가 본 상태 그대로 유지.
4. **검색 히스토리** — 최대 8개, 중복 제거, 최신순. `localStorage` 영속.
5. **Figma 디자인 토큰 고정** — `tailwind.config.ts` 의 `ink.*`, `brand`, `surface.*` 로 Figma 값 정확히 매핑. `cn` 유틸에 `tailwind-merge` 커스텀 토큰 group 을 확장해 size/color 클래스 충돌 방지.
6. **Radix Accordion 기반 카드 전개** — BookCard 의 상세 펼침을 Radix 로 제어. `aria-expanded` / `aria-controls` / region role / smooth 애니메이션 자동.
7. **상세 아코디언 lazy 로딩** — `React.lazy` + `Suspense` 로 첫 펼침 시 chunk 동적 로드. 초기 번들에서 분리.
8. **FSD 아키텍처** — `app → pages → widgets → features → entities → shared` 단방향. 슬라이스 cross-import 금지.
