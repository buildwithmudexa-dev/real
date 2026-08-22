document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const header = document.querySelector('.header-inner');
  if (!header) return;

  // The banner/navbar is intentionally clean: no floating theme, language, or menu container.
  document.getElementById('nav-icon-card')?.remove();
  document.getElementById('mobile-nav-overlay')?.remove();
  document.querySelector('.navbar-controls-v2')?.remove();
  document.querySelector('.desktop-nav')?.remove();
  document.querySelector('.header-cta')?.remove();
  document.querySelector('.menu-toggle')?.remove();

  const LANGUAGES = {
    en: { native: 'English', dir: 'ltr' },
    ar: { native: 'العربية', dir: 'rtl' },
    ur: { native: 'اردو', dir: 'rtl' }
  };

  const language = localStorage.getItem('sama-language') || 'en';
  const selectedLanguage = LANGUAGES[language] ? language : 'en';
  root.lang = selectedLanguage;
  root.dir = LANGUAGES[selectedLanguage].dir;
  root.dataset.language = selectedLanguage;

  const savedTheme = localStorage.getItem('sama-theme') || 'system';
  const theme = ['light', 'dark', 'system'].includes(savedTheme) ? savedTheme : 'system';
  const effectiveTheme = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  root.dataset.themeChoice = theme;
  root.dataset.theme = effectiveTheme;

  const themeFix = document.createElement('style');
  themeFix.id = 'sama-clean-navbar-fix';
  themeFix.textContent = `
    .site-header,
    .site-header .header-inner,
    .site-header .logo { background: transparent !important; box-shadow: none !important; border: 0 !important; }
    .site-header { pointer-events: none !important; }
    .site-header .logo { pointer-events: auto !important; }
    html[data-theme="dark"] body,
    html[data-theme="dark"] main,
    html[data-theme="dark"] .section,
    html[data-theme="dark"] .about,
    html[data-theme="dark"] .location-section,
    html[data-theme="dark"] .hours-section { background: #000 !important; color: #f3f4f6 !important; }
    html[data-theme="dark"] .section-muted { background: #080808 !important; }
    html[data-theme="dark"] .property-card,
    html[data-theme="dark"] .location-details,
    html[data-theme="dark"] .hours-grid > div { background: #111 !important; color: #f3f4f6 !important; border-color: #2b2b2b !important; }
    html[data-theme="dark"] .location-map { background: #111 !important; border-color: #2b2b2b !important; }
    html[data-theme="dark"] .about h2,
    html[data-theme="dark"] .about h3,
    html[data-theme="dark"] .about p,
    html[data-theme="dark"] .about .lead,
    html[data-theme="dark"] .about .stat strong,
    html[data-theme="dark"] .about .stat span,
    html[data-theme="dark"] .location-section h2,
    html[data-theme="dark"] .location-section p,
    html[data-theme="dark"] .location-section strong,
    html[data-theme="dark"] .hours-section h2,
    html[data-theme="dark"] .hours-section p,
    html[data-theme="dark"] .hours-section strong,
    html[data-theme="dark"] .hours-section span { color: #f3f4f6 !important; }
    html[data-theme="dark"] .contact-cta { background: #050505 !important; }
    html[data-theme="dark"] .sama-footer { background: #050505 !important; color: #f3f4f6 !important; border-color: #222 !important; }
    html[data-theme="dark"] .sama-footer a,
    html[data-theme="dark"] .sama-footer p,
    html[data-theme="dark"] .sama-footer span { color: #d1d5db !important; }
    html[data-theme="dark"] .sama-footer h3 { color: #4ee0bd !important; }
  `;
  document.head.appendChild(themeFix);
});
