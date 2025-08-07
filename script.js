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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const statusEl = document.getElementById('formStatus');
    function setStatus(msg, type = 'info') {
      if (!statusEl) return alert(msg);
      statusEl.textContent = msg;
      statusEl.dataset.type = type;
      statusEl.style.display = 'block';
    }

    const name = (document.getElementById('name')?.value || '').trim();
    const phone = (document.getElementById('phone')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const details = (document.getElementById('details')?.value || '').trim();
    const services = Array.from(document.querySelectorAll('input[name="services"]:checked')).map(i => i.value);

    if (!name || !phone || !email) {
      setStatus('Please complete Name, Phone Number, and Email.', 'error');
      return;
    }

    try {
      setStatus('Sending...', 'info');
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, details, services })
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || `Request failed: ${resp.status}`);
      }

      setStatus('Thanks! Your message has been sent.', 'success');
      form.reset();
    } catch (err) {
      // Fallback to mailto so the user still has a way to reach you
      setStatus('Unable to send via server. Opening your email client...', 'error');
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
    }
  });
}

document.addEventListener('DOMContentLoaded', handleContactForm);
