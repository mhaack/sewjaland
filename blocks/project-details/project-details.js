/**
 * Field configuration: label, formatter
 */
const FIELDS = {
  date: {
    label: 'Datum',
    format: (v) => v,
  },
  duration: {
    label: 'Nähzeit',
    format: (v) => v,
  },
  pattern: {
    label: 'Schnitt',
    format: (v) => v,
  },
  fabrics: {
    label: 'Stoffe',
    format: (v) => v,
  },
  'fabrics spend': {
    label: 'Stoff- verbrauch',
    format: (v) => ` ${v} m`,
  },
  shop: {
    label: 'Gekauft bei',
    format: (v) => v,
  },
  'material cost': {
    label: 'Material- kosten',
    format: (v) => {
      const cost = parseFloat(v);
      return Number.isNaN(cost) ? v : `${cost.toFixed(2)} €`;
    },
  },
};

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
    dt.append(meta.label);

    const dd = document.createElement('dd');
    dd.className = 'project-details-value';
    dd.textContent = formatted;

    grid.append(dt, dd);
  });

  block.replaceChildren(grid);
}
