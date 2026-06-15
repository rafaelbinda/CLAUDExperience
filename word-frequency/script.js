const textInput       = document.getElementById('text-input');
const translateBtn    = document.getElementById('translate-btn');
const clearBtn        = document.getElementById('clear-btn');
const errorMessage    = document.getElementById('error-message');
const resultsSection  = document.getElementById('results-section');
const tableBody       = document.getElementById('table-body');
const charCount       = document.getElementById('char-count');
const caseSensitive   = document.getElementById('case-sensitive');
const urlInput        = document.getElementById('url-input');
const fetchBtn        = document.getElementById('fetch-btn');
const urlError        = document.getElementById('url-error');
const limitMessage    = document.getElementById('limit-message');

let chart = null;

// ── Char counter ──────────────────────────────────────────────
textInput.addEventListener('input', () => {
  const len = textInput.value.length;
  charCount.textContent = `${len} / 10000`;
  charCount.classList.toggle('warn',  len >= 9000 && len < 10000);
  charCount.classList.toggle('limit', len === 10000);
  limitMessage.classList.toggle('hidden', len < 10000);
  if (textInput.value.trim()) errorMessage.classList.add('hidden');
});

// ── Translate ─────────────────────────────────────────────────
translateBtn.addEventListener('click', analyze);

function analyze() {
  const text = textInput.value.trim();
  if (!text) {
    errorMessage.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    return;
  }
  errorMessage.classList.add('hidden');

  const entries = countFrequencies(text, caseSensitive.checked);
  renderTable(entries);
  renderChart(entries);
  resultsSection.classList.remove('hidden');
}

// ── Clear ─────────────────────────────────────────────────────
clearBtn.addEventListener('click', () => {
  textInput.value    = '';
  charCount.textContent = '0 / 10000';
  charCount.classList.remove('warn', 'limit');
  errorMessage.classList.add('hidden');
  limitMessage.classList.add('hidden');
  resultsSection.classList.add('hidden');
  tableBody.innerHTML = '';
  if (chart) { chart.destroy(); chart = null; }
});

// ── URL fetch ─────────────────────────────────────────────────
const PROXIES = [
  async (url) => {
    const r = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    if (!r.ok) throw new Error();
    const { contents } = await r.json();
    if (!contents) throw new Error('empty');
    return contents;
  },
  async (url) => {
    const r = await fetch(`https://corsproxy.io/?url=${encodeURIComponent(url)}`);
    if (!r.ok) throw new Error();
    const text = await r.text();
    if (!text) throw new Error('empty');
    return text;
  },
];

fetchBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) {
    urlError.textContent = 'Please enter a URL.';
    urlError.classList.remove('hidden');
    return;
  }

  urlError.classList.add('hidden');
  fetchBtn.disabled    = true;
  fetchBtn.textContent = 'Fetching…';

  try {
    let html = null;
    for (const proxy of PROXIES) {
      try { html = await proxy(url); break; } catch { /* try next */ }
    }
    if (!html) throw new Error('all proxies failed');

    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script, style, nav, header, footer').forEach(el => el.remove());

    const text = doc.body.textContent.replace(/\s+/g, ' ').trim();
    textInput.value = text.slice(0, 10000);
    errorMessage.classList.add('hidden');
    const len = textInput.value.length;
    charCount.textContent = `${len} / 10000`;
    charCount.classList.toggle('warn',  len >= 1800 && len < 10000);
    charCount.classList.toggle('limit', len === 10000);
  } catch {
    urlError.textContent = 'Failed to fetch the page. Check the URL and try again.';
    urlError.classList.remove('hidden');
  } finally {
    fetchBtn.disabled    = false;
    fetchBtn.textContent = 'Fetch';
  }
});

// ── Algorithm ─────────────────────────────────────────────────
function countFrequencies(text, isCaseSensitive) {
  const normalized = isCaseSensitive ? text : text.toLowerCase();
  const words = normalized
    .replace(/[^\p{L}\p{N}\s]/gu, '')   // keeps accented letters (é, ñ, ü…)
    .split(/\s+/)
    .filter(Boolean);

  const map = Object.create(null);
  for (const word of words) {
    map[word] = (map[word] || 0) + 1;
  }

  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

// ── Table ─────────────────────────────────────────────────────
function renderTable(entries) {
  tableBody.innerHTML = '';
  for (const [i, [word, count]] of entries.entries()) {
    const row = document.createElement('tr');
    const badge = i < 3
      ? `<span class="rank rank-${i + 1}">${i + 1}</span>`
      : '';
    row.innerHTML = `<td>${badge}${word}</td><td>${count}</td>`;
    tableBody.appendChild(row);
  }
}

// ── Chart ─────────────────────────────────────────────────────
function renderChart(entries) {
  const top    = entries.slice(0, 15);
  const labels = top.map(([word]) => word);
  const data   = top.map(([, count]) => count);

  if (chart) chart.destroy();

  const ctx = document.getElementById('frequency-chart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: 'rgba(79, 110, 247, 0.75)',
        borderColor: '#4f6ef7',
        borderWidth: 1,
        borderRadius: 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: ([item]) => item.label,
            label: (item) => ` ${item.parsed.y} occurrence${item.parsed.y !== 1 ? 's' : ''}`,
          },
        },
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
        x: { ticks: { maxRotation: 45, minRotation: 0 } },
      },
    },
  });
}
