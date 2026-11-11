/* js/09-startup.js: Start-up: preview gate, startApp and the data.json loader (runs last). Part of the site script, split out of index.html on 10 Nov 2026.
   The files load in order (see index.html) and share one global scope, so code that runs at load time may only use what earlier files define. */
// ==== Start-up: preview gate, startApp, data.json loader ====
function applyPreviewGate() {
  if (IS_PREVIEW) return;
  PREVIEW_PAGES.forEach((pg) => {
    const b = document.querySelector(`.nav-item[data-page="${pg}"]`);
    if (b) b.hidden = true;
  });
  const g = $('navDungeonsGroup'),
    t = $('navDungeonsToggle');
  if (g) g.hidden = true;
  if (t) t.hidden = true;
}
function initTierV2() {
  const p = new URLSearchParams(location.search);
  if (p.get('tiers') !== 'new') return;
  const tp = $('tierPage');
  const box = document.createElement('div');
  box.id = 'tierV2';
  tp.prepend(box);
  showTierV2(true);
}

function patchText() {
  const m = DATA_META || {};
  return m.balancePatch && m.balancePatch !== m.patch
    ? `${m.patch} (no balance changes since ${m.balancePatch})`
    : m.patch || '';
}
function startApp() {
  setupSearchClearButtons();
  if (IS_PREVIEW) {
    const hp = document.querySelector('header p');
    if (hp)
      hp.innerHTML =
        '<span class="hdr-page" id="hdrPage"></span><span class="hdr-tl">Visual tier list · </span>patch <span id="patchLabel"></span><span class="hdr-tl"> · hover or focus a hero for the early / mid / end-game breakdown</span>';
  } /* preview: header names the open page */
  $('patchLabel').textContent = patchText();
  makeArchFilters();
  makeRoleFilters();
  render();
  renderTeams();
  renderKarmaFilters();
  renderKarmas();
  document.getElementById('karmaSearch').addEventListener('input', renderKarmas);
  renderHeroesFilters();
  renderHeroes();
  document.getElementById('heroesSearch').addEventListener('input', renderHeroes);
  renderGear();
  renderGearPreview();
  renderPatches();
  renderFamiliars();
  renderTitles();
  renderDungeons();
  renderCurrencyDungeons();
  renderTrait();
  renderCookbook();
  renderGuides();
  if (IS_PREVIEW) {
    renderItems();
    renderAchievements();
    renderTools();
  }
  applyPreviewGate();
  initTierV2();
  if (IS_PREVIEW && location.hash.startsWith('#dungeons')) {
    const b = document.querySelector('.nav-item[data-page="dungeons"]');
    if (b) b.click();
  } /* preview: #dungeons links open the page */
  if (IS_PREVIEW) navInit();
  navIcon('navIconFamiliars', (UI_ICONS || {}).familiars);
  navIcon('navIconTrait', (UI_ICONS || {}).trait);
  navIcon('navIconHeroes', (UI_ICONS || {}).heroes);
  navIcon('navIconTeams', (UI_ICONS || {}).teams);
  navIcon('navIconCookbook', (UI_ICONS || {}).cookbook);
  navIcon('navIconGuides', (UI_ICONS || {}).guides);
}
/* Preview: Back and Forward buttons (Claude, 10 Nov 2026). Every page and hero profile tab gets its own address
   (#gear, #karma, #hero/Ryza/build), so the browser's Back returns to where you were, scroll position included.
   Any click or Enter that changes the view adds a history entry; popstate redraws the view from it. */
const NAV = { restoring: false, key: '', url: '', y: 0 };
function navKey() {
  if (!$('profilePage').hidden)
    return (
      'hero/' +
      encodeURIComponent(currentProfileName) +
      '/' +
      (((document.querySelector('.profile-tab.active') || {}).dataset || {}).profileTab || 'skills')
    );
  const b = document.querySelector('.nav-item.active[data-page]');
  return b ? b.dataset.page : 'tier';
}
function navRecord() {
  if (NAV.restoring) return;
  const k = navKey();
  if (k === NAV.key) return;
  history.replaceState({ k: NAV.key, y: NAV.y }, '', NAV.url);
  const url = location.pathname + location.search + (k === 'tier' ? '' : '#' + k);
  history.pushState({ k, y: 0 }, '', url);
  NAV.key = k;
  NAV.url = url;
}
function navShow(k, y) {
  NAV.restoring = true;
  try {
    const m = /^hero\/([^/]+)\/?(\w*)/.exec(k || '');
    if (m) {
      openCharacterProfile(decodeURIComponent(m[1]), m[2] || 'skills');
    } else {
      const pg = String(k || 'tier').split('?')[0];
      const b =
        [...document.querySelectorAll('.nav-item[data-page="' + pg + '"]')][0] ||
        document.querySelector('.nav-item[data-page="tier"]');
      if (pg === 'tier' && !$('profilePage').hidden) closeCharacterProfile();
      else if (b) b.click();
    }
  } finally {
    NAV.restoring = false;
  }
  NAV.key = navKey();
  NAV.url = location.pathname + location.search + location.hash;
  requestAnimationFrame(() => window.scrollTo({ top: y || 0, behavior: 'instant' }));
}
function navInit() {
  const h = location.hash.slice(1);
  if (h && !h.startsWith('dungeons')) navShow(h, 0);
  NAV.key = navKey();
  NAV.url = location.pathname + location.search + location.hash;
  history.replaceState({ k: NAV.key, y: 0 }, '', NAV.url);
  const before = () => {
    NAV.y = window.scrollY;
  };
  const after = () => setTimeout(navRecord, 0);
  document.addEventListener('click', before, true);
  document.addEventListener('click', after);
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        before();
        after();
      }
    },
    true,
  );
  window.addEventListener('popstate', (e) => {
    const st = e.state || {};
    navShow(st.k || location.hash.slice(1), st.y || 0);
  });
}
fetch('data.json', {
  cache: 'no-cache',
}) /* revalidates every visit (ETag): always the newest data, but no re-download when unchanged (10 Nov; was a timestamp + no-store) */
  .then((r) => {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  })
  .then(async (d) => {
    ({ HEROES, ROLE_ICONS, ARCHES, TIER_ORDER, TIER_COLORS, TEAM_DATA, KARMA_DATA, CHARACTER_PROFILE_DATA, GEAR_DATA } =
      d);
    ARCH_COLORS = d.ARCH_COLORS || {};
    STATUS_ARCHETYPE = d.STATUS_ARCHETYPE || {};
    GEAR_STATS = d.GEAR_STATS || GEAR_STATS;
    HERO_BASE_STATS = d.HERO_BASE_STATS || {};
    HERO_BUILDS = d.HERO_BUILDS || {};
    HERO_STAT_MODEL = d.HERO_STAT_MODEL || {};
    TITLES = d.TITLES || TITLES;
    AWAKENINGS = d.AWAKENINGS || AWAKENINGS;
    GENERIC_KARMA = d.GENERIC_KARMA || {};
    SKILL_LEVEL_MULTIPLIERS = d.SKILL_LEVEL_MULTIPLIERS || SKILL_LEVEL_MULTIPLIERS;
    KARMA_ASCENSION = d.KARMA_ASCENSION || KARMA_ASCENSION;
    STATUS_EFFECTS = d.STATUS_EFFECTS || {};
    DATA_META = d.meta || {};
    PATCH_NOTES = d.PATCH_NOTES || {};
    FAMILIARS = d.FAMILIARS || {};
    DUNGEONS = d.DUNGEONS || {};
    TRAIT_DUNGEONS = d.TRAIT_DUNGEONS || {};
    UI_ICONS = d.UI_ICONS || {};
    TIER_LIST_V2 = d.TIER_LIST_V2 || {};
    TOWER_TRIALS = d.TOWER_TRIALS || {};
    COOKBOOK = d.COOKBOOK || {};
    GEAR_UPGRADE = d.GEAR_UPGRADE || GEAR_UPGRADE;
    RUNES = d.RUNES || null;
    GEAR_MODEL = d.GEAR_MODEL || null;
    GUIDES = d.GUIDES || { categories: [] };
    LEVEL_COSTS = d.LEVEL_COSTS || null;
    DAMAGE_CALC = d.DAMAGE_CALC || null;
    DEFENSE_MODEL = d.DEFENSE_MODEL || null;
    startApp(); /* banners now preload when Dungeons is first opened (was: awaited here, so the preview waited for ~9 MB of art before drawing) */
  })
  .catch((err) => {
    console.error(err);
    $('board').innerHTML =
      '<div class="no-results">Could not load data.json (' +
      String(err.message || err) +
      '). Open the site from Netlify or a local web server; browsers block loading it from a file opened directly.</div>';
  });
