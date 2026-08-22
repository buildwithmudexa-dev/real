document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const header = document.querySelector('.header-inner');
  if (!header) return;

  const LANGUAGES = {
    en: { native: 'English', dir: 'ltr' },
    ar: { native: 'العربية', dir: 'rtl' },
    ur: { native: 'اردو', dir: 'rtl' }
  };

  document.getElementById('nav-icon-card')?.remove();

  const card = document.createElement('div');
  card.id = 'nav-icon-card';
  card.className = 'nav-icon-card navbar-controls-v2';
  card.setAttribute('role', 'group');
  card.setAttribute('aria-label', 'Website controls');
  card.innerHTML = `
    <div class="theme-control-wrap">
      <button class="nav-icon-btn" id="theme-control-v2" type="button" aria-label="Theme options" aria-expanded="false" aria-haspopup="true" title="Theme options">
        <i data-lucide="sun"></i>
      </button>
      <div class="theme-dropdown" id="theme-dropdown-v2" role="menu" aria-label="Theme options" hidden>
        <button type="button" role="menuitem" data-theme="light"><i data-lucide="sun"></i><span>Light</span></button>
        <button type="button" role="menuitem" data-theme="dark"><i data-lucide="moon"></i><span>Dark</span></button>
        <button type="button" role="menuitem" data-theme="system"><i data-lucide="sun-moon"></i><span>System</span></button>
      </div>
    </div>
    <div class="language-control-wrap">
      <button class="nav-icon-btn language-btn" id="language-control-v2" type="button" aria-label="Choose language" aria-expanded="false" aria-haspopup="true" title="Language">
        <i data-lucide="globe-2"></i>
      </button>
      <div class="language-dropdown" id="language-dropdown-v2" role="menu" aria-label="Language options" hidden>
        <button type="button" role="menuitem" data-lang="en">English</button>
        <button type="button" role="menuitem" data-lang="ar">العربية</button>
        <button type="button" role="menuitem" data-lang="ur">اردو</button>
      </div>
    </div>
    <button class="nav-icon-btn" id="menu-control-v2" type="button" aria-label="Open menu" aria-expanded="false" title="Menu">
      <i data-lucide="menu"></i>
    </button>`;
  header.appendChild(card);

  const applyLanguage = (code) => {
    const language = LANGUAGES[code] ? code : 'en';
    root.lang = language;
    root.dir = LANGUAGES[language].dir;
    root.dataset.language = language;
    localStorage.setItem('sama-language', language);
    card.querySelectorAll('[data-lang]').forEach(item => item.setAttribute('aria-current', item.dataset.lang === language ? 'true' : 'false'));
  };
  applyLanguage(localStorage.getItem('sama-language') || 'en');

  const themeButton = document.getElementById('theme-control-v2');
  const themeDropdown = document.getElementById('theme-dropdown-v2');
  const getEffectiveTheme = value => value === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : value;
  const applyTheme = (theme) => {
    const selected = ['light', 'dark', 'system'].includes(theme) ? theme : 'system';
    root.dataset.theme = getEffectiveTheme(selected);
    root.dataset.themeChoice = selected;
    localStorage.setItem('sama-theme', selected);
    themeButton?.setAttribute('aria-label', `Theme: ${selected}`);
    themeButton?.setAttribute('title', `Theme: ${selected}`);
    themeDropdown?.querySelectorAll('[data-theme]').forEach(item => item.setAttribute('aria-current', item.dataset.theme === selected ? 'true' : 'false'));
  };
  applyTheme(localStorage.getItem('sama-theme') || 'system');

  const setThemeMenu = open => {
    themeDropdown.hidden = !open;
    themeButton?.setAttribute('aria-expanded', String(open));
  };
  themeButton?.addEventListener('click', event => {
    event.stopPropagation();
    setThemeMenu(themeDropdown.hidden);
    setLanguageMenu(false);
  });
  themeDropdown?.querySelectorAll('[data-theme]').forEach(item => item.addEventListener('click', () => {
    applyTheme(item.dataset.theme);
    setThemeMenu(false);
  }));

  const languageButton = document.getElementById('language-control-v2');
  const dropdown = document.getElementById('language-dropdown-v2');
  const setLanguageMenu = open => {
    dropdown.hidden = !open;
    languageButton?.setAttribute('aria-expanded', String(open));
  };
  languageButton?.addEventListener('click', event => {
    event.stopPropagation();
    setLanguageMenu(dropdown.hidden);
    setThemeMenu(false);
  });
  dropdown?.querySelectorAll('[data-lang]').forEach(item => item.addEventListener('click', () => {
    applyLanguage(item.dataset.lang);
    setLanguageMenu(false);
  }));

  document.addEventListener('click', event => {
    if (!event.target.closest('.theme-control-wrap')) setThemeMenu(false);
    if (!event.target.closest('.language-control-wrap')) setLanguageMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { setThemeMenu(false); setLanguageMenu(false); }
  });

  const menuButton = document.getElementById('menu-control-v2');
  const mobileMenu = document.getElementById('mobile-menu');
  menuButton?.addEventListener('click', () => {
    if (!mobileMenu) return;
    const open = mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuButton.setAttribute('title', open ? 'Close menu' : 'Menu');
    menuButton.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}"></i>`;
    window.lucide?.createIcons();
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
    if (localStorage.getItem('sama-theme') === 'system') applyTheme('system');
  });
  window.lucide?.createIcons();
});
