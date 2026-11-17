/* Beta launch: shortcuts, canonical path navigation and data loading. */
const APP_ROOT = new URL('.', document.baseURI).pathname;
const NAV = { ready: false, restoring: false, state: null, url: '', y: 0 };
const REFERENCE_HASHES = { cookbook: 'recipe', gear: 'set', karma: 'card', items: 'item' };
function setMobileMenu(open, restoreFocus = false) {
  const toggle = $('mobileMenu');
  const menu = $('mainNavigation');
  toggle.setAttribute('aria-expanded', String(open));
  menu.classList.toggle('is-open', open);
  $('mobileMenuBackdrop').hidden = !open;
  if (open) (menu.querySelector('.nav-item.active') || menu.querySelector('.nav-item'))?.focus();
  else if (restoreFocus) toggle.focus();
}
function routeUrl(page, options = {}) {
  const path =
    page === 'hero'
      ? encodeURIComponent(options.hero)
      : page === 'tools' && options.tool
        ? SITE.toolRoutes[options.tool] || SITE.routes.tools
        : (SITE.routes[page] ?? '');
  let hash = '';
  if (page === 'hero') {
    if (options.skill) hash = '#skill=' + encodeURIComponent(options.skill);
    else if (options.tab === 'build' || options.tab === 'review') hash = '#' + options.tab;
  }
  if (page === 'guides' && options.guide) hash = '#' + encodeURIComponent(options.guide);
  if (page === 'plans') {
    if (options.rotation) hash = '#rotation=' + encodeURIComponent(options.rotation);
    else if (options.plan && options.plan !== 'goals') hash = '#' + encodeURIComponent(options.plan);
  }
  if (page === 'patches' && options.patch) hash = '#patch=' + encodeURIComponent(options.patch);
  if (page === 'tools' && options.tool === 'damage' && options.scenario)
    hash = '#scenario=' + encodeURIComponent(options.scenario);
  if (page === 'teams') {
    if (options.team) hash = '#team=' + encodeURIComponent(options.team);
    else if (options.speed) hash = '#speed';
  }
  if (page === 'tier') {
    if (options.tier?.mode === 'bosses') hash = '#boss=' + encodeURIComponent(options.tier.boss);
    if (options.tier?.mode === 'towers') hash = '#tower=' + encodeURIComponent(options.tier.tower);
  }
  if (page === 'finder' && options.finder) {
    const { encounter, difficulty } = options.finder;
    hash = '#encounter=' + encodeURIComponent(encounter);
    if (difficulty) hash += '&difficulty=' + encodeURIComponent(difficulty);
    const check = options.finder.teamCheck;
    if (check) {
      if (check.heroes.some(Boolean)) hash += '&team=' + encodeURIComponent(check.heroes.join(','));
      if (check.build !== 'mastery') hash += '&build=' + encodeURIComponent(check.build);
      if (check.broken) hash += '&break=1';
    }
  }
  if (REFERENCE_HASHES[page] && options.entry)
    hash = '#' + REFERENCE_HASHES[page] + '=' + encodeURIComponent(options.entry);
  return APP_ROOT + path + hash;
}
function navCurrent() {
  if (!$('profilePage').hidden)
    return {
      page: 'hero',
      hero: currentProfileName,
      tab: document.querySelector('.profile-tab.active')?.dataset.profileTab || 'skills',
      ...(currentProfileSkill ? { skill: currentProfileSkill } : {}),
    };
  const page = document.querySelector('.nav-item.active[data-page]')?.dataset.page || 'home';
  const state = { page };
  if (page === 'teams') {
    if (TEAMS_VIEW.target) state.team = TEAMS_VIEW.target;
    else if (TEAMS_VIEW.speed) state.speed = true;
  }
  if (page === 'finder') {
    const selection = finderSelection();
    if (selection) state.finder = selection;
  }
  if (page === 'guides' && $('guidesBody').dataset.guide) state.guide = $('guidesBody').dataset.guide;
  if (page === 'plans') {
    state.plan = PLAN_VIEW.tab;
    if (PLAN_VIEW.token) state.rotation = PLAN_VIEW.token;
  }
  if (page === 'patches' && activePatchVersion) state.patch = activePatchVersion;
  if (page === 'tools') {
    state.tool = document.querySelector('#toolTabs .on')?.dataset.tool || 'damage';
    if (state.tool === 'damage' && DC_SCENARIO) state.scenario = DC_SCENARIO;
  }
  if (page === 'tier') state.tier = { mode: V2.mode, boss: V2.boss, tower: V2.tower, view: V2.view };
  if (REFERENCE_HASHES[page] && NAV.reference?.page === page) state.entry = NAV.reference.entry;
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
    const scenario = state.page === 'tools' && state.tool === 'damage' ? state.scenario || '' : '';
    if (scenario !== DC_SCENARIO) {
      DC_SCENARIO = scenario;
      renderDamageCalc();
    }
    const resetItems = ITEMDB.entry && state.page === 'items' && !state.entry;
    clearReferenceEntry(state.page !== 'items');
    NAV.reference = state.entry ? { page: state.page, entry: state.entry } : null;
    if (state.page === 'hero') {
      openCharacterProfile(state.hero, state.tab || 'skills');
      if (state.skill) focusProfileSkill(state.hero, state.skill);
    } else {
      const button =
        document.querySelector(`.nav-item[data-page="${state.page}"]`) ||
        document.querySelector('.nav-item[data-page="home"]');
      button.click();
      if (state.page === 'plans') showPlans(state.plan, state.rotation);
      if (state.page === 'patches' && (state.patch || activePatchVersion)) showPatchVersion(state.patch);
      if (state.entry) showReferenceEntry(state.page, state.entry);
      if (resetItems) renderItems();
      if (state.page === 'tier' && state.tier) {
        Object.assign(V2, state.tier);
        renderTierV2();
      }
      if (state.page === 'tools' && state.tool) document.querySelector(`[data-tool="${state.tool}"]`)?.click();
      if (state.page === 'finder') selectFinderEncounter(state.finder);
      if (state.page === 'teams') {
        const speed = Boolean(state.speed);
        TEAMS_VIEW.target = state.team || '';
        if (TEAMS_VIEW.speed !== speed) {
          TEAMS_VIEW.speed = speed;
          renderTeams();
        }
        if (state.team)
          requestAnimationFrame(() =>
            flashEl([...document.querySelectorAll('.team-card')].find((card) => card.dataset.teamName === state.team)),
          );
      }
      if (state.page === 'guides') {
        renderGuides(state.guide);
        if (state.guide && guideTarget(state.guide) !== state.guide)
          requestAnimationFrame(() => {
            const section = $(state.guide);
            section?.focus({ preventScroll: true });
            section?.scrollIntoView();
          });
      }
    }
  } finally {
    NAV.restoring = false;
  }
  if (
    scrollY !== null &&
    !state.skill &&
    !state.team &&
    !state.entry &&
    !state.patch &&
    (!state.guide || guideTarget(state.guide) === state.guide)
  )
    requestAnimationFrame(() => window.scrollTo({ top: scrollY, behavior: 'instant' }));
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
  if (hero) {
    const skill = new URLSearchParams(hash).get('skill');
    const tab = ['build', 'review'].includes(hash) ? hash : 'skills';
    return { page: 'hero', hero: hero.name, tab, ...(skill ? { skill } : {}) };
  }
  const tool = Object.entries(SITE.toolRoutes).find(([, p]) => p.toLowerCase() === path.toLowerCase());
  if (tool) {
    const scenario = new URLSearchParams(hash).get('scenario');
    return {
      page: 'tools',
      tool: tool[0],
      ...(tool[0] === 'damage' && dcScenarioRead(scenario) ? { scenario } : {}),
    };
  }
  const page = Object.entries(SITE.routes).find(([, p]) => p === path)?.[0];
  const params = new URLSearchParams(hash);
  if (page === 'plans') {
    const rotation = params.get('rotation');
    if (rotationDecode(rotation)) return { page, plan: 'rotations', rotation };
    if (Object.hasOwn(PLAN_TABS, hash)) return { page, plan: hash };
  }
  if (page === 'patches' && params.has('patch')) return { page, patch: params.get('patch') };
  if (page === 'tier') {
    const boss = params.get('boss'),
      tower = params.get('tower');
    if (TIER_LIST_V2.bosses.some((entry) => entry.id === boss)) return { page, tier: { mode: 'bosses', boss } };
    if (TOWER_TRIALS.towers.some((entry) => entry.id === tower)) return { page, tier: { mode: 'towers', tower } };
  }
  if (page === 'finder' && params.has('encounter'))
    return {
      page,
      finder: {
        encounter: params.get('encounter'),
        difficulty: params.get('difficulty'),
        teamCheck: {
          heroes: (params.get('team') || '').split(',').slice(0, 3),
          build: params.get('build'),
          broken: params.get('break') === '1',
        },
      },
    };
  if (page === 'teams' && hash === 'speed') return { page, speed: true };
  if (page === 'teams' && TEAM_DATA.some((team) => team.name === params.get('team')))
    return { page, team: params.get('team') };
  if (page === 'guides' && guideTarget(hash)) return { page, guide: hash };
  if (REFERENCE_HASHES[page] && params.get(REFERENCE_HASHES[page]))
    return { page, entry: params.get(REFERENCE_HASHES[page]) };
  return { page: page || 'home' };
}
function navInit() {
  const initial = navInitial();
  navShow(initial);
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
  document.querySelector('.nav-item[data-page="teams"]').addEventListener('click', (e) => {
    if (NAV.restoring || !isPlainLinkClick(e)) return;
    TEAMS_VIEW.target = '';
    if (TEAMS_VIEW.speed) {
      TEAMS_VIEW.speed = false;
      renderTeams();
    }
  });
  document.querySelector('.nav-item[data-page="guides"]').addEventListener('click', (e) => {
    if (!NAV.restoring && isPlainLinkClick(e)) renderGuides();
  });
  document.querySelector('.nav-item[data-page="patches"]').addEventListener('click', (e) => {
    if (!NAV.restoring && isPlainLinkClick(e) && activePatchVersion) showPatchVersion();
  });
  document.querySelectorAll('.nav-item[data-page]').forEach((button) => {
    button.addEventListener('click', (event) => {
      if (!NAV.restoring && isPlainLinkClick(event)) {
        clearReferenceEntry();
        if (DC_SCENARIO) {
          DC_SCENARIO = '';
          renderDamageCalc();
        }
      }
    });
  });
  document.querySelectorAll('.brand-home, .mobile-home').forEach((link) =>
    link.addEventListener('click', (e) => {
      if (!isPlainLinkClick(e)) return;
      e.preventDefault();
      navNavigate({ page: 'home' });
    }),
  );
  const menu = $('mobileMenu');
  menu.onclick = () => setMobileMenu(menu.getAttribute('aria-expanded') !== 'true');
  $('mobileMenuBackdrop').onclick = () => setMobileMenu(false, true);
  const narrow = matchMedia('(max-width: 760px)');
  narrow.addEventListener('change', () => setMobileMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') setMobileMenu(false, true);
  });
}
function renderShortcuts() {
  const root = $('shortcutsBody');
  root.replaceChildren();
  for (const group of SITE.shortcuts) {
    const section = document.createElement('section');
    section.className = 'shortcut-group';
    if (group.label === 'Start here') section.classList.add('shortcut-featured');
    const title = document.createElement('h3');
    title.className = 'gear-section-title shortcut-title';
    title.textContent = group.label;
    const grid = document.createElement('div');
    grid.className = 'shortcut-grid';
    for (const item of group.items.filter((entry) => !entry.disabled)) {
      const card = document.createElement('a');
      card.className = 'shortcut-card';
      card.href = routeUrl(item.page, item);
      card.addEventListener('click', (event) => {
        if (!isPlainLinkClick(event)) return;
        event.preventDefault();
        navNavigate({
          page: item.page,
          guide: item.guide,
          tool: item.tool,
          ...(item.mode ? { tier: { mode: item.mode } } : {}),
        });
      });
      card.insertAdjacentHTML('afterbegin', cardEmblem(item.guide || item.tool || item.page));
      const label = document.createElement('span');
      label.textContent = item.label;
      const arrow = document.createElement('span');
      arrow.className = 'shortcut-arrow';
      arrow.textContent = '→';
      arrow.setAttribute('aria-hidden', 'true');
      card.append(label, arrow);
      grid.append(card);
    }
    section.append(title, grid);
    root.append(section);
  }
  const first = steamNews.posts[0];
  if (first) {
    const latest = document.createElement('a');
    latest.className = 'shortcuts-latest';
    latest.href = routeUrl('news');
    latest.innerHTML = `${cardEmblem('news')}<strong>Latest from Hound13</strong><span>${profileEsc(first.title)} →</span>`;
    latest.onclick = (e) => {
      if (!isPlainLinkClick(e)) return;
      e.preventDefault();
      navNavigate({ page: 'news' });
    };
    root.querySelector('.shortcut-featured').after(latest);
  }
}
function patchText() {
  return DATA_META.patch || '';
}
function tierPatchText() {
  return 'Game version ' + DATA_META.patch + ' · Tier List reviewed for balance patch ' + DATA_META.tierReviewedPatch;
}
function startApp() {
  document.documentElement.classList.add('beta');
  setupSearchClearButtons();
  $('patchLabel').textContent = patchText();
  $('tierPatchLabel').textContent = tierPatchText();
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
  cbLoadPantry();
  renderCookbook();
  renderGuides();
  renderFinder();
  renderTools();
  document.querySelectorAll('.nav-item').forEach((b) => {
    const label = b.querySelector('.nav-label');
    if (!label) return;
    b.setAttribute('aria-label', label.textContent.trim());
    b.title = label.textContent.trim();
  });
  initPlans();
  navInit();
  initSiteSearch();
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
    TEAM_SPEED_RUNS = d.TEAM_SPEED_RUNS;
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
    UPCOMING_HEROES = d.UPCOMING_HEROES || [];
    GUIDES = d.GUIDES || { categories: [] };
    LEVEL_COSTS = d.LEVEL_COSTS || null;
    DAMAGE_CALC = d.DAMAGE_CALC || null;
    DEFENSE_MODEL = d.DEFENSE_MODEL || null;
    await loadSteamNews();
    mergeSteamPatches();
    startApp(); /* banners now preload when Dungeons is first opened (was: awaited here, so the preview waited for ~9 MB of art before drawing) */
  })
  .catch((err) => {
    console.error(err);
    $('shortcutsBody').innerHTML =
      '<div class="no-results">Could not load data.json (' +
      String(err.message || err) +
      '). Open the site from GitHub Pages or a local web server; browsers block loading it from a file opened directly.</div>';
  });
