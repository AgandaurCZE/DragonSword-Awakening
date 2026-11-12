/* Beta launch: shortcuts, canonical path navigation and data loading. */
const APP_ROOT = new URL('.', document.baseURI).pathname;
const NAV = { ready: false, restoring: false, state: null, url: '', y: 0 };
function routeUrl(page, options = {}) {
  const path =
    page === 'hero'
      ? encodeURIComponent(options.hero)
      : page === 'tools' && options.tool
        ? SITE.toolRoutes[options.tool] || SITE.routes.tools
        : (SITE.routes[page] ?? '');
  return APP_ROOT + path;
}
function navCurrent() {
  if (!$('profilePage').hidden)
    return {
      page: 'hero',
      hero: currentProfileName,
      tab: document.querySelector('.profile-tab.active')?.dataset.profileTab || 'skills',
    };
  const page = document.querySelector('.nav-item.active[data-page]')?.dataset.page || 'home';
  const state = { page };
  if (page === 'tools') state.tool = document.querySelector('#toolTabs .on')?.dataset.tool || 'damage';
  if (page === 'tier') state.tier = { mode: V2.mode, boss: V2.boss, tower: V2.tower, view: V2.view };
  return state;
}
function navRecord(replace = false) {
  if (!NAV.ready || NAV.restoring) return;
  const state = navCurrent(),
    url = routeUrl(state.page, state);
  if (replace || url === NAV.url) history.replaceState({ view: state, y: window.scrollY }, '', url);
  else {
    history.replaceState({ view: NAV.state, y: NAV.y }, '', NAV.url);
    history.pushState({ view: state, y: window.scrollY }, '', url);
  }
  NAV.state = state;
  NAV.url = url;
  NAV.y = window.scrollY;
  navTitle(state);
}
function navTitle(state) {
  const t = tabTitleFor(state);
  if (t !== null) setTabTitle(t);
}
function navSchedule() {
  if (NAV.ready && !NAV.restoring) queueMicrotask(() => navRecord());
}
function navShow(state, scrollY = null) {
  NAV.restoring = true;
  try {
    if (state.page === 'hero') openCharacterProfile(state.hero, state.tab || 'skills');
    else {
      const button =
        document.querySelector(`.nav-item[data-page="${state.page}"]`) ||
        document.querySelector('.nav-item[data-page="home"]');
      button.click();
      if (state.page === 'tier' && state.tier) {
        Object.assign(V2, state.tier);
        renderTierV2();
      }
      if (state.page === 'tools' && state.tool) document.querySelector(`[data-tool="${state.tool}"]`)?.click();
    }
  } finally {
    NAV.restoring = false;
  }
  if (scrollY !== null) requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: 'instant' }));
}
function navNavigate(state) {
  NAV.y = window.scrollY;
  navShow(state, 0);
  navRecord();
}
function navInitial() {
  const hash = location.hash.slice(1);
  if (hash.startsWith('hero/')) {
    const [, hero, tab] = hash.split('/');
    const h = HEROES.find((h) => h.name.toLowerCase() === decodeURIComponent(hero || '').toLowerCase());
    if (h) return { page: 'hero', hero: h.name, tab: ['skills', 'review', 'build'].includes(tab) ? tab : 'skills' };
  }
  if (hash) {
    const page = hash.split('?')[0];
    if (Object.hasOwn(SITE.routes, page)) return { page, ...(page === 'tools' ? { tool: 'damage' } : {}) };
  }
  let path;
  try {
    path = decodeURIComponent(location.pathname.slice(APP_ROOT.length))
      .replace(/\/$/, '')
      .replace(/\/index\.html$/, '');
  } catch {
    return { page: 'home' };
  }
  if (!path || path === 'index.html' || path === 'dungeons') return { page: 'home' };
  const hero = HEROES.find((h) => h.name.toLowerCase() === path.toLowerCase());
  if (hero) return { page: 'hero', hero: hero.name, tab: 'skills' };
  const tool = Object.entries(SITE.toolRoutes).find(([, p]) => p.toLowerCase() === path.toLowerCase());
  if (tool) return { page: 'tools', tool: tool[0] };
  const page = Object.entries(SITE.routes).find(([, p]) => p === path)?.[0];
  return { page: page || 'home' };
}
function navInit() {
  navShow(navInitial());
  NAV.state = navCurrent();
  NAV.url = routeUrl(NAV.state.page, NAV.state);
  NAV.ready = true;
  history.replaceState({ view: NAV.state, y: 0 }, '', NAV.url);
  navTitle(NAV.state);
  window.addEventListener('popstate', (e) => {
    const view = e.state?.view || navInitial();
    navShow(view, e.state?.y || 0);
    NAV.state = navCurrent();
    NAV.url = routeUrl(NAV.state.page, NAV.state);
    NAV.y = e.state?.y || 0;
    navTitle(NAV.state);
  });
  document.addEventListener(
    'click',
    () => {
      NAV.y = window.scrollY;
    },
    true,
  );
  document.addEventListener('click', () => navSchedule());
  document.addEventListener('change', () => navSchedule());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') navSchedule();
  });
  document.querySelector('.brand-home').addEventListener('click', (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navNavigate({ page: 'home' });
  });
}
function renderShortcuts() {
  const root = $('shortcutsBody');
  root.replaceChildren();
  for (const group of SITE.shortcuts) {
    const section = document.createElement('section');
    section.className = 'shortcut-group';
    const title = document.createElement('h3');
    title.className = 'gear-section-title shortcut-title';
    title.textContent = group.label;
    const grid = document.createElement('div');
    grid.className = 'shortcut-grid';
    for (const item of group.items) {
      const card = document.createElement(item.disabled ? 'div' : 'a');
      card.className = 'shortcut-card' + (item.disabled ? ' shortcut-soon' : '');
      if (item.disabled) card.setAttribute('aria-disabled', 'true');
      else {
        card.href = routeUrl(item.page, item);
        card.addEventListener('click', (e) => {
          if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          const state = { page: item.page };
          if (item.tool) state.tool = item.tool;
          if (item.mode) state.tier = { mode: item.mode };
          navNavigate(state);
        });
      }
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = '';
      image.loading = 'lazy';
      const label = document.createElement('span');
      label.textContent = item.label;
      const arrow = document.createElement('span');
      arrow.className = 'shortcut-arrow';
      arrow.textContent = item.disabled ? 'SOON' : '→';
      arrow.setAttribute('aria-hidden', 'true');
      card.append(image, label, arrow);
      grid.append(card);
    }
    section.append(title, grid);
    root.append(section);
  }
}
function patchText() {
  const m = DATA_META || {};
  return m.balancePatch && m.balancePatch !== m.patch
    ? `${m.patch} (no balance changes since ${m.balancePatch})`
    : m.patch || '';
}
function startApp() {
  document.documentElement.classList.add('beta');
  setupSearchClearButtons();
  $('patchLabel').textContent = patchText();
  renderShortcuts();
  renderTierV2();
  renderTeams();
  renderKarmaFilters();
  renderKarmas();
  $('karmaSearch').addEventListener('input', renderKarmas);
  renderHeroesFilters();
  renderHeroes();
  $('heroesSearch').addEventListener('input', renderHeroes);
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
  renderItems();
  renderAchievements();
  renderTools();
  document.querySelectorAll('.nav-item').forEach((b) => {
    const label = b.querySelector('.nav-label');
    if (!label) return;
    b.setAttribute('aria-label', label.textContent.trim());
    b.title = label.textContent.trim();
  });
  navInit();
  for (const [id, key] of [
    ['navIconFamiliars', 'familiars'],
    ['navIconTrait', 'trait'],
    ['navIconHeroes', 'heroes'],
    ['navIconTeams', 'teams'],
    ['navIconCookbook', 'cookbook'],
    ['navIconGuides', 'guides'],
  ])
    navIcon(id, UI_ICONS[key]);
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
    SITE = d.SITE;
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
    KARMA_LEVELLING = d.KARMA_LEVELLING || null;
    GUIDES = d.GUIDES || { categories: [] };
    LEVEL_COSTS = d.LEVEL_COSTS || null;
    DAMAGE_CALC = d.DAMAGE_CALC || null;
    DEFENSE_MODEL = d.DEFENSE_MODEL || null;
    startApp(); /* banners now preload when Dungeons is first opened (was: awaited here, so the preview waited for ~9 MB of art before drawing) */
  })
  .catch((err) => {
    console.error(err);
    $('shortcutsBody').innerHTML =
      '<div class="no-results">Could not load data.json (' +
      String(err.message || err) +
      '). Open the site from GitHub Pages or a local web server; browsers block loading it from a file opened directly.</div>';
  });
