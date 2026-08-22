document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  // Show a clean consent/accept button 2 seconds after the website opens.
  // The choice is remembered so the popup does not return on every visit.
  const consentKey = 'sama-consent-accepted';
  if (localStorage.getItem(consentKey) !== 'true') {
    setTimeout(() => {
      if (document.getElementById('sama-consent')) return;

      const consent = document.createElement('div');
      consent.id = 'sama-consent';
      consent.setAttribute('role', 'dialog');
      consent.setAttribute('aria-label', 'Website consent');
      consent.innerHTML = `
        <div class="sama-consent-card">
          <p>Welcome to SAMA United Real Estate.</p>
          <button type="button" id="sama-accept">Accept</button>
        </div>`;

      const style = document.createElement('style');
      style.id = 'sama-consent-style';
      style.textContent = `
        #sama-consent{position:fixed;left:0;right:0;bottom:22px;z-index:9999;display:flex;justify-content:center;padding:0 16px;animation:samaConsentIn .35s ease both}
        .sama-consent-card{width:min(560px,100%);display:flex;align-items:center;justify-content:space-between;gap:20px;padding:16px 18px;background:#fff;color:#171717;border:1px solid rgba(23,23,23,.12);box-shadow:0 14px 40px rgba(0,0,0,.18);border-radius:4px;font:500 13px/1.4 "Plus Jakarta Sans",Arial,sans-serif}
        .sama-consent-card p{margin:0}
        #sama-accept{border:0;background:#171717;color:#fff;padding:11px 22px;min-width:90px;cursor:pointer;font:700 12px/1 "Plus Jakarta Sans",Arial,sans-serif;border-radius:2px}
        #sama-accept:hover{opacity:.88}
        @keyframes samaConsentIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @media(max-width:600px){#sama-consent{bottom:14px;padding:0 12px}.sama-consent-card{padding:14px;gap:12px}.sama-consent-card p{font-size:12px}#sama-accept{padding:10px 16px;min-width:78px}}
      `;
      document.head.appendChild(style);
      document.body.appendChild(consent);

      document.getElementById('sama-accept')?.addEventListener('click', () => {
        localStorage.setItem(consentKey, 'true');
        consent.remove();
        document.getElementById('sama-consent-style')?.remove();
      });
    }, 2000);
  }

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

  // Mobile/location and footer polish fixes. Kept here so the fix applies to the live
  // page without changing the existing HTML structure.
  const fixStyle = document.createElement('style');
  fixStyle.id = 'sama-mobile-polish';
  fixStyle.textContent = `
    .location-actions{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:stretch!important}
    .location-actions .btn{min-width:0!important;overflow:hidden!important;white-space:nowrap!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;line-height:1.2!important;padding:14px 10px!important}
    .location-actions .btn svg{width:18px!important;height:18px!important;flex:0 0 auto!important}
    .footer-brand-mark{display:flex!important;align-items:flex-start!important}
    .footer-brand-mark img{width:56px!important;max-width:56px!important;height:auto!important;object-fit:contain!important}
    @media(max-width:850px){
      .location-actions{grid-template-columns:1fr 1fr!important}
      .location-actions .btn:first-child{grid-column:1/-1!important}
    }
    @media(max-width:600px){
      .location-actions{grid-template-columns:1fr!important;gap:0!important}
      .location-actions .btn:first-child{grid-column:auto!important}
      .location-actions .btn{width:100%!important;min-height:54px!important;white-space:normal!important;font-size:.66rem!important;padding:13px 10px!important}
      .footer-brand-mark img{width:48px!important;max-width:48px!important}
    }
    @media(max-width:380px){.footer-brand-mark img{width:44px!important;max-width:44px!important}}
  `;
  document.head.appendChild(fixStyle);
});
