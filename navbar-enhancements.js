document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const header = document.querySelector('.header-inner');
  if (!header) return;

  const LANGUAGES = { en: { native: 'English', dir: 'ltr' }, ar: { native: 'العربية', dir: 'rtl' }, ur: { native: 'اردو', dir: 'rtl' } };
  document.getElementById('nav-icon-card')?.remove();
  document.getElementById('mobile-nav-overlay')?.remove();

  const card = document.createElement('div');
  card.id = 'nav-icon-card';
  card.className = 'nav-icon-card navbar-controls-v2';
  card.setAttribute('role', 'group');
  card.setAttribute('aria-label', 'Website controls');
  card.innerHTML = `
    <div class="theme-control-wrap"><button class="nav-icon-btn" id="theme-control-v2" type="button" aria-label="Theme options" aria-expanded="false" aria-haspopup="true" title="Theme options"><i data-lucide="sun"></i></button>
      <div class="theme-dropdown" id="theme-dropdown-v2" role="menu" hidden><button type="button" role="menuitem" data-theme="light"><i data-lucide="sun"></i><span>Light</span></button><button type="button" role="menuitem" data-theme="dark"><i data-lucide="moon"></i><span>Dark</span></button><button type="button" role="menuitem" data-theme="system"><i data-lucide="sun-moon"></i><span>System</span></button></div></div>
    <div class="language-control-wrap"><button class="nav-icon-btn language-btn" id="language-control-v2" type="button" aria-label="Choose language" aria-expanded="false" aria-haspopup="true" title="Language"><i data-lucide="globe-2"></i></button>
      <div class="language-dropdown" id="language-dropdown-v2" role="menu" hidden><button type="button" role="menuitem" data-lang="en">English</button><button type="button" role="menuitem" data-lang="ar">العربية</button><button type="button" role="menuitem" data-lang="ur">اردو</button></div></div>
    <button class="nav-icon-btn" id="menu-control-v2" type="button" aria-label="Open menu" aria-expanded="false" title="Menu"><i data-lucide="menu"></i></button>`;
  header.appendChild(card);

  const applyLanguage = code => { const language = LANGUAGES[code] ? code : 'en'; root.lang = language; root.dir = LANGUAGES[language].dir; root.dataset.language = language; localStorage.setItem('sama-language', language); card.querySelectorAll('[data-lang]').forEach(item => item.setAttribute('aria-current', item.dataset.lang === language ? 'true' : 'false')); };
  applyLanguage(localStorage.getItem('sama-language') || 'en');

  const themeButton = document.getElementById('theme-control-v2');
  const themeDropdown = document.getElementById('theme-dropdown-v2');
  const getEffectiveTheme = value => value === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : value;
  const applyTheme = theme => { const selected = ['light','dark','system'].includes(theme) ? theme : 'system'; root.dataset.theme = getEffectiveTheme(selected); root.dataset.themeChoice = selected; localStorage.setItem('sama-theme', selected); themeButton?.setAttribute('aria-label', `Theme: ${selected}`); themeButton?.setAttribute('title', `Theme: ${selected}`); themeDropdown?.querySelectorAll('[data-theme]').forEach(item => item.setAttribute('aria-current', item.dataset.theme === selected ? 'true' : 'false')); };
  applyTheme(localStorage.getItem('sama-theme') || 'system');

  const languageButton = document.getElementById('language-control-v2');
  const languageDropdown = document.getElementById('language-dropdown-v2');
  const setThemeMenu = open => { if (!themeDropdown) return; themeDropdown.hidden = !open; themeButton?.setAttribute('aria-expanded', String(open)); };
  const setLanguageMenu = open => { if (!languageDropdown) return; languageDropdown.hidden = !open; languageButton?.setAttribute('aria-expanded', String(open)); };
  themeButton?.addEventListener('click', event => { event.stopPropagation(); const open = themeDropdown?.hidden !== false; setLanguageMenu(false); setThemeMenu(open); });
  themeDropdown?.querySelectorAll('[data-theme]').forEach(item => item.addEventListener('click', () => { applyTheme(item.dataset.theme); setThemeMenu(false); }));
  languageButton?.addEventListener('click', event => { event.stopPropagation(); const open = languageDropdown?.hidden !== false; setThemeMenu(false); setLanguageMenu(open); });
  languageDropdown?.querySelectorAll('[data-lang]').forEach(item => item.addEventListener('click', () => { applyLanguage(item.dataset.lang); setLanguageMenu(false); }));

  const overlay = document.createElement('div');
  overlay.id = 'mobile-nav-overlay'; overlay.className = 'mobile-nav-overlay';
  overlay.innerHTML = `<div class="mobile-nav-panel" role="dialog" aria-modal="true" aria-label="Navigation menu"><button class="mobile-nav-close" type="button" aria-label="Close menu"><i data-lucide="x"></i></button><nav class="mobile-nav-links"><a href="#home">Home</a><a href="#about">About SAMA</a><a href="#services">Services</a><a href="#location">Find Us</a><a href="#contact">Contact</a><a href="blog.html">Blog</a><a href="faqs.html">FAQs</a><a href="testimonials.html">Testimonials</a></nav></div>`;
  document.body.appendChild(overlay);
  const menuButton = document.getElementById('menu-control-v2'); const closeButton = overlay.querySelector('.mobile-nav-close');
  const closeMenu = () => { overlay.classList.remove('open'); document.body.classList.remove('menu-open'); menuButton?.setAttribute('aria-expanded','false'); menuButton?.setAttribute('aria-label','Open menu'); menuButton?.setAttribute('title','Menu'); if(menuButton) menuButton.innerHTML='<i data-lucide="menu"></i>'; window.lucide?.createIcons(); };
  const openMenu = () => { setThemeMenu(false); setLanguageMenu(false); overlay.classList.add('open'); document.body.classList.add('menu-open'); menuButton?.setAttribute('aria-expanded','true'); menuButton?.setAttribute('aria-label','Close menu'); menuButton?.setAttribute('title','Close menu'); if(menuButton) menuButton.innerHTML='<i data-lucide="x"></i>'; window.lucide?.createIcons(); closeButton?.focus(); };
  menuButton?.addEventListener('click', () => overlay.classList.contains('open') ? closeMenu() : openMenu()); closeButton?.addEventListener('click', closeMenu); overlay.addEventListener('click', event => { if(event.target === overlay) closeMenu(); }); overlay.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if(!event.target.closest('.theme-control-wrap')) setThemeMenu(false); if(!event.target.closest('.language-control-wrap')) setLanguageMenu(false); });
  document.addEventListener('keydown', event => { if(event.key === 'Escape'){setThemeMenu(false);setLanguageMenu(false);if(overlay.classList.contains('open')) closeMenu();} });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => { if(localStorage.getItem('sama-theme') === 'system') applyTheme('system'); });

  const themeFix = document.createElement('style');
  themeFix.id = 'sama-theme-fix';
  themeFix.textContent = `
    .site-header, .site-header .header-inner { background: transparent !important; box-shadow: none !important; border: 0 !important; }
    .site-header .navbar-controls-v2 { background: transparent !important; box-shadow: none !important; border-color: transparent !important; }
    .site-header .navbar-controls-v2 .nav-icon-btn { background: transparent !important; box-shadow: none !important; }
    html[data-theme="dark"] body,html[data-theme="dark"] main,html[data-theme="dark"] .section,html[data-theme="dark"] .about,html[data-theme="dark"] .location-section,html[data-theme="dark"] .hours-section{background:#000!important;color:#f3f4f6!important}
    html[data-theme="dark"] .section-muted{background:#080808!important}
    html[data-theme="dark"] .property-card,html[data-theme="dark"] .location-details,html[data-theme="dark"] .hours-grid>div{background:#111!important;color:#f3f4f6!important;border-color:#2b2b2b!important}
    html[data-theme="dark"] .location-map{background:#111!important;border-color:#2b2b2b!important}
    html[data-theme="dark"] .about h2,html[data-theme="dark"] .about h3,html[data-theme="dark"] .about p,html[data-theme="dark"] .about .lead,html[data-theme="dark"] .about .stat strong,html[data-theme="dark"] .about .stat span,html[data-theme="dark"] .location-section h2,html[data-theme="dark"] .location-section p,html[data-theme="dark"] .location-section strong,html[data-theme="dark"] .hours-section h2,html[data-theme="dark"] .hours-section p,html[data-theme="dark"] .hours-section strong,html[data-theme="dark"] .hours-section span{color:#f3f4f6!important}
    html[data-theme="dark"] .contact-cta{background:#050505!important}
    html[data-theme="dark"] .sama-footer{background:#050505!important;color:#f3f4f6!important;border-color:#222!important}
    html[data-theme="dark"] .sama-footer a,html[data-theme="dark"] .sama-footer p,html[data-theme="dark"] .sama-footer span{color:#d1d5db!important}
    html[data-theme="dark"] .sama-footer h3{color:#4ee0bd!important}
    html[data-theme="dark"] .mobile-nav-panel{background:#050505!important;color:#f3f4f6!important}
    html[data-theme="dark"] .mobile-nav-links a{color:#f3f4f6!important}
    html[data-theme="dark"] .theme-dropdown,html[data-theme="dark"] .language-dropdown{background:#20242a!important}
  `;
  document.head.appendChild(themeFix);
  window.lucide?.createIcons();
});
