/* Site-wide search and direct links into the reference pages. */
const SEARCH_KINDS = [
  'Hero',
  'Skill',
  'Team',
  'Hunt',
  'Raid',
  'Tower',
  'Status',
  'Guide',
  'Gear',
  'Karma',
  'Recipe',
  'Item',
  'Page',
];
const searchText = (value) =>
  String(value || '')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/['\u2019]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

function showReferenceEntry(page, entry) {
  if (page === 'gear' && GEAR_DATA.some((gear) => gear.name === entry)) {
    openGearSet(entry, false);
  } else if (page === 'karma' && KARMA_DATA.some((card) => card.name === entry)) {
    openKarmaByName(entry, false);
  } else if (page === 'cookbook' && COOKBOOK.dishes.some((dish) => dish.id === entry)) {
    Object.assign(CB, { m: '', e: '', hide: false, q: '', sel: entry });
    renderCookbook();
    requestAnimationFrame(() => {
      if (NAV.reference?.entry === entry && !$('cookbookPage').hidden) flashEl($('cbRecipeDetails'));
    });
  } else if (page === 'items') {
    const split = entry.indexOf(':');
    const tab = entry.slice(0, split);
    const name = entry.slice(split + 1);
    if (split > 0 && name && ITEM_TABS.some(([key]) => key === tab)) {
      Object.assign(ITEMDB, { tab, entry: name, q: '', rar: '' });
      renderItems();
      return;
    }
    NAV.reference = null;
  } else {
    NAV.reference = null;
  }
}

function clearReferenceEntry(refresh = true) {
  NAV.reference = null;
  if (ITEMDB.entry) {
    ITEMDB.entry = '';
    if (refresh) renderItems();
  }
}

function makeSearchEntry(kind, name, detail, state, keywords = []) {
  return {
    kind,
    name,
    detail,
    state,
    title: searchText(name),
    context: searchText([detail, kind, ...keywords].join(' ')),
  };
}

function siteSearchIndex() {
  const entries = [];
  const add = (...args) => entries.push(makeSearchEntry(...args));
  for (const hero of HEROES) {
    const { name, archetype, role } = hero;
    add('Hero', name, [archetype, role].join(' · '), { page: 'hero', hero: name });
    const used = new Set();
    for (const sk of CHARACTER_PROFILE_DATA[name]?.skills || []) {
      const skill = sk.skill
        ?.replace(/\s*\(Lv\.?\s*\d+\).*$/i, '')
        .trim()
        .replace(/\s*\([^)]*\)$/, '');
      if (!skill || used.has(skill) || !findSkill(name, skill) || /^MODE SWITCH/i.test(sk.slot)) continue;
      used.add(skill);
      add('Skill', skill, [name, sk.slot].join(' · '), { page: 'hero', hero: name, skill }, [
        archetype,
        ...(sk.meta?.inflicts || []),
        ...(sk.meta?.requiresAny || []),
      ]);
    }
  }
  for (const team of TEAM_DATA) {
    add('Team', team.name, team.arch, { page: 'teams', team: team.name }, [
      team.lead,
      ...team.members.flatMap((slot) => [slot.name, ...(slot.alts || [])]),
    ]);
  }
  for (const boss of TIER_LIST_V2.bosses) {
    const weakness = Object.entries(STATUS_ARCHETYPE)
      .filter(([, archetype]) => boss.weak?.includes(archetype))
      .map(([status]) => status);
    const raidName = guideArticle(boss.type.toLowerCase() + '-' + boss.id)?.title;
    add(boss.type, boss.name, 'Boss & Tower Finder', { page: 'finder', finder: { encounter: boss.id } }, [
      raidName,
      ...(boss.weak || []),
      ...weakness,
    ]);
  }
  for (const tower of TOWER_TRIALS.towers) {
    add('Tower', tower.name, tower.status, { page: 'finder', finder: { encounter: tower.id } }, [tower.archetype]);
  }
  for (const { name } of DAMAGE_CALC.statuses) {
    const label = name === 'Frozen' ? 'Frost' : name;
    const isBreak = name === 'Break';
    add(
      'Status',
      label,
      isBreak ? 'Break & Super Armor guide' : 'Status Effects guide',
      { page: 'guides', guide: isBreak ? 'break-super-armor' : 'status-effects' },
      [STATUS_ARCHETYPE[name], name === 'Frozen' ? 'Freeze Frozen' : ''],
    );
  }
  for (const { name, items } of GUIDES.categories) {
    for (const guide of items.filter((item) => item.ready && guideTarget(item.id))) {
      const article = guideArticle(guide.id);
      add('Guide', guide.title, name, { page: 'guides', guide: guide.id }, [
        article?.title,
        ...(article?.sections || []).map((section) => (Array.isArray(section) ? section[0] : section.title)),
      ]);
    }
  }
  for (const gear of GEAR_DATA) {
    add('Gear', gear.name, gear.source, { page: 'gear', entry: gear.name }, [gear.two, gear.three]);
  }
  for (const card of KARMA_DATA) {
    add(
      'Karma',
      card.name,
      [card.archetype, card.signature].filter(Boolean).join(' · '),
      { page: 'karma', entry: card.name },
      [...(card.traits || []).map((trait) => trait.label)],
    );
  }
  for (const dish of COOKBOOK.dishes) {
    add('Recipe', dish.name, [dish.method, dish.scope].join(' · '), { page: 'cookbook', entry: dish.id }, [
      dish.effect,
      dish.text,
      ...cbCombos(dish).flatMap((combo) => combo.slots.flatMap((slot) => cbOpts(slot).map((ing) => ing.name))),
    ]);
  }
  for (const nav of document.querySelectorAll('.nav-item[data-page]')) {
    add('Page', nav.querySelector('.nav-label').textContent, '', { page: nav.dataset.page });
  }
  for (const [tool, title] of Object.entries(TAB_TOOLS)) {
    add('Page', title, 'Tools', { page: 'tools', tool });
  }
  return entries;
}

function siteSearchMatches(entries, text, kind) {
  const query = searchText(text);
  const terms = [...new Set(query.split(' ').filter(Boolean))];
  const matches = [];
  for (const entry of entries) {
    if (kind && entry.kind !== kind) continue;
    const { title, context } = entry;
    const words = title.split(' ');
    const contextWords = context.split(' ');
    if (!terms.every((term) => title.includes(term) || context.includes(term))) continue;
    const quality = terms.reduce((sum, term) => {
      if (words.includes(term)) return sum + 24;
      if (words.some((word) => word.startsWith(term))) return sum + 16;
      if (title.includes(term)) return sum + 10;
      return sum + (contextWords.includes(term) ? 6 : 2);
    }, 0);
    matches.push({
      entry,
      quality: quality + (query && title === query ? 180 : title.startsWith(query + ' ') ? 90 : 0),
    });
  }
  return matches
    .sort((a, b) => b.quality - a.quality || a.entry.name.localeCompare(b.entry.name))
    .map(({ entry }) => entry);
}

function initSiteSearch() {
  const dialog = $('siteSearch');
  const input = $('siteSearchQuery');
  const kind = $('siteSearchKind');
  const status = $('siteSearchStatus');
  const results = $('siteSearchResults');
  const base = siteSearchIndex();
  const starter = ['home', 'heroes', 'finder', 'teams', 'guides', 'cookbook'];
  const itemEntries = new Map();
  let loading = false;
  let itemFailures = 0;
  let trigger;

  for (const label of SEARCH_KINDS) kind.add(new Option(label, label));
  function update() {
    const activeLink = results.contains(document.activeElement) ? document.activeElement.href : '';
    const scroll = results.scrollTop;
    const query = input.value.trim();
    const empty = !query && !kind.value;
    const matches = empty
      ? starter.map((page) => base.find((entry) => entry.kind === 'Page' && entry.state.page === page)).filter(Boolean)
      : siteSearchMatches(base.concat(...itemEntries.values()), query, kind.value);
    const shown = matches.slice(0, 24);
    const searchItems = !kind.value || kind.value === 'Item';
    if (empty) status.textContent = 'Jump to a page';
    else if (shown.length) {
      status.textContent =
        (shown.length < matches.length ? 'Showing the first ' + shown.length + ' of ' : '') +
        matches.length +
        (matches.length === 1 ? ' result' : ' results');
      if (loading && searchItems) status.textContent += ' · Loading items…';
    } else
      status.textContent = loading && searchItems ? 'Loading items…' : 'No results. Try a different name or category.';
    if (!empty && searchItems && !loading && itemFailures)
      status.textContent += ' · Some items could not load. Reopen search to retry.';

    results.replaceChildren(
      ...shown.map(({ kind: category, name, detail, state }) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = routeUrl(state.page, state);
        link.innerHTML = '<span><b></b><small></small></span><span class="search-kind"></span>';
        link.querySelector('b').textContent = name;
        link.querySelector('small').textContent = detail;
        link.querySelector('.search-kind').textContent = category;
        link.addEventListener('click', (event) => {
          if (!isPlainLinkClick(event)) return;
          event.preventDefault();
          dialog.close();
          navNavigate(state);
        });
        li.append(link);
        return li;
      }),
    );
    if (activeLink) {
      const links = [...results.querySelectorAll('a')];
      results.scrollTop = scroll;
      (links.find((link) => link.href === activeLink) || input).focus({ preventScroll: true });
    } else results.scrollTop = 0;
  }

  async function loadItems() {
    if (loading || itemEntries.size === ITEM_TABS.length) return;
    loading = true;
    itemFailures = 0;
    await Promise.all(
      ITEM_TABS.filter(([tab]) => !itemEntries.has(tab)).map(async ([tab, label]) => {
        const items = await itemLoad(tab);
        if (!items) {
          itemFailures++;
          return;
        }
        itemEntries.set(
          tab,
          items.map((item) =>
            makeSearchEntry(
              'Item',
              item.name,
              [label, item.type].filter(Boolean).join(' · '),
              { page: 'items', entry: tab + ':' + item.name },
              [item.rarity, ...(item.sources || [])],
            ),
          ),
        );
      }),
    );
    loading = false;
    if (dialog.open) update();
  }

  function open(from) {
    if (document.querySelector('dialog[open]')) return;
    trigger = from;
    if ($('mobileMenu').getAttribute('aria-expanded') === 'true') setMobileMenu(false);
    loadItems();
    update();
    dialog.showModal();
    input.select();
  }

  const buttons = [...document.querySelectorAll('[data-site-search]')];
  for (const button of buttons) button.addEventListener('click', () => open(button));
  $('siteSearchClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    trigger?.focus({ preventScroll: true });
  });
  input.addEventListener('input', update);
  kind.addEventListener('change', update);
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !event.isComposing) {
      event.preventDefault();
      dialog.close();
      return;
    }
    const active = document.activeElement;
    if (!results.contains(active) && active !== input) return;
    const links = [...results.querySelectorAll('a')];
    if (!links.length || event.isComposing) return;
    if (event.key === 'Enter' && active === input) {
      event.preventDefault();
      links[0].click();
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const index = links.indexOf(active);
      const next = index + (event.key === 'ArrowDown' ? 1 : -1);
      if (next >= links.length || (index < 0 && next < 0)) return;
      event.preventDefault();
      (links[next] || input).focus();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.repeat || event.isComposing || event.altKey || event.shiftKey) return;
    const editing = event.target.closest?.('input, textarea, select, [contenteditable]');
    if (
      ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') ||
      (!event.ctrlKey && !event.metaKey && event.key === '/' && !editing)
    ) {
      if (document.querySelector('dialog[open]')) return;
      event.preventDefault();
      open(buttons.find((control) => control.offsetWidth));
    }
  });
}
