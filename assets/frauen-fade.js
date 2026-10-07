// Billeder i indholdet toner frem, når de er hentet (CSS i frauen-base.css)
(function () {
  const reveal = (img) => img.classList.add('is-loaded');
  const watch = (img) => {
    if (img.complete && img.naturalWidth) reveal(img);
    else {
      img.addEventListener('load', () => reveal(img), { once: true });
      img.addEventListener('error', () => reveal(img), { once: true });
    }
  };
  document.querySelectorAll('#MainContent img').forEach(watch);
  // Billeder, der kommer til senere (fx i temaeditoren), vises med det samme
  document.addEventListener('shopify:section:load', (e) => e.target.querySelectorAll('img').forEach(reveal));
})();
