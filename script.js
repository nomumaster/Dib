// Update footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Theme toggle (dark default)
const toggle = document.getElementById('themeToggle');
const icon = document.getElementById('themeIcon');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'light') {
    document.body.style.background = '#f6f7fb';
    document.body.style.color = '#0f1220';
    icon.classList.remove('ri-moon-line');
    icon.classList.add('ri-sun-line');
  } else {
    document.body.style.background = '';
    document.body.style.color = '';
    icon.classList.remove('ri-sun-line');
    icon.classList.add('ri-moon-line');
  }
}

const saved = localStorage.getItem('theme') || 'dark';
applyTheme(saved);

if (toggle) {
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

// Contact form handling
function handleContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Pre-fill intent
  const params = new URLSearchParams(window.location.search);
  if (params.get('intent') === 'consultation') {
    const details = document.getElementById('details');
    if (details && !details.value) {
      details.value = 'Requesting a consultation about scope, budget, and timeline.';
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = (document.getElementById('name')?.value || '').trim();
    const phone = (document.getElementById('phone')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const details = (document.getElementById('details')?.value || '').trim();
    const services = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(i => i.value);

    if (!name || !phone || !email) {
      alert('Please complete Name, Phone Number, and Email.');
      return;
    }

    const subject = encodeURIComponent(`[Website Contact] ${name}`);
    const bodyLines = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Services: ${services.join(', ') || 'N/A'}`,
      '',
      'Details:',
      details || 'N/A'
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailto = `mailto:nomu@dataisbacon.com?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  });
}

document.addEventListener('DOMContentLoaded', handleContactForm);
