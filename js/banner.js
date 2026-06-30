(function () {
  const bannerSection = document.querySelector('.banner-section');
  if (!bannerSection || typeof gsap === 'undefined') return;

  const carousel = bannerSection.querySelector('.banner-carousel');
  const frame = bannerSection.querySelector('.banner-frame');
  const track = bannerSection.querySelector('.banner-track');
  const slides = [...bannerSection.querySelectorAll('.banner-slide')];
  const prevBtn = bannerSection.querySelector('.banner-prev');
  const nextBtn = bannerSection.querySelector('.banner-next');
  const modal = document.querySelector('.banner-modal');
  const modalContent = modal?.querySelector('.banner-modal-content');
  const modalClose = modal?.querySelector('.banner-modal-close');
  const modalOverlay = modal?.querySelector('.banner-modal-overlay');

  const total = slides.length;
  const STEP = 360 / total;
  const DURATION = 0.9;

  let current = 0;
  let wheelAngle = 0;
  let isAnimating = false;
  let radius = 0;
  let centerX = 0;
  let centerY = 0;

  function getWorldAngle(index, angle) {
    return ((index * STEP - angle) % 360 + 360) % 360;
  }

  function getDistFromTop(index, angle) {
    const worldAngle = getWorldAngle(index, angle);
    return Math.min(worldAngle, 360 - worldAngle);
  }

  const CARD_SCALE = 1;
const EXTRA_HEIGHT = 0;

function measureLayout() {
  gsap.set(slides[0], {
    position: 'relative',
    left: 'auto',
    top: 'auto',
    x: 0,
    y: 0,
    autoAlpha: 1,
    clearProps: 'transform,zIndex'
  });

  const slideHeight = slides[0].offsetHeight;
  const containerHeight = slideHeight;

  if (frame) frame.style.height = `${containerHeight}px`;
  carousel.style.height = `${containerHeight}px`;
  track.style.width = '100%';
  track.style.height = `${containerHeight}px`;
  track.style.margin = '0 auto';

  centerX = 0;
  centerY = radius = slideHeight;

  slides.forEach((slide) => {
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
  slides.forEach((slide, i) => {
    const worldAngle = getWorldAngle(i, angle);
    const rad = (worldAngle * Math.PI) / 180;
    const distFromTop = Math.min(worldAngle, 360 - worldAngle);
    const isTop = distFromTop < STEP * 0.5;

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
    if (isAnimating) return;

    isAnimating = true;
    const animState = { angle: wheelAngle };
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

  function goNext() {
    rotateWheel(1);
  }

  function goPrev() {
    rotateWheel(-1);
  }

  function openModal(bannerNum) {
    if (!modal || !modalContent) return;

    const activeSlide = slides[current];
    const mainImg = activeSlide.querySelector('.banner-main-img img');

    modalContent.textContent = '';

    if (mainImg) {
      modalContent.appendChild(mainImg.cloneNode(true));
    } else {
      modalContent.textContent = `배너 ${bannerNum} 모달`;
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  prevBtn?.addEventListener('click', goPrev);
  nextBtn?.addEventListener('click', goNext);

  bannerSection.querySelectorAll('.banner-modal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.banner);
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  measureLayout();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(measureLayout, 200);
  });
})();
