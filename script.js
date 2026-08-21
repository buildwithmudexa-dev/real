document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();

  // Sticky glass header
  const header = document.getElementById("site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile drawer
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeMenu = () => {
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };
  menuToggle?.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  mobileMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  // Animated counters
  const counters = document.querySelectorAll("[data-counter]");
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter);
      let start = 0;
      const duration = 1200;
      const startTime = performance.now();
      const tick = now => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  // Property filtering
  const cards = [...document.querySelectorAll(".property-card")];
  const search = document.getElementById("property-search");
  const status = document.getElementById("status-filter");
  const type = document.getElementById("type-filter");
  const location = document.getElementById("location-filter");
  const price = document.getElementById("price-filter");
  const empty = document.getElementById("empty-state");

  const priceMatch = (value, filter) => {
    const n = Number(value);
    if (filter === "under1m") return n < 1000000;
    if (filter === "1to3m") return n >= 1000000 && n <= 3000000;
    if (filter === "3to5m") return n > 3000000 && n <= 5000000;
    if (filter === "over5m") return n > 5000000;
    return true;
  };

  const filterProperties = () => {
    const q = (search?.value || "").trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const matches =
        (!q || text.includes(q)) &&
        (status.value === "all" || card.dataset.status === status.value) &&
        (type.value === "all" || card.dataset.type === type.value) &&
        (location.value === "all" || card.dataset.location === location.value) &&
        priceMatch(card.dataset.price, price.value);
      card.hidden = !matches;
      if (matches) visible++;
    });
    empty.hidden = visible !== 0;
  };
  [search, status, type, location, price].forEach(el => el?.addEventListener("input", filterProperties));
  [status, type, location, price].forEach(el => el?.addEventListener("change", filterProperties));

  // Favorites
  document.querySelectorAll(".property-favorite").forEach(button => {
    button.addEventListener("click", () => button.classList.toggle("saved"));
  });

  // Testimonial slider
  const testimonials = [...document.querySelectorAll(".testimonial")];
  let testimonialIndex = 0;
  const showTestimonial = index => {
    testimonialIndex = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((item, i) => item.classList.toggle("active", i === testimonialIndex));
  };
  document.getElementById("testimonial-prev")?.addEventListener("click", () => showTestimonial(testimonialIndex - 1));
  document.getElementById("testimonial-next")?.addEventListener("click", () => showTestimonial(testimonialIndex + 1));

  // FAQ accordion
  document.querySelectorAll(".faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => {
        i.classList.remove("open");
        i.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Close mobile drawer with Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
  });
});
