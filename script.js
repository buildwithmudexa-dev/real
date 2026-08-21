document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();

  // Language selector + lightweight multilingual UI
  const translations = {
    en: {
      label: "Language", home: "Home", properties: "Properties", neighborhoods: "Neighborhoods", agents: "Agents", sell: "Sell With Us", about: "About Us", blog: "Blog", contact: "Contact", call: "Book a Call",
      eyebrow: "Exceptional Real Estate", heroTitle: "Find a place", heroEm: "worth calling home.", heroText: "Discover exceptional properties, distinguished neighborhoods, and a real estate experience designed around you.", viewProperties: "View Properties", talkAgent: "Talk to Agent", scroll: "Scroll to explore",
      aboutEyebrow: "About Novalux", aboutTitle: "Real estate,", aboutEm: "redefined.", aboutLead: "We believe buying or selling a home should feel as exceptional as the property itself.", discover: "Discover our story", propertiesEyebrow: "Curated Collection", propertiesTitle: "Featured", propertiesEm: "properties.", viewAll: "View all properties"
    },
    hi: {
      label: "भाषा", home: "होम", properties: "प्रॉपर्टीज़", neighborhoods: "इलाके", agents: "एजेंट्स", sell: "हमारे साथ बेचें", about: "हमारे बारे में", blog: "ब्लॉग", contact: "संपर्क", call: "कॉल बुक करें",
      eyebrow: "विशेष रियल एस्टेट", heroTitle: "ऐसी जगह खोजें", heroEm: "जिसे घर कह सकें।", heroText: "बेहतरीन प्रॉपर्टीज़, शानदार इलाकों और आपकी जरूरत के अनुसार रियल एस्टेट अनुभव की खोज करें।", viewProperties: "प्रॉपर्टीज़ देखें", talkAgent: "एजेंट से बात करें", scroll: "आगे देखने के लिए स्क्रॉल करें",
      aboutEyebrow: "नोवालक्स के बारे में", aboutTitle: "रियल एस्टेट,", aboutEm: "नए अंदाज़ में।", aboutLead: "हम मानते हैं कि घर खरीदना या बेचना खुद प्रॉपर्टी जितना ही शानदार अनुभव होना चाहिए।", discover: "हमारी कहानी जानें", propertiesEyebrow: "चुनिंदा संग्रह", propertiesTitle: "विशेष", propertiesEm: "प्रॉपर्टीज़।", viewAll: "सभी प्रॉपर्टीज़ देखें"
    },
    ar: {
      label: "اللغة", home: "الرئيسية", properties: "العقارات", neighborhoods: "الأحياء", agents: "الوكلاء", sell: "بع معنا", about: "من نحن", blog: "المدونة", contact: "اتصل بنا", call: "احجز مكالمة",
      eyebrow: "عقارات استثنائية", heroTitle: "اعثر على مكان", heroEm: "يستحق أن تسميه منزلاً.", heroText: "اكتشف عقارات مميزة وأحياء راقية وتجربة عقارية مصممة حول احتياجاتك.", viewProperties: "عرض العقارات", talkAgent: "تحدث إلى وكيل", scroll: "مرر للاستكشاف",
      aboutEyebrow: "عن نوفالوكس", aboutTitle: "العقارات،", aboutEm: "بمفهوم جديد.", aboutLead: "نؤمن أن شراء أو بيع المنزل يجب أن يكون تجربة استثنائية مثل العقار نفسه.", discover: "اكتشف قصتنا", propertiesEyebrow: "مجموعة مختارة", propertiesTitle: "عقارات", propertiesEm: "مميزة.", viewAll: "عرض جميع العقارات"
    }
  };

  const applyLanguage = lang => {
    const t = translations[lang] || translations.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("rtl-language", lang === "ar");
    const setText = (selector, value) => { const el = document.querySelector(selector); if (el) el.textContent = value; };

    const navMap = [
      ["#home", t.home], ["#properties", t.properties], ["#neighborhoods", t.neighborhoods], ["#agents", t.agents],
      ["#sell", t.sell], ["#about", t.about], ["#blog", t.blog], ["#contact", t.contact]
    ];
    document.querySelectorAll(".desktop-nav .nav-link, .mobile-menu nav > a:not(.btn)").forEach((el, i) => {
      const item = navMap[i % navMap.length];
      if (item) el.textContent = item[1];
    });
    document.querySelectorAll(".header-cta, .mobile-menu .btn").forEach(el => {
      const icon = el.querySelector("svg");
      el.textContent = t.call + " ";
      if (icon) el.appendChild(icon);
    });

    setText(".hero-copy .eyebrow", t.eyebrow);
    const heroHeading = document.querySelector(".hero-copy h1");
    if (heroHeading) { heroHeading.childNodes[0].nodeValue = t.heroTitle + " "; const em = heroHeading.querySelector("em"); if (em) em.textContent = t.heroEm; }
    setText(".hero-copy p", t.heroText);
    setText(".hero-actions .btn-light", t.viewProperties);
    setText(".hero-actions .btn-outline-light", t.talkAgent);
    setText(".hero-scroll span", t.scroll);
    setText(".about-content .eyebrow", t.aboutEyebrow);
    const aboutHeading = document.querySelector(".about-content h2");
    if (aboutHeading) { aboutHeading.childNodes[0].nodeValue = t.aboutTitle + " "; const em = aboutHeading.querySelector("em"); if (em) em.textContent = t.aboutEm; }
    setText(".about-content .lead", t.aboutLead);
    setText(".about-content .text-link", t.discover);
    const propsHeading = document.querySelector("#properties .section-header h2");
    if (propsHeading) { const first = propsHeading.childNodes[0]; if (first) first.nodeValue = t.propertiesTitle + " "; const em = propsHeading.querySelector("em"); if (em) em.textContent = t.propertiesEm; }
    setText("#properties .section-header .eyebrow", t.propertiesEyebrow);
    setText("#properties .section-header .text-link", t.viewAll);
    localStorage.setItem("novalux-language", lang);
  };

  const headerInner = document.querySelector(".header-inner");
  if (headerInner && !document.getElementById("language-selector")) {
    const wrapper = document.createElement("div");
    wrapper.className = "language-selector-wrap";
    wrapper.innerHTML = `<label class="sr-only" for="language-selector">Language</label><span class="language-icon" aria-hidden="true">◎</span><select id="language-selector" aria-label="Language"><option value="en">EN</option><option value="hi">हिंदी</option><option value="ar">العربية</option></select>`;
    const menuToggle = document.getElementById("menu-toggle");
    if (menuToggle) headerInner.insertBefore(wrapper, menuToggle); else headerInner.appendChild(wrapper);
    const selector = wrapper.querySelector("select");
    selector.value = localStorage.getItem("novalux-language") || "en";
    selector.addEventListener("change", e => applyLanguage(e.target.value));
    applyLanguage(selector.value);
  }

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
      const duration = 1200;
      const startTime = performance.now();
      const tick = now => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased);
        if (progress < 1) requestAnimationFrame(tick); else el.textContent = target;
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
      const matches = (!q || text.includes(q)) && (status.value === "all" || card.dataset.status === status.value) && (type.value === "all" || card.dataset.type === type.value) && (location.value === "all" || card.dataset.location === location.value) && priceMatch(card.dataset.price, price.value);
      card.hidden = !matches;
      if (matches) visible++;
    });
    empty.hidden = visible !== 0;
  };
  [search, status, type, location, price].forEach(el => el?.addEventListener("input", filterProperties));
  [status, type, location, price].forEach(el => el?.addEventListener("change", filterProperties));

  document.querySelectorAll(".property-favorite").forEach(button => button.addEventListener("click", () => button.classList.toggle("saved")));

  const testimonials = [...document.querySelectorAll(".testimonial")];
  let testimonialIndex = 0;
  const showTestimonial = index => {
    if (!testimonials.length) return;
    testimonialIndex = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((item, i) => item.classList.toggle("active", i === testimonialIndex));
  };
  document.getElementById("testimonial-prev")?.addEventListener("click", () => showTestimonial(testimonialIndex - 1));
  document.getElementById("testimonial-next")?.addEventListener("click", () => showTestimonial(testimonialIndex + 1));

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

  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });
});
