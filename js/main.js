const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

function closeMenu() {
  if (!menuToggle || !mainNav) return;

  menuToggle.classList.remove('is-active');
  mainNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '메뉴 열기');
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (link.dataset.nav) {
        setActiveNav(link.dataset.nav);
      }
      closeMenu();
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-inner')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 875) {
      closeMenu();
    }
  });
}

const navLinks = document.querySelectorAll('#main-nav a[data-nav]');
const navSections = [
  { id: 'profile', nav: 'profile' },
  { id: 'uiux-design', nav: 'uiux-design' },
  { id: 'web-publish', nav: 'web-publish' },
  { id: 'team', nav: 'team' }
];

function setActiveNav(navId) {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === navId);
  });
}

const mockupOrder = [6, 1, 4, 3, 5, 2];

  const mockupFrom = {
    1: { xPercent: -120, yPercent: 0 }, // 왼쪽
    2: { xPercent: 0, yPercent: -120 }, // 위
    3: { xPercent: 0, yPercent: -120 }, // 위
    4: { xPercent: 120, yPercent: 0 },  // 오른쪽
    5: { xPercent: 0, yPercent: 120 },  // 아래
    6: { xPercent: 0, yPercent: 120 }   // 오른쪽
  };
gsap.registerPlugin(ScrollTrigger);

function initPageAnimations() {
  if (navLinks.length) {
    navSections.forEach(({ id, nav }) => {
      const section = document.getElementById(id);
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveNav(nav),
        onEnterBack: () => setActiveNav(nav)
      });
    });

    const hash = window.location.hash.replace('#', '');
    if (hash && navSections.some((item) => item.nav === hash)) {
      setActiveNav(hash);
    }
  }

  let isMockupAnimating = false;

  function playMockupAnimation() {
    if (isMockupAnimating) return;

    isMockupAnimating = true;

    gsap.killTweensOf(".mockup-item");

    const mockupTimeline = gsap.timeline({
      defaults: {
        duration: 0.7,
        ease: "power2.out"
      },
      onComplete: () => {
        isMockupAnimating = false;
      }
    });

    mockupOrder.forEach((num, index) => {
      const el = document.querySelector(`[data-mockup="${num}"]`);
      if (!el) return;

      const fromVars = mockupFrom[num];

      mockupTimeline.fromTo(
        el,
        { ...fromVars, autoAlpha: 0 },
        { xPercent: 0, yPercent: 0, autoAlpha: 1 },
        index === 0 ? 0 : "-=0.45"
      );
    });
  }

  ScrollTrigger.create({
    trigger: ".mockup-section",
    start: "top 85%",

    onEnter: () => {
      playMockupAnimation();
    },

    onLeaveBack: () => {
      gsap.killTweensOf(".mockup-item");
      gsap.set(".mockup-item", { autoAlpha: 0 });
      isMockupAnimating = false;
    }
  });

    ScrollTrigger.refresh();
  }

if (document.getElementById('site-intro')) {
  window.addEventListener('intro:complete', initPageAnimations, { once: true });
} else {
  initPageAnimations();
}
