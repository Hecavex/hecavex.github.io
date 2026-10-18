(() => {
  'use strict';
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
  const token = document.currentScript?.dataset.measurementToken;
  if (!token) return;
  // Inject after `load` so the third-party fetch never delays the page's own load event.
  const inject = () => {
    const beacon = document.createElement('script');
    beacon.type = 'module';
    beacon.defer = true;
    beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    beacon.dataset.cfBeacon = JSON.stringify({ token });
    document.body.appendChild(beacon);
  };
  if (document.readyState === 'complete') inject();
  else window.addEventListener('load', inject, { once: true });
})();
