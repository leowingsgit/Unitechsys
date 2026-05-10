const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const chatLauncher = document.querySelector('.chat-launcher');
const chatbot = document.querySelector('.chatbot');
const chatClose = document.querySelector('.chat-close');
const chatForm = document.querySelector('.chat-form');
const chatMessages = document.querySelector('.chat-messages');
const themeToggle = document.querySelector('.theme-toggle');
const rotatingWord = document.querySelector('.rotating-word');
const visitorIp = document.querySelector('.visitor-ip');

if (rotatingWord && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const words = rotatingWord.dataset.rotatingWords.split('|');
  let activeWord = 0;
  let letterIndex = 0;
  let isDeleting = false;
  function typeHeroWord() {
    const word = words[activeWord];
    rotatingWord.textContent = word.slice(0, letterIndex);
    if (!isDeleting && letterIndex < word.length) { letterIndex += 1; window.setTimeout(typeHeroWord, 52); return; }
    if (!isDeleting && letterIndex === word.length) {
      rotatingWord.classList.add('is-changing');
      window.setTimeout(() => { rotatingWord.classList.remove('is-changing'); isDeleting = true; typeHeroWord(); }, 1350);
      return;
    }
    if (isDeleting && letterIndex > 0) { letterIndex -= 1; window.setTimeout(typeHeroWord, 28); return; }
    isDeleting = false;
    activeWord = (activeWord + 1) % words.length;
    window.setTimeout(typeHeroWord, 260);
  }
  typeHeroWord();
}

const revealTargets = document.querySelectorAll('.trust-strip div, .intro-copy, .intro-panel, .values article, .service-grid article, .support-band, .partner-block, .contact-panel');
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
  const isDark = mode === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  window.localStorage.setItem('theme', mode);
}
if (window.localStorage.getItem('theme') === 'dark') setTheme('dark');

async function loadVisitorIp() {
  if (!visitorIp) return;

  try {
    const response = await fetch('/client-ip', { cache: 'no-store' });
    if (!response.ok) throw new Error('IP unavailable');
    const data = await response.json();
    visitorIp.textContent = data.ip || 'IP unavailable';
  } catch (error) {
    visitorIp.textContent = 'IP unavailable';
  }
}

loadVisitorIp();

const intentLibrary = [
  { name: 'Managed IT support', keywords: ['support', 'outsourcing', 'helpdesk', 'maintenance', 'onsite', 'slow pc', 'printer', 'ticket', 'troubleshoot', 'urgent'], summary: 'UNI can operate as your day-to-day IT support team for helpdesk requests, onsite troubleshooting, endpoint setup, preventive maintenance, and vendor coordination.', steps: ['Confirm affected users, devices, location, and urgency.', 'Stabilize the issue first, then review the root cause.', 'Set a maintenance rhythm for patching, checks, backups, and recurring problems.'], followUps: ['How many users or devices need support?', 'Is this urgent today or planned support?'], prompt: 'Need helpdesk support' },
  { name: 'Cloud and productivity', keywords: ['cloud', 'microsoft 365', 'office 365', 'google', 'workspace', 'email', 'backup', 'migration', 'onedrive', 'sharepoint'], summary: 'For Microsoft 365, Google Workspace, identity, email, storage, backup, and migration projects, UNI can plan the rollout and support users after migration.', steps: ['Review current email, files, users, licenses, and security settings.', 'Prepare migration timing, backup, identity, and access controls.', 'Complete cutover with user support and post-migration checks.'], followUps: ['How many mailboxes or users are involved?', 'Are you migrating from another provider?'], prompt: 'Plan cloud migration' },
  { name: 'Cybersecurity and identity', keywords: ['security', 'firewall', 'virus', 'endpoint', 'mfa', 'fido', 'password', 'breach', 'ransomware', 'phishing', 'zero trust'], summary: 'UNI can strengthen practical security with endpoint protection, firewall policy, MFA, FIDO2 security keys, backup validation, access reviews, and security governance.', steps: ['Check endpoint protection, patch status, firewall rules, and admin accounts.', 'Enable MFA or FIDO2 for key services and high-risk users.', 'Validate backups and create a clear response path for incidents.'], followUps: ['Which system or account is at risk?', 'Do you already use MFA or endpoint protection?'], prompt: 'Improve cybersecurity' },
  { name: 'Network infrastructure', keywords: ['network', 'wifi', 'wi-fi', 'router', 'switch', 'cabling', 'internet', 'vlan', 'vpn', 'wireless'], summary: 'UNI can plan, deploy, and maintain switching, Wi-Fi, routing, cabling coordination, monitoring, and performance tuning for reliable connectivity.', steps: ['Map the office layout, users, devices, internet link, and weak coverage areas.', 'Review switches, access points, firewall, cabling, and segmentation.', 'Recommend upgrade priorities with monitoring and documentation.'], followUps: ['How many rooms or floors need Wi-Fi?', 'Is the issue speed, coverage, dropouts, or security?'], prompt: 'Fix network or Wi-Fi' },
  { name: 'Hardware and lifecycle', keywords: ['laptop', 'desktop', 'server', 'hardware', 'storage', 'ups', 'device', 'procure', 'lenovo', 'dell', 'hp'], summary: 'UNI can source, configure, deploy, and maintain business desktops, notebooks, servers, storage, UPS units, accessories, and lifecycle replacement plans.', steps: ['Confirm user role, performance needs, warranty, and budget range.', 'Prepare configuration, delivery, setup, data transfer, and asset records.', 'Plan refresh cycles so aging equipment does not interrupt operations.'], followUps: ['How many devices do you need?', 'Is this new deployment, replacement, or repair?'], prompt: 'Request hardware quote' },
  { name: 'Software, licensing, and web', keywords: ['website', 'software', 'development', 'install', 'license', 'licensing', 'application', 'workflow', 'web'], summary: 'UNI can handle software installation, licensing compliance, website delivery, application support, workflow improvements, and business system maintenance.', steps: ['Clarify the business process, users, software requirements, and timeline.', 'Confirm licensing, hosting, support, backup, and security needs.', 'Deliver the implementation with documentation and user support.'], followUps: ['Is this for a website, software setup, or custom workflow?', 'Do you already have a platform or license?'], prompt: 'Discuss software or web project' },
  { name: 'Remote support and client tools', keywords: ['teamviewer', 'anydesk', 'remote', 'session', 'dns', 'speed test', 'fast.com', 'eset', 'scanner', 'online scan', 'antivirus', 'threat map', 'cyber map', 'kaspersky', 'forms', 'power automate', 'automation', 'workflow'], summary: 'The Client Support Portal includes TeamViewer, AnyDesk, DNS Checker, ESET Online Scanner, Fast.com, a Cyber Threat Map, Microsoft Forms, and Power Automate links for guided troubleshooting and workflow intake.', steps: ['Open the Client Portal and choose the requested tool.', 'Run only the tool requested by support and share IDs or results securely.', 'For remote sessions, keep the support engineer on WhatsApp or email before allowing access.'], followUps: ['Which tool did support ask you to run?', 'Are you checking remote access, DNS, speed, or malware?'], prompt: 'Open client tools' },
  { name: 'Contact and quotation', keywords: ['contact', 'phone', 'email', 'whatsapp', 'quote', 'price', 'cost', 'quotation', 'call'], summary: 'For a fast response, WhatsApp UNI Technology Systems at (65) 9092 7222 or email enquiries@unitechsys.sg with your company size, issue, timeline, and affected systems.', steps: ['Share what you need help with.', 'Include urgency, number of users/devices, and location if onsite support is needed.', 'The team can follow up with recommendation, availability, and pricing.'], followUps: ['Would you like to contact by WhatsApp or email?', 'Is this urgent support or a planned project?'], prompt: 'Get contact details' }
];

const starterPrompts = ['Need helpdesk support', 'Plan cloud migration', 'Improve cybersecurity', 'Fix network or Wi-Fi', 'Open client tools'];
const handoffLinks = [
  { label: 'WhatsApp support', href: 'https://api.whatsapp.com/send?phone=6590927222' },
  { label: 'Email support', href: 'mailto:enquiries@unitechsys.sg?subject=UNI%20IT%20Assistant%20Enquiry' },
  { label: 'Client portal', href: '/portal.html' },
  { label: 'View services', href: '#services' }
];

function addMessage(text, sender = 'bot', details = {}) {
  const message = document.createElement('div');
  message.className = `message ${sender}`;
  if (details.html) message.appendChild(details.html); else message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return message;
}

function buildBotMessage(answer) {
  const wrapper = document.createElement('div');
  const title = document.createElement('strong');
  title.className = 'message-title';
  title.textContent = answer.title;
  wrapper.appendChild(title);
  const summary = document.createElement('p');
  summary.textContent = answer.summary;
  wrapper.appendChild(summary);
  if (answer.matches.length > 1) {
    const related = document.createElement('p');
    related.textContent = `I also noticed: ${answer.matches.slice(1).map((item) => item.name).join(', ')}.`;
    wrapper.appendChild(related);
  }
  const list = document.createElement('ol');
  list.className = 'message-list';
  answer.steps.forEach((step) => { const item = document.createElement('li'); item.textContent = step; list.appendChild(item); });
  wrapper.appendChild(list);
  const next = document.createElement('p');
  next.textContent = `Next, please share: ${answer.followUps.join(' ')}`;
  wrapper.appendChild(next);
  const meta = document.createElement('div');
  meta.className = 'message-meta';
  answer.signals.forEach((signal) => { const chip = document.createElement('span'); chip.className = 'message-chip'; chip.textContent = signal; meta.appendChild(chip); });
  if (answer.confidence) { const chip = document.createElement('span'); chip.className = 'message-chip'; chip.textContent = answer.confidence; meta.appendChild(chip); }
  wrapper.appendChild(meta);
  return wrapper;
}

function addTypingIndicator() {
  const message = document.createElement('div');
  message.className = 'message typing';
  message.setAttribute('aria-label', 'Assistant is typing');
  message.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return message;
}

function addQuickReplies(labels) {
  const existing = chatMessages.querySelector('.quick-replies');
  if (existing) existing.remove();
  const options = document.createElement('div');
  options.className = 'quick-replies';
  labels.forEach((label) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chat-option';
    button.textContent = label;
    button.addEventListener('click', () => handleQuestion(label));
    options.appendChild(button);
  });
  chatMessages.appendChild(options);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addHandoffLinks() {
  const existing = chatMessages.querySelector('.chat-handoffs');
  if (existing) existing.remove();
  const links = document.createElement('div');
  links.className = 'chat-handoffs';
  handoffLinks.forEach((link, index) => {
    const anchor = document.createElement('a');
    anchor.className = index === 0 ? 'chat-option primary link' : 'chat-option link';
    anchor.href = link.href;
    anchor.textContent = link.label;
    if (link.href.startsWith('http')) { anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
    links.appendChild(anchor);
  });
  chatMessages.appendChild(links);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function scoreIntent(input, intent) {
  const normalized = input.toLowerCase();
  return intent.keywords.reduce((score, keyword) => normalized.includes(keyword) ? score + keyword.length : score, 0);
}

function getSignals(input) {
  const normalized = input.toLowerCase();
  const signals = [];
  const userMatch = normalized.match(/(\d+)\s*(user|users|staff|people|pc|pcs|laptop|laptops|device|devices|mailbox|mailboxes)/);
  if (userMatch) signals.push(`${userMatch[1]} ${userMatch[2]}`);
  if (/(urgent|today|asap|down|cannot|can't|offline|breach|hacked|ransomware)/.test(normalized)) signals.push('urgent attention');
  if (/(office|onsite|site|floor|floors|branch)/.test(normalized)) signals.push('site context');
  if (/(quote|price|cost|quotation|buy|purchase)/.test(normalized)) signals.push('quotation needed');
  return signals.length ? signals : ['guided triage'];
}

function getBotAnswer(input) {
  const ranked = intentLibrary.map((intent) => ({ ...intent, score: scoreIntent(input, intent) })).sort((left, right) => right.score - left.score);
  const matches = ranked.filter((intent) => intent.score > 0).slice(0, 2);
  const match = matches[0] || null;
  if (!match) {
    return { title: 'Let me narrow this down', summary: 'UNI supports helpdesk, cloud, cybersecurity, networks, hardware, software, websites, client tools, and IT quotations. Type the affected system, number of users/devices, and urgency for a sharper recommendation.', steps: ['Choose the closest topic below.', 'Describe what is broken or what you want to improve.', 'Include user count, location, deadline, and any error message.'], followUps: ['What system is affected?', 'How urgent is it?'], signals: getSignals(input), matches: [], confidence: 'needs more detail', options: starterPrompts };
  }
  return { title: match.name, summary: match.summary, steps: match.steps, followUps: match.followUps, signals: getSignals(input), matches, confidence: matches.length > 1 ? 'multi-topic match' : 'good match', options: [match.prompt, 'Open client tools', 'Get contact details', 'Urgent support'] };
}

function handleQuestion(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;
  addMessage(cleanQuestion, 'user');
  const typing = addTypingIndicator();
  window.setTimeout(() => {
    typing.remove();
    const answer = getBotAnswer(cleanQuestion);
    addMessage('', 'bot', { html: buildBotMessage(answer) });
    addQuickReplies(answer.options);
    addHandoffLinks();
  }, Math.min(950, 360 + cleanQuestion.length * 14));
}

function openChat() {
  chatbot.classList.add('open');
  chatbot.setAttribute('aria-hidden', 'false');
  chatLauncher.setAttribute('aria-expanded', 'true');
  if (!chatMessages.children.length) {
    addMessage('Hi, I am the UNI IT Assistant. I can help triage IT support, cloud migration, cybersecurity, Wi-Fi/network, hardware, software/web projects, client tools, and quotations. Choose a topic or type your issue with user count and urgency.', 'system');
    addQuickReplies(starterPrompts);
    addHandoffLinks();
  }
  chatForm.elements.message.focus();
}

function closeChat() {
  chatbot.classList.remove('open');
  chatbot.setAttribute('aria-hidden', 'true');
  chatLauncher.setAttribute('aria-expanded', 'false');
}

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
chatLauncher.addEventListener('click', openChat);
chatClose.addEventListener('click', closeChat);
themeToggle.addEventListener('click', () => { setTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark'); });

function submitChatQuestion() {
  const input = chatForm.elements.message;
  const question = input.value.trim();
  if (!question) return;
  input.value = '';
  handleQuestion(question);
}
chatForm.addEventListener('submit', (event) => { event.preventDefault(); submitChatQuestion(); });
chatForm.elements.message.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submitChatQuestion(); }
});
chatForm.querySelector('button').addEventListener('click', (event) => { event.preventDefault(); submitChatQuestion(); });


