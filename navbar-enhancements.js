document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const header = document.querySelector('.header-inner');
  if (!header) return;

  const LANGUAGES = {
    en: { label: 'English', native: 'English', dir: 'ltr' },
    ar: { label: 'Arabic', native: 'العربية', dir: 'rtl' },
    ur: { label: 'Urdu', native: 'اردو', dir: 'rtl' }
  };

  const existingCard = document.getElementById('nav-icon-card');
  if (existingCard) existingCard.remove();

  const card = document.createElement('div');
  card.className = 'nav-icon-card navbar-controls-v2';
  card.setAttribute('role', 'group');
  card.setAttribute('aria-label', 'Website controls');
  card.innerHTML = `
    <button class="nav-icon-btn" id="theme-control-v2" type="button" aria-label="Toggle theme" title="Toggle theme">
      <i data-lucide="sun"></i>
    </button>
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
    const config = LANGUAGES[language];
    root.lang = language;
    root.dir = config.dir;
    root.dataset.language = language;
    localStorage.setItem('sama-language', language);

    const selector = document.querySelector('.goog-te-combo');
    if (selector && selector.value !== language) {
      selector.value = language;
      selector.dispatchEvent(new Event('change'));
    }

    document.querySelectorAll('[data-lang]').forEach((item) => {
      item.setAttribute('aria-current', item.dataset.lang === language ? 'true' : 'false');
    });
  };

  const savedLanguage = localStorage.getItem('sama-language') || 'en';
  applyLanguage(savedLanguage);

  const themeButton = document.getElementById('theme-control-v2');
  const applyTheme = (theme) => {
    const next = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = next;
    localStorage.setItem('sama-theme', next);
    themeButton?.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} theme`);
    themeButton?.setAttribute('title', `Switch to ${next === 'dark' ? 'light' : 'dark'} theme`);
  };
  applyTheme(localStorage.getItem('sama-theme') || 'light');
  themeButton?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  const languageButton = document.getElementById('language-control-v2');
  const dropdown = document.getElementById('language-dropdown-v2');
  const setLanguageMenu = (open) => {
    dropdown.hidden = !open;
    languageButton?.setAttribute('aria-expanded', String(open));
  };
  languageButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    setLanguageMenu(dropdown.hidden);
  });
  dropdown?.querySelectorAll('[data-lang]').forEach((item) => {
    item.addEventListener('click', () => {
      applyLanguage(item.dataset.lang);
      setLanguageMenu(false);
    });
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.language-control-wrap')) setLanguageMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setLanguageMenu(false);
  });

  const menuButton = document.getElementById('menu-control-v2');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenu = () => {
    mobileMenu?.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
    menuButton?.setAttribute('title', 'Menu');
    if (menuButton) menuButton.innerHTML = '<i data-lucide="menu"></i>';
    window.lucide?.createIcons();
  };
  menuButton?.addEventListener('click', () => {
    if (!mobileMenu) {
      document.querySelectorAll('.desktop-nav a').forEach((link) => link.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      return;
    }
    const open = mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuButton.setAttribute('title', open ? 'Close menu' : 'Menu');
    menuButton.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}"></i>`;
    window.lucide?.createIcons();
  });

  window.lucide?.createIcons();
});
