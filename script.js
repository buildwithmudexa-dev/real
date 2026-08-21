document.addEventListener('DOMContentLoaded',()=>{
  if(window.lucide)lucide.createIcons();

  // Full-page multilingual selector: English, Arabic and Urdu only.
  const LANGS={en:'English',ar:'العربية',ur:'اردو'};
  const saved=localStorage.getItem('novalux-language')||'en';

  const setGoogleLanguage=(lang)=>{
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
      setTimeout(()=>setGoogleLanguage(saved),250);
    }
  };

  const loadGoogleTranslate=()=>{
    if(document.getElementById('google-translate-script'))return;
    const s=document.createElement('script');s.id='google-translate-script';s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';s.async=true;document.head.appendChild(s);
  };

  const headerInner=document.querySelector('.header-inner');
  if(headerInner&&!document.getElementById('language-selector')){
    const wrap=document.createElement('div');wrap.className='language-selector-wrap';
    wrap.innerHTML='<label class="sr-only" for="language-selector">Language</label><span class="language-icon" aria-hidden="true">◎</span><select id="language-selector" aria-label="Language"></select>';
    const select=wrap.querySelector('select');
    Object.entries(LANGS).forEach(([code,name])=>{const o=document.createElement('option');o.value=code;o.textContent=name;select.appendChild(o)});
    select.value=LANGS[saved]?saved:'en';
    select.addEventListener('change',e=>setGoogleLanguage(e.target.value));
    const menu=document.getElementById('menu-toggle');if(menu)headerInner.insertBefore(wrap,menu);else headerInner.appendChild(wrap);
  }
  const hidden=document.createElement('div');hidden.id='google_translate_element';hidden.setAttribute('aria-hidden','true');hidden.style.cssText='position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';document.body.appendChild(hidden);
  loadGoogleTranslate();

  // Sticky glass header
  const header=document.getElementById('site-header');
  const onScroll=()=>header&&header.classList.toggle('scrolled',window.scrollY>30);
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  // Mobile menu
  const menuToggle=document.getElementById('menu-toggle'),mobileMenu=document.getElementById('mobile-menu');
  const closeMenu=()=>{mobileMenu?.classList.remove('open');document.body.classList.remove('menu-open');menuToggle?.setAttribute('aria-expanded','false')};
  menuToggle?.addEventListener('click',()=>{const open=mobileMenu.classList.toggle('open');document.body.classList.toggle('menu-open',open);menuToggle.setAttribute('aria-expanded',String(open))});
  mobileMenu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

  // Animated counters
  const counters=document.querySelectorAll('[data-counter]');
  const counterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const el=entry.target,target=Number(el.dataset.counter),start=performance.now();
    const tick=now=>{const p=Math.min((now-start)/1200,1),ease=1-Math.pow(1-p,3);el.textContent=Math.floor(target*ease);if(p<1)requestAnimationFrame(tick);else el.textContent=target};
    requestAnimationFrame(tick);counterObserver.unobserve(el);
  }),{threshold:.4});
  counters.forEach(c=>counterObserver.observe(c));

  // Property filtering
  const cards=[...document.querySelectorAll('.property-card')];
  const search=document.getElementById('property-search'),status=document.getElementById('status-filter'),type=document.getElementById('type-filter'),location=document.getElementById('location-filter'),price=document.getElementById('price-filter'),empty=document.getElementById('empty-state');
  const priceMatch=(v,f)=>{const n=Number(v);if(f==='under1m')return n<1000000;if(f==='1to3m')return n>=1000000&&n<=3000000;if(f==='3to5m')return n>3000000&&n<=5000000;if(f==='over5m')return n>5000000;return true};
  const filter=()=>{const q=(search?.value||'').trim().toLowerCase();let visible=0;cards.forEach(card=>{const ok=(!q||card.textContent.toLowerCase().includes(q))&&(status.value==='all'||card.dataset.status===status.value)&&(type.value==='all'||card.dataset.type===type.value)&&(location.value==='all'||card.dataset.location===location.value)&&priceMatch(card.dataset.price,price.value);card.hidden=!ok;if(ok)visible++});if(empty)empty.hidden=visible!==0};
  [search,status,type,location,price].forEach(el=>el?.addEventListener('input',filter));[status,type,location,price].forEach(el=>el?.addEventListener('change',filter));

  document.querySelectorAll('.property-favorite').forEach(button=>button.addEventListener('click',()=>button.classList.toggle('saved')));

  // Testimonials
  const testimonials=[...document.querySelectorAll('.testimonial')];let testimonialIndex=0;
  const showTestimonial=index=>{if(!testimonials.length)return;testimonialIndex=(index+testimonials.length)%testimonials.length;testimonials.forEach((item,i)=>item.classList.toggle('active',i===testimonialIndex))};
  document.getElementById('testimonial-prev')?.addEventListener('click',()=>showTestimonial(testimonialIndex-1));
  document.getElementById('testimonial-next')?.addEventListener('click',()=>showTestimonial(testimonialIndex+1));

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(button=>button.addEventListener('click',()=>{
    const item=button.closest('.faq-item'),wasOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>{i.classList.remove('open');i.querySelector('.faq-question')?.setAttribute('aria-expanded','false')});
    if(!wasOpen){item.classList.add('open');button.setAttribute('aria-expanded','true')}
  }));
});
