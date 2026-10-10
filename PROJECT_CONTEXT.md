# PROJECT_CONTEXT.md

> 예유진(YE YUJIN) 퍼블리셔 포트폴리오 — AI Agent용 프로젝트 지도  
> **기준 진입점:** `index.html`  
> 실제 코드와 문서가 다를 경우 **실제 코드 우선**

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **목적** | UI/UX·웹퍼블리싱·팀 프로젝트 작업물을 한 페이지에서 소개하는 개인 포트폴리오 |
| **유형** | 정적 SPA-like 단일 페이지 (Vanilla HTML/CSS/JS, 빌드 도구 없음) |
| **핵심 UX** | 스플래시 인트로 → 섹션 스크롤 네비 → 목업/배너/팀 상세는 **공통 모달**로 fetch |

### 주요 페이지/섹션 (`index.html` 기준)

| 순서 | 섹션 | id / class | 역할 |
|------|------|------------|------|
| 0 | Splash | `#splash`, `.splash-cover` | 로고·타이핑·전환 애니메이션 |
| 1 | Header | `header`, `#main-nav` | 고정 네비, 앵커 스크롤 |
| 2 | Profile | `#profile` | 소개·경력·자격·스킬 |
| 3 | UIUX Design | `#uiux-design`, `.mockup-section` | 목업 갤러리 (7개) |
| 4 | Web Publish | `#web-publish`, `.banner-section` | 프로젝트 배너 캐러셀 (4슬라이드) |
| 5 | Team | `#team`, `.project-preview` | 팀 프로젝트 미리보기 |
| — | Modal | `#projectModal` | banner / mockup / team 상세 공통 레이어 |

### 부분 HTML (모달용, 단독 페이지 아님)

| 파일 | section id 패턴 | 용도 |
|------|-----------------|------|
| `banner.html` | `#banner{N}Detail` (1~4) | Web Publish View 모달 |
| `mockup.html` | `#mockup{N}Detail` (1~7) | UIUX 목업 클릭 모달 |
| `team.html` | `#team1Detail` | Team View 모달 |

### 레거시/미사용

| 파일 | 비고 |
|------|------|
| `index3.html` | 구버전 프로토타입. `css/index.css`, `js/vendor/gsap.min.js` 참조하나 **현재 repo에 없음** |
| `js/includeHTML.js`, `js/includeRouter.js` | HTML include 유틸. **index.html에서 미사용** |

---

## 2. 기술 스택

| 분류 | 사용 |
|------|------|
| **HTML** | 시맨틱 section, data-attribute 기반 JS 연동 |
| **CSS** | 단일 `css/style.css` (+ `reset.css` import). **SCSS 없음** |
| **JavaScript** | ES6+, IIFE/DOMContentLoaded, fetch + DOMParser |
| **GSAP** | v3.12.5 CDN (`index.html`) |
| **ScrollTrigger** | GSAP 플러그인 CDN (`index.html`). `js/vendor/ScrollTrigger.min.js`는 index3용 |
| **Swiper** | **미사용** |
| **jQuery** | **미사용** (스킬 아이콘 이미지만 존재) |
| **폰트** | Pretendard, Noto Sans KR (reset.css) |

---

## 3. 전체 파일 구조

```
Yujin-s-portfolio/
├── index.html          ← 메인 (유일한 프로덕션 진입점)
├── index3.html         ← 레거시 프로토타입
├── banner.html         ← 배너 상세 fragment (fetch)
├── mockup.html         ← 목업 상세 fragment (fetch)
├── team.html           ← 팀 상세 fragment (fetch)
├── css/
│   ├── reset.css       ← 리셋, body.modal-open
│   └── style.css       ← 전역·섹션·모달·반응형·테마 (단일 파일)
├── js/
│   ├── intro.js        ← 스플래시 타이핑·커버 전환
│   ├── main.js         ← 네비·스킬 차트·목업 ScrollTrigger
│   ├── banner.js       ← 배너 캐러셀 + banner 모달 로드
│   ├── mockup.js       ← 목업 클릭 모달 + Key Features 아코디언
│   ├── team.js         ← 공통 모달 open/close/스크롤 잠금
│   ├── project.js      ← team 섹션 GSAP 진입 애니 (index.html)
│   ├── includeHTML.js  ← (미사용) data-include fetch
│   ├── includeRouter.js← (미사용) route-link SPA-like 로드
│   └── vendor/
│       └── ScrollTrigger.min.js
├── image/              ← UI 에셋 (로고, 프로필, 목업, 프로젝트 캡처 등)
└── .vscode/settings.json
```

---

## 4. HTML 구조 (`index.html`)

```
body
├── #splash                    … 인트로 (SVG 로고, h1, skill-bottom)
├── .splash-cover              … 노란 원 확장 전환 레이어
├── header
│   └── .header-inner
│       ├── .header-logo
│       ├── .menu-toggle       … aria-controls="#main-nav"
│       └── nav.nav#main-nav   … data-nav="profile|uiux-design|web-publish|team"
├── main.portfolio-page
│   ├── #profile
│   │   └── .profile-grid
│   │       ├── .col-left  → .profile-box, .intro-box
│   │       └── .col-right → .study-box, .license-box, .skill-box
│   ├── .mockup-section#uiux-design
│   │   └── .mockup-grid → .mockup-item[data-mockup="1~7"]
│   ├── .banner-section#web-publish
│   │   └── .banner-inner → .banner-prev/next, .banner-carousel
│   │       └── .banner-track → .banner-slide[data-slide]
│   │           └── .banner-modal-btn[data-banner]
│   └── .project-preview#team
│       ├── .project-section__content / .project-actions
│       └── .project-preview-inner → .project-images (left/center/right)
└── #projectModal.modal-overlay
    └── .modal-dialog → #modalContent, #closeProjectModal
```

**네비 ↔ 섹션 매핑**

| nav `data-nav` | section id |
|----------------|------------|
| profile | `#profile` |
| uiux-design | `#uiux-design` |
| web-publish | `#web-publish` |
| team | `#team` |

---

## 5. CSS 구조 (`css/style.css`)

단일 파일, 주석 섹션으로 구분.

| 구간 (주석) | 내용 |
|-------------|------|
| ROOT / RESET | `:root` 변수, `.theme-*` 프로젝트별 포인트 컬러 |
| navbar | `header`, `.nav`, `.menu-toggle` |
| SPLASH / INTRO | `#splash`, `.splash-cover`, `@keyframes` (revealBlack, dropDot, coverExpand 등) |
| INDEX MAIN | `.portfolio-page`, `#profile`, `.profile-grid`, skill 원형 차트 |
| mockup | `.mockup-section`, `.mockup-grid`, `.mockup-1~7` grid 위치 |
| banner | `.banner-section`, `.banner-slide`, `.banner-arrow` |
| PROJECT SECTION | `.project-preview`, `.project-images`, `.project-btn` |
| MODAL | `.modal-overlay`, `.modal-dialog`, `.modal-content` |
| DETAIL CONTENT | `.detail-content`, `.key-features`, `.feature-item` (모달 내부) |
| RESPONSIVE | `@media` 블록 |

### CSS 변수

```css
/* :root */
--bg, --panel, --text, --muted, --accent, --light-sky, --navy, --border, --shadow

/* .theme-nol, .theme-osulloc, .theme-seoripet 등 */
--point-color, --point-text
```

### Breakpoint

| px | 용도 |
|----|------|
| **1024** | feature-detail 1열, preview 축소 |
| **768** | Tablet — profile/mockup/banner/project 레이아웃 조정 |
| **700** | 모달 내 Key Features 모바일 패딩·가로 스크롤 flow |
| **480** | Mobile — mockup flex wrap, banner 세로 리스트, 화살표 숨김 |
| **875** (JS only) | `main.js` resize 시 모바일 메뉴 닫기 |

### 주요 animation

| 대상 | 방식 |
|------|------|
| Splash 로고 | CSS `@keyframes` (clip-path 마스크, dot drop) |
| Splash → Main | `.splash-cover` clip-path `coverExpand` |
| Skill 원형 | GSAP strokeDashoffset + ScrollTrigger |
| Mockup 등장 | GSAP fromTo + ScrollTrigger (1회) |
| Banner 캐러셀 | GSAP wheel rotation (PC only) |
| Team 이미지 | GSAP timeline + ScrollTrigger (`project.js`) |
| Feature accordion | CSS `.feature-item.active` + JS class toggle |

---

## 6. JavaScript 구조

| 파일 | 역할 | 주요 함수/로직 |
|------|------|----------------|
| `intro.js` | 스플래시 | `startSplashTyping()`, dot/cover `animationend`, skill-content GSAP |
| `main.js` | 공통 UX | `setActiveNav()`, `changeActive()`, `closeMenu()`, `initPageAnimations()` |
| `banner.js` | Web Publish | `slideData`, `loadBannerContent()`, `openBannerModal()`, `rotateWheel()`, `measureLayout()` |
| `mockup.js` | UIUX + accordion | `loadMockupContent()`, `openModal()`, `openFeature()` |
| `team.js` | **모달 허브** | `lockBodyScroll`/`unlockBodyScroll` → `window.lockProjectModalScroll`, `closeModal()`, fetch `team.html` |
| `project.js` | Team 섹션 | `playIntro()` ScrollTrigger, `.project-detail-btn` 모달 (index3 전용) |

**스크립트 로드 순서 (`index.html`)**  
GSAP → ScrollTrigger → intro → main → banner → team → mockup → project

> `team.js`가 `lockProjectModalScroll`을 전역 등록하므로 **banner/mockup보다 먼저 또는 직후** 로드되어야 함. 현재: banner → team → mockup.

---

## 7. DOM 관계 (selector → JS)

| Selector | JS 파일 | 동작 |
|----------|---------|------|
| `.menu-toggle`, `#main-nav` | main.js | toggle `is-open` / `is-active` |
| `.nav a[data-nav]` | main.js | active 클래스, IntersectionObserver |
| `#profile` ~ `#team` | main.js | scroll spy sections |
| `.skill-progress[data-percent]` | main.js | SVG circle GSAP |
| `.mockup-item[data-mockup]` | main.js, mockup.js | scroll anim / click → modal |
| `.banner-slide[data-slide]` | banner.js | 캐러셀 위치 |
| `.banner-modal-btn[data-banner]` | banner.js | `#banner{N}Detail` fetch |
| `#openTeam1Modal` | team.js | `#team1Detail` fetch |
| `#projectModal`, `#modalContent`, `#closeProjectModal` | team.js, banner.js, mockup.js | 공통 모달 |
| `.feature-item`, `.feature-summary` | mockup.js | hover(PC) / click(mobile) accordion |
| `.project-img-*`, `.project-actions` | project.js | ScrollTrigger 진입 anim |
| `#splash`, `.splash-cover`, `.logo-dot` | intro.js | 인트로 전환 |
| `body.modal-open` | team.js, reset.css | 배경 스크롤 잠금 |

### fetch ID 규칙

| 트리거 | fetch 파일 | 추출 selector |
|--------|-----------|---------------|
| `data-banner="2"` | banner.html | `#banner2Detail` |
| `data-mockup="4"` | mockup.html | `#mockup4Detail` |
| `#openTeam1Modal` | team.html | `#team1Detail` |

---

## 8. 인터랙션 맵

### 메뉴 (Header)
- **HTML:** `header`, `.menu-toggle`, `#main-nav`
- **CSS:** `.menu-toggle`, `.nav a.active`
- **JS:** `main.js` — click toggle, IntersectionObserver active, resize >875 닫기
- **주의:** `.nav.is-open` 모바일 드로어 **CSS 미정의** (JS만 toggle). 햄버거 `display` 전환 media query도 **style.css에 없음**.

### 공통 모달 (`#projectModal`)
- **HTML:** `index.html` 하단
- **CSS:** `.modal-overlay`, `.modal-dialog`, `.modal-close`
- **JS:** `team.js` (열기/닫기/ESC/overlay/scroll lock), `banner.js`·`mockup.js` (콘텐츠 주입)

### 아코디언 (Key Features)
- **HTML:** `banner.html`, `mockup.html`, `team.html` 내 `.feature-item`
- **CSS:** `.feature-item.active .feature-detail`
- **JS:** `mockup.js` — `#modalContent` 위임 이벤트 (동적 삽입 대응)
- **PC:** hover → `openFeature()` / **Mobile·Tablet:** click toggle

### 배너 슬라이더 (커스텀, Swiper 아님)
- **HTML:** `.banner-section`, `.banner-prev/next`, `.banner-track`
- **CSS:** `.banner-slide` absolute 배치
- **JS:** `banner.js` — GSAP 원형 wheel (`rotateWheel`), **≤480px 세로 리스트** (애니 비활성)

### 목업 갤러리
- **HTML:** `.mockup-section`, `[data-mockup]`
- **CSS:** grid(PC) → flex wrap(480px), `:hover:after` "Click"
- **JS:** `main.js` ScrollTrigger 등장 / `mockup.js` click modal

### Team 섹션 애니메이션
- **HTML:** `.project-preview`, `.project-img-left/center/right`
- **CSS:** absolute layered images
- **JS:** `project.js` — ScrollTrigger `playIntro()` once

### Hover
- nav 링크, intro 연락처 `.intro-content.bg`, banner/project 버튼, mockup item

### Scroll
- nav active: IntersectionObserver + scroll 보정 (`main.js`)
- skill/mockup/project: ScrollTrigger
- modal open: `position:fixed` body lock (`team.js`)

### GSAP / ScrollTrigger
- `main.js`: skill circle, mockup stagger
- `banner.js`: carousel rotation
- `project.js`: team image intro
- `intro.js`: splash skill-bottom stagger

---

## 9. 반응형

| 구간 | 레이아웃 변화 |
|------|---------------|
| **PC (>768px)** | profile 2열 grid, mockup CSS grid, banner GSAP wheel 캐러셀, project 이미지 3단 레이어 |
| **Tablet (≤768px)** | profile column/flex 혼합, mockup grid 축소, banner/project padding 조정 |
| **Mobile (≤480px)** | profile 1열, mockup flex wrap+order, banner **세로 스택·화살표 숨김**, project 이미지 height 150px, mockup scroll anim **별도 순서/방향** (`mobileOrder`, `mobileFrom`) |
| **Modal (≤700px)** | feature-flow 가로 스크롤, preview 축소 |

---

## 10. 코드 의존 관계

| 수정 대상 | 함께 확인 |
|-----------|-----------|
| 새 Web Publish 슬라이드 | `index.html` `.banner-slide`, `banner.js` `slideData`, `banner.html` `#banner{N}Detail` |
| 목업 추가/삭제 | `index.html` `[data-mockup]`, `mockup.html` section id, `main.js` `mockupOrder`/`mobileOrder`, CSS `.mockup-N` grid |
| 모달 상세 콘텐츠 | 해당 fragment HTML + `style.css` DETAIL/`.key-features` + `mockup.js` accordion |
| 공통 모달 UX | `team.js` (close/scroll lock), `index.html` `#projectModal` |
| 네비 섹션 추가 | `index.html` header+section id, `main.js` sections/navLinks 쿼리 |
| 스플래시 | `index.html` `#splash`, `intro.js`, CSS SPLASH 키프레임 |
| 프로젝트 테마 색 | fragment의 `.key-features.theme-*`, CSS `.theme-*` 변수 |
| 배너 썸네일 | `banner.js` `slideData[N].thumbs` |

---

## 11. 수정 시 주의사항

1. **단일 CSS 파일** — 섹션 스타일이 `style.css` 한곳에 몰려 있음. 클래스명으로 구간 검색.
2. **공통 모달** — banner/mockup/team이 `#modalContent`를 공유. 닫을 때 내용 비우지 않음.
3. **fetch fragment** — `banner.html` 등은 `<body>` 안 section만 파싱. id 네이밍 규칙 엄수.
4. **ScrollTrigger + modal** — `body.modal-open`이면 mockup scroll anim 재생/리셋 스킵 (`main.js`).
5. **intro.js 하단** — `logoContainer`, `playLogoAnimation`, `finishIntro` 참조가 있으나 index.html 기준 **미정의** (index3 잔재). 콘솔 에러 가능.
6. **애니메이션 이름** — intro.js는 `riseDot` listen, CSS는 `dropDot` 정의. dot 전환 이벤트 연동 확인 필요.
7. **index3 vs index.html** — `project.js`의 `.project-modal` / `.project-detail-btn`은 index3 전용. index.html Team View는 `team.js` + `#openTeam1Modal`.
8. **이미지 경로** — fragment 일부 `./images/nol/` 참조 (repo에 없을 수 있음). `image/`와 혼용.
9. **로컬 실행** — fetch 사용 → `file://`보다 **로컬 서버** 필요.
10. **banner.html placeholder** — banner 2~4 상세가 banner1과 동일 템플릿 복제 상태.

---

## 12. AI 작업 가이드

1. **먼저 이 문서**에서 관련 섹션·파일 위치 확인.
2. **수정 전** 해당 HTML/JS/CSS 원본을 직접 읽기.
3. **index.html + style.css + 해당 js 1~2개**만 열기. 무관한 파일 탐색 최소화.
4. **기존 class/id/data-attribute** 유지. JS 쿼리와 fetch id 규칙 깨지 않게.
5. **요청 범위만** 수정. 전체 파일 재작성 금지.
6. fragment 수정 시 **모달 안에서만** 보이는지, fetch selector가 맞는지 확인.
7. GSAP/ScrollTrigger 변경 후 **resize·모달 open/close·스크롤 재진입** 테스트.
8. 문서와 코드 불일치 시 **코드가 정본**.

### 자주 쓰는 수정 경로

| 작업 | 파일 |
|------|------|
| 프로필 텍스트/레이아웃 | `index.html` `#profile`, `style.css` profile 구간 |
| 목업 이미지/배치 | `index.html`, `style.css` `.mockup-*`, `main.js` anim order |
| 배너 프로젝트 | `index.html`, `banner.js`, `banner.html` |
| 모달 상세·아코디언 | `mockup.html` / `banner.html` / `team.html`, `mockup.js`, `style.css` `.feature-*` |
| 네비/스크롤 | `main.js`, `style.css` header |
| 인트로 | `index.html` `#splash`, `intro.js`, `style.css` SPLASH |

---

*Last mapped: project structure as of workspace analysis.*
