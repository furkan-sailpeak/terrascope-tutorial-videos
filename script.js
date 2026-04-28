// Terrascope Tutorials , UI logic
// 1) Caption language switcher (EN/FR/NL/Off) for the <video> element
// 2) Chapter quick-jump buttons that seek the player

(() => {
  const player = document.getElementById('player');
  if (!player) return;

  // ---------- Caption language switching ----------
  const langButtons = document.querySelectorAll('.lang-btn');
  const downloadLink = document.querySelector('.download-link');

  const setActiveLang = (lang) => {
    // Update button state
    langButtons.forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update each TextTrack's mode
    const tracks = player.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      const t = tracks[i];
      if (lang === 'off') {
        t.mode = 'disabled';
      } else if (t.language === lang) {
        t.mode = 'showing';
      } else {
        t.mode = 'disabled';
      }
    }

    // Persist user choice
    try { localStorage.setItem('terrascope.captionLang', lang); } catch (e) {}

    // Update download link target
    if (downloadLink && lang !== 'off') {
      downloadLink.href = `subtitles/Video1.${lang}.vtt`;
    }
  };

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => setActiveLang(btn.dataset.lang));
  });

  // Restore preference (or default to EN)
  const saved = (() => {
    try { return localStorage.getItem('terrascope.captionLang'); } catch (e) { return null; }
  })();
  // textTracks are populated after metadata; wait for it
  player.addEventListener('loadedmetadata', () => setActiveLang(saved || 'en'), { once: true });
  // Some browsers expose tracks immediately
  if (player.readyState >= 1) setActiveLang(saved || 'en');

  // ---------- Chapter buttons ----------
  document.querySelectorAll('.ch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = parseFloat(btn.dataset.time);
      if (Number.isFinite(t)) {
        player.currentTime = t;
        player.play().catch(() => { /* user-gesture-required browsers: ignore */ });
        player.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // ---------- Keyboard nicety: J/L for ±10s when player focused ----------
  player.addEventListener('keydown', (e) => {
    if (e.key === 'j' || e.key === 'J') player.currentTime = Math.max(0, player.currentTime - 10);
    if (e.key === 'l' || e.key === 'L') player.currentTime = Math.min(player.duration || Infinity, player.currentTime + 10);
  });
})();
