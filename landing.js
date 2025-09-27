// landing.js

// util: seletor seguro
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

// Ano no footer
document.addEventListener('DOMContentLoaded', () => {
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
});

// Menu mobile com acessibilidade
document.addEventListener('DOMContentLoaded', () => {
  const nav = $('#nav');
  const toggle = $('#navToggle');
  const links = $$('.nav-links a', nav);

  if (!nav || !toggle) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Fecha ao clicar em um link
  links.forEach(a => a.addEventListener('click', closeMenu));

  // Fecha com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
});

// Rolagem suave para âncoras da mesma página
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;

  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Lazy-enhance: prioriza imagens do carrossel quando entram na viewport
document.addEventListener('DOMContentLoaded', () => {
  const imgs = $$('.carousel img, .shot img');

  if ('loading' in HTMLImageElement.prototype) {
    // Navegadores já suportam loading="lazy" nativo → só garante decoding assíncrono
    imgs.forEach(img => img.decoding = 'async');
    return;
  }

  // Fallback com IntersectionObserver (para navegadores antigos)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        const src = target.getAttribute('data-src');
        if (src) {
          target.src = src;
          target.removeAttribute('data-src');
        }
        obs.unobserve(target);
      });
    }, { rootMargin: '200px 0px' });

    imgs.forEach(img => {
      // se já tem src, deixa; se quiser usar data-src, adapte seu HTML
      io.observe(img);
    });
  }
});
