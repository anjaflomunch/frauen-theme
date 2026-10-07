/* Frauen produkt: galleri-slider og valg af størrelse */

if (!customElements.get('frauen-gallery')) {
  customElements.define(
    'frauen-gallery',
    class FrauenGallery extends HTMLElement {
      connectedCallback() {
        this.slides = [...this.querySelectorAll('.frauen-gallery__slide')];
        this.current = this.querySelector('[data-current]');
        this.index = 0;
        if (this.slides.length < 2) return;

        const prev = () => this.go(this.index - 1);
        const next = () => this.go(this.index + 1);
        this.querySelectorAll('.frauen-gallery__prev, .frauen-gallery__hit--prev').forEach((b) => b.addEventListener('click', prev));
        this.querySelectorAll('.frauen-gallery__next, .frauen-gallery__hit--next').forEach((b) => b.addEventListener('click', next));

        // Swipe på mobil
        let x0 = null;
        this.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
        this.addEventListener('touchend', (e) => {
          if (x0 === null) return;
          const dx = e.changedTouches[0].clientX - x0;
          if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
          x0 = null;
        });

        // Piletaster, når galleriet har fokus
        this.tabIndex = 0;
        this.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') prev();
          if (e.key === 'ArrowRight') next();
        });
      }

      go(i) {
        const n = this.slides.length;
        this.index = (i + n) % n;
        this.slides.forEach((s, j) => s.classList.toggle('is-active', j === this.index));
        if (this.current) this.current.textContent = this.index + 1;
      }
    }
  );
}

document.querySelectorAll('.frauen-product__form').forEach((form) => {
  const dataEl = form.querySelector('[data-variants]');
  if (!dataEl) return;
  const variants = JSON.parse(dataEl.textContent);
  const idInput = form.querySelector('[data-variant-id]');
  const section = form.closest('.frauen-product');
  // Knappen findes både i formularen og i mobilbjælken
  const addBtns = section ? [...section.querySelectorAll('[data-add]')] : [form.querySelector('[data-add]')];
  const addLabels = section ? [...section.querySelectorAll('[data-add-label]')] : [form.querySelector('[data-add-label]')];
  const addLabel = addLabels[0];
  const priceEls = section ? [...section.querySelectorAll('[data-price]')] : [];
  const addText = addLabel ? addLabel.dataset.addText : '';
  const soldText = addLabel ? addLabel.dataset.soldText : '';

  const money = (cents) =>
    new Intl.NumberFormat('da-DK', { maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100) + ' kr.';

  const selected = () =>
    [...form.querySelectorAll('.frauen-product__option')].map((fs) => {
      const c = fs.querySelector('input:checked');
      return c ? c.value : null;
    });

  const update = () => {
    const opts = selected();
    const v = variants.find((v) => v.options.every((o, i) => o === opts[i]));
    if (!v) return;
    idInput.value = v.id;
    priceEls.forEach((el) => (el.textContent = money(v.price)));
    addBtns.forEach((b) => (b.disabled = !v.available));
    addLabels.forEach((l) => (l.textContent = v.available ? addText : soldText));
    const url = new URL(window.location.href);
    url.searchParams.set('variant', v.id);
    window.history.replaceState({}, '', url);
  };

  form.addEventListener('change', (e) => {
    if (e.target.matches('.frauen-product__value input')) update();
  });
});
