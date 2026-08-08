(function () {
  const splashTexts = document.querySelectorAll('#splash h1, #splash>p');
  const typingSpeed = 50;
  const delayBetween = 300;

  // 기존 텍스트 저장하고 화면에서는 비우기
  splashTexts.forEach(element => {
    element.dataset.text = element.textContent.trim();
    element.textContent = '';
  });

  function typeText(element, text) {
    return new Promise(resolve => {
      let index = 0;

      function typing() {
        if (index < text.length) {
          element.textContent += text[index];
          index++;

          setTimeout(typing, typingSpeed);
        } else {
          resolve();
        }
      }

      typing();
    });
  }

  async function startSplashTyping() {
    for (const element of splashTexts) {
      await typeText(element, element.dataset.text);

      await new Promise(resolve => {
        setTimeout(resolve, delayBetween);
      });
    }
  }

  startSplashTyping();

  const dot = document.querySelector(".logo-dot");
  const splash = document.querySelector("#splash");
  const splashCover = document.querySelector(".splash-cover");
  const mainPage = document.querySelector(".portfolio-page");

  /**
   * SVG 안의 원은 SVG 영역 밖으로 커질 수 있어서 잘려 보입니다.
   * 그래서 원이 올라온 순간의 화면 좌표를 구한 뒤,
   * fixed 레이어(.splash-cover)를 그 위치에서 화면 전체로 확장합니다.
   */
  dot?.addEventListener("animationend", (e) => {
    if (e.animationName !== "riseDot") return;

    const dotRect = dot.getBoundingClientRect();
    const centerX = dotRect.left + dotRect.width / 2;
    const centerY = dotRect.top + dotRect.height / 2;

    splashCover?.style.setProperty("--cover-x", `${centerX}px`);
    splashCover?.style.setProperty("--cover-y", `${centerY}px`);
    splashCover?.classList.add("is-expand");

    // SVG 점과 fixed 원이 겹쳐 보이도록 한 뒤, SVG 점은 숨김
    dot.style.opacity = "0";
  });

  splashCover?.addEventListener("animationend", (e) => {
    if (e.animationName !== "coverExpand") return;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.location.hash = "#profile";

    mainPage?.classList.add("show");
    splash?.classList.add("hide");

    // 노란 화면이 잠깐 남았다가 사라지면서 메인으로 넘어감
    setTimeout(() => {
      splashCover.classList.add("is-hide");
    }, 120);
  });
  const skillContents = document.querySelectorAll("#splash .skill-content");

  gsap.set(skillContents, {
    x: -50,
    autoAlpha: 0
  });

  gsap.to(skillContents, {
    x: 0,
    autoAlpha: 1,
    duration: 2,
    stagger: 0.5,
    ease: "power2.out",
    delay: 3
  });

  gsap.set(logoContainer, { autoAlpha: 0 });

  gsap.timeline({ onComplete: finishIntro })
    .call(playLogoAnimation, null, 0)
    .to({}, { duration: INTRO_HOLD });
})();
