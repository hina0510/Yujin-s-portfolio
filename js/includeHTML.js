async function includeHTML(callback) {
  const elements = document.querySelectorAll('[data-include]');

  const promises = [...elements].map(async (el) => {
    const file = el.getAttribute('data-include');

    try {
      const res = await fetch(file);

      if (!res.ok) {
        el.innerHTML = 'Page not found.';
        return;
      }

      const html = await res.text();
      el.innerHTML = html;

    } catch (err) {
      console.error(err);
      el.innerHTML = 'Error loading content.';
    }
  });

  await Promise.all(promises);

  if (typeof callback === 'function') {
    requestAnimationFrame(callback);
  }
}