(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  // Reveal: chequeo por posición en scroll y resize. Sin IntersectionObserver,
  // así ningún elemento queda oculto por un umbral que nunca se cumple.
  const items = [...document.querySelectorAll('[data-reveal]')];
  items.forEach((el) => {
    const siblings = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
    if (siblings.length > 1) el.style.setProperty('--d', `${siblings.indexOf(el) * 0.1}s`);
  });

  let pending = items.slice();
  const checkReveal = () => {
    const vh = window.innerHeight;
    pending = pending.filter((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        el.classList.add('is-in');
        return false;
      }
      return true;
    });
  };

  if (reduce) {
    items.forEach((el) => el.classList.add('is-in'));
  } else {
    root.classList.add('js-reveal');
    checkReveal();
  }

  // Barra superior: toma el tema de la sección que está bajo ella
  const nav = document.querySelector('.nav');
  const themed = [...document.querySelectorAll('[data-theme]')].filter(el => el !== nav);
  const updateNav = () => {
    const probe = nav.getBoundingClientRect().bottom + 2;
    for (const sec of themed) {
      const r = sec.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) { nav.dataset.theme = sec.dataset.theme; break; }
    }
  };

  const updateProgress = () => {
    const max = root.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    nav.style.setProperty('--progress', p.toFixed(4));
  };

  // Halftone del hero: se mueve con el scroll
  const dots = document.querySelector('.hero__dots');

  let tick = false;
  const onScroll = () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      if (!reduce) checkReveal();
      updateNav();
      updateProgress();
      if (dots && !reduce) {
        dots.style.setProperty('--shift', `${Math.min(window.scrollY, 900) * -0.25}px`);
      }
      tick = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  onScroll();

})();
