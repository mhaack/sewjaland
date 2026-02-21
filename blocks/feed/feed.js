import ffetch from '../../scripts/ffetch.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

const BENTO_PATTERN = ['large', 'tall', 'small', 'small', 'wide', 'wide'];

function parseSortDate(entry) {
  if (entry.date?.trim()) {
    const d = new Date(entry.date.trim());
    if (!Number.isNaN(d.getTime())) return d.getTime();
    // Try European format DD.MM.YYYY
    const parts = entry.date.trim().split(/[.\-/]/);
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      const european = new Date(year, month - 1, day);
      if (!Number.isNaN(european.getTime())) return european.getTime();
    }
  }
  // Fallback: year extracted from path
  const match = entry.path.match(/\/projects\/(\d{4})\//);
  return match ? new Date(`${match[1]}-06-01`).getTime() : 0;
}

function createCard(entry, index) {
  const li = document.createElement('li');
  li.className = 'feed-card';
  li.dataset.bento = BENTO_PATTERN[index % 6];
  li.style.setProperty('--card-index', Math.min(index, 12));

  const a = document.createElement('a');
  a.href = entry.path;
  a.className = 'feed-card-link';

  const fig = document.createElement('figure');
  fig.className = 'feed-card-figure';

  if (entry.image) {
    const picture = createOptimizedPicture(entry.image, entry.title, false, [
      { media: '(min-width: 900px)', width: '400' },
      { width: '800' },
    ]);
    fig.appendChild(picture);
  }

  const caption = document.createElement('figcaption');
  caption.className = 'feed-card-caption';

  const h3 = document.createElement('h3');
  h3.className = 'feed-card-title';
  h3.textContent = entry.title;
  caption.appendChild(h3);

  fig.appendChild(caption);
  a.appendChild(fig);
  li.appendChild(a);
  return li;
}

export default async function decorate(block) {
  const entries = await ffetch('/query-index.json').all();
  entries.sort((a, b) => parseSortDate(b) - parseSortDate(a));

  const ul = document.createElement('ul');
  entries.forEach((entry, i) => ul.appendChild(createCard(entry, i)));

  block.textContent = '';
  block.appendChild(ul);
}
