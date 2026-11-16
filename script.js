(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---- Project data (single source of truth; add real URLs to github/demo) ---- */
  const PROJECTS = [
    { id: '01', name: 'Smart IV Drip Monitor', featured: true, tags: ['ESP32', 'HX711', 'OLED', 'IoT'], github: '', demo: '',
      desc: 'An IoT-based healthcare monitoring system using ESP32, HX711 load cell, OLED display and alert mechanisms to monitor IV fluid levels and detect changes in drip rate.' },
    { id: '02', name: 'LearnMate AI', featured: true, tags: ['Python', 'Flask', 'HTML', 'CSS', 'Gemini API'], github: '', demo: '',
      desc: 'An AI-powered study assistant built with Python, Flask, HTML, CSS and Google Gemini API. Features include Explain, Summarize and Quiz.' },
    { id: '03', name: 'Tic Tac Toe', tags: ['C', 'Turbo C++'], github: '', demo: '',
      desc: 'A playable console-based Tic Tac Toe game developed in C using Turbo C++. Demonstrates programming fundamentals, conditions, loops and game logic.' },
    { id: '04', name: 'C Calculator', tags: ['C'], github: '', demo: '',
      desc: 'A functional calculator developed using C programming.' },
    { id: '05', name: 'Student Performance Dashboard', tags: ['Data Analytics', 'Visualization'], github: '', demo: '',
      desc: 'A data analytics project involving student performance data, analysis and dashboard visualization.' }
  ];

  const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h != null) n.textContent = h; return n; };
  const link = (label, url) => {
    if (url) { const a = el('a', 'btn', label); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; }
    const b = el('button', 'btn off', label + ' (link pending)'); b.type = 'button'; b.setAttribute('aria-disabled', 'true'); b.title = 'Add the URL in script.js'; return b;
  };
  const grid = $('#projectGrid');
  PROJECTS.forEach(p => {
    const c = el('article', 'glass proj' + (p.featured ? ' feat' : ''));
    if (p.featured) c.appendChild(el('span', 'star', 'FEATURED'));
    c.appendChild(el('div', 'shot', '[ Screenshot placeholder: add to assets/ ]'));
    c.appendChild(el('span', 'num', 'PROJECT ' + p.id));
    c.appendChild(el('h3', '', p.name));
    c.appendChild(el('p', '', p.desc));
    const tg = el('ul', 'tags'); p.tags.forEach(t => tg.appendChild(el('li', '', t))); c.appendChild(tg);
    const bt = el('div', 'pbtns'); bt.append(link('GitHub', p.github), link('Demo', p.demo)); c.appendChild(bt);
    grid.appendChild(c);
  });

  /* ---- Nav, progress, back-to-top, active link ---- */
  const menuBtn = $('#menuBtn'), links = $('#links');
  const setMenu = o => { links.classList.toggle('open', o); menuBtn.setAttribute('aria-expanded', o); };
  menuBtn.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const bar = $('#progress'), top = $('#top');
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1) * 100) + '%';
    top.classList.toggle('show', h.scrollTop > 500);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.addEventListener('click', () => scrollTo({ top: 0 }));

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(s => io.observe(s));

  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('a', links).forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  /* ---- Hero: clock + typed text ---- */
  const tick = () => { $('#clock').textContent = new Date().toLocaleTimeString([], { hour12: false }); };
  tick(); setInterval(tick, 1000);
  $('#yr').textContent = new Date().getFullYear();
  const phrases = ['initializing portfolio...', 'loading projects: 5 found', 'ready to build.'];
  const typed = $('#typed'), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) typed.textContent = phrases[2];
  else { let p = 0, i = 0, del = false;
    (function loop() {
      const w = phrases[p];
      typed.textContent = w.slice(0, i);
      if (!del && i === w.length) { del = true; return setTimeout(loop, 1400); }
      if (del && i === 0) { del = false; p = (p + 1) % phrases.length; }
      i += del ? -1 : 1; setTimeout(loop, del ? 25 : 60);
    })(); }

  /* ---- Custom cursor (fine pointers only) ---- */
  const cur = $('#cursor');
  if (matchMedia('(pointer:fine)').matches) {
    addEventListener('mousemove', e => { cur.classList.add('on'); cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; }, { passive: true });
    document.addEventListener('mouseover', e => cur.classList.toggle('big', !!e.target.closest('a,button,input,textarea')));
  }

  /* ---- Terminal ---- */
  const out = $('#out'), cmd = $('#cmd'), hist = []; let hi = 0;
  const print = (t, c) => { const d = el('div', c || '', t); out.appendChild(d); out.scrollTop = out.scrollHeight; };
  const C = {
    help: () => 'Commands: help, about, skills, projects, contact, clear',
    about: () => 'Parth Kapadia: Computer Science student interested in software development, AI, electronics and problem-solving.',
    skills: () => 'Programming: C, Python\nWeb: HTML, CSS, JavaScript, Flask\nAI: Generative AI, Prompt Engineering, Gemini API\nHardware: ESP32, IoT fundamentals\nTools: Git, GitHub, VS Code',
    projects: () => PROJECTS.map(p => p.id + '  ' + p.name + (p.featured ? '  [featured]' : '')).join('\n'),
    contact: () => 'Contact details are placeholders for now. See the Contact section below.',
    clear: () => { out.textContent = ''; return null; }
  };
  print('Welcome. Type "help" to see commands.');
  cmd.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const v = cmd.value.trim().toLowerCase(); cmd.value = ''; if (!v) return;
      hist.push(v); hi = hist.length; print('$ ' + v, 'u');
      const r = C[v] ? C[v]() : 'Command not found: ' + v + '. Type "help" for commands.';
      if (r) print(r, C[v] ? '' : 'e');
    } else if (e.key === 'ArrowUp' && hi > 0) { cmd.value = hist[--hi]; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { cmd.value = hist[++hi] || ''; e.preventDefault(); }
  });
  $('#term').addEventListener('click', () => cmd.focus());

  /* ---- Contact form validation (frontend only) ---- */
  const form = $('#form'), msg = $('#formMsg');
  const rules = {
    name: v => v.trim().length >= 2 || 'Enter your name (2+ characters).',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    message: v => v.trim().length >= 10 || 'Message needs at least 10 characters.'
  };
  const check = f => { const r = rules[f.name](f.value), e = $('[data-for="' + f.name + '"]'); e.textContent = r === true ? '' : r; f.classList.toggle('bad', r !== true); return r === true; };
  $$('input,textarea', form).forEach(f => f.addEventListener('blur', () => check(f)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = $$('input,textarea', form).map(check).every(Boolean);
    msg.textContent = ok ? 'Message validated. This form has no backend yet; connect a form service or email link to send it.' : 'Fix the highlighted fields.';
    if (ok) form.reset();
  });
})();
