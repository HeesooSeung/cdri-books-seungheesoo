# CERTICOS BOOKS

Kakao 책 검색 API 기반 SPA. 키워드/상세 검색, 무한 스크롤, 찜 목록, 검색 기록 관리를 제공.

---

## 프로젝트 개요

- **목표**: Kakao Open API를 활용해 도서를 검색하고, 관심 도서를 찜 목록에 저장·관리하는 단일 페이지 애플리케이션.
- **핵심 플로우**
  1. 일반 검색 / 상세 검색(제목·저자·출판사·ISBN) 전환
  2. 무한 스크롤로 결과 페이지네이션
  3. 도서 카드 → 아코디언 확장 → 상세 정보 + 구매 링크
  4. 찜 버튼 토글 → `localStorage` 영속 → `/favorites`에서 확인
  5. 최근 검색어 자동 저장(최대 8개), 드롭다운으로 재사용
- **화면**: `/` (검색), `/favorites` (찜 목록)

---

## 실행 방법 및 환경 설정

### 요구 사항
- Node.js 18+ (Vite 6 요구)
- npm 9+

### 설치 및 실행
```bash
npm install
cp .env.example .env.local
# .env.local 에서 VITE_KAKAO_REST_KEY 값에 Kakao REST API 키를 입력
npm run dev        # http://localhost:5173
```

### 환경 변수
| Key | 용도 | 필수 |
|-----|------|------|
| `VITE_KAKAO_REST_KEY` | Kakao Developers REST API 키 (`Authorization: KakaoAK <key>`) | ✓ |

Kakao 키 발급: https://developers.kakao.com → 앱 생성 → REST API 키 복사.

#### ⚠️ 키 노출 주의
`VITE_` prefix 환경 변수는 Vite 가 **클라이언트 번들에 plain text 로 인라인** 한다. 배포된 `dist/assets/*.js` 에 키가 그대로 노출되므로 DevTools 로 추출 가능.

REST API 는 `Authorization: KakaoAK <key>` 헤더만 검증하므로, 브라우저에서 직접 호출하는 한 효과적인 키 은닉 수단은 사실상 **프록시 서버 분리** 하나임.

**권장 조치**:
- 별도 서버리스 함수 (Vercel Functions / Cloudflare Workers 등) 에 Kakao API 호출을 위임하고, 클라이언트는 자사 프록시 엔드포인트만 호출. 키는 서버 env 로 이동.
- 프록시에 Origin / Referer 검사 + rate limit 를 걸어 쿼터 남용 방지.

현재 구현은 단일 SPA 범위로 **클라이언트 직접 호출** 전제. 공개 배포 전 프록시 도입 권장.

### 스크립트
| 명령 | 설명 |
|------|------|
| `npm run dev` | Vite 개발 서버 (5173) |
| `npm run build` | `tsc -b` 타입체크 + Vite 프로덕션 빌드 |
| `npm run preview` | `dist/` 로컬 프리뷰 |
| `npm run typecheck` | `tsc --noEmit` |

---

## 폴더 구조 및 주요 코드 설명

Feature-Sliced Design(FSD). 상위 레이어 → 하위 레이어만 import 가능.

```
src/
├── app/          # 애플리케이션 루트
│   ├── App.tsx           # Router 정의 (SearchPage / FavoritesPage)
│   ├── providers/        # QueryClientProvider 등 전역 provider
│   └── styles/globals.css # Tailwind base + 전역 규칙
│
├── pages/
│   ├── search/SearchPage.tsx       # 검색 결과 레이아웃 + SearchBar + BookList
│   └── favorites/FavoritesPage.tsx # 찜 목록 뷰
│
├── widgets/
│   ├── header/Header.tsx       # 상단 네비 (검색 / 내 찜 링크)
│   ├── search-bar/SearchBar.tsx # 입력 + 상세 검색 팝오버 + 히스토리 드롭다운
│   └── book-list/BookList.tsx   # 무한 스크롤 리스트 + 센티넬
│
├── features/
│   ├── search-books/
│   │   ├── useSearchBooksInfinite.ts # react-query useInfiniteQuery 래퍼
│   │   └── searchModeStore.ts        # 일반/상세 검색 상태 (상호 초기화)
│   ├── detail-search/DetailSearchPopover.tsx # 제목·저자·출판사·ISBN 필터 UI
│   ├── search-history/
│   │   ├── searchHistoryStore.ts      # Zustand + persist, 최대 8개
│   │   └── SearchHistoryDropdown.tsx  # 최근 검색어 드롭다운
│   ├── toggle-favorite/
│   │   ├── favoriteStore.ts           # 찜 스냅샷 저장 (BookDocument 전체)
│   │   └── ToggleFavoriteButton.tsx   # 하트 아이콘 버튼
│   └── book-accordion/BookAccordion.tsx # 상세 정보 + 구매 링크
│
├── entities/
│   ├── book/
│   │   ├── model/selectors.ts   # formatAuthors, hasDiscount 등
│   │   └── ui/                  # BookCard, BookCover
│   └── favorite/model/          # 찜 도메인 모델
│
└── shared/
    ├── api/
    │   ├── client.ts                    # fetch 래퍼
    │   └── kakao-book/{searchBooks,types,index}.ts # Kakao 엔드포인트 + 타입
    ├── config/{env,constants}.ts         # 환경/상수
    ├── lib/{cn,format}.ts                # className 머지, 포맷터
    ├── ui/                               # 공용 UI (popover, input, icons 등)
    └── assets/                           # 이미지/아이콘
```

### 핵심 파일 요약

| 파일 | 역할 |
|------|------|
| `shared/api/kakao-book/searchBooks.ts` | Kakao `/v3/search/book` 호출. 쿼리/페이지/대상(target) 파라미터 조합 |
| `features/search-books/useSearchBooksInfinite.ts` | `useInfiniteQuery`. `is_end` 또는 page 50 초과 시 `getNextPageParam`에서 중단 |
| `features/search-books/searchModeStore.ts` | 일반↔상세 검색 상태 전환. `setGeneral` / `setDetail` 액션에서 반대편 상태 초기화 |
| `features/toggle-favorite/favoriteStore.ts` | Zustand + `persist`. 찜 시점의 `BookDocument` 전체를 스냅샷으로 저장 |
| `widgets/book-list/BookList.tsx` | `IntersectionObserver` 센티넬로 다음 페이지 로드 트리거 |
| `shared/ui/popover.tsx` | Radix Popover 래퍼 |

---

## 라이브러리 선택 이유

| 라이브러리 | 선택 이유 |
|------------|-----------|
| **React 18 + TypeScript** | 생태계 안정기. Radix/Zustand/TanStack Query v5 모두 18 기준 검증. React 19 신기능(Actions, Compiler) 불필요한 SPA 스코프 |
| **Vite 6** | HMR/빌드 속도, 플러그인(`@vitejs/plugin-react@4`) 호환 검증. Vite 7은 Node 20+ 강제라 환경 제약 회피 |
| **Tailwind CSS v3** | Figma 디자인 토큰(ink/brand/surface)을 `theme.extend`에 1:1 매핑. 유틸리티 기반으로 스타일 파일 분산 방지 |
| **Radix UI (Popover)** | 접근성(a11y) + 키보드 인터랙션이 검증된 headless primitive. 디자인은 Tailwind로 자유롭게 덮어쓰기 |
| **@tanstack/react-query** | `useInfiniteQuery`로 무한 스크롤 상태 관리(캐시·중복요청·loading/error)를 선언적으로 처리. 직접 구현 시 반복 보일러플레이트 제거 |
| **Zustand + persist** | Redux 대비 보일러플레이트 최소. `persist` 미들웨어로 `localStorage` 동기화가 한 줄. 검색 기록/찜 스토어 용도에 적합 |
| **React Router v6** | SPA 라우팅 표준. data router 기능까지 요구되지 않아 v6로 충분 |
| **Sonner** | 토스트 UX가 모던하고 API가 간결. 찜 추가/해제 피드백 용도 |
| **tailwind-merge + clsx** | 조건부 클래스 + Tailwind 충돌 해결 정석 조합. `cn()` 유틸로 통일 |
| **tailwindcss-animate** | Radix의 open/close transition 상태 기반 애니메이션 유틸 제공 |

### UI 프리미티브 작성 방침

UI 프리미티브(`shared/ui/popover.tsx`, `input.tsx` 등)는 **Figma 디자인 토큰을 1순위로 반영**하기 위해 Radix primitive 위에 직접 얇게 래핑. 외부 UI 라이브러리를 가져와 테마를 덮어쓰는 방식 대신, **`tailwind.config.ts`에 정의된 토큰(`ink.*`, `brand`, `surface.*`)을 그대로 쓰는 컴포넌트**를 처음부터 작성. 이유:

1. **디자인 토큰 단일 출처 유지** — Figma 값 → Tailwind `theme.extend` → 컴포넌트 className으로 흐름이 일직선. 중간에 CSS 변수(HSL) 계층을 끼워 넣지 않음 → 토큰 변경 시 전파 경로가 짧고 추적 쉬움.
2. **컴포넌트 수가 적음** — Popover, Input, Icons 등 소수. 외부 라이브러리/CLI 도입 오버헤드(설정 스키마 관리, alias 매핑)가 직접 작성 비용보다 큼.
3. **FSD 배치 규약 유지** — `shared/ui/`에 맞춘 경로/네이밍을 그대로 준수.

---

## 강조하고 싶은 기능

### 1. 무한 스크롤
- `IntersectionObserver` 센티넬을 리스트 끝에 배치 → 화면에 들어오면 `fetchNextPage()` 호출.
- Kakao API `is_end: true` 또는 50페이지 초과 시 자동 중단(불필요 요청 방지).
- react-query 캐시로 뒤로가기 시 즉시 복원.

### 2. 일반 / 상세 검색 모드 상호 초기화
- 일반 검색어와 상세 필터(제목·저자·출판사·ISBN)는 동시에 유효할 수 없음.
- `searchModeStore.setGeneral` / `setDetail` 액션 내부에서 반대편 상태를 비워 **모드 충돌을 원천 차단**.

### 3. 찜 스냅샷 저장
- 찜 클릭 시점의 `BookDocument` 전체를 `favoriteStore`에 저장.
- Kakao API 응답이 나중에 바뀌거나(제목 수정, 가격 변동) 검색 결과에서 사라져도 **찜 목록은 사용자가 본 상태 그대로 유지**.

### 4. 검색 히스토리
- 최근 검색어 최대 8개, 중복 제거, 최신순.
- `localStorage` 자동 영속. 검색창 포커스 시 드롭다운으로 재사용.

### 5. Figma 디자인 토큰 고정
- `tailwind.config.ts`의 `theme.extend`에 Figma 변수(`ink.primary`, `brand`, `surface.light` 등)를 **정확한 값으로 매핑**.
- 컴포넌트 코드에서 raw hex/magic px 금지 → 디자인 변경 시 토큰만 교체.

### 6. FSD 아키텍처
- `app → pages → widgets → features → entities → shared` 단방향 의존.
- 슬라이스 간 cross-import 금지 → 기능 교체/삭제 시 영향 범위 최소화.
