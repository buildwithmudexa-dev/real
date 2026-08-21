document.addEventListener('DOMContentLoaded',()=>{
  if(window.lucide)lucide.createIcons();

  /* ==========================================================
     NOVALUX NAVBAR CONTROLS
     Light card + Theme/Sun + Language/Globe + Menu buttons
     ========================================================== */
  const LANGS={en:'English',ar:'العربية',ur:'اردو'};
  const savedLanguage=localStorage.getItem('novalux-language')||'en';
  const savedTheme=localStorage.getItem('novalux-theme')||'system';
  const themeOrder=['light','dark','system'];
  const themeIcons={light:'sun',dark:'moon',system:'sun-moon'};
  const themeLabels={light:'Light mode',dark:'Dark mode',system:'System mode'};

  const controlStyle=document.createElement('style');
  controlStyle.textContent=`
    .nav-icon-card{display:flex;align-items:center;gap:7px;padding:6px;background:rgba(248,249,250,.96);border:1px solid rgba(20,20,20,.08);border-radius:12px;box-shadow:0 5px 18px rgba(0,0,0,.09);color:#171717;backdrop-filter:blur(12px);flex-shrink:0}
    .nav-icon-btn{width:38px;height:38px;border:0;border-radius:8px;background:transparent;color:#171717;display:grid;place-items:center;cursor:pointer;transition:all .2s ease;position:relative}
    .nav-icon-btn:hover,.nav-icon-btn:focus-visible{background:#e9eaec;transform:translateY(-1px);outline:none}
    .nav-icon-btn.language-btn{color:#1976d2}
    .nav-icon-btn svg{width:19px;height:19px;stroke-width:2}
    .nav-icon-btn::after{content:attr(aria-label);position:absolute;top:calc(100% + 8px);right:0;background:#171717;color:#fff;padding:5px 8px;border-radius:5px;font-size:10px;white-space:nowrap;opacity:0;pointer-events:none;transform:translateY(-3px);transition:.15s ease;z-index:300}
    .nav-icon-btn:hover::after,.nav-icon-btn:focus-visible::after{opacity:1;transform:none}
    .nav-language-select{position:absolute!important;opacity:0!important;pointer-events:none!important;width:1px!important;height:1px!important}
    html[data-theme='dark'] .nav-icon-card{background:rgba(35,35,35,.96);border-color:rgba(255,255,255,.1);box-shadow:0 5px 20px rgba(0,0,0,.3);color:#fff}
    html[data-theme='dark'] .nav-icon-btn{color:#fff}
    html[data-theme='dark'] .nav-icon-btn:hover,html[data-theme='dark'] .nav-icon-btn:focus-visible{background:#303030}
    @media(max-width:1100px){.nav-icon-card{padding:5px;gap:4px}.nav-icon-btn{width:36px;height:36px}}
    @media(max-width:850px){.nav-icon-card{margin-left:auto}.nav-icon-btn{width:35px;height:35px}.nav-icon-btn::after{display:none}.desktop-nav,.header-cta{display:none}.menu-toggle{display:none!important}}
  `;
  document.head.appendChild(controlStyle);

  const applyTheme=theme=>{
    const effective=theme==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme;
    document.documentElement.dataset.theme=effective;
    localStorage.setItem('novalux-theme',theme);
    const btn=document.getElementById('theme-control');
    if(btn){btn.innerHTML=`<i data-lucide="${themeIcons[theme]}"></i>`;btn.setAttribute('aria-label',themeLabels[theme]);btn.setAttribute('title',themeLabels[theme]);if(window.lucide)lucide.createIcons();}
  };
  const applyLanguage=lang=>{
    localStorage.setItem('novalux-language',lang);
    document.documentElement.lang=lang;
    document.documentElement.dir=(lang==='ar'||lang==='ur')?'rtl':'ltr';
    document.body.classList.toggle('rtl-language',lang==='ar'||lang==='ur');
    const combo=document.querySelector('.goog-te-combo');
    if(combo&&combo.value!==lang){combo.value=lang;combo.dispatchEvent(new Event('change'));}
  };
  window.googleTranslateElementInit=()=>{
    if(window.google?.translate?.TranslateElement){
      new google.translate.TranslateElement({pageLanguage:'en',includedLanguages:'ar,ur',autoDisplay:false,multilanguagePage:true},'google_translate_element');
      setTimeout(()=>applyLanguage(savedLanguage),300);
    }
  };
  if(!document.getElementById('google-translate-script')){const s=document.createElement('script');s.id='google-translate-script';s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';s.async=true;document.head.appendChild(s)}

  const headerInner=document.querySelector('.header-inner');
  if(headerInner){
    const oldLang=document.getElementById('language-selector')?.closest('.language-selector-wrap');
    const oldTheme=document.getElementById('theme-selector')?.closest('.theme-selector-wrap');
    oldLang?.remove();oldTheme?.remove();
    const oldMenu=document.getElementById('menu-toggle');
    oldMenu?.style.setProperty('display','none','important');

    const card=document.createElement('div');
    card.className='nav-icon-card';card.setAttribute('aria-label','Site controls');
    card.innerHTML=`
      <button class="nav-icon-btn" id="theme-control" type="button" aria-label="Theme" title="Theme"><i data-lucide="sun-moon"></i></button>
      <button class="nav-icon-btn language-btn" id="language-control" type="button" aria-label="Language" title="Language"><i data-lucide="globe-2"></i></button>
      <button class="nav-icon-btn" id="menu-control" type="button" aria-label="Open menu" aria-expanded="false" title="Menu"><i data-lucide="menu"></i></button>
    `;
    const menu=oldMenu;
    headerInner.appendChild(card);

    const langSelect=document.createElement('select');
    langSelect.id='language-selector';langSelect.className='nav-language-select';langSelect.setAttribute('aria-hidden','true');
    Object.entries(LANGS).forEach(([code,name])=>{const option=document.createElement('option');option.value=code;option.textContent=name;langSelect.appendChild(option)});
    langSelect.value=LANGS[savedLanguage]?savedLanguage:'en';card.appendChild(langSelect);

    document.getElementById('theme-control').addEventListener('click',()=>{const next=themeOrder[(themeOrder.indexOf(localStorage.getItem('novalux-theme')||'system')+1)%themeOrder.length];applyTheme(next)});
    document.getElementById('language-control').addEventListener('click',()=>{const current=localStorage.getItem('novalux-language')||'en';const keys=Object.keys(LANGS);const next=keys[(keys.indexOf(current)+1)%keys.length];langSelect.value=next;applyLanguage(next)});
    document.getElementById('menu-control').addEventListener('click',()=>{const mobile=document.getElementById('mobile-menu');const open=mobile?.classList.toggle('open');document.body.classList.toggle('menu-open',!!open);const b=document.getElementById('menu-control');b.setAttribute('aria-expanded',String(!!open));b.setAttribute('aria-label',open?'Close menu':'Open menu');b.innerHTML=`<i data-lucide="${open?'x':'menu'}"></i>`;if(window.lucide)lucide.createIcons()});
  }
  const hidden=document.createElement('div');hidden.id='google_translate_element';hidden.setAttribute('aria-hidden','true');hidden.style.cssText='position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';document.body.appendChild(hidden);
  applyTheme(savedTheme);

  const media=window.matchMedia('(prefers-color-scheme: dark)');media.addEventListener?.('change',()=>{if(localStorage.getItem('novalux-theme')==='system')applyTheme('system')});
  const header=document.getElementById('site-header');const onScroll=()=>header&&header.classList.toggle('scrolled',window.scrollY>30);onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  const mobileMenu=document.getElementById('mobile-menu');
  const closeMenu=()=>{mobileMenu?.classList.remove('open');document.body.classList.remove('menu-open');const b=document.getElementById('menu-control');if(b){b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Open menu');b.innerHTML='<i data-lucide="menu"></i>';if(window.lucide)lucide.createIcons()}};
  mobileMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

  const counters=document.querySelectorAll('[data-counter']);const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target,target=Number(el.dataset.counter),start=performance.now();const tick=now=>{const p=Math.min((now-start)/1200,1),ease=1-Math.pow(1-p,3);el.textContent=Math.floor(target*ease);if(p<1)requestAnimationFrame(tick);else el.textContent=target};requestAnimationFrame(tick);counterObserver.unobserve(el)}),{threshold:.4});counters.forEach(c=>counterObserver.observe(c));

  const cards=[...document.querySelectorAll('.property-card')],search=document.getElementById('property-search'),status=document.getElementById('status-filter'),type=document.getElementById('type-filter'),location=document.getElementById('location-filter'),price=document.getElementById('price-filter'),empty=document.getElementById('empty-state');
  const priceMatch=(v,f)=>{const n=Number(v);if(f==='under1m')return n<1000000;if(f==='1to3m')return n>=1000000&&n<=3000000;if(f==='3to5m')return n>3000000&&n<=5000000;if(f==='over5m')return n>5000000;return true};
  const filter=()=>{const q=(search?.value||'').trim().toLowerCase();let visible=0;cards.forEach(card=>{const ok=(!q||card.textContent.toLowerCase().includes(q))&&(status.value==='all'||card.dataset.status===status.value)&&(type.value==='all'||card.dataset.type===type.value)&&(location.value==='all'||card.dataset.location===location.value)&&priceMatch(card.dataset.price,price.value);card.hidden=!ok;if(ok)visible++});if(empty)empty.hidden=visible!==0};
  [search,status,type,location,price].forEach(el=>el?.addEventListener('input',filter));[status,type,location,price].forEach(el=>el?.addEventListener('change',filter));
  document.querySelectorAll('.property-favorite').forEach(button=>button.addEventListener('click',()=>button.classList.toggle('saved')));
  const testimonials=[...document.querySelectorAll('.testimonial')];let testimonialIndex=0;const showTestimonial=index=>{if(!testimonials.length)return;testimonialIndex=(index+testimonials.length)%testimonials.length;testimonials.forEach((item,i)=>item.classList.toggle('active',i===testimonialIndex))};document.getElementById('testimonial-prev')?.addEventListener('click',()=>showTestimonial(testimonialIndex-1));document.getElementById('testimonial-next')?.addEventListener('click',()=>showTestimonial(testimonialIndex+1));
  document.querySelectorAll('.faq-question').forEach(button=>button.addEventListener('click',()=>{const item=button.closest('.faq-item'),wasOpen=item.classList.contains('open');document.querySelectorAll('.faq-item').forEach(i=>{i.classList.remove('open');i.querySelector('.faq-question')?.setAttribute('aria-expanded','false')});if(!wasOpen){item.classList.add('open');button.setAttribute('aria-expanded','true')}}));
});
