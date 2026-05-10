const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const chatLauncher = document.querySelector('.chat-launcher');
const chatbot = document.querySelector('.chatbot');
const chatClose = document.querySelector('.chat-close');
const chatForm = document.querySelector('.chat-form');
const chatMessages = document.querySelector('.chat-messages');
const themeToggle = document.querySelector('.theme-toggle');

const revealTargets = document.querySelectorAll('.metric, .intro-copy, .intro-panel, .value-card, .service-card, .support-band, .partner-panel, .contact-panel');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach((target) => target.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}

function setTheme(mode) {
  if (!themeToggle) return;
  const isDark = mode === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  window.localStorage.setItem('theme', mode);
}

if (window.localStorage.getItem('theme') === 'dark') {
  setTheme('dark');
}

const starterPrompts = ['Managed IT support', 'Cloud migration', 'Cybersecurity review', 'Network support', 'Hardware quote'];
const supportLinks = [
  { label: 'Email support', href: 'mailto:enquiries@unitechsys.sg?subject=UNI%20Service%20Desk%20Request' },
  { label: 'WhatsApp support', href: 'https://api.whatsapp.com/send?phone=6590927222' },
  { label: 'Client portal', href: '/portal.html' },
  { label: 'View services', href: '#services' }
];

const responses = {
  'managed it support': 'UNI can provide helpdesk support, endpoint setup, onsite troubleshooting, maintenance planning, and vendor coordination for daily IT operations.',
  'cloud migration': 'UNI can plan Microsoft 365, Google Workspace, identity, file storage, backup, and migration projects with user support after cutover.',
  'cybersecurity review': 'UNI can review endpoint protection, firewall posture, MFA, FIDO2 keys, backup validation, access controls, and incident response readiness.',
  'network support': 'UNI can assess switching, routing, Wi-Fi, firewall, cabling coordination, VPN, monitoring, and office connectivity performance.',
  'hardware quote': 'UNI can source and configure notebooks, desktops, servers, storage, UPS units, accessories, warranties, and lifecycle replacement plans.'
};

function addMessage(text, sender = 'bot') {
  if (!chatMessages) return null;
  const message = document.createElement('div');
  message.className = `message ${sender}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return message;
}

function addQuickReplies() {
  const existing = chatMessages.querySelector('.quick-replies');
  if (existing) existing.remove();
  const options = document.createElement('div');
  options.className = 'quick-replies';
  starterPrompts.forEach((label) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chat-option';
    button.textContent = label;
    button.addEventListener('click', () => handleQuestion(label));
    options.appendChild(button);
  });
  chatMessages.appendChild(options);
}

function addSupportLinks() {
  const existing = chatMessages.querySelector('.chat-handoffs');
  if (existing) existing.remove();
  const links = document.createElement('div');
  links.className = 'chat-handoffs';
  supportLinks.forEach((link, index) => {
    const anchor = document.createElement('a');
    anchor.className = index === 0 ? 'chat-option primary link' : 'chat-option link';
    anchor.href = link.href;
    anchor.textContent = link.label;
    if (link.href.startsWith('http')) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    links.appendChild(anchor);
  });
  chatMessages.appendChild(links);
}

function handleQuestion(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;
  addMessage(cleanQuestion, 'user');
  const key = cleanQuestion.toLowerCase();
  const matchedKey = Object.keys(responses).find((candidate) => key.includes(candidate.split(' ')[0]) || candidate.includes(key));
  const response = matchedKey ? responses[matchedKey] : 'Please share the affected system, number of users or devices, location, and urgency. UNI will route the request to the right support path.';
  window.setTimeout(() => {
    addMessage(response, 'bot');
    addQuickReplies();
    addSupportLinks();
  }, 320);
}

function openChat() {
  if (!chatbot || !chatMessages) return;
  chatbot.classList.add('open');
  chatbot.setAttribute('aria-hidden', 'false');
  chatLauncher.setAttribute('aria-expanded', 'true');
  if (!chatMessages.children.length) {
    addMessage('Welcome to the UNI Service Desk. Select a topic or describe your support request with user count, affected system, location, and urgency.', 'system');
    addQuickReplies();
    addSupportLinks();
  }
  chatForm.elements.message.focus();
}

function closeChat() {
  chatbot.classList.remove('open');
  chatbot.setAttribute('aria-hidden', 'true');
  chatLauncher.setAttribute('aria-expanded', 'false');
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

if (chatLauncher && chatClose && chatForm) {
  chatLauncher.addEventListener('click', openChat);
  chatClose.addEventListener('click', closeChat);
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = chatForm.elements.message;
    const question = input.value.trim();
    if (!question) return;
    input.value = '';
    handleQuestion(question);
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    setTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark');
  });
}
