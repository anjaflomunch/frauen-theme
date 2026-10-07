/*
  Frauen hero: lægger det store logo op i headeren efter en ventetid
  eller ved første scroll. Bruger FLIP: vi måler start og slut og
  animerer med transform, så det kører glat.
*/
if (!customElements.get('frauen-hero')) {
  customElements.define(
    'frauen-hero',
    class FrauenHero extends HTMLElement {
      connectedCallback() {
        this.logo = this.querySelector('[data-hero-logo]');
        this.tagline = this.querySelector('[data-hero-tagline]');
        this.headerLogo = document.querySelector('.frauen-header__logo');
        this.delay = Number(this.dataset.delay) || 3000;
        this.duration = Number(this.dataset.duration) || 2000;
        this.docked = false;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce || !this.logo || !this.headerLogo) {
          this.finish();
          return;
        }

        this.timer = setTimeout(() => this.dock(), this.delay);
        this.onScroll = () => {
          if (window.scrollY > 10) this.dock();
        };
        window.addEventListener('scroll', this.onScroll, { passive: true });
      }

      disconnectedCallback() {
        clearTimeout(this.timer);
        window.removeEventListener('scroll', this.onScroll);
      }

      dock() {
        if (this.docked) return;
        this.docked = true;
        clearTimeout(this.timer);
        window.removeEventListener('scroll', this.onScroll);

        const from = this.logo.getBoundingClientRect();
        const to = this.headerLogo.getBoundingClientRect();
        const scale = to.width / from.width;
        const dx = to.left - from.left;
        const dy = to.top - from.top;

        this.classList.add('is-animating', 'is-docking');
        this.logo.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

        if (this.tagline) {
          const heroBottom = this.getBoundingClientRect().bottom;
          const tag = this.tagline.getBoundingClientRect();
          this.tagline.style.transform = `translateY(${heroBottom - this.taglineGap() - tag.bottom}px)`;
        }

        setTimeout(() => this.finish(), this.duration);
      }

      // Afstand fra taglinens bund til heroens bund, efter logoet er lagt op
      taglineGap() {
        return window.innerWidth < 750 ? 32 : 40;
      }

      finish() {
        this.docked = true;
        this.classList.add('is-docking', 'is-docked');
        if (this.tagline && !this.tagline.style.transform) {
          const heroBottom = this.getBoundingClientRect().bottom;
          const tag = this.tagline.getBoundingClientRect();
          this.tagline.style.transition = 'none';
          this.tagline.style.transform = `translateY(${heroBottom - this.taglineGap() - tag.bottom}px)`;
        }
      }
    }
  );
}
