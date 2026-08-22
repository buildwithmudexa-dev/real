document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  // Core page interactions. Language/theme/menu controls are handled by navbar-enhancements.js.
  const counters = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.counter || 0);
        const start = performance.now();
        const tick = now => {
          const progress = Math.min((now - start) / 900, 1);
          el.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        };
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.35 });
    counters.forEach(el => observer.observe(el));
  }

  // Property filters, when present on a page.
  const cards = [...document.querySelectorAll('.property-card')];
  const search = document.getElementById('property-search');
  const status = document.getElementById('status-filter');
  const type = document.getElementById('type-filter');
  const location = document.getElementById('location-filter');
  const price = document.getElementById('price-filter');
  const empty = document.getElementById('empty-state');
  const priceMatch = (value, filter) => {
    const n = Number(value);
    if (!filter || filter === 'all') return true;
    if (filter === 'under1m') return n < 1000000;
    if (filter === '1to3m') return n >= 1000000 && n <= 3000000;
    if (filter === '3to5m') return n > 3000000 && n <= 5000000;
    if (filter === 'over5m') return n > 5000000;
    return true;
  };
  const filterCards = () => {
    const q = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const ok = (!q || card.textContent.toLowerCase().includes(q)) &&
        (!status || status.value === 'all' || card.dataset.status === status.value) &&
        (!type || type.value === 'all' || card.dataset.type === type.value) &&
        (!location || location.value === 'all' || card.dataset.location === location.value) &&
        priceMatch(card.dataset.price, price?.value);
      card.hidden = !ok;
      if (ok) visible++;
    });
    if (empty) empty.hidden = visible !== 0;
  };
  [search, status, type, location, price].forEach(el => {
    el?.addEventListener('input', filterCards);
    el?.addEventListener('change', filterCards);
  });

  document.querySelectorAll('.property-favorite').forEach(button => {
    button.addEventListener('click', () => button.classList.toggle('saved'));
  });

  const testimonials = [...document.querySelectorAll('.testimonial')];
  let testimonialIndex = 0;
  const showTestimonial = index => {
    if (!testimonials.length) return;
    testimonialIndex = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((item, i) => item.classList.toggle('active', i === testimonialIndex));
  };
  document.getElementById('testimonial-prev')?.addEventListener('click', () => showTestimonial(testimonialIndex - 1));
  document.getElementById('testimonial-next')?.addEventListener('click', () => showTestimonial(testimonialIndex + 1));

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const wasOpen = item?.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen && item) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
