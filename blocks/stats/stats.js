import ffetch from '../../scripts/ffetch.js';
import { decorateIcons } from '../../scripts/aem.js';

function parseDetails(details) {
  if (!Array.isArray(details)) return {};
  return details.reduce((acc, item) => {
    const nl = item.indexOf('\n');
    if (nl > -1) {
      const key = item.slice(0, nl).trim().toLowerCase();
      const value = item.slice(nl + 1).trim();
      acc[key] = value;
    }
    return acc;
  }, {});
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

  const totals = entries.reduce((acc, entry) => {
    const d = parseDetails(entry.details);
    acc.totalCost += parseNumber(d['material cost'] ?? d['material-cost']);
    acc.totalFabric += parseNumber(d['fabrics spend']);
    acc.totalDuration += parseDuration(d.duration);
    return acc;
  }, { totalCost: 0, totalFabric: 0, totalDuration: 0 });

  const { totalCost, totalFabric, totalDuration } = totals;

  const stats = [
    { icon: 'scissors', value: entries.length, label: 'Projekte' },
    { icon: 'euro', value: `${formatNumber(totalCost, 2)} €`, label: 'Gesamtausgaben' },
    { icon: 'ruler', value: `${formatNumber(totalFabric, 2)} m`, label: 'Stoffverbrauch' },
    { icon: 'clock', value: `${formatNumber(totalDuration)} h`, label: 'Nähzeit' },
  ];

  const ul = document.createElement('ul');
  ul.className = 'stats-list';

  stats.forEach((stat) => {
    const li = document.createElement('li');
    li.className = 'stats-item';

    const valueRow = document.createElement('div');
    valueRow.className = 'stats-value-row';

    const iconEl = document.createElement('span');
    iconEl.className = `icon icon-${stat.icon} stats-icon`;

    const valEl = document.createElement('span');
    valEl.className = 'stats-value';
    valEl.textContent = stat.value;

    const labelEl = document.createElement('span');
    labelEl.className = 'stats-label';
    labelEl.textContent = stat.label;

    valueRow.append(iconEl, valEl);
    li.append(valueRow, labelEl);
    ul.append(li);
  });

  block.textContent = '';
  block.appendChild(ul);
  decorateIcons(block);
}
