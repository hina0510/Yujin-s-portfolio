function includeRouter(callback) {
  document.body.addEventListener('click', function (e) {
    const target = e.target.closest('[route-link]');
    if (!target) return;

    const file = target.getAttribute('route-link');
    const content = document.getElementById('content');

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          content.innerHTML = this.responseText;

          // script 실행
          const scripts = content.getElementsByTagName('script');
          for (let i = 0; i < scripts.length; i++) {
            eval(scripts[i].text);
          }

          requestAnimationFrame(() => {
            if (callback) callback(e);
          });
        } else {
          content.innerHTML = 'Page not found.';
        }
      }
    };

    xhr.open('GET', file, true);
    xhr.send();
  });
}