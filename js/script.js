// Nav scroll shadow
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const allLinks  = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// Scroll reveal
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.stat-card, .skill-category, .timeline-card, .edu-card, .contact-card, .about-text, .hero-content, .hero-image-wrap, .project-card'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ============================================================
// AI PROJECTS — Modal
// ============================================================

const projectData = {
  'domain-scoring': {
    icon: '🧠',
    badge: 'ML · REST API',
    title: 'Domain Scoring Engine',
    problem: 'Domain registrars and investment platforms need to quickly assess domain quality without manual evaluation. Manually reviewing thousands of domains for memorability, marketability, and value is not scalable. This service automates premium domain identification using machine learning.',
    how: [
      'Ingests labeled domain datasets (premium, non-premium, sold domains) as CSV files.',
      'Extracts 40+ engineered features per domain — phonetic metrics (syllable count, vowel ratio, consonant clusters), TLD desirability rankings, digit/hyphen patterns, and market signals like how many TLDs are registered for the same name.',
      'Optionally generates 384-dimensional semantic embeddings using Sentence Transformers (all-MiniLM-L6-v2) to capture meaning and brandability.',
      'Trains a LightGBM binary classifier (premium vs non-premium) with auto-balanced class weights to handle dataset imbalance.',
      'Evaluates using ranking-aware metrics: ROC AUC, NDCG@K, Mean Average Precision, Precision@K — not just accuracy.',
      'Exposes a Flask REST API that scores 1–1000 domains per request in real time, returning a confidence score from 0.0 to 1.0.',
      'Feature extraction results are cached as Parquet files so model retraining is fast without re-processing data.',
    ],
    arch: [
      { label: 'ML Model', value: 'LightGBM Classifier' },
      { label: 'Embeddings', value: 'Sentence Transformers (384-dim)' },
      { label: 'API Framework', value: 'Flask REST' },
      { label: 'Feature Cache', value: 'Parquet files' },
      { label: 'Data Processing', value: 'Pandas, NumPy, scikit-learn' },
      { label: 'Model Storage', value: 'Pickle (.pkl)' },
    ],
    setup: `<span class="comment"># 1. Clone and set up environment</span>
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

<span class="comment"># 2. Place training data in data/</span>
<span class="comment">#    premium.csv, non_premium.csv, order_domains.csv</span>

<span class="comment"># 3. Train the model</span>
python train_grading_model.py

<span class="comment"># 4. Start the scoring API</span>
python run.py

<span class="comment"># 5. Score domains via POST /grade_domain</span>
curl -X POST http://localhost:5000/grade_domain \\
  -H "Content-Type: application/json" \\
  -d '{"domains":[{"domain_name":"shop.com","tld_taken_count":145}]}'`,
    tags: ['Python', 'LightGBM', 'Flask', 'Sentence Transformers', 'Pandas', 'NumPy', 'scikit-learn', 'Parquet'],
  },

  'livekit-voice': {
    icon: '🎙️',
    badge: 'AI Voice · Real-time',
    title: 'LiveKit AI Voice Agent',
    problem: 'Businesses need automated voice agents for customer service, outbound calling, and support — but building one from scratch means wiring together speech recognition, language models, voice synthesis, and phone network connectivity. This project assembles all of that into a production-ready, configurable voice agent.',
    how: [
      'Agent registers as a LiveKit worker and listens for incoming job dispatches (outbound calls) or room joins (inbound/dashboard-initiated calls).',
      'For outbound calls: creates a SIP participant via Vobiz trunk, dials the target phone number, and waits for the call to be answered.',
      'Once connected, a full pipeline activates: Silero VAD detects speech activity → Deepgram Nova-2 transcribes speech to text in real time → LLM (Groq llama-3.3-70b or OpenAI gpt-4o-mini) generates a response → TTS converts the response to audio and plays it back.',
      'The LLM has access to tool functions it can call mid-conversation: lookup_user() to fetch caller context, and transfer_call() to route the call to a human agent or another number via SIP transfer.',
      'Supports multiple STT, TTS, and LLM providers that can be swapped per call via metadata — allowing different voices, languages, or models for different use cases.',
      'BVC Telephony noise cancellation runs on the audio stream for cleaner call quality.',
      'A Next.js dashboard allows initiating calls and monitoring active sessions without needing the CLI.',
    ],
    arch: [
      { label: 'Voice Platform', value: 'LiveKit Agents SDK' },
      { label: 'Speech-to-Text', value: 'Deepgram Nova-2/3' },
      { label: 'LLM', value: 'Groq (llama-3.3-70b) / OpenAI (gpt-4o-mini)' },
      { label: 'Text-to-Speech', value: 'OpenAI / Deepgram / Sarvam / Cartesia' },
      { label: 'Phone Network', value: 'Vobiz SIP Trunk (PSTN)' },
      { label: 'Dashboard', value: 'Next.js (React/TypeScript)' },
    ],
    setup: `<span class="comment"># 1. Clone and set up environment</span>
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

<span class="comment"># 2. Configure credentials</span>
cp .env.example .env
<span class="comment"># Fill in: LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_SECRET</span>
<span class="comment">#          DEEPGRAM_API_KEY, GROQ_API_KEY, OPENAI_API_KEY</span>
<span class="comment">#          VOBIZ_SIP_TRUNK_ID, VOBIZ_SIP_DOMAIN</span>

<span class="comment"># 3. Start the agent worker</span>
python agent.py start

<span class="comment"># 4. Dispatch an outbound call (separate terminal)</span>
python make_call.py --to +91XXXXXXXXXX

<span class="comment"># 5. (Optional) Run the Next.js dashboard</span>
cd dashboard && npm install && npm run dev`,
    tags: ['Python', 'LiveKit', 'Deepgram', 'OpenAI', 'Groq', 'Silero VAD', 'SIP/PSTN', 'asyncio', 'Next.js'],
  },
};

function buildModalContent(project) {
  const d = projectData[project];
  if (!d) return '';

  const archItems = d.arch.map(a =>
    `<div class="modal-arch-item"><strong>${a.label}</strong><span>${a.value}</span></div>`
  ).join('');

  const howItems = d.how.map(h => `<li>${h}</li>`).join('');
  const tags = d.tags.map(t => `<span class="tag">${t}</span>`).join('');

  return `
    <div class="modal-header-icon">${d.icon}</div>
    <div class="modal-badge">${d.badge}</div>
    <h2 class="modal-title" id="modalTitle">${d.title}</h2>

    <div class="modal-section">
      <h4 class="modal-section-title">Problem It Solves</h4>
      <p>${d.problem}</p>
    </div>

    <div class="modal-section">
      <h4 class="modal-section-title">How It Works</h4>
      <ul>${howItems}</ul>
    </div>

    <div class="modal-section">
      <h4 class="modal-section-title">Architecture</h4>
      <div class="modal-arch-grid">${archItems}</div>
    </div>

    <div class="modal-section">
      <h4 class="modal-section-title">Tech Stack</h4>
      <div class="modal-tags">${tags}</div>
    </div>

    <div class="modal-section">
      <h4 class="modal-section-title">Setup</h4>
      <div class="modal-code-block">${d.setup}</div>
    </div>
  `;
}

const modal        = document.getElementById('projectModal');
const modalClose   = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const project = card.dataset.project;
    modalContent.innerHTML = buildModalContent(project);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
