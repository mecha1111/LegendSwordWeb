(() => {
  const configured = window.GAME_SITE?.demoUrl?.trim();
  if (!configured) return;
  let url;
  try { url = new URL(configured); } catch { return; }
  if (!['https:', 'http:'].includes(url.protocol)) return;
  const link = document.querySelector('#demo-link');
  for (const download of [link, document.querySelector('[data-download]')]) {
    download.href = url.href;
    download.target = '_blank';
    download.rel = 'noopener noreferrer';
  }
  link.hidden = false;
  document.querySelector('#demo-status').hidden = true;
})();
