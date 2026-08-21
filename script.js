document.addEventListener('DOMContentLoaded',()=>{
  if(window.lucide)lucide.createIcons();

  const LANGS={en:'English',ar:'العربية',ur:'اردو'};
  const savedLanguage=localStorage.getItem('novalux-language')||'en';
  const savedTheme=localStorage.getItem('novalux-theme')||'system';
  const themeOrder=['light','dark','system'];
  const themeIcons={light:'sun',dark:'moon',system:'sun-moon'};
  const themeLabels={light:'Light mode',dark:'Dark mode',system:'System mode'};

  // Navbar control card: Theme / Language / Menu
  const controlStyle=document.createElement('style');
  controlStyle.textContent=`
    .nav-icon-card{display:flex!important;align-items:center;justify-content:center;gap:6px;padding:6px!important;margin-left:8px!important;width:max-content;min-width:132px;height:52px;background:rgba(248,249,250,.98)!important;border:1px solid rgba(20,20,20,.09)!important;border-radius:12px!important;box-shadow:0 6px 20px rgba(0,0,0,.10)!important;color:#171717!important;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);flex:0 0 auto;position:relative;z-index:110}
    .nav-icon-btn{width:40px!important;height:40px!important;min-width:40px!important;border:0!important;border-radius:9px!important;background:transparent!important;color:#171717!important;display:grid!important;place-items:center!important;padding:0!important;cursor:pointer;transition:background .2s ease,transform .2s ease!important;position:relative}
    .nav-icon-btn:hover,.nav-icon-btn:focus-visible{background:#e8eaed!important;transform:translateY(-1px);outline:none}
    .nav-icon-btn.language-btn{color:#1976d2!important}
    .nav-icon-btn svg{width:20px!important;height:20px!important;stroke-width:2!important}
    .nav-icon-btn::after{content:attr(aria-label);position:absolute;top:calc(100% + 8px);right:0;background:#171717;color:#fff;padding:5px 8px;border-radius:5px;font-size:10px;font-weight:600;white-space:nowrap;opacity:0;pointer-events:none;transform:translateY(-3px);transition:opacity .15s ease,transform .15s ease;z-index:300}
    .nav-icon-btn:hover::after,.nav-icon-btn:focus-visible::after{opacity:1;transform:none}
    .nav-language-select{position:absolute!important;opacity:0!important;pointer-events:none!important;width:1px!important;height:1px!important;border:0!important}
    html[data-theme='dark'] .nav-icon-card{background:rgba(35,35,35,.98)!important;border-color:rgba(255,255,255,.12)!important;box-shadow:0 7px 22px rgba(0,0,0,.32)!important;color:#fff!important}
    html[data-theme='dark'] .nav-icon-btn{color:#fff!important}
    html[data-theme='dark'] .nav-icon-btn:hover,html[data-theme='dark'] .nav-icon-btn:focus-visible{background:#303030!important}
    html[data-theme='dark'] .nav-icon-btn.language-btn{color:#58a6ff!important}
    @media(max-width:1100px){.header-inner{gap:12px}.desktop-nav{gap:11px}.nav-icon-card{min-width:126px;width:126px;gap:3px;padding:5px!important}.nav-icon-btn{width:37px!important;height:37px!important;min-width:37px!important}.nav-icon-btn svg{width:19px!important;height:19px!important}}
    @media(max-width:850px){.nav-icon-card{margin-left:auto!important;margin-right:4px!important;min-width:132px;width:132px;height:48px;padding:5px!important}.nav-icon-btn{width:38px!important;height:38px!important;min-width:38px!important}.nav-icon-btn::after{display:none}.desktop-nav,.header-cta{display:none!important}.menu-toggle{display:none!important}.header-inner{gap:8px}.logo{margin-right:auto}}
    @media(max-width:430px){.nav-icon-card{min-width:120px;width:120px}.nav-icon-btn{width:34px!important;height:34px!important;min-width:34px!important}.nav-icon-btn svg{width:18px!important;height:18px!important}.logo{font-size:.72rem}.logo-mark{width:30px;height:30px}}
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
    document.getElementById('language-selector')?.closest('.language-selector-wrap')?.remove();
    document.getElementById('theme-selector')?.closest('.theme-selector-wrap')?.remove();
    document.getElementById('nav-icon-card')?.remove();
    document.getElementById('menu-toggle')?.style.setProperty('display','none','important');

    const card=document.createElement('div');
    card.id='nav-icon-card';
    card.className='nav-icon-card';
    card.innerHTML=`
      <button class="nav-icon-btn" id="theme-control" type="button" aria-label="Theme" title="Theme"><i data-lucide="sun-moon"></i></button>
      <button class="nav-icon-btn language-btn" id="language-control" type="button" aria-label="Language" title="Language"><i data-lucide="globe-2"></i></button>
      <button class="nav-icon-btn" id="menu-control" type="button" aria-label="Open menu" aria-expanded="false" title="Menu"><i data-lucide="menu"></i></button>`;

    headerInner.appendChild(card);

    const langSelect=document.createElement('select');
    langSelect.id='language-selector';langSelect.className='nav-language-select';langSelect.setAttribute('aria-hidden','true');
    Object.entries(LANGS).forEach(([code,name])=>{const option=document.createElement('option');option.value=code;option.textContent=name;langSelect.appendChild(option)});
    langSelect.value=LANGS[savedLanguage]?savedLanguage:'en';
    card.appendChild(langSelect);

    document.getElementById('theme-control').addEventListener('click',()=>{const current=localStorage.getItem('novalux-theme')||'system';const next=themeOrder[(themeOrder.indexOf(current)+1)%themeOrder.length];applyTheme(next)});
    document.getElementById('language-control').addEventListener('click',()=>{const current=localStorage.getItem('novalux-language')||'en';const keys=Object.keys(LANGS);const next=keys[(keys.indexOf(current)+1)%keys.length];langSelect.value=next;applyLanguage(next)});
    document.getElementById('menu-control').addEventListener('click',()=>{const mobile=document.getElementById('mobile-menu');const open=mobile?.classList.toggle('open');document.body.classList.toggle('menu-open',!!open);const b=document.getElementById('menu-control');b.setAttribute('aria-expanded',String(!!open));b.setAttribute('aria-label',open?'Close menu':'Open menu');b.setAttribute('title',open?'Close menu':'Menu');b.innerHTML=`<i data-lucide="${open?'x':'menu'}"></i>`;if(window.lucide)lucide.createIcons()});
    if(window.lucide)lucide.createIcons();
  }

  const hidden=document.createElement('div');hidden.id='google_translate_element';hidden.setAttribute('aria-hidden','true');hidden.style.cssText='position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';document.body.appendChild(hidden);
  applyTheme(savedTheme);
  const media=window.matchMedia('(prefers-color-scheme: dark)');media.addEventListener?.('change',()=>{if(localStorage.getItem('novalux-theme')==='system')applyTheme('system')});

  const header=document.getElementById('site-header');const onScroll=()=>header&&header.classList.toggle('scrolled',window.scrollY>30);onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  const mobileMenu=document.getElementById('mobile-menu');
  const closeMenu=()=>{mobileMenu?.classList.remove('open');document.body.classList.remove('menu-open');const b=document.getElementById('menu-control');if(b){b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Open menu');b.setAttribute('title','Menu');b.innerHTML='<i data-lucide="menu"></i>';if(window.lucide)lucide.createIcons()}};
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
