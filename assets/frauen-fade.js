// Billeder i indholdet toner frem, når de er hentet og kommer ind på skærmen.
// CSS i frauen-base.css. Hover-billeder på kort håndteres af kortets egen CSS.
(function () {
  // Scriptet kører: sikkerhedsnettet i <head> er ikke nødvendigt
  clearTimeout(window.frauenFadeSafety);
  const show = (img) =>
    requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add('is-loaded')));

  const ready = (img, cb) => {
    if (img.complete && img.naturalWidth) cb();
    else {
      img.addEventListener('load', cb, { once: true });
      img.addEventListener('error', cb, { once: true });
    }
  };

  const io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              io.unobserve(e.target);
              ready(e.target, () => show(e.target));
            }),
          { rootMargin: '0px 0px -8% 0px' }
        )
      : null;

  document.querySelectorAll('#MainContent img').forEach((img) => {
    if (io) io.observe(img);
    else ready(img, () => show(img));
  });

  // Sektioner, der genindlæses i temaeditoren, vises med det samme
  document.addEventListener('shopify:section:load', (e) =>
    e.target.querySelectorAll('img').forEach((img) => img.classList.add('is-loaded'))
  );
})();
