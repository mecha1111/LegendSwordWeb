(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero');
  const header = document.querySelector('header');
  const progress = document.createElement('span');
  progress.className = 'reading-progress'; progress.setAttribute('aria-hidden', 'true'); header.append(progress);
  let scrollFrame = 0, scrollDistance = 1, lastProgress = -1;
  const measurePage = () => { scrollDistance = Math.max(1, document.documentElement.scrollHeight - innerHeight); };
  measurePage();
  const updateScroll = () => {
    scrollFrame = 0;
    const value = Math.round(Math.min(1, scrollY / scrollDistance) * 1000) / 1000;
    if (value !== lastProgress) { progress.style.transform = `scaleX(${value})`; lastProgress = value; }
    header.classList.toggle('has-scrolled',scrollY > 24);
  };
  addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, { passive:true });
  const resizeObserver = new ResizeObserver(() => { measurePage(); updateScroll(); });
  resizeObserver.observe(document.body);
  addEventListener('resize', () => { measurePage(); updateScroll(); }); updateScroll();
  document.addEventListener('visibilitychange', () => document.body.classList.toggle('page-hidden', document.hidden));
  const atmosphere = new IntersectionObserver(entries => entries.forEach(entry => hero.classList.toggle('fx-paused',!entry.isIntersecting)));
  atmosphere.observe(hero);
  const light = document.createElement('span'); light.className = 'forest-light'; light.setAttribute('aria-hidden','true'); hero.append(light);
  const altar = document.querySelector('.altar');
  const glints = document.createElement('span'); glints.className = 'sword-glints'; glints.setAttribute('aria-hidden','true');
  for (let i=0;i<3;i++) glints.append(document.createElement('i')); altar.append(glints);
  document.querySelectorAll('.objects article').forEach(article => {
    let reset;
    const animate = () => {
      if (reducedMotion.matches || article.classList.contains('object-react')) return;
      article.classList.add('object-react'); clearTimeout(reset);
      reset = setTimeout(() => article.classList.remove('object-react'),700);
    };
    article.addEventListener('pointerenter', animate);
    article.addEventListener('pointerdown', animate);
  });
  document.querySelectorAll('.department').forEach((card,i) => card.style.setProperty('--reveal-delay',`${i * 70}ms`));
  const revealTargets = [...document.querySelectorAll('.about, .department, .download')];
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('reveal-pending'); entry.target.classList.add('reveal-ready'); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.08 });
  if (!reducedMotion.matches) revealTargets.forEach(el => {
    if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('reveal-pending'); revealObserver.observe(el); }
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) { revealTargets.forEach(el => el.classList.remove('reveal-pending')); revealObserver.disconnect(); }
  });
  const navLinks = [...document.querySelectorAll('nav a')];
  const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) navLinks.forEach(link => {
      if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }), { rootMargin: '-15% 0px -45% 0px' });
  document.querySelectorAll('main > section').forEach(section => sectionObserver.observe(section));
  document.addEventListener('click', event => {
    if (reducedMotion.matches || event.detail === 0 || document.querySelectorAll('.click-pixel').length >= 16 || !event.target.closest('.button, .nav-download, .altar')) return;
    [[-12,-10],[10,-12],[-9,10],[12,8]].forEach(([x,y]) => {
      const pixel = document.createElement('i'); pixel.className = 'click-pixel'; pixel.setAttribute('aria-hidden','true');
      pixel.style.left = event.clientX + 'px'; pixel.style.top = event.clientY + 'px';
      pixel.style.setProperty('--dx',x+'px'); pixel.style.setProperty('--dy',y+'px');
      document.body.append(pixel); setTimeout(() => pixel.remove(),350);
    });
  });
  document.querySelector('.altar').addEventListener('click', () => {
    const section = document.querySelector('#demo');
    section.classList.remove('is-invited');
    requestAnimationFrame(() => section.classList.add('is-invited'));
    section.querySelector('[data-demo-link]').focus({ preventScroll: true });
  });
  let demoUrl = null, timer;
  try { const url = new URL(window.GAME_SITE?.demoUrl || ''); if (['https:', 'http:'].includes(url.protocol)) demoUrl = url.href; } catch {}
  document.querySelectorAll('[data-demo-link]').forEach(link => {
    if (demoUrl) {
      link.href = demoUrl; link.target = '_blank'; link.rel = 'noopener noreferrer';
      document.querySelector('#demo-status').textContent = 'PC 데모 · 다운로드 페이지로 이동';
    } else link.addEventListener('click', event => {
      event.preventDefault(); const notice = document.querySelector('#notice');
      notice.textContent = '죄송합니다. 현재 데모는 추가 예정입니다.';
      notice.hidden = false; clearTimeout(timer); timer = setTimeout(() => { notice.hidden = true; }, 6000);
    });
  });
})();
