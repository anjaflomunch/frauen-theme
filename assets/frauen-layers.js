/*
  Frauen lag: skift lag ved klik på overskrifterne.
  Lag før det aktive bliver liggende, lag efter glider ned igen.
  Kun videoen i det aktive lag afspilles.
*/
if (!customElements.get('frauen-layers')) {
  customElements.define(
    'frauen-layers',
    class FrauenLayers extends HTMLElement {
      connectedCallback() {
        this.layers = [...this.querySelectorAll('.frauen-layers__layer')];
        this.tabs = [...this.querySelectorAll('.frauen-layers__tab')];
        this.buttons = [...this.querySelectorAll('.frauen-layers__btn')];
        this.tabs.forEach((tab) =>
          tab.addEventListener('click', () => this.show(Number(tab.dataset.index)))
        );

        // I temaeditoren: vis laget, man klikker på i sidepanelet
        this.addEventListener('shopify:block:select', (e) => {
          const i = this.layers.indexOf(e.target);
          if (i > -1) this.show(i);
        });

        this.show(0, true);
      }

      show(index, instant = false) {
        this.layers.forEach((layer, i) => {
          if (instant) layer.style.transition = 'none';
          layer.classList.toggle('is-active', i === index);
          layer.classList.toggle('is-before', i < index);
          const video = layer.querySelector('video');
          if (video) {
            if (i === index) {
              video.play().catch(() => {});
            } else {
              setTimeout(() => video.pause(), 1000);
            }
          }
          if (instant) requestAnimationFrame(() => (layer.style.transition = ''));
        });

        this.tabs.forEach((tab, i) => {
          tab.classList.toggle('is-active', i === index);
          tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });

        this.buttons.forEach((btn) => {
          const on = Number(btn.dataset.index) === index;
          btn.classList.toggle('is-active', on);
          if (on) {
            btn.removeAttribute('tabindex');
            btn.removeAttribute('aria-hidden');
          } else {
            btn.setAttribute('tabindex', '-1');
            btn.setAttribute('aria-hidden', 'true');
          }
        });
      }
    }
  );
}
