/* Personal plans. Site data supplies the links and quantities. Plans live in this browser. */
const PLAN_TABS = { goals: 'Goals', farm: 'Farming list', rotations: 'Rotation cards', watch: 'Patch watchlist' };
const PLAN_KINDS = {
  hero: 'Hero build',
  set: 'Gear set',
  karma: 'Karma',
  boss: 'Fight',
  recipe: 'Recipe',
  note: 'Custom goal',
};
const ROTATION_TYPES = ['Opener', 'Swap', 'Skill', 'Ultimate', 'Signal', 'Burst', 'Note'];
const PLAN_VIEW = { tab: 'goals', token: '', active: '', step: -1 };
const plansBlank = () => ({ goals: [], farm: [], stock: {}, rotations: [], watch: [] });
let plans = plansBlank();
const planText = (v, limit) => (typeof v === 'string' ? v.trim().slice(0, limit) : '');
const planQuantity = (v, max = 1e9) => Math.min(max, Math.max(0, Math.floor(Number(v) || 0)));
const planId = () => crypto.randomUUID();
const planHero = (n) => HEROES.some((h) => h.name === n);
const planSet = (n) => GEAR_DATA.some((g) => g.name === n);
const planKarma = (n) => KARMA_DATA.some((k) => k.name === n);
function planEncounters() {
  return [...TIER_LIST_V2.bosses, ...TOWER_TRIALS.towers];
}

function cleanRotation(raw) {
  const name = planText(raw?.name, 72);
  if (!name || !Array.isArray(raw.heroes) || !Array.isArray(raw.steps)) return null;
  const heroes = [...new Set(raw.heroes.filter(planHero))].slice(0, 3);
  const encounter = planEncounters().find((entry) => entry.id === raw.encounter)?.id || '';
  const steps = raw.steps
    .slice(0, 18)
    .filter((step) => step && ROTATION_TYPES.includes(step.type))
    .map((step) => {
      const hero = heroes.includes(step.hero) ? step.hero : '';
      const skill = hero && findSkill(hero, planText(step.skill, 80)) ? planText(step.skill, 80) : '';
      return { type: step.type, hero, skill, note: planText(step.note, 140) };
    });
  return { name, heroes, encounter, steps };
}
function readPlans() {
  try {
    const data = JSON.parse(localStorage.getItem(PLAN_KEY) || 'null');
    if (!data || !['goals', 'farm', 'rotations', 'watch'].every((key) => Array.isArray(data[key]))) return plansBlank();
    return {
      ...data,
      stock: data.stock && typeof data.stock === 'object' && !Array.isArray(data.stock) ? data.stock : {},
    };
  } catch (error) {
    return plansBlank();
  }
}
function savePlans(change) {
  plans = readPlans();
  change(plans);
  try {
    localStorage.setItem(PLAN_KEY, JSON.stringify(plans));
    return true;
  } catch (error) {
    return false;
  }
}
function planSetStatus(message) {
  if ($('planStatus')) $('planStatus').textContent = message;
}
function planRefresh(saved = true, focus = '') {
  drawPlans();
  if (!saved) planSetStatus('This browser could not save the change.');
  if (focus) $(focus)?.focus();
}
function planTargets(kind) {
  if (kind === 'hero') return HEROES.map((h) => [h.name, h.name]);
  if (kind === 'set') return GEAR_DATA.map((g) => [g.name, g.name]);
  if (kind === 'karma') return KARMA_DATA.map((k) => [k.name, k.name]);
  if (kind === 'boss') return planEncounters().map((b) => [b.id, b.name]);
  if (kind === 'recipe') return COOKBOOK.dishes.map((d) => [d.id, d.name]);
  return [];
}
function planLink(state, title, className = '') {
  return (
    '<a class="' + className + '" href="' + profileEsc(routeUrl(state.page, state)) + '">' + profileEsc(title) + '</a>'
  );
}
function planGoalLink({ kind, target }) {
  if (kind === 'hero') return { page: 'hero', hero: target, tab: 'build' };
  if (kind === 'set') return { page: 'gear', entry: target };
  if (kind === 'karma') return { page: 'karma', entry: target };
  if (kind === 'recipe') return { page: 'cookbook', entry: target };
  if (kind === 'boss') {
    const entry = planEncounters().find((e) => e.id === target);
    if (!entry) return null;
    const guide = (entry.type ? entry.type.toLowerCase() : 'tower') + '-' + target;
    return guideTarget(guide) ? { page: 'guides', guide } : { page: 'finder', finder: { encounter: target } };
  }
  return null;
}
function planOptions(pairs, current, empty) {
  const E = profileEsc;
  return (
    (empty ? '<option value="">' + E(empty) + '</option>' : '') +
    pairs
      .map(
        ([value, label]) =>
          '<option value="' + E(value) + '"' + (value === current ? ' selected' : '') + '>' + E(label) + '</option>',
      )
      .join('')
  );
}
function planFormHero(current = '', label = 'Choose a hero') {
  return planOptions(planTargets('hero'), current, label);
}
function plansTabHtml() {
  return (
    '<nav class="plan-nav" aria-label="Planning tools">' +
    Object.entries(PLAN_TABS)
      .map(
        ([tab, title]) =>
          '<a href="' +
          profileEsc(routeUrl('plans', { plan: tab })) +
          '" data-plan-tab="' +
          tab +
          '"' +
          (PLAN_VIEW.tab === tab ? ' aria-current="page"' : '') +
          '>' +
          title +
          '</a>',
      )
      .join('') +
    '</nav>'
  );
}

const PLAN_BACKUP_GROUPS = [
  ['goals', 'Goals'],
  ['farm', 'Farming lists'],
  ['stock', 'Stock entries'],
  ['rotations', 'Saved rotations'],
  ['watch', 'Watched heroes'],
];
function validatePlanBackup(value) {
  const label = 'My Plans';
  const keys = PLAN_BACKUP_GROUPS.map(([key]) => key);
  const invalid = (name) => {
    throw new Error(label + ' · ' + name + ' is invalid.');
  };
  const record = (row, fields, name) => {
    progressObject(row, label + ' · ' + name, fields);
    if (fields.some((key) => !Object.hasOwn(row, key))) invalid(name);
  };
  const text = (v, n, blank = false) => typeof v === 'string' && v.length <= n && (blank || !!v.trim());
  const integer = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;
  const rows = (group, fields, valid) => {
    const records = value[group];
    if (!Array.isArray(records)) invalid(group);
    const ids = new Set();
    for (const row of records) {
      record(row, ['id', ...fields], group);
      if (typeof row.id !== 'string' || !/^[A-Za-z0-9-]{1,80}$/.test(row.id) || ids.has(row.id) || !valid(row))
        invalid(group);
      ids.add(row.id);
    }
  };
  record(value, keys, 'saved plans');
  rows(
    'goals',
    ['title', 'kind', 'target', 'done'],
    (g) =>
      text(g.title, 90) &&
      Object.hasOwn(PLAN_KINDS, g.kind) &&
      (g.kind === 'note' ? g.target === '' : planTargets(g.kind).some(([id]) => id === g.target)) &&
      typeof g.done === 'boolean',
  );
  const levels = ['heroFrom', 'heroTo', 'karmaFrom', 'karmaTo'];
  rows(
    'farm',
    ['hero', 'sets', 'karma', 'heroSkip', 'karmaSkip', ...levels],
    (f) =>
      planHero(f.hero) &&
      (f.karma === '' || planKarma(f.karma)) &&
      Array.isArray(f.sets) &&
      f.sets.length <= 5 &&
      f.sets.every((set) => {
        record(set, ['set', 'pieces'], 'gear pairing');
        return planSet(set.set) && integer(set.pieces, 1, 5);
      }) &&
      levels.every((key) => integer(f[key], 1, 70)) &&
      typeof f.heroSkip === 'boolean' &&
      typeof f.karmaSkip === 'boolean',
  );
  rows('rotations', ['name', 'heroes', 'encounter', 'steps'], (card) => {
    if (
      !text(card.name, 72) ||
      !Array.isArray(card.heroes) ||
      card.heroes.length > 3 ||
      (card.encounter !== '' && !planEncounters().some(({ id }) => id === card.encounter)) ||
      !Array.isArray(card.steps) ||
      card.steps.length > 18
    )
      return false;
    progressNames(
      card.heroes,
      label + ' · lineup',
      HEROES.map((hero) => hero.name),
    );
    return card.steps.every((step) => {
      record(step, ['type', 'hero', 'skill', 'note'], 'rotation step');
      return (
        ROTATION_TYPES.includes(step.type) &&
        (step.hero === '' || card.heroes.includes(step.hero)) &&
        text(step.skill, 80, true) &&
        text(step.note, 140, true)
      );
    });
  });
  progressNames(
    value.watch,
    label + ' · watched heroes',
    HEROES.map((hero) => hero.name),
  );
  if (!value.stock || typeof value.stock !== 'object' || Array.isArray(value.stock)) invalid('stock');
  for (const [key, quantity] of Object.entries(value.stock)) {
    const colon = key.indexOf(':');
    const name = key.slice(colon + 1);
    const stockType = key.slice(0, colon);
    const valid =
      (stockType === 'set' && planSet(name)) ||
      (stockType === 'karma' && planKarma(name)) ||
      (stockType === 'gold' && name === 'Gold') ||
      (stockType === 'material' && text(name, 140));
    if (!valid || !integer(quantity, 0, 1e9)) invalid('stock');
  }
}

function mergePlanBackup(current, incoming) {
  const appendNew = (here, there) => {
    const existing = new Set(here.map((row) => row.id));
    return [...here, ...there.filter((row) => !existing.has(row.id))];
  };
  return {
    goals: appendNew(current.goals, incoming.goals),
    farm: appendNew(current.farm, incoming.farm),
    stock: {
      ...current.stock,
      ...Object.fromEntries(Object.entries(incoming.stock).filter(([key]) => !Object.hasOwn(current.stock, key))),
    },
    rotations: appendNew(current.rotations, incoming.rotations),
    watch: [...new Set([...current.watch, ...incoming.watch])],
  };
}
function planBackupEntries(plans, key) {
  if (!plans) return [];
  if (key === 'stock')
    return Object.entries(plans.stock).map(([id, count]) => [id, id.slice(id.indexOf(':') + 1) + ' · ' + count]);
  if (key === 'watch') return plans.watch.map((hero) => [hero, hero]);
  return plans[key].map((row) => [row.id, row.title || row.name || row.hero]);
}
function planButton(label, action, id = '', options = {}) {
  return (
    '<button type="button" class="plan-button' +
    (options.primary ? ' primary' : '') +
    '" data-plan-action="' +
    action +
    '" data-id="' +
    profileEsc(id) +
    '"' +
    (options.index != null ? ' data-index="' + options.index + '"' : '') +
    (options.disabled ? ' disabled' : '') +
    (options.aria ? ' aria-label="' + profileEsc(options.aria) + '"' : '') +
    '>' +
    profileEsc(label) +
    '</button>'
  );
}

function plansGoalsHtml() {
  const E = profileEsc;
  const cards = [...plans.goals]
    .sort((a, b) => Number(a.done) - Number(b.done))
    .map((g) => {
      const to = planGoalLink(g);
      const target = planTargets(g.kind).find(([v]) => v === g.target)?.[1];
      return (
        '<li class="plan-goal' +
        (g.done ? ' done' : '') +
        '"><label class="plan-check">' +
        '<input type="checkbox" data-plan-goal="' +
        E(g.id) +
        '"' +
        (g.done ? ' checked' : '') +
        ' aria-label="Complete ' +
        E(g.title) +
        '">' +
        '<span><strong>' +
        E(g.title) +
        '</strong><small>' +
        (to && target ? planLink(to, target) : E(PLAN_KINDS[g.kind] || 'Goal')) +
        '</small></span></label>' +
        planButton('Remove', 'remove-goal', g.id, { aria: 'Remove ' + g.title }) +
        '</li>'
      );
    })
    .join('');
  const complete = plans.goals.filter((g) => g.done).length;
  return (
    '<div class="plan-section"><h3>My next goals</h3><form id="planGoalForm" class="plan-form">' +
    '<label>Type<select name="kind" id="planGoalKind">' +
    planOptions(Object.entries(PLAN_KINDS), 'hero') +
    '</select></label>' +
    '<label id="planTargetLabel">Link to<select name="target" id="planGoalTarget">' +
    planOptions(planTargets('hero'), '', 'Choose a hero') +
    '</select></label><label>Goal<input name="title" id="planGoalTitle" maxlength="90" placeholder="e.g. Build Cerese for Ursula" required></label>' +
    '<button class="plan-button primary">Add goal</button></form>' +
    (cards
      ? '<p>' + complete + ' of ' + plans.goals.length + ' complete</p><ul class="plan-goals">' + cards + '</ul>'
      : '<p>Choose a goal and link it to the page you’ll use next.</p>') +
    '</div>'
  );
}

function newFarmPlan(hero, sets) {
  const build = CHARACTER_PROFILE_DATA[hero]?.build;
  return {
    id: planId(),
    hero,
    sets: (sets || build?.sets || []).filter((row) => planSet(row.set)),
    karma: build?.karma?.signature || build?.karma?.second || '',
    heroFrom: 1,
    heroTo: 1,
    karmaFrom: 1,
    karmaTo: 1,
    heroSkip: false,
    karmaSkip: false,
  };
}
function trackFarmBuild(hero, sets) {
  if (!planHero(hero)) return;
  const plan = newFarmPlan(hero, sets);
  const saved = savePlans((state) => {
    const existing = state.farm.find((p) => p.hero === hero && JSON.stringify(p.sets) === JSON.stringify(plan.sets));
    if (!existing && state.farm.length < 20) state.farm.unshift(plan);
  });
  navNavigate({ page: 'plans', plan: 'farm' });
  if (!saved) planSetStatus('This browser could not save the build.');
}
function farmGearCard(p, kind) {
  const E = profileEsc;
  const from = kind + 'From';
  const to = kind + 'To';
  const label = kind === 'hero' ? 'Hero levels' : 'Karma levels';
  const number = (f, caption) =>
    '<label>' +
    caption +
    '<input type="number" min="1" max="70" step="1" value="' +
    E(p[f]) +
    '" data-farm-level="' +
    f +
    '" data-id="' +
    E(p.id) +
    '"></label>';
  return (
    '<fieldset class="plan-range"><legend>' +
    label +
    '</legend>' +
    number(from, 'Current') +
    number(to, 'Target') +
    '<label class="plan-check"><input type="checkbox" data-farm-level="' +
    kind +
    'Skip" data-id="' +
    E(p.id) +
    '"' +
    (p[kind + 'Skip'] ? ' checked' : '') +
    '> Current breakthrough done</label></fieldset>'
  );
}
function plansFarmHtml() {
  const E = profileEsc;
  const builds = plans.farm
    .map((p) => {
      const b = CHARACTER_PROFILE_DATA[p.hero]?.build?.karma;
      const choices = [...new Set([p.karma, b?.signature, b?.second, ...(b?.alternatives || [])].filter(planKarma))];
      return (
        '<article class="plan-build"><header><h4>' +
        planLink({ page: 'hero', hero: p.hero, tab: 'build' }, p.hero) +
        '</h4>' +
        planButton('Remove', 'remove-farm', p.id, { aria: 'Remove ' + p.hero + ' farming plan' }) +
        '</header><p>' +
        p.sets.map(({ set, pieces }) => planLink({ page: 'gear', entry: set }, pieces + ' × ' + set)).join(' · ') +
        '</p><label>Karma<select data-farm-karma="' +
        E(p.id) +
        '">' +
        planOptions(
          choices.map((name) => [name, name]),
          p.karma,
          'None',
        ) +
        '</select></label><div class="plan-build-levels">' +
        farmGearCard(p, 'hero') +
        farmGearCard(p, 'karma') +
        '</div></article>'
      );
    })
    .join('');
  return (
    '<div class="plan-section"><h3>Builds to farm</h3>' +
    '<form id="planFarmForm" class="plan-form"><label>Hero<select name="hero" required>' +
    planFormHero() +
    '</select></label><button class="plan-button primary">Add recommended build</button></form>' +
    (builds
      ? '<div class="plan-builds">' + builds + '</div><div id="planFarmTotals"></div>'
      : '<p>Add a recommended build here, or send a gear pairing from a hero’s Build tab.</p>') +
    '</div>'
  );
}
function farmPlanRequirements() {
  const totals = new Map();
  const add = (type, name, count, extra = {}) => {
    if (!name || !(count > 0)) return;
    const key = type + ':' + name;
    const row = totals.get(key) || { key, type, name, need: 0, ...extra };
    row.need += count;
    totals.set(key, row);
  };
  for (const plan of plans.farm) {
    for (const { set, pieces } of plan.sets) add('set', set, pieces);
    if (plan.karma) add('karma', plan.karma, 1);
    for (const kind of ['hero', 'karma']) {
      const from = plan[kind + 'From'],
        to = plan[kind + 'To'],
        skip = plan[kind + 'Skip'];
      if (!(from < to)) continue;
      const item = plan.karma && KARMA_DATA.find((k) => k.name === plan.karma);
      if (kind === 'karma' && !item) continue;
      const exp = lvPlan(
        kind,
        from,
        to,
        0,
        LEVEL_COSTS.items[kind].map((entry) => entry.name),
        skip,
      );
      for (const [name, quantity] of Object.entries(exp.counts)) add('material', name, quantity, { src: lvSrc(name) });
      add('gold', 'Gold', exp.itemGold + exp.btGold);
      const mats =
        kind === 'hero' ? lvMats(plan.hero, exp.breakthroughs) : lvKarmaMats(item.archetype, exp.breakthroughs);
      for (const { name, amount, src, ins, chrono } of mats)
        add('material', name, amount, {
          src,
          exchange: ins || chrono,
          trait: kind === 'karma' && !!src && !lvSrc(name),
        });
    }
  }
  return [...totals.values()];
}
function farmSource(row) {
  const item = (ITEMDB.data.materials || []).find((entry) => entry.name === row.name);
  const itemLink = item
    ? planLink({ page: 'items', entry: 'materials:' + item.name }, item.name)
    : profileEsc(row.name);
  if (row.type === 'set') {
    const detail = planLink({ page: 'gear', entry: row.name }, row.name);
    const set = GEAR_DATA.find((entry) => entry.name === row.name);
    const dungeons = DUNGEONS.normal.filter((dungeon) => dungeon.set === row.name);
    if (dungeons.length)
      return {
        group: 'Normal Dungeons',
        link: detail,
        source:
          '<a href="' +
          profileEsc(routeUrl('dungeons')) +
          '#dungeons?set=' +
          encodeURIComponent(row.name) +
          '">' +
          profileEsc(dungeons.map((dungeon) => dungeon.name).join(' · ')) +
          '</a>',
      };
    const recipes = Object.entries(GEAR_UPGRADE.crafting)
      .filter(([, costs]) => costs.archetype)
      .map(
        ([rarity, costs]) =>
          '<span class="plan-recipe-cost">' + profileEsc(rarity + ' · ' + costs.archetype) + '</span>',
      )
      .join('');
    return {
      group: 'Blacksmith',
      link: detail,
      source:
        profileEsc(set?.source || 'Blacksmith') +
        (recipes ? '<details><summary>Crafting costs per piece</summary>' + recipes + '</details>' : ''),
    };
  }
  if (row.type === 'karma') {
    const card = KARMA_DATA.find((k) => k.name === row.name);
    const source = card?.source || '';
    return {
      group: /exchange/i.test(source) ? 'Exchange' : 'Karma sources',
      link: planLink({ page: 'karma', entry: row.name }, row.name),
      source: profileEsc(source),
    };
  }
  if (row.type === 'gold')
    return { group: 'Gold', link: itemLink, source: planLink({ page: 'currency' }, 'Currency Dungeons') };
  if (row.exchange)
    return {
      group: 'Exchange',
      link: itemLink,
      source: planLink({ page: 'guides', guide: 'exchange' }, 'Exchange and currencies'),
    };
  if (row.src && row.trait)
    return {
      group: 'Trait Dungeons',
      link: itemLink,
      source: planLink({ page: 'trait' }, row.src.dungeon + ' · ' + row.src.diff),
    };
  if (row.src)
    return {
      group: 'Normal Dungeons',
      link: itemLink,
      source:
        '<a href="' +
        profileEsc(routeUrl('dungeons')) +
        '#dungeons?material=' +
        encodeURIComponent(row.name) +
        '">' +
        profileEsc(row.src.dungeon + ' · ' + row.src.diff) +
        '</a>',
    };
  const currencyRewards = DUNGEONS.currencyRewardItems || {};
  const currency = (DUNGEONS.currency || [])
    .flatMap((dungeon) =>
      (dungeon.difficulties || []).flatMap((level) =>
        (level.rewards || [])
          .filter(([id]) => currencyRewards[id]?.name === row.name)
          .map(([, quantity]) => ({
            name: dungeon.name + ' · ' + level.name,
            quantity,
          })),
      ),
    )
    .sort((a, b) => b.quantity - a.quantity)[0];
  if (currency)
    return { group: 'Currency Dungeons', link: itemLink, source: planLink({ page: 'currency' }, currency.name) };
  const source = item?.sources || [];
  return {
    group: source.some((s) => /\[Hunt\]/i.test(s)) ? 'Hunts' : 'Other materials',
    link: itemLink,
    source: profileEsc(source.join(' · ') || 'Source details unavailable'),
  };
}
function drawFarmTotals() {
  const root = $('planFarmTotals');
  if (!root) return;
  const E = profileEsc;
  const fmt = (n) => Number(n).toLocaleString('en-GB');
  const groups = new Map();
  for (const row of farmPlanRequirements()) {
    const { group, link, source } = farmSource(row);
    const have = planQuantity(plans.stock[row.key]);
    const left = Math.max(0, row.need - have);
    const html =
      '<li class="plan-need' +
      (!left ? ' complete' : '') +
      '"><div><strong>' +
      link +
      '</strong><small>' +
      source +
      '</small></div><span>Need <b>' +
      fmt(row.need) +
      '</b></span><label>Have<input type="number" min="0" step="1" value="' +
      have +
      '" data-farm-stock="' +
      E(row.key) +
      '" aria-label="Have ' +
      E(row.name) +
      '"></label><span>Left <strong data-farm-left>' +
      fmt(left) +
      '</strong></span></li>';
    groups.set(group, (groups.get(group) || '') + html);
  }
  root.innerHTML =
    '<h3>Combined checklist</h3><p>Level ranges start with an empty EXP bar. A named EXP item is one way to meet the total.</p>' +
    [...groups]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([group, rows]) => '<section class="plan-sources"><h4>' + E(group) + '</h4><ul>' + rows + '</ul></section>')
      .join('');
}

function rotationDecode(token) {
  if (!token || token.length > 22000 || !/^1\.[A-Za-z0-9_-]+$/.test(token)) return null;
  try {
    const bytes = Uint8Array.from(atob(token.slice(2).replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
    return cleanRotation(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)));
  } catch (error) {
    return null;
  }
}
function rotationEncode(rotation) {
  const bytes = new TextEncoder().encode(JSON.stringify(cleanRotation(rotation)));
  return (
    '1.' +
    btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  );
}
function rotationActive() {
  return PLAN_VIEW.token
    ? rotationDecode(PLAN_VIEW.token)
    : plans.rotations.find((card) => card.id === PLAN_VIEW.active) || plans.rotations[0];
}
function rotationFromFinder() {
  const team = FIGHT_CHECK.heroes.filter(Boolean);
  if (!team.length) return;
  const encounter = $('finderEncounter').value;
  const entry = planEncounters().find((e) => e.id === encounter);
  openNewRotation({ name: entry?.name || team.join(' / '), heroes: team, encounter, steps: [] });
}
function openNewRotation(data) {
  const clean = cleanRotation(data);
  if (!clean) return;
  const card = { id: planId(), ...clean };
  const saved = savePlans((state) => state.rotations.unshift(card));
  PLAN_VIEW.active = card.id;
  navNavigate({ page: 'plans', plan: 'rotations' });
  if (!saved) planSetStatus('This browser could not save the rotation.');
}
function rotationStepSummary(step) {
  const E = profileEsc;
  const title = step.skill ? planLink({ page: 'hero', hero: step.hero, skill: step.skill }, step.skill) : E(step.hero);
  return (
    '<span class="plan-step-type">' +
    E(step.type) +
    '</span>' +
    (title ? '<strong>' + title + '</strong>' : '') +
    (step.note ? '<span>' + E(step.note) + '</span>' : '')
  );
}
function plansRotationsHtml() {
  const E = profileEsc;
  const card = rotationActive();
  const shared = Boolean(PLAN_VIEW.token);
  if (card && PLAN_VIEW.step >= card.steps.length) PLAN_VIEW.step = -1;
  const rosterFields = (selected) =>
    [0, 1, 2]
      .map(
        (i) =>
          '<label>Hero ' +
          (i + 1) +
          '<select name="hero' +
          i +
          '">' +
          planFormHero(selected[i], 'Leave empty') +
          '</select></label>',
      )
      .join('');
  const encounterField = (id) =>
    '<label>Encounter<select name="encounter">' +
    planOptions(planTargets('boss'), id, 'Any fight') +
    '</select></label>';
  const create =
    '<details class="plan-create"' +
    (!card ? ' open' : '') +
    '><summary>Create a rotation</summary>' +
    '<form id="planRotationForm" class="plan-form">' +
    '<label>Card name<input name="name" maxlength="72" required></label>' +
    rosterFields([]) +
    encounterField('') +
    '<button class="plan-button primary">Create card</button></form>' +
    '<label>Start with a team<select id="planTeamPreset">' +
    planOptions(
      TEAM_DATA.map((t) => [t.name, t.name]),
      '',
      'Choose a team',
    ) +
    '</select></label></details>';
  if (!card)
    return (
      '<div class="plan-section"><h3>Rotation cards</h3>' +
      create +
      '<p>Start with a team here, or send your lineup from the Boss &amp; Tower Finder.</p></div>'
    );
  const encounter = planEncounters().find((e) => e.id === card.encounter);
  const lineup = card.heroes
    .map((name) => {
      const portrait = HEROES.find((h) => h.name === name)?.portrait;
      return (
        '<a href="' +
        E(heroLinkUrl(name)) +
        '">' +
        (portrait ? '<img src="' + E(portrait) + '" alt="">' : '') +
        E(name) +
        '</a>'
      );
    })
    .join('');
  const steps = card.steps
    .map((step, i) => {
      const skills = step.hero
        ? CHARACTER_PROFILE_DATA[step.hero]?.skills.filter((s) => !/^(MODE|Mastery)/i.test(s.slot)) || []
        : [];
      const skillNames = [
        ...new Set(skills.map((s) => fightSkillName(s.skill)).filter((name) => findSkill(step.hero, name))),
      ];
      const select = (field, label, opts) =>
        '<label>' +
        label +
        '<select data-plan-step="' +
        field +
        '" data-index="' +
        i +
        '" aria-label="' +
        E(label + ' for step ' + (i + 1)) +
        '">' +
        opts +
        '</select></label>';
      const controls = shared
        ? ''
        : '<div class="plan-step-edit">' +
          select(
            'type',
            'Action',
            planOptions(
              ROTATION_TYPES.map((type) => [type, type]),
              step.type,
            ),
          ) +
          select(
            'hero',
            'Hero',
            planOptions(
              card.heroes.map((h) => [h, h]),
              step.hero,
              'Any hero',
            ),
          ) +
          select(
            'skill',
            'Skill',
            planOptions(
              skillNames.map((s) => [s, s]),
              step.skill,
              'Choose a skill',
            ),
          ) +
          '<label>Timing or condition<input maxlength="140" data-plan-step="note" data-index="' +
          i +
          '" aria-label="Timing or condition for step ' +
          (i + 1) +
          '" value="' +
          E(step.note) +
          '"></label>' +
          '<div class="plan-step-actions">' +
          planButton('↑', 'step-up', card.id, { index: i, disabled: i === 0, aria: 'Move step ' + (i + 1) + ' up' }) +
          planButton('↓', 'step-down', card.id, {
            index: i,
            disabled: i + 1 === card.steps.length,
            aria: 'Move step ' + (i + 1) + ' down',
          }) +
          planButton('Remove', 'step-remove', card.id, { index: i, aria: 'Remove step ' + (i + 1) }) +
          '</div></div>';
      return (
        '<li class="plan-step' +
        (PLAN_VIEW.step === i ? ' on' : '') +
        '" data-position="' +
        i +
        '"><div class="plan-step-summary">' +
        rotationStepSummary(step) +
        '</div>' +
        controls +
        '</li>'
      );
    })
    .join('');
  const edit = shared
    ? ''
    : '<details class="plan-create"><summary>Edit name and lineup</summary><form id="planEditRotationForm" class="plan-form">' +
      '<label>Card name<input name="name" maxlength="72" value="' +
      E(card.name) +
      '" required></label>' +
      rosterFields(card.heroes) +
      encounterField(card.encounter) +
      '<button class="plan-button">Save lineup</button></form></details>';
  return (
    '<div class="plan-section"><h3>Rotation cards</h3>' +
    (shared
      ? ''
      : '<div class="plan-rotation-top"><label>Saved card<select id="planRotationSelect">' +
        planOptions(
          plans.rotations.map((c) => [c.id, c.name]),
          card.id,
        ) +
        '</select></label>' +
        create +
        '</div>') +
    '<article class="plan-rotation"><header><div><h4>' +
    E(card.name) +
    '</h4>' +
    (encounter
      ? planLink(
          { page: 'finder', finder: { encounter: encounter.id, teamCheck: { heroes: card.heroes, build: 'mastery' } } },
          encounter.name,
        )
      : '') +
    '</div><div class="plan-lineup">' +
    lineup +
    '</div></header>' +
    edit +
    '<div class="plan-deck-actions">' +
    planButton('Previous step', 'step-prev', '', { disabled: PLAN_VIEW.step <= 0 }) +
    planButton(PLAN_VIEW.step < 0 ? 'Start rotation' : 'Next step', 'step-next', '', {
      disabled: !card.steps.length || PLAN_VIEW.step >= card.steps.length - 1,
    }) +
    planButton('Reset', 'step-reset', '', { disabled: PLAN_VIEW.step < 0 }) +
    '</div>' +
    '<div id="planCurrentStep" class="plan-step-summary plan-now"' +
    (PLAN_VIEW.step < 0 ? ' hidden' : '') +
    '>' +
    (PLAN_VIEW.step >= 0 ? rotationStepSummary(card.steps[PLAN_VIEW.step]) : '') +
    '</div>' +
    (steps
      ? '<ol class="plan-steps">' + steps + '</ol>'
      : '<p>Add the actions you use, with the timing or condition for each.</p>') +
    '<div class="plan-deck-actions">' +
    (shared
      ? planButton('Save a copy', 'save-shared', '', { primary: true })
      : planButton('Add step', 'step-add', card.id, { primary: true, disabled: card.steps.length >= 18 }) +
        planButton('Remove card', 'remove-rotation', card.id)) +
    planButton('Copy rotation link', 'share-rotation') +
    '</div><input id="planShareUrl" type="url" aria-label="Rotation link" readonly hidden></article></div>'
  );
}

function tickWatch(hero, button) {
  if (!planHero(hero)) return;
  const saved = savePlans((state) => {
    state.watch = state.watch.includes(hero) ? state.watch.filter((name) => name !== hero) : [...state.watch, hero];
  });
  if (button) {
    const on = saved && plans.watch.includes(hero);
    button.setAttribute('aria-pressed', String(on));
    button.textContent = saved ? (on ? 'Watching patches' : 'Watch hero patches') : 'Could not save';
  }
}
function watchChangeHtml(hero, change) {
  const names = (CHARACTER_PROFILE_DATA[hero]?.skills || []).map((skill) => fightSkillName(skill.skill));
  return (change.changes || [])
    .map((line) => {
      const current = names.find((s) => s === line.skill && findSkill(hero, s));
      const detail =
        line.before != null ? profileEsc(line.before + '% → ' + line.after + '%') : colourStatusWords(line.text || '');
      return (
        '<li>' +
        (current ? planLink({ page: 'hero', hero, skill: current }, current) : profileEsc(line.skill || '')) +
        (detail ? '<span>' + detail + '</span>' : '') +
        '</li>'
      );
    })
    .join('');
}
function plansWatchHtml() {
  const E = profileEsc;
  const selected = plans.watch.filter(planHero);
  const heroes = selected
    .map((hero) => planButton(hero + ' ×', 'unwatch', hero, { aria: 'Stop watching ' + hero }))
    .join('');
  const articles = (PATCH_NOTES.patches || []).flatMap((patch) => {
    const rows = selected.flatMap((hero) => {
      const change = patch.heroChanges?.[hero];
      if (!change) return [];
      const entries = watchChangeHtml(hero, change);
      return [
        '<section><h5>' +
          planLink({ page: 'hero', hero }, hero) +
          ' ' +
          patchArrow(change, patch.version) +
          '</h5>' +
          (entries ? '<ul>' + entries + '</ul>' : '') +
          (change.devNote ? '<p>' + colourStatusWords(change.devNote) + '</p>' : '') +
          '</section>',
      ];
    });
    return rows.length
      ? [
          '<article class="plan-watch-patch"><header><h4>Patch ' +
            E(patch.version) +
            '</h4>' +
            planLink({ page: 'patches', patch: patch.version }, 'Read full patch notes') +
            '</header>' +
            rows.join('') +
            '</article>',
        ]
      : [];
  });
  return (
    '<div class="plan-section"><h3>Hero patch watchlist</h3><form class="plan-form" id="planWatchForm"><label>Hero<select name="hero" required>' +
    planOptions(
      planTargets('hero').filter(([name]) => !selected.includes(name)),
      '',
      'Choose a hero',
    ) +
    '</select></label><button class="plan-button primary">Watch hero</button></form><div class="plan-picked">' +
    heroes +
    '</div>' +
    (articles.length
      ? articles.join('')
      : '<p>' +
        (selected.length
          ? 'The patch history has no listed changes for these heroes.'
          : 'Pin the heroes you play to see their damage, trigger, Rage and other patch changes together.') +
        '</p>') +
    '</div>'
  );
}

function showPlans(tab = 'goals', token = '') {
  if (!Object.hasOwn(PLAN_TABS, tab)) tab = 'goals';
  if (PLAN_VIEW.token !== token || PLAN_VIEW.tab !== tab) PLAN_VIEW.step = -1;
  PLAN_VIEW.tab = tab;
  PLAN_VIEW.token = token;
  drawPlans();
}
function drawPlans() {
  const root = $('plansBody');
  if (!root) return;
  plans = readPlans();
  const contents = { goals: plansGoalsHtml, farm: plansFarmHtml, rotations: plansRotationsHtml, watch: plansWatchHtml };
  root.innerHTML =
    plansTabHtml() +
    '<p class="plan-status" id="planStatus" role="status"></p>' +
    contents[PLAN_VIEW.tab]() +
    '<p class="plans-backup-link">' +
    planLink({ page: 'tools', tool: 'backup' }, 'Back up or transfer My Plans →') +
    '</p>';
  if (PLAN_VIEW.tab === 'farm' && $('planFarmTotals')) {
    drawFarmTotals();
    if (!ITEMDB.data.materials)
      itemLoad('materials').then((data) => {
        if (data && PLAN_VIEW.tab === 'farm' && !$('plansPage').hidden) drawFarmTotals();
      });
  }
}
function rotationFormValues(form) {
  return {
    name: form.get('name'),
    heroes: [0, 1, 2].map((i) => form.get('hero' + i)),
    encounter: form.get('encounter'),
  };
}
function changeRotation(change) {
  const current = rotationActive();
  if (!current?.id || PLAN_VIEW.token) return;
  return savePlans((state) => {
    const card = state.rotations.find((r) => r.id === current.id);
    if (card) change(card);
  });
}
function updateFarmField(input) {
  const { farmLevel, farmKarma, id } = input.dataset;
  const key = farmKarma ? 'karma' : farmLevel;
  const planId = farmKarma || id;
  const value = farmKarma
    ? planKarma(input.value)
      ? input.value
      : ''
    : input.type === 'checkbox'
      ? input.checked
      : Math.max(1, planQuantity(input.value, 70));
  const current = plans.farm.find((p) => p.id === planId);
  if (!current || current[key] === value) return;
  const saved = savePlans((state) => {
    const plan = state.farm.find((p) => p.id === planId);
    if (plan) plan[key] = value;
  });
  drawFarmTotals();
  if (!saved) planSetStatus('This browser could not save the plan.');
}
async function copyRotation() {
  const card = rotationActive();
  if (!card) return;
  const url = new URL(routeUrl('plans', { plan: 'rotations', rotation: rotationEncode(card) }), location.origin).href;
  try {
    await navigator.clipboard.writeText(url);
    planSetStatus('Rotation link copied.');
  } catch (error) {
    const field = $('planShareUrl');
    if (!field) return;
    field.value = url;
    field.hidden = false;
    field.focus();
    field.select();
  }
}
function handlePlanAction(button) {
  const { planAction: action, id } = button.dataset;
  const index = Number(button.dataset.index);
  if (action === 'share-rotation') return copyRotation();
  if (action === 'save-shared') return openNewRotation(rotationActive());
  if (action === 'unwatch') {
    tickWatch(id);
    return planRefresh();
  }
  if (action === 'step-next' || action === 'step-prev' || action === 'step-reset') {
    PLAN_VIEW.step = action === 'step-reset' ? -1 : PLAN_VIEW.step + (action === 'step-next' ? 1 : -1);
    // Repaint the highlight while keeping the controls in reach.
    $('plansBody')
      .querySelectorAll('[data-position]')
      .forEach((row) => row.classList.toggle('on', Number(row.dataset.position) === PLAN_VIEW.step));
    const active = rotationActive();
    const get = (name) => $('plansBody').querySelector('[data-plan-action="' + name + '"]');
    get('step-prev').disabled = PLAN_VIEW.step <= 0;
    get('step-next').disabled = PLAN_VIEW.step >= active.steps.length - 1;
    get('step-next').textContent = PLAN_VIEW.step < 0 ? 'Start rotation' : 'Next step';
    get('step-reset').disabled = PLAN_VIEW.step < 0;
    const current = $('planCurrentStep');
    current.hidden = PLAN_VIEW.step < 0;
    current.innerHTML = current.hidden ? '' : rotationStepSummary(active.steps[PLAN_VIEW.step]);
    if (PLAN_VIEW.step >= 0)
      planSetStatus(
        'Step ' + (PLAN_VIEW.step + 1) + ' of ' + active.steps.length + ' · ' + active.steps[PLAN_VIEW.step].type,
      );
    else planSetStatus('Rotation reset.');
    return;
  }
  if (action.startsWith('remove-')) {
    const key = { 'remove-goal': 'goals', 'remove-farm': 'farm', 'remove-rotation': 'rotations' }[action];
    if (action === 'remove-rotation') {
      PLAN_VIEW.step = -1;
      PLAN_VIEW.active = '';
    }
    if (key)
      return planRefresh(
        savePlans((state) => {
          state[key] = state[key].filter((row) => row.id !== id);
        }),
      );
  }
  if (action.startsWith('step-')) {
    PLAN_VIEW.step = -1;
    return planRefresh(
      changeRotation((card) => {
        if (action === 'step-add' && card.steps.length < 18)
          card.steps.push({
            type: card.steps.length ? 'Skill' : 'Opener',
            hero: card.heroes[0] || '',
            skill: '',
            note: '',
          });
        else if (action === 'step-remove') card.steps.splice(index, 1);
        else if (action === 'step-up' || action === 'step-down') {
          const other = index + (action === 'step-up' ? -1 : 1);
          if (card.steps[index] && card.steps[other])
            [card.steps[index], card.steps[other]] = [card.steps[other], card.steps[index]];
        }
      }),
    );
  }
}
function initPlans() {
  plans = readPlans();
  const root = $('plansBody');
  root.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-plan-tab]');
    if (tab && isPlainLinkClick(event)) {
      event.preventDefault();
      navNavigate({ page: 'plans', plan: tab.dataset.planTab });
      root.querySelector('[aria-current="page"]')?.focus();
    }
    const action = event.target.closest('[data-plan-action]');
    if (action) handlePlanAction(action);
  });
  root.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    if (event.target.id === 'planGoalForm') {
      const kind = form.get('kind'),
        title = planText(form.get('title'), 90);
      const target = planTargets(kind).some(([v]) => v === form.get('target')) ? form.get('target') : '';
      if (!title || (kind !== 'note' && !target)) return planSetStatus('Choose a page to link to and enter a goal.');
      return planRefresh(
        savePlans((state) => state.goals.unshift({ id: planId(), title, kind, target, done: false })),
        'planGoalTitle',
      );
    }
    if (event.target.id === 'planFarmForm') return trackFarmBuild(form.get('hero'));
    if (event.target.id === 'planWatchForm') {
      const hero = form.get('hero');
      if (planHero(hero) && !readPlans().watch.includes(hero)) tickWatch(hero);
      return planRefresh();
    }
    if (event.target.id === 'planRotationForm') return openNewRotation({ ...rotationFormValues(form), steps: [] });
    if (event.target.id === 'planEditRotationForm')
      return planRefresh(
        changeRotation((card) => {
          const clean = cleanRotation({ ...card, ...rotationFormValues(form) });
          if (clean) Object.assign(card, clean);
        }),
      );
  });
  root.addEventListener('input', (event) => {
    const field = event.target;
    if (field.dataset.farmLevel && field.type === 'number' && field.validity.valid && field.value !== '')
      updateFarmField(field);
  });
  root.addEventListener('change', (event) => {
    const t = event.target;
    const d = t.dataset;
    if (t.id === 'planGoalKind') {
      $('planTargetLabel').hidden = t.value === 'note';
      $('planGoalTarget').innerHTML = planOptions(planTargets(t.value), '', 'Choose a destination');
    } else if (d.planGoal) {
      const saved = savePlans((state) => {
        const goal = state.goals.find((g) => g.id === d.planGoal);
        if (goal) goal.done = t.checked;
      });
      planRefresh(saved);
      [...root.querySelectorAll('[data-plan-goal]')].find((box) => box.dataset.planGoal === d.planGoal)?.focus();
    } else if (d.farmStock) {
      const saved = savePlans((state) => {
        state.stock[d.farmStock] = planQuantity(t.value);
      });
      const row = farmPlanRequirements().find((entry) => entry.key === d.farmStock);
      if (row) {
        const left = Math.max(0, row.need - plans.stock[d.farmStock]);
        t.value = plans.stock[d.farmStock];
        const item = t.closest('.plan-need');
        item.classList.toggle('complete', !left);
        item.querySelector('[data-farm-left]').textContent = left.toLocaleString('en-GB');
      }
      if (!saved) planSetStatus('This browser could not save your stock.');
    } else if (d.farmLevel || d.farmKarma) {
      if (d.farmLevel && !d.farmLevel.endsWith('Skip')) t.value = Math.max(1, planQuantity(t.value, 70));
      updateFarmField(t);
    } else if (t.id === 'planRotationSelect') {
      PLAN_VIEW.active = t.value;
      PLAN_VIEW.step = -1;
      drawPlans();
      $('planRotationSelect')?.focus();
    } else if (t.id === 'planTeamPreset') {
      const team = TEAM_DATA.find((entry) => entry.name === t.value);
      if (!team) return;
      const form = $('planRotationForm');
      form.elements.namedItem('name').value = team.name;
      team.members.slice(0, 3).forEach((slot, i) => {
        form.elements.namedItem('hero' + i).value = slot.name;
      });
    } else if (d.planStep) {
      const saved = changeRotation((card) => {
        const step = card.steps[+d.index];
        if (!step) return;
        step[d.planStep] = t.value;
        if (d.planStep === 'hero') step.skill = '';
      });
      if (d.planStep === 'hero' || d.planStep === 'type' || d.planStep === 'skill') {
        planRefresh(saved);
        root.querySelector('[data-plan-step="' + d.planStep + '"][data-index="' + d.index + '"]')?.focus();
      } else {
        const step = rotationActive()?.steps[+d.index];
        const summary = t.closest('.plan-step')?.querySelector('.plan-step-summary');
        if (summary && step) summary.innerHTML = rotationStepSummary(step);
        if (!saved) planSetStatus('This browser could not save the step.');
      }
    }
  });
  window.addEventListener('storage', (event) => {
    if (event.key === PLAN_KEY && !$('plansPage').hidden) drawPlans();
  });
}
