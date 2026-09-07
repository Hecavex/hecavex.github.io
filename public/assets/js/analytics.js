(() => {
  'use strict';
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
  const token = document.currentScript?.dataset.measurementToken;
  if (!token) return;
  const beacon = document.createElement('script');
  beacon.type = 'module';
  beacon.defer = true;
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  beacon.dataset.cfBeacon = JSON.stringify({ token });
  document.body.appendChild(beacon);
})();
