(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll: un observer, con stagger entre hermanos
  const items = document.querySelectorAll('[data-reveal]');
  items.forEach((el) => {
    const siblings = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
    if (siblings.length > 1) el.style.setProperty('--d', `${siblings.indexOf(el) * 0.1}s`);
  });
  if (!reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-in'));
  }

  // Barra superior: toma el tema de la sección que está bajo ella
  const nav = document.querySelector('.nav');
  const themed = [...document.querySelectorAll('[data-theme]')].filter(el => el !== nav);
  const updateNav = () => {
    const probe = nav.offsetHeight / 2 + 1;
    let current = null;
    for (const sec of themed) {
      const r = sec.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) { current = sec; break; }
    }
    if (current) nav.dataset.theme = current.dataset.theme;
  };
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    nav.style.setProperty('--progress', p.toFixed(4));
  };
  let navTick = false;
  window.addEventListener('scroll', () => {
    if (navTick) return;
    navTick = true;
    requestAnimationFrame(() => { updateNav(); updateProgress(); navTick = false; });
  }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateNav();
  updateProgress();

  // Halftone del hero: se mueve con el scroll
  const dots = document.querySelector('.hero__dots');
  if (dots && !reduce) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        dots.style.setProperty('--shift', `${Math.min(window.scrollY, 900) * -0.25}px`);
        ticking = false;
      });
    }, { passive: true });
  }
})();
