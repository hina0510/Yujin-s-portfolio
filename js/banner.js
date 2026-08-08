(function () {
  // 전역 스크롤 위치 저장 (모든 모달이 공유)
  if (!window.portfolioScrollPosition) {
    window.portfolioScrollPosition = 0;
  }

  /* ─── 1. 슬라이드별 데이터 정의 ───────────────────────────────────────
   * 수정 위치: banner.js 상단
   * 각 슬라이드의 썸네일 이미지 배열과 모달 내용을 여기서 관리합니다.
   * thumbs: .banner-thumb-item 3개에 순서대로 삽입할 이미지
   * title / eyebrow / summary: 모달에 표시할 텍스트
   */
  const slideData = {
    1: {
      thumbs: [
        { src: 'image/HTML.png', alt: 'HTML' },
        { src: 'image/CSS.png', alt: 'CSS' },
        { src: 'image/CSS.png', alt: 'CSS' }
      ]
    },
    2: {
      thumbs: [
        { src: 'image/HTML.png', alt: 'HTML' },
        { src: 'image/CSS.png', alt: 'CSS' },
        { src: 'image/CSS.png', alt: 'CSS' }
      ]
    },
    3: {
      thumbs: [
        { src: 'image/HTML.png', alt: 'HTML' },
        { src: 'image/CSS.png', alt: 'CSS' },
        { src: 'image/CSS.png', alt: 'CSS' }
      ]
    },
    4: {
      thumbs: [
        { src: 'image/HTML.png', alt: 'HTML' },
        { src: 'image/CSS.png', alt: 'CSS' },
        { src: 'image/CSS.png', alt: 'CSS' }
      ]
    },
    5: {
      thumbs: [
        { src: 'image/HTML.png', alt: 'HTML' },
        { src: 'image/CSS.png', alt: 'CSS' },
        { src: 'image/CSS.png', alt: 'CSS' }
      ]
    },
    6: {
      thumbs: [
        { src: 'image/HTML.png', alt: 'HTML' },
        { src: 'image/CSS.png', alt: 'CSS' },
        { src: 'image/CSS.png', alt: 'CSS' }
      ]
    }
  };

  // 스크롤바 너비 계산
  const getScrollbarWidth = () => {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  };

  const bannerSection = document.querySelector('.banner-section');
  if (!bannerSection || typeof gsap === 'undefined') return;

  const carousel = bannerSection.querySelector('.banner-carousel');
  const frame    = bannerSection.querySelector('.banner-frame');
  const track    = bannerSection.querySelector('.banner-track');
  const slides   = [...bannerSection.querySelectorAll('.banner-slide')];
  const prevBtn  = bannerSection.querySelector('.banner-prev');
  const nextBtn  = bannerSection.querySelector('.banner-next');

  /* ─── 2. 슬라이드별 썸네일 렌더링 ────────────────────────────────────
   * 수정 위치: banner.js — 초기화 시 각 .banner-thumb-item에 이미지 삽입
   * slideData[슬라이드 번호].thumbs 배열 순서대로 이미지를 교체합니다.
   */
  slides.forEach(slide => {
    const num  = parseInt(slide.dataset.slide, 10);
    const data = slideData[num];
    if (!data) return;

    slide.querySelectorAll('.banner-thumb-item').forEach((item, i) => {
      const thumb = data.thumbs[i];
      if (!thumb) return;
      item.textContent = '';
      const img = document.createElement('img');
      img.src = thumb.src;
      img.alt = thumb.alt;
      item.appendChild(img);
    });
  });

  /* ─── 3. 공통 모달 레이어 재사용 (#projectModal) ─────────────────────
   * 수정 위치: banner.js — 기존 .banner-modal 대신 index.html의 공통 모달 사용
   * 닫기 버튼 / ESC / 배경 클릭 닫기는 team.js가 이미 처리합니다.
   */
  /* ─── 3. 배너 상세 모달 ───────────────────────────────────── */

const modal = document.getElementById('projectModal');
const modalContent = document.getElementById('modalContent');

let bannerDetailCache = null;

async function loadBannerContent(slideId) {
  try {
    if (!bannerDetailCache) {
      const response = await fetch('banner.html');

      if (!response.ok) {
        throw new Error('banner.html을 불러오지 못했습니다.');
      }

      const html = await response.text();
      const parser = new DOMParser();

      bannerDetailCache = parser.parseFromString(html, 'text/html');
    }

    const content = bannerDetailCache.querySelector(
      `#banner${slideId}Detail`
    );

    modalContent.innerHTML = content
      ? content.outerHTML
      : '<p class="modal-error">상세 정보를 찾을 수 없습니다.</p>';
  } catch (error) {
    console.error(error);

    modalContent.innerHTML =
      '<p class="modal-error">상세 내용을 불러오지 못했습니다.</p>';
  }
}

function initBannerTabs() {
  if (!modalContent) return;

  const tabButtons = modalContent.querySelectorAll(
    '.detail-content__tab-button'
  );

  const tabPanes = modalContent.querySelectorAll(
    '.detail-content__tab-pane'
  );

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;

      tabButtons.forEach((btn) => {
        btn.classList.remove('is-active');
      });

      tabPanes.forEach((pane) => {
        pane.classList.remove('is-active');
      });

      button.classList.add('is-active');

      const selectedPane = modalContent.querySelector(
        `.detail-content__tab-pane[data-pane="${tabName}"]`
      );

      selectedPane?.classList.add('is-active');
    });
  });
}

async function openBannerModal(slideId) {
  if (!modal || !modalContent) return;

  await loadBannerContent(slideId);

  initBannerTabs();

  const modalDialog = modal.querySelector('.modal-dialog');

  if (modalDialog) {
    modalDialog.scrollTop = 0;
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');

  if (typeof window.lockProjectModalScroll === 'function') {
    window.lockProjectModalScroll();
  } else {
    document.body.classList.add('modal-open');
  }
}

/* .banner-modal-btn 클릭: 속한 슬라이드의 data-banner로 모달 열기 */
  bannerSection.querySelectorAll('.banner-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openBannerModal(parseInt(btn.dataset.banner, 10));
    });
  });
  
  

  /* ─── 4. GSAP 캐러셀 (기존 코드 유지) ────────────────────────────────
   * 이전/다음 버튼, 무한 루프, 휠 회전 애니메이션 — 변경 없음
   */
  const total    = slides.length;
  const STEP     = 360 / total;
  const DURATION = 0.9;

  let current     = 0;
  let wheelAngle  = 0;
  let isAnimating = false;
  let radius      = 0;
  let centerX     = 0;
  let centerY     = 0;

  const CARD_SCALE  = 1;

  function getWorldAngle(index, angle) {
    return ((index * STEP - angle) % 360 + 360) % 360;
  }

  function getDistFromTop(index, angle) {
    const worldAngle = getWorldAngle(index, angle);
    return Math.min(worldAngle, 360 - worldAngle);
  }

  function measureLayout() {
    const isMobile = window.innerWidth <= 480;

    gsap.set(slides[0], {
      position: 'relative',
      left: 'auto',
      top: 'auto',
      x: 0,
      y: 0,
      autoAlpha: 1,
      clearProps: 'transform,zIndex'
    });

    // ⭐ 모바일이면 일반 세로 리스트
    if (isMobile) {

      if (frame) frame.style.height = 'auto';
      carousel.style.height = 'auto';
      track.style.width = '100%';
      track.style.height = 'auto';
      track.style.margin = '0';

      slides.forEach(slide => {
        gsap.set(slide, {
          clearProps: 'all'
        });
      });

      return;
    }

    // ===== PC 기존 코드 =====

    const slideHeight = slides[0].offsetHeight;
    const containerHeight = slideHeight;

    if (frame) frame.style.height = `${containerHeight}px`;
    carousel.style.height = `${containerHeight}px`;
    track.style.width = '100%';
    track.style.height = `${containerHeight}px`;
    track.style.margin = '0 auto';

    centerX = 0;
    centerY = radius = slideHeight;

    slides.forEach(slide => {
      gsap.set(slide, {
        position: 'absolute',
        left: '50%',
        top: 0,
        width: '100%',
        xPercent: -50,
        marginLeft: 0
      });
    });

    applyPositions(wheelAngle);
  }

  function applyPositions(angle) {
    if (window.innerWidth <= 480) return;

    slides.forEach((slide, i) => {
      const worldAngle  = getWorldAngle(i, angle);
      const rad         = (worldAngle * Math.PI) / 180;
      const distFromTop = Math.min(worldAngle, 360 - worldAngle);
      const isTop       = distFromTop < STEP * 0.5;

      gsap.set(slide, {
        x: centerX + radius * Math.sin(rad),
        y: centerY - radius * Math.cos(rad),
        rotation: 0,
        scale: CARD_SCALE,
        transformOrigin: '50% 0%',
        autoAlpha: isTop ? 1 : 0,
        pointerEvents: isTop ? 'auto' : 'none',
        zIndex: isTop ? 2 : 1
      });
    });

    slides.forEach((_, i) => {
      if (getDistFromTop(i, angle) < STEP * 0.5) {
        current = i;
      }
    });
  }

  function rotateWheel(direction) {
    if (window.innerWidth <= 480) return;
    if (isAnimating) return;

    isAnimating = true;
    const animState  = { angle: wheelAngle };
    const targetAngle = wheelAngle + direction * STEP;

    gsap.to(animState, {
      angle: targetAngle,
      duration: DURATION,
      ease: 'power2.inOut',
      onUpdate: () => applyPositions(animState.angle),
      onComplete: () => {
        wheelAngle = targetAngle;
        applyPositions(wheelAngle);
        isAnimating = false;
      }
    });
  }

  prevBtn?.addEventListener('click', () => rotateWheel(-1));
  nextBtn?.addEventListener('click', () => rotateWheel(1));

  measureLayout();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(measureLayout, 200);
  });
})();
