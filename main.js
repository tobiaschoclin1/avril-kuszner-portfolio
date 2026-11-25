// Reveal on scroll: a single observer, staggered per group.
(() => {
  const items = document.querySelectorAll('[data-reveal]');

  // Stagger siblings that enter together (list items, gallery tiles)
  items.forEach((el, i) => {
    const parent = el.parentElement;
    const siblings = [...parent.children].filter(c => c.hasAttribute('data-reveal'));
    if (siblings.length > 1) {
      el.style.setProperty('--d', `${siblings.indexOf(el) * 0.12}s`);
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  items.forEach((el) => io.observe(el));

  // Halftone field drifts with scroll, only while the hero is visible
  const dots = document.querySelector('.hero__dots');
  if (dots && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        dots.style.setProperty('--shift', `${y * -0.25}px`);
        ticking = false;
      });
    }, { passive: true });
  }
})();
