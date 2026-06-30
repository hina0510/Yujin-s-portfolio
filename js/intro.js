(function () {
  const intro = document.getElementById('site-intro');
  if (!intro || typeof gsap === 'undefined') {
    window.dispatchEvent(new Event('intro:complete'));
    return;
  }

  const logoContainer = intro.querySelector('.site-intro-logo');
  const logoTemplate = document.getElementById('intro-logo-template');
  const INTRO_HOLD = 3.5;

  function finishIntro() {
    gsap.to(intro, {
      autoAlpha: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        intro.remove();
        document.body.classList.remove('intro-active');
        window.dispatchEvent(new Event('intro:complete'));
      }
    });
  }

  function playLogoAnimation() {
    if (!logoTemplate || !logoContainer) return;

    logoContainer.innerHTML = '';
    logoContainer.appendChild(logoTemplate.content.cloneNode(true));
    gsap.set(logoContainer, { autoAlpha: 1 });
  }

  gsap.set(logoContainer, { autoAlpha: 0 });

  gsap.timeline({ onComplete: finishIntro })
    .call(playLogoAnimation, null, 0)
    .to({}, { duration: INTRO_HOLD });
})();
