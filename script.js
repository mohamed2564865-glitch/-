// Theme toggle with persistence
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') root.classList.add('light');

const themeBtn = document.getElementById('theme-toggle');
themeBtn?.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

// Mobile nav
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navList.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', () => navList.classList.remove('open'));
});

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Scroll spy (active nav link)
const sections = [...document.querySelectorAll('section[id]')];
const links = [...document.querySelectorAll('.nav-link')];
const spy = () => {
  let current = sections[0].id;
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 120) current = sec.id;
  });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
};
window.addEventListener('scroll', spy);
window.addEventListener('load', spy);

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form: simple validation + mailto compose
const form = document.getElementById('contact-form');
const statusEl = document.querySelector('.form-status');

const setError = (el, msg) => {
  el.classList.add('error');
  const small = el.parentElement.querySelector('.error-msg');
  if (small) small.textContent = msg || '';
};
const clearError = (el) => {
  el.classList.remove('error');
  const small = el.parentElement.querySelector('.error-msg');
  if (small) small.textContent = '';
};

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  clearError(form.name); clearError(form.email); clearError(form.message);

  let ok = true;
  if (name.length < 2){ setError(form.name, 'الاسم قصير جداً'); ok = false; }
  if (!/^\S+@\S+\.\S+$/.test(email)){ setError(form.email, 'بريد غير صالح'); ok = false; }
  if (message.length < 10){ setError(form.message, 'اكتب تفاصيل أكثر لو سمحت'); ok = false; }

  if (!ok) return;

  const subject = encodeURIComponent('تواصل عبر الموقع من: ' + name);
  const body = encodeURIComponent(`الاسم: ${name}\nالبريد: ${email}\n\n${message}`);
  window.location.href = `mailto:youremail@example.com?subject=${subject}&body=${body}`;

  statusEl.textContent = 'فتح برنامج البريد لإرسال رسالتك. شكراً لك!';
});