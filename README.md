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
├── entities/
│   ├── book/               # BookCard, BookCover, formatter
│   └── favorite/           # 찜 도메인 모델
└── shared/
    ├── api/                # Kakao 클라이언트 + 타입
    ├── assets/             # 정적 자원
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
| Sonner | 토스트 라이브러리. 후보 비교는 아래 섹션 |
| tailwindcss-animate | Radix `data-[state]` 애니메이션 유틸 |

### 토스트 라이브러리 선택 (Sonner)

요구: 찜 추가/해제 피드백, 검색 에러 알림. 단순한 알림 2종.

| 후보 | 특징 | 결정 |
|---|---|---|
| **sonner** | `toast()` 한 줄 호출, `id` 기반 중복 억제 네이티브, 스택/스와이프 애니메이션 기본, 번들 ~3KB gzip | ✅ |
| react-hot-toast | 비슷한 API, 번들 약간 큼, 디자인·스택 처리 단순 | △ |
| react-toastify | 무겁고 provider·config 다수, API 구식 | ✗ |
| shadcn Toast (Radix) | `useToast` + `<Toaster>` + `<Toast>` 세트 + 수동 트리거. 보일러플레이트 과다 | ✗ |

**선택 근거**:
- `id` 기반 중복 억제가 네이티브 → 검색 에러가 반복될 때 단일 토스트로 수렴. 다른 라이브러리는 직접 상태 관리 필요.
- 최소 설정: `<Toaster position="top-center" richColors />` 한 줄 + `toast.error(msg, { id })` 호출.
- 번들 영향 미미. 이 앱 스코프에 딱 맞음.

---

## 강조하고 싶은 기능

기능 구현 자체보다 **선택한 구현 방식과 그 이유**.

### 1. Figma MCP 연동으로 디자인 스펙 1:1 반영
Figma MCP 서버로 node 단위 디자인 컨텍스트 (색, 폰트 weight/line-height, 여백, inset 비율) 를 **직접 조회**하며 구현. 스크린샷 추정 대신 스펙 원본으로 대조 → 버튼 padding, chevron 위치, 아코디언 가격 영역 등 픽셀·스타일 일치도 검증 가능.
→ 디자인-코드 괴리를 줄이고, 변경 발생 시 재조회만으로 근거 확보. "있어 보이는" 구현이 아니라 근거 있는 구현.

### 2. FSD 아키텍처 + barrel 제거
`app → pages → widgets → features → entities → shared` 단방향 의존. 슬라이스 cross-import 금지. 중간에 있던 barrel (`shared/api/kakao-book/index.ts`) 도 제거해 import 경로가 모듈 단위로 고정.
→ 기능 단위 교체/삭제 시 영향 범위를 레이어 경계로 미리 제한. tree-shake 와 정적 분석에도 유리.

### 3. 도서 목록 카드 제목·저자 — 의도적 세로 배치
Figma 원본은 제목 + 저자를 **한 줄 (horizontal)** 로 배치하도록 설계. 그러나 한국어 책 제목 평균 길이가 길어 **제목이 truncate 되거나 저자가 영역 밖으로 밀림**. BookAccordion 에서 세로 스택으로 분리해 긴 제목도 줄바꿈으로 수용, 저자는 항상 노출.
→ 디자인 충실도와 실사용 데이터 (한국어 콘텐츠) 의 간극을 인지하고, 실사용자 경험을 우선한 판단. 주석으로 의도 문서화.

