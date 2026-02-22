import ffetch from '../../scripts/ffetch.js';

function parseDetails(details) {
  const result = {};
  if (!Array.isArray(details)) return result;
  for (const item of details) {
    const nl = item.indexOf('\n');
    if (nl > -1) {
      const key = item.slice(0, nl).trim().toLowerCase();
      const value = item.slice(nl + 1).trim();
      result[key] = value;
    }
  }
  return result;
}

function parseNumber(str) {
  if (!str) return 0;
  return parseFloat(str.replace(',', '.').replace(/[^\d.]/g, '')) || 0;
}

function parseDuration(str) {
  if (!str) return 0;
  const match = str.match(/^(\d+(?:[.,]\d+)?)/);
  return match ? parseFloat(match[1].replace(',', '.')) : 0;
}

function formatNumber(n, decimals = 0) {
  return n.toLocaleString('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default async function decorate(block) {
  const year = block.classList.length === 3 ? block.classList[1] : null;
  let entries = await ffetch('/stats-index.json').all();

  if (year) {
    entries = entries.filter((e) => e.path.includes(`/projects/${year}/`));
  }

  let totalCost = 0;
  let totalFabric = 0;
  let totalDuration = 0;

  for (const entry of entries) {
    const d = parseDetails(entry.details);
    totalCost += parseNumber(d['material cost'] ?? d['material-cost']);
    totalFabric += parseNumber(d['fabrics spend']);
    totalDuration += parseDuration(d.duration);
  }

  const stats = [
    { value: entries.length, label: 'Projekte' },
    { value: `${formatNumber(totalCost, 2)} €`, label: 'Gesamtausgaben' },
    { value: `${formatNumber(totalFabric, 2)} m`, label: 'Stoffverbrauch' },
    { value: `${formatNumber(totalDuration)} h`, label: 'Nähzeit' },
  ];

  const ul = document.createElement('ul');
  ul.className = 'stats-list';

  for (const stat of stats) {
    const li = document.createElement('li');
    li.className = 'stats-item';

    const valEl = document.createElement('span');
    valEl.className = 'stats-value';
    valEl.textContent = stat.value;

    const labelEl = document.createElement('span');
    labelEl.className = 'stats-label';
    labelEl.textContent = stat.label;

    li.append(valEl, labelEl);
    ul.appendChild(li);
  }

  block.textContent = '';
  block.appendChild(ul);
}
