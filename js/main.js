const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

const navLinks = document.querySelectorAll(".nav a");
const sections = document.querySelectorAll(
  "#profile, #uiux-design, #web-publish, #team"
);

function setActiveNav() {
  const headerHeight = document.querySelector("header").offsetHeight;
  const scrollPoint = window.scrollY + headerHeight + 120;
  const bottomPoint = window.innerHeight + window.scrollY;
  const docHeight = document.documentElement.scrollHeight;

  let currentId = "profile";

  sections.forEach((section) => {
    if (scrollPoint >= section.offsetTop) {
      currentId = section.id;
    }
  });

  if (bottomPoint >= docHeight - 5) {
    currentId = "team";
  }

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === currentId);
  });
}

function changeActive(id) {
  navLinks.forEach((link) => {
    link.classList.remove('active');

    if (link.dataset.nav === id) {
      link.classList.add('active');
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const id = link.dataset.nav;

    if (id) {
      changeActive(id);
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        changeActive(entry.target.id);
      }

    });
  },
  {
    root: null,

    // 화면 가운데 영역을 기준으로 판단
    rootMargin: '-35% 0px -55% 0px',

    threshold: 0
  }
);

sections.forEach((section) => {
  observer.observe(section);
});

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

const mockupOrder = [6, 1, 4, 3, 5, 2, 7];
const mobileOrder = [1, 2, 3, 4, 5, 7, 6];

  const mockupFrom = {
    1: { xPercent: -120, yPercent: 0 }, // 왼쪽
    2: { xPercent: 0, yPercent: -120 }, // 위
    3: { xPercent: 0, yPercent: -120 }, // 위
    4: { xPercent: 120, yPercent: 0 },  // 오른쪽
    5: { xPercent: 0, yPercent: 120 },  // 아래
    6: { xPercent: 0, yPercent: 120 },   // 오른쪽
    7: { xPercent: 0, yPercent: 120 }
  };

  const mobileFrom = {
    1: { xPercent: -120, yPercent: 0 },
    2: { xPercent: -120, yPercent: 0 },
    3: { xPercent: 120, yPercent: 0 },
    4: { xPercent: 120, yPercent: 0 },
    5: { xPercent: -120, yPercent: 0 },
    6: { xPercent: -120, yPercent: 0 },
    7: { xPercent: 120, yPercent: 0 }
  };
gsap.registerPlugin(ScrollTrigger);

function initPageAnimations() {  
  const skillProgress = document.querySelectorAll(".skill-progress");

  skillProgress.forEach((item) => {
    const percent = Number(item.dataset.percent);
    const circle = item.querySelector(".skill-progress-circle");

    if (!circle) return;

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    const targetOffset =
      circumference - (circumference * percent / 100);

    // 처음엔 0%
    gsap.set(circle, {
      strokeDasharray: circumference,
      strokeDashoffset: circumference
    });

    function playProgress() {
      gsap.killTweensOf(circle);

      gsap.fromTo(
        circle,
        {
          strokeDashoffset: circumference
        },
        {
          strokeDashoffset: targetOffset,
          duration: 1.3,
          delay: 4,
          ease: "power2.out"
        }
      );
    }
    function replayProgress() {
      gsap.killTweensOf(circle);

      gsap.fromTo(
        circle,
        {
          strokeDashoffset: circumference
        },
        {
          strokeDashoffset: targetOffset,
          duration: 1.3,
          ease: "power2.out"
        }
      );
    }

    function resetProgress() {
      gsap.killTweensOf(circle);

      gsap.set(circle, {
        strokeDashoffset: circumference
      });
    }

    ScrollTrigger.create({
      trigger: ".skill-box",
      start: "top 85%",
      end: "bottom 15%",

      // 처음 아래로 들어올 때
      onEnter: playProgress,

      // 아래로 지나가면 초기화
      onLeave: resetProgress,

      // 아래에서 다시 위로 올라올 때
      onEnterBack: replayProgress
    });
  });

  
  let isMockupAnimating = false;
  let hasMockupPlayed = false;

  function playMockupAnimation(self) {
    if (document.body.classList.contains("modal-open")) return;
    if (self.direction !== 1) return;
    if (isMockupAnimating) return;
    if (hasMockupPlayed) return;

    isMockupAnimating = true;
    hasMockupPlayed = true;

    gsap.killTweensOf(".mockup-item");

    const mobile = window.innerWidth <= 480;
    const order = mobile ? mobileOrder : mockupOrder;
    const from = mobile ? mobileFrom : mockupFrom;

    const mockupTimeline = gsap.timeline({
      defaults: {
        duration: 0.7,
        ease: "power2.out"
      },
      onComplete: () => {
        isMockupAnimating = false;
      }
    });

    order.forEach((num, index) => {
      const el = document.querySelector(`[data-mockup="${num}"]`);
      if (!el) return;

      const fromVars = from[num];

      mockupTimeline.fromTo(
        el,
        { ...fromVars, autoAlpha: 0 },
        { xPercent: 0, yPercent: 0, autoAlpha: 1 },
        index === 0 ? 0 : "-=0.45"
      );
    });
    mockupTimeline.to('.mockup-guide', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out'
    });
  }

  ScrollTrigger.create({
    trigger: ".mockup-section",
    start: "top 85%",

    onEnter: (self) => {
      playMockupAnimation(self);
    },

    onLeaveBack: () => {
      if (document.body.classList.contains("modal-open")) return;

      hasMockupPlayed = false;
      isMockupAnimating = false;

      gsap.killTweensOf(".mockup-item");
      gsap.set(".mockup-item", { autoAlpha: 0 });
    }
  });
    ScrollTrigger.refresh();
  }

if (document.getElementById('site-intro')) {
  window.addEventListener('intro:complete', initPageAnimations, { once: true });
} else {
  initPageAnimations();
}
