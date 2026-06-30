(function () {
  const detailBtn = document.querySelector('.project-detail-btn');
  const modal = document.querySelector('.project-modal');
  const modalClose = modal?.querySelector('.project-modal-close');
  const modalOverlay = modal?.querySelector('.project-modal-overlay');
  const previewSection = document.querySelector('.project-preview');
  const imageContainer = document.querySelector('.project-images');
  const centerImg = document.querySelector('.project-img-center');
  const leftImg = document.querySelector('.project-img-left');
  const rightImg = document.querySelector('.project-img-right');
  const actions = document.querySelector('.project-actions');

  let hasPlayed = false;

  function openModal() {
    if (!modal) return;
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

  if (detailBtn && modal) {
    detailBtn.addEventListener('click', openModal);
    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  }

  if (typeof gsap === 'undefined' || !previewSection || !imageContainer) return;

  gsap.registerPlugin(ScrollTrigger);

  function getOffsets() {
    const height = imageContainer.offsetHeight;
    const width = imageContainer.offsetWidth;

    return {
      centerY: -(height * 0.6),
      leftX: -(width * 0.28),
      rightX: width * 0.22,
      actionsX: width * 0.12
    };
  }

  function setInitialState() {
    const { centerY, leftX, rightX, actionsX } = getOffsets();

    gsap.set(centerImg, { y: centerY, x: 0, autoAlpha: 0 });
    gsap.set(leftImg, { x: leftX, y: 0, autoAlpha: 0 });
    gsap.set(rightImg, { x: rightX, y: 0, autoAlpha: 0 });

    if (actions) {
      gsap.set(actions, { x: actionsX, y: 0, autoAlpha: 0 });
    }
  }

  function playIntro() {
    hasPlayed = true;
    const { centerY, leftX, rightX, actionsX } = getOffsets();

    gsap.set(centerImg, { y: centerY, x: 0, autoAlpha: 0 });
    gsap.set(leftImg, { x: leftX, y: 0, autoAlpha: 0 });
    gsap.set(rightImg, { x: rightX, y: 0, autoAlpha: 0 });

    if (actions) {
      gsap.set(actions, { x: actionsX, y: 0, autoAlpha: 0 });
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 0.85 }
    });

    tl.to(centerImg, { y: 0, autoAlpha: 1 })
      .to(leftImg, { x: 0, autoAlpha: 1 }, '-=0.45')
      .to(rightImg, { x: 0, autoAlpha: 1 }, '-=0.45');

    if (actions) {
      tl.to(actions, { x: 0, autoAlpha: 1 }, '+=0.05');
    }
  }

  setInitialState();

  ScrollTrigger.create({
    trigger: previewSection,
    start: 'top 85%',
    once: true,
    onEnter: playIntro
  });

  window.addEventListener('resize', () => {
    if (!hasPlayed) {
      setInitialState();
    }
  });
})();
