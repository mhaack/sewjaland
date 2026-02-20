/**
 * Field configuration: label, emoji icon, formatter
 */
const FIELDS = {
  status: {
    label: 'Status',
    icon: '●',
    format: (v) => v,
    badge: true,
  },
  date: {
    label: 'Abgeschlossen',
    icon: '◷',
    format: (v) => v,
  },
  duration: {
    label: 'Dauer',
    icon: '⧗',
    format: (v) => v,
  },
  fabrics: {
    label: 'Stoffe',
    icon: '◈',
    format: (v) => v,
  },
  materials: {
    label: 'Materialien',
    icon: '◉',
    format: (v) => v,
  },
  shop: {
    label: 'Gekauft bei',
    icon: '◎',
    format: (v) => v,
  },
  'material-cost': {
    label: 'Materialkosten',
    icon: '◆',
    format: (v) => {
      const cost = parseFloat(v);
      return Number.isNaN(cost) ? v : `${cost.toFixed(2)} €`;
    },
  },
};

/**
 * Returns a CSS class suffix for status badge colors
 * @param {string} value
 * @returns {string}
 */
function statusClass(value) {
  const v = value.toLowerCase();
  if (['fertig', 'done', 'completed', 'abgeschlossen'].includes(v)) return 'done';
  if (['in progress', 'in arbeit', 'wip'].includes(v)) return 'wip';
  if (['pause', 'paused', 'on hold'].includes(v)) return 'pause';
  return 'default';
}

/**
 * Decorates the project-details block
 * @param {Element} block
 */
export default function decorate(block) {
  // Extract key-value pairs from block rows
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    if (row.children.length === 2) {
      const key = row.children[0].textContent.trim().toLowerCase();
      const value = row.children[1].textContent.trim();
      if (value) config[key] = value;
    }
  });

  // Build the details grid
  const grid = document.createElement('dl');
  grid.className = 'project-details-grid';

  Object.entries(FIELDS).forEach(([key, meta]) => {
    const value = config[key];
    if (!value) return;

    const formatted = meta.format(value);

    const dt = document.createElement('dt');
    dt.className = 'project-details-label';

    const icon = document.createElement('span');
    icon.className = 'project-details-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = meta.icon;

    dt.append(icon, meta.label);

    const dd = document.createElement('dd');
    dd.className = 'project-details-value';

    if (meta.badge) {
      const badge = document.createElement('span');
      badge.className = `project-details-badge project-details-badge-${statusClass(value)}`;
      badge.textContent = formatted;
      dd.append(badge);
    } else if (meta.highlight) {
      dd.classList.add('project-details-value-highlight');
      dd.textContent = formatted;
    } else {
      dd.textContent = formatted;
    }

    grid.append(dt, dd);
  });

  block.replaceChildren(grid);
}
