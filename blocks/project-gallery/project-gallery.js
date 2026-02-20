/**
 * Updates the visible slide, counter, and progress bar
 * @param {Element} block
 * @param {number} index
 * @param {number} total
 */
function showSlide(block, index, total) {
  block.querySelectorAll('.photo-gallery-slide').forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  const counter = block.querySelector('.photo-gallery-counter');
  if (counter) {
    counter.innerHTML = `${String(index + 1).padStart(2, '0')}<em> / ${String(total).padStart(2, '0')}</em>`;
  }

  const fill = block.querySelector('.photo-gallery-progress-fill');
  if (fill) {
    fill.style.width = `${((index + 1) / total) * 100}%`;
  }
}

/**
 * Decorates the photo gallery block
 * @param {Element} block
 */
export default function decorate(block) {
  const pictures = [...block.querySelectorAll('picture')];

  if (pictures.length === 0) {
    block.textContent = 'Keine Bilder verfügbar';
    return;
  }

  // Single image — no carousel needed
  if (pictures.length === 1) {
    block.classList.add('photo-gallery-single');
    const wrap = document.createElement('div');
    wrap.className = 'photo-gallery-single-image';
    wrap.append(pictures[0]);
    block.replaceChildren(wrap);
    const img = pictures[0].querySelector('img');
    if (img) img.loading = 'eager';
    return;
  }

  const total = pictures.length;

  // ── Shell ──────────────────────────────────────────────────
  const carousel = document.createElement('div');
  carousel.className = 'photo-gallery-carousel';
  carousel.setAttribute('tabindex', '0');

  // ── Slides ─────────────────────────────────────────────────
  const slidesWrap = document.createElement('div');
  slidesWrap.className = 'photo-gallery-slides';
  slidesWrap.setAttribute('role', 'region');
  slidesWrap.setAttribute('aria-label', 'Bildergalerie');

  pictures.forEach((picture, i) => {
    const slide = document.createElement('div');
    slide.className = `photo-gallery-slide${i === 0 ? ' active' : ''}`;
    slide.append(picture);
    slidesWrap.append(slide);

    const img = picture.querySelector('img');
    if (img) img.loading = i === 0 ? 'eager' : 'lazy';
  });

  carousel.append(slidesWrap);

  // ── Navigation ─────────────────────────────────────────────
  const makeBtn = (dir) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `photo-gallery-nav photo-gallery-nav-${dir}`;
    btn.setAttribute('aria-label', dir === 'prev' ? 'Vorheriges Bild' : 'Nächstes Bild');
    btn.textContent = dir === 'prev' ? '‹' : '›';
    return btn;
  };

  const prevBtn = makeBtn('prev');
  const nextBtn = makeBtn('next');

  // ── Counter ────────────────────────────────────────────────
  const counter = document.createElement('div');
  counter.className = 'photo-gallery-counter';
  counter.setAttribute('aria-live', 'polite');
  counter.setAttribute('aria-atomic', 'true');
  counter.innerHTML = `01<em> / ${String(total).padStart(2, '0')}</em>`;

  // ── Progress bar ───────────────────────────────────────────
  const progress = document.createElement('div');
  progress.className = 'photo-gallery-progress';
  const fill = document.createElement('div');
  fill.className = 'photo-gallery-progress-fill';
  fill.style.width = `${(1 / total) * 100}%`;
  progress.append(fill);

  carousel.append(prevBtn, nextBtn, counter, progress);
  block.replaceChildren(carousel);

  // ── State + navigation ─────────────────────────────────────
  let current = 0;

  const navigate = (dir) => {
    current = (current + dir + total) % total;
    showSlide(block, current, total);
  };

  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); }
  });

  // Touch swipe
  let startX = 0;
  slidesWrap.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].screenX; }, { passive: true });
  slidesWrap.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
  }, { passive: true });
}
