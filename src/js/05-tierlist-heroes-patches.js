/* js/05-tierlist-heroes-patches.js: Hero tooltips, Heroes page, Patch Notes, Familiars and Titles. Part of the site script, split out of index.html on 10 Nov 2026.
   The files load in order (see index.html) and share one global scope, so code that runs at load time may only use what earlier files define. */
// ==== Shared hero tooltips ====
function showHeroCard(h, anchor) {
  hideTip();
  showRefPopover(anchor, 'hero', h.name, IS_TOUCH);
}
function hideTip() {
  $('tooltip').style.display = 'none';
}
const dToggle = $('navDungeonsToggle');
if (dToggle)
  dToggle.addEventListener('click', () => {
    const sub = $('navDungeonsSubgroup'),
      open = sub.hidden;
    sub.hidden = !open;
    dToggle.setAttribute('aria-expanded', String(open));
    dToggle.classList.toggle('active', open);
  });
document.querySelectorAll('.nav-item[data-page]').forEach((btn) =>
  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    const page = btn.dataset.page;
    if (page !== 'currency' && !$('currencyPage').hidden) {
      CURRENCY_DNG_STATE.selected = {};
      renderCurrencyDungeons();
    }
    if (page !== 'dungeons' && !$('dungeonsPage').hidden) resetDungeonFilters();
    document.querySelectorAll('.nav-item[data-page]').forEach((x) => x.classList.toggle('active', x === btn));
    if (['dungeons', 'trait', 'currency'].includes(page)) {
      $('navDungeonsSubgroup').hidden = false;
      $('navDungeonsToggle').setAttribute('aria-expanded', 'true');
      $('navDungeonsToggle').classList.add('active');
    } else {
      $('navDungeonsToggle').classList.remove('active');
    }
    $('profilePage').hidden = true;
    Object.entries(PAGE_IDS).forEach(([k, id]) => {
      $(id).hidden = k !== page;
    });
    const titles = {
      home: 'Shortcuts',
      tier: 'Tier List',
      heroes: 'Heroes',
      teams: 'Teams',
      gear: 'Gear',
      karma: 'Karma',
      patches: 'Patch Notes',
      familiars: 'Familiars',
      titles: 'Titles',
      dungeons: 'Normal Dungeons',
      trait: 'Trait Dungeons',
      currency: 'Currency Dungeons',
      cookbook: 'Cookbook',
      items: 'Item Database',
      achievements: 'Achievements',
      guides: 'Guides',
      tools: 'Tools',
      news: 'News',
    };
    setTabTitle(page === 'home' ? '' : titles[page] || page);
    {
      document.documentElement.dataset.page = page;
      const hp = $('hdrPage');
      if (hp) hp.textContent = titles[page] || page;
      if (['dungeons', 'trait', 'currency'].includes(page) && !DNG.preloaded) {
        DNG.preloaded = true;
        preloadDungeonBanners();
      }
      if (page === 'dungeons' && DNG.lazy) {
        DNG.lazy = false;
        renderDungeons();
      }
    }
    navSchedule();
  }),
);

let activeHeroesArch = '';
let activeHeroesRole = '';
// ==== Heroes page ====
function renderHeroesFilters() {
  const archRoot = $('heroesArchFilters'),
    roleRoot = $('heroesRoleFilters');
  archRoot.innerHTML = '';
  roleRoot.innerHTML = '';
  function addAll(root, active, change, label) {
    const b = document.createElement('button');
    b.className = 'heroes-filter-btn' + (!active ? ' active' : '');
    b.title = label;
    b.setAttribute('aria-label', label);
    b.innerHTML = '<span class="all-symbol">✱</span>';
    b.onclick = () => {
      change('');
      renderHeroesFilters();
      renderHeroes();
    };
    root.append(b);
  }
  addAll(archRoot, activeHeroesArch, (v) => (activeHeroesArch = v), 'All archetypes');
  ARCHES.forEach((a) => {
    const h = HEROES.find((x) => x.archetype === a),
      b = document.createElement('button');
    b.className = 'heroes-filter-btn' + (activeHeroesArch === a ? ' active' : '');
    b.title = a;
    b.setAttribute('aria-label', a);
    b.innerHTML = `<img src="${h?.archIcon || ''}" alt="">`;
    b.onclick = () => {
      activeHeroesArch = activeHeroesArch === a ? '' : a;
      renderHeroesFilters();
      renderHeroes();
    };
    archRoot.append(b);
  });
  const roles = [
    { key: 'Main DPS', label: 'Main DPS' },
    { key: 'Sub-DPS', label: 'Sub DPS' },
    { key: 'Support', label: 'Support' },
  ];
  addAll(roleRoot, activeHeroesRole, (v) => (activeHeroesRole = v), 'All roles');
  roles.forEach((r) => {
    const b = document.createElement('button');
    b.className = 'heroes-filter-btn' + (activeHeroesRole === r.key ? ' active' : '');
    b.title = r.label;
    b.setAttribute('aria-label', r.label);
    b.innerHTML = `<img src="${ROLE_ICONS[r.key] || ''}" alt="">`;
    b.onclick = () => {
      activeHeroesRole = activeHeroesRole === r.key ? '' : r.key;
      renderHeroesFilters();
      renderHeroes();
    };
    roleRoot.append(b);
  });
}
function renderHeroes() {
  const q = $('heroesSearch').value.trim().toLowerCase();
  const list = HEROES.filter(
    (h) =>
      (!q || h.name.toLowerCase().includes(q)) &&
      (!activeHeroesArch || h.archetype === activeHeroesArch) &&
      (!activeHeroesRole || h.role === activeHeroesRole),
  );
  $('heroesCount').textContent = `Showing ${list.length} characters`;
  const grid = $('heroesGrid');
  grid.innerHTML = '';
  list.forEach((h) => {
    const card = document.createElement('article');
    card.className = 'heroes-character-card';
    card.title = `${h.name} · ${h.archetype} · ${h.role}`;
    card.tabIndex = 0;
    card.innerHTML = `<img class="heroes-portrait" src="${h.portrait}" alt="${h.name}" loading="lazy"><div class="heroes-char-badges"><span class="heroes-char-badge" title="${h.role}"><img src="${ROLE_ICONS[h.role] || ''}" alt="${h.role}"></span></div>${h.name === 'Ryza' ? '<span class="heroes-new">NEW</span>' : ''}<div class="heroes-char-name">${h.name}</div>`;
    card.style.cursor = 'pointer';
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Open ${h.name} character page`);
    card.addEventListener('click', () => openCharacterProfile(h.name));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCharacterProfile(h.name);
      }
    });
    card.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'touch') showHeroCard(h, card);
    });
    card.addEventListener('pointerleave', (e) => {
      if (!$('karmaPopover').contains(e.relatedTarget)) hideKarmaPopover();
    });
    card.addEventListener('focus', () => showHeroCard(h, card));
    card.addEventListener('blur', () => hideKarmaPopover());
    grid.append(card);
  });
  if (!list.length) grid.innerHTML = '<div class="heroes-empty">No characters match your search and filters.</div>';
}

// ---- Patch Notes (PATCH_NOTES in data.json) ----
const PB_COLORS = {
  hero: '#f0b94a',
  balance: '#19b9ff',
  content: '#6fd08c',
  costume: '#ff7eb6',
  quest: '#b28cff',
  system: '#9aa4b5',
  fix: '#ff8a5c',
};
const PB_ICONS = {
  hero: '<path d="M8 1.5l1.9 4 4.3.5-3.2 3 .9 4.3L8 11.2l-3.9 2.1.9-4.3-3.2-3 4.3-.5z" fill="currentColor"/>',
  balance:
    '<path d="M8 2v11M4 13h8M3 4h10M5 4l-2.5 5h5zM11 4l-2.5 5h5z" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linejoin="round"/>',
  content:
    '<path d="M3 14V2M3 2.5h9l-2 3 2 3H3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>',
  costume:
    '<path d="M5.5 2L2 4.5l1.5 3L5 6.5V14h6V6.5l1.5 1 1.5-3L10.5 2c-.5 1.2-1.4 1.8-2.5 1.8S6 3.2 5.5 2z" fill="currentColor"/>',
  quest:
    '<path d="M4 2h7.5a1.5 1.5 0 011.5 1.5V14H5a2 2 0 01-2-2V3a1 1 0 011-1zM6 5.5h5M6 8h5M6 10.5h3" stroke="currentColor" stroke-width="1.3" fill="none"/>',
  system:
    '<circle cx="8" cy="8" r="2.2" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" stroke="currentColor" stroke-width="1.4"/>',
  fix: '<path d="M5.5 5.5a2.5 2.5 0 015 0V10a2.5 2.5 0 01-5 0zM5.5 8H2.5M13.5 8h-3M3 4.5l2.5 1.5M13 4.5l-2.5 1.5M3 12l2.5-1.5M13 12l-2.5-1.5M8 6.5v5" stroke="currentColor" stroke-width="1.3" fill="none"/>',
};
function patchBadge(k, withLabel = true) {
  const P = PATCH_NOTES || {};
  return `<span class="pbadge" style="--pb:${PB_COLORS[k] || '#9aa4b5'}" title="${profileEsc((P.badgeTypes || {})[k] || k)}"><svg viewBox="0 0 16 16" aria-hidden="true">${PB_ICONS[k] || ''}</svg><span>${withLabel ? profileEsc((P.badgeTypes || {})[k] || k) : ''}</span></span>`;
}
const PA_SVG = {
  buff: '<path d="M8 3l5.5 8h-11z" fill="currentColor"/>',
  nerf: '<path d="M8 13l5.5-8h-11z" fill="currentColor"/>',
  mixed: '<path d="M8 1.5l4 5.5H4zM8 14.5l4-5.5H4z" fill="currentColor"/>',
  adjusted: '<path d="M3 6.5h10M3 9.5h10" stroke="currentColor" stroke-width="2"/>',
  fix: '<path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2.2" fill="none"/>',
};
function patchDirLabel(c) {
  const P = PATCH_NOTES || {};
  const d = (P.directions || {})[c.direction] || c.direction;
  const i = (P.impactLabels || [])[c.impact] || '';
  return c.direction === 'new'
    ? 'New hero'
    : c.direction === 'mixed' && i
      ? `Mixed (${i.toLowerCase()} impact)`
      : i && !['fix', 'adjusted'].includes(c.direction)
        ? i + ' ' + d.toLowerCase()
        : d;
}
function patchArrow(c, version) {
  if (!c) return '';
  const t = `Patch ${version}: ${patchDirLabel(c)}${c.damagePct != null ? ` (skill damage ${c.damagePct > 0 ? '+' : ''}${c.damagePct}%${c.shiftPct ? `, with ${c.shiftPct}% of it moved between skills` : ''})` : ''}`;
  if (c.direction === 'new') return `<span class="pa pa-new" title="${profileEsc(t)}">NEW</span>`;
  return `<span class="pa pa-${c.direction}" title="${profileEsc(t)}" aria-label="${profileEsc(t)}"><svg viewBox="0 0 16 16" aria-hidden="true">${PA_SVG[c.direction] || ''}</svg></span>`;
}
function latestBalanceChange(name) {
  const P = PATCH_NOTES || {};
  const p = (P.patches || []).find((x) => x.version === P.latestBalance);
  const c = p && (p.heroChanges || {})[name];
  return c ? { c, version: p.version } : null;
}
function latestArrow(name, onlyDirectional = true) {
  const l = latestBalanceChange(name);
  if (!l) return '';
  if (onlyDirectional && !['buff', 'nerf', 'mixed', 'new'].includes(l.c.direction)) return '';
  return patchArrow(l.c, l.version);
}
function patchDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1]} ${y}`;
}
const PA_COLOR = {
  buff: '#1f9d55',
  nerf: '#d63c43',
  mixed: '#d9962b',
  adjusted: '#5b6270',
  fix: '#3c4656',
  new: '#f0b94a',
};
function patchChangeRows(c) {
  return (c.changes || [])
    .map((x) => {
      const nm = `<b>${profileEsc(x.skill || '')}</b>${x.patchName ? ` <small style="color:#8f98a8">(“${profileEsc(x.patchName)}” in the notes)</small>` : ''}${x.slot ? ` <small style="color:#8f98a8">· ${profileEsc(x.slot)}</small>` : ''}`;
      if (x.before != null) {
        const pc = Math.round(((x.after - x.before) / x.before) * 1000) / 10;
        return `<tr><td>${nm}</td><td class="num">${x.before}% → <b>${x.after}%</b></td><td class="num ${pc > 0 ? 'up' : pc < 0 ? 'down' : ''}">${pc > 0 ? '+' : ''}${pc}%</td></tr>`;
      }
      return `<tr><td>${nm}</td><td colspan="2">${colourStatusWords(x.text || '')}</td></tr>`;
    })
    .join('');
}
let activePatchBadge = '',
  activePatchHero = '';
function openPatchesFor(hero) {
  document.querySelector('.nav-item[data-page="patches"]').click();
  activePatchHero = hero || '';
  activePatchBadge = '';
  renderPatches();
  const s = $('patchHeroSelect');
  if (s) s.value = activePatchHero;
  window.scrollTo({ top: 0 });
}
function renderPatches() {
  const root = $('patchesBody');
  if (!root) return;
  const P = PATCH_NOTES || {};
  const patches = P.patches || [];
  const lb = patches.find((x) => x.version === P.latestBalance);
  let sum = '';
  if (lb) {
    const cnt = {};
    Object.values(lb.heroChanges || {}).forEach((c) => (cnt[c.direction] = (cnt[c.direction] || 0) + 1));
    sum = `<div class="patch-summary"><span>Latest balance patch: <b>${profileEsc(lb.version)}</b> · ${patchDate(lb.date)}</span>${[
      'buff',
      'nerf',
      'mixed',
      'adjusted',
      'new',
    ]
      .filter((k) => cnt[k])
      .map(
        (k) =>
          `<span class="ps-count">${patchArrow({ direction: k }, lb.version)} ${cnt[k]} ${k === 'new' ? 'new hero' : ((P.directions || {})[k] || k).toLowerCase() + (cnt[k] > 1 ? (k === 'buff' ? 's' : k === 'nerf' ? 's' : '') : '')}</span>`,
      )
      .join(
        '',
      )}<span style="color:#9aa3b2;font-size:12px;flex-basis:100%">Green ▲ buffed, red ▼ nerfed, amber mixed. The same arrows appear on the Tier List and Teams. How the ratings are worked out is explained at the bottom of this page.</span></div>`;
  }
  const heroes = HEROES.map((h) => h.name).sort();
  const controls = `<div class="patch-controls"><button class="patch-filter${!activePatchBadge ? ' active' : ''}" data-pbf="">✱ All</button>${Object.keys(
    P.badgeTypes || {},
  )
    .map(
      (k) =>
        `<button class="patch-filter${activePatchBadge === k ? ' active' : ''}" data-pbf="${k}">${patchBadge(k, false).replace('<span class="pbadge"', '<span class="pbadge" style="border:0;background:none;padding:0;--pb:' + PB_COLORS[k] + '"')} ${profileEsc(P.badgeTypes[k])}</button>`,
    )
    .join(
      '',
    )}<select id="patchHeroSelect" aria-label="Filter by hero"><option value="">All heroes</option>${heroes.map((n) => `<option${n === activePatchHero ? ' selected' : ''}>${profileEsc(n)}</option>`).join('')}</select></div>`;
  const list = patches.filter((p) => {
    if (activePatchBadge && !(p.badges || []).includes(activePatchBadge)) return false;
    if (
      activePatchHero &&
      !(
        (p.heroChanges || {})[activePatchHero] ||
        (p.highlights || []).some((h) => (h.heroes || []).includes(activePatchHero))
      )
    )
      return false;
    return true;
  });
  const entry = (p) => {
    let hl = (p.highlights || []).filter((h) => !activePatchBadge || h.badge === activePatchBadge);
    if (activePatchHero)
      hl = (p.highlights || []).filter(
        (h) => (h.heroes || []).includes(activePatchHero) && (!activePatchBadge || h.badge === activePatchBadge),
      );
    let hc = Object.entries(p.heroChanges || {});
    if (activePatchHero) hc = hc.filter(([n]) => n === activePatchHero);
    const order = { buff: 0, mixed: 1, nerf: 2, adjusted: 3, new: 4, fix: 5 };
    hc.sort(
      (a, b) =>
        order[a[1].direction] - order[b[1].direction] ||
        (b[1].impact || 0) - (a[1].impact || 0) ||
        (b[1].damagePct || 0) - (a[1].damagePct || 0),
    );
    const showHeroes =
      hc.length &&
      (!activePatchBadge ||
        activePatchBadge === 'balance' ||
        (activePatchBadge === 'fix' && hc.some(([, c]) => c.direction === 'fix')));
    const chips = hc
      .filter(([, c]) => activePatchBadge !== 'fix' || c.direction === 'fix')
      .map(([n, c]) => {
        const h = HEROES.find((x) => x.name === n) || {};
        const col = PA_COLOR[c.direction];
        return `<button type="button" class="phc" style="--pc:${col}" data-phc="${profileEsc(p.version)}|${profileEsc(n)}"><img src="${h.portrait || ''}" alt=""><div><div class="phc-name">${profileEsc(n)}</div><div class="phc-sub">${patchArrow(c, p.version)} ${profileEsc(patchDirLabel(c))}${c.impact && !['fix', 'new', 'adjusted'].includes(c.direction) ? ` <span class="pips">${[1, 2, 3].map((i) => `<i class="${i <= c.impact ? 'on' : ''}"></i>`).join('')}</span>` : ''}${c.damagePct != null ? ` <span class="${c.damagePct > 0 ? 'up' : c.damagePct < 0 ? 'down' : ''}">${c.damagePct > 0 ? '+' : ''}${c.damagePct}%</span>` : ''}</div></div></button>`;
      })
      .join('');
    return `<article class="patch-entry${p.balance ? ' is-balance' : ''}" id="patch-${p.version.replace(/\./g, '-')}"><div class="patch-card"><div class="patch-head"><span class="patch-version">${profileEsc(p.version)}${p.launch ? ' <small style="font-size:12px;color:#f0b94a;vertical-align:middle">LAUNCH</small>' : ''}</span><span class="patch-date">${patchDate(p.date)}</span><div class="patch-badges">${(p.badges || []).map((b) => patchBadge(b)).join('')}</div><div class="patch-title">${profileEsc(p.title)} · Steam build ${profileEsc(String(p.buildId || ''))}</div></div><div class="patch-body"><p class="patch-headline">${profileEsc(p.headline || '')}</p>${hl.length ? `<ul class="patch-hl">${hl.map((h) => `<li>${patchBadge(h.badge, false)}<div>${colourStatusWords(h.text)}</div></li>`).join('')}</ul>` : ''}${showHeroes && chips ? `<div class="patch-heroes-title">Hero changes${p.version === P.latestBalance ? ' · click a hero for the numbers' : ''}</div><div class="patch-hero-grid">${chips}</div>` : ''}<div class="patch-more">${p.fixCount ? `${p.fixCount} bug fix${p.fixCount > 1 ? 'es' : ''} in total. ` : ''}<a href="${profileEsc(p.source)}" target="_blank" rel="noopener">Full official notes</a></div></div></div></article>`;
  };
  root.innerHTML =
    sum +
    controls +
    (list.length
      ? `<div class="patch-timeline">${list.map(entry).join('')}</div>`
      : '<div class="patch-empty">No patches match these filters.</div>') +
    `<p class="profile-note">${profileEsc(P.rating || '')} ${profileEsc(P.note || '')}</p>`;
  root.querySelectorAll('[data-pbf]').forEach(
    (b) =>
      (b.onclick = () => {
        activePatchBadge = b.dataset.pbf;
        renderPatches();
      }),
  );
  $('patchHeroSelect').onchange = (e) => {
    activePatchHero = e.target.value;
    renderPatches();
  };
  root.querySelectorAll('.phc').forEach(
    (b) =>
      (b.onclick = () => {
        const grid = b.parentElement;
        const open = b.classList.contains('open');
        grid.querySelectorAll('.phd').forEach((x) => x.remove());
        grid.querySelectorAll('.phc.open').forEach((x) => x.classList.remove('open'));
        if (open) return;
        const [v, n] = b.dataset.phc.split('|');
        const c = (patches.find((x) => x.version === v).heroChanges || {})[n];
        b.classList.add('open');
        const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
        const chipsArr = [...grid.querySelectorAll('.phc')];
        const idx = chipsArr.indexOf(b);
        const after = chipsArr[Math.min(chipsArr.length - 1, Math.floor(idx / cols) * cols + cols - 1)];
        const d = document.createElement('div');
        d.className = 'phd';
        d.style.setProperty('--pc', PA_COLOR[c.direction]);
        d.innerHTML = `${c.devNote ? `<p class="phd-dev">Developer note: “${profileEsc(c.devNote)}”</p>` : ''}${c.totalBefore ? `<p style="margin:0 0 8px">Sum of all skill damage (max-level %): ${c.totalBefore}% → <b>${c.totalAfter}%</b> <span class="${c.damagePct > 0 ? 'up' : c.damagePct < 0 ? 'down' : ''}">(${c.damagePct > 0 ? '+' : ''}${c.damagePct}%)</span>${c.shiftPct ? `. The total barely changed, but ${c.shiftPct}% of it moved between skills, so some skills got much stronger and others much weaker.` : ''}</p>` : ''}${(c.changes || []).length ? `<table>${patchChangeRows(c)}</table>` : ''}<button type="button" class="phd-open">Open ${profileEsc(n)}'s page →</button>`;
        d.querySelector('.phd-open').onclick = () => openCharacterProfile(n, 'review');
        after.after(d);
      }),
  );
}
function renderProfilePatches(h) {
  const P = PATCH_NOTES || {};
  const rows = (P.patches || []).filter((p) => (p.heroChanges || {})[h.name]);
  if (!rows.length) return '';
  return (
    rows
      .map((p) => {
        const c = p.heroChanges[h.name];
        return `<div class="rv-patch"><div class="rv-patch-head">${patchArrow(c, p.version)} Patch ${profileEsc(p.version)}: ${profileEsc(patchDirLabel(c))}${c.damagePct != null ? ` <span class="${c.damagePct > 0 ? 'up' : c.damagePct < 0 ? 'down' : ''}">(skill damage ${c.damagePct > 0 ? '+' : ''}${c.damagePct}%)</span>` : ''} <small>${patchDate(p.date)}</small></div><ul>${(c.changes || []).map((x) => `<li><b>${profileEsc(x.skill || '')}</b>: ${x.before != null ? `${x.before}% → ${x.after}%` : colourStatusWords(x.text || '')}</li>`).join('') || `<li>${profileEsc(c.devNote || '')}</li>`}</ul></div>`;
      })
      .join('') +
    `<button type="button" class="phd-open" data-open-patches="${profileEsc(h.name)}">See ${profileEsc(h.name)} in Patch Notes →</button>`
  );
}

// ---- Simple pages: Familiars, Titles, Trait Dungeons ----
const PAGE_IDS = {
  home: 'homePage',
  tier: 'tierPage',
  heroes: 'heroesPage',
  teams: 'teamsPage',
  gear: 'gearPage',
  karma: 'karmaPage',
  patches: 'patchesPage',
  familiars: 'familiarsPage',
  titles: 'titlesPage',
  dungeons: 'dungeonsPage',
  trait: 'traitPage',
  currency: 'currencyPage',
  cookbook: 'cookbookPage',
  guides: 'guidesPage',
  items: 'itemsPage',
  achievements: 'achievementsPage',
  tools: 'toolsPage',
};
function navIcon(id, src) {
  const el = $(id);
  if (!el || !src) return;
  const im = new Image();
  im.onload = () => {
    el.textContent = '';
    const m = document.createElement('span');
    m.className = 'nav-mask';
    m.style.webkitMaskImage = m.style.maskImage = `url('${src}')`;
    el.append(m);
  };
  im.src = src;
}
function famAbilityHtml(name) {
  const A = ((FAMILIARS || {}).abilities || {})[name];
  if (!A) return `[${profileEsc(name)}]`;
  return `<button type="button" class="fam-abil" data-abil="${profileEsc(name)}"><img src="${profileEsc(A.icon)}" alt="">${profileEsc(name)}</button>`;
}
function famPassiveText(t) {
  return profileEsc(t).replace(/\[([^\]]+)\]/g, (m, n) => famAbilityHtml(n));
}
function famShowAbility(el) {
  const A = ((FAMILIARS || {}).abilities || {})[el.dataset.abil];
  if (!A) return;
  const tip = $('tooltip');
  tip.innerHTML = `<div class="fam-pop"><img src="${profileEsc(A.icon)}" alt=""><div class="fam-pop-name">${profileEsc(el.dataset.abil)}</div><div class="fam-pop-line"></div><p>${profileEsc(A.description)}</p><p class="fam-pop-cd">Cooldown <b>${A.cooldown.toFixed(1)}</b> seconds</p><div class="fam-pop-src">${profileEsc(A.species)} ability</div></div>`;
  tip.style.setProperty('--tier', '#536273');
  tip.style.display = 'block';
  const r = el.getBoundingClientRect();
  let left = r.left;
  if (left + tip.offsetWidth > window.innerWidth - 12) left = window.innerWidth - tip.offsetWidth - 12;
  tip.style.left = Math.max(12, left) + 'px';
  let top = r.bottom + 8;
  if (top + tip.offsetHeight > window.innerHeight - 12) top = r.top - tip.offsetHeight - 8;
  tip.style.top = Math.max(12, top) + 'px';
}
document.addEventListener('click', (e) => {
  const tip = $('tooltip');
  if (tip && tip.dataset.abil && !e.target.closest('.fam-abil')) {
    hideTip();
    tip.dataset.abil = '';
  }
});
const FAM_OBTAIN_ICONS = {
  dlc: '<path d="M1.5 2.5h2l1.6 7.2h7.3l1.6-5.2H4.3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/><circle cx="6" cy="12.8" r="1.2" fill="currentColor"/><circle cx="11.5" cy="12.8" r="1.2" fill="currentColor"/>',
  task: '<circle cx="8" cy="8" r="5.6" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="8" cy="8" r="2.4" fill="currentColor"/>',
  promotion:
    '<path d="M3 9.5l5-4 5 4M3 13l5-4 5 4M8 1.8l1.2 2.1-1.2 1.6-1.2-1.6z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>',
  quest:
    '<path d="M4 2h7.5a1.5 1.5 0 011.5 1.5V14H5a2 2 0 01-2-2V3a1 1 0 011-1zM6 5.5h5M6 8h5M6 10.5h3" stroke="currentColor" stroke-width="1.3" fill="none"/>',
  default:
    '<path d="M2.5 7h11v7h-11zM1.8 4.5h12.4V7H1.8zM8 4.5V14M8 4.5C6.5 2 3.8 2.3 4.6 4.1M8 4.5c1.5-2.5 4.2-2.2 3.4-.4" stroke="currentColor" stroke-width="1.3" fill="none"/>',
  other: '<circle cx="8" cy="8" r="2" fill="currentColor"/>',
};
function famObtainHtml(o) {
  if (!o) return '';
  const F = FAMILIARS || {};
  const svg = (k) =>
    `<svg viewBox="0 0 16 16" aria-hidden="true">${FAM_OBTAIN_ICONS[k] || FAM_OBTAIN_ICONS.other}</svg>`;
  if (o.type === 'dlc')
    return `<div class="fam-obtain fo-dlc">${svg('dlc')}<a href="${profileEsc(o.url)}" target="_blank" rel="noopener" title="Opens the Steam store page">${profileEsc(o.label)}</a><span class="fo-price">${profileEsc(o.price || '')}</span></div>`;
  if (o.type === 'currency') {
    const c = (F.currencies || {})[o.currency] || {};
    return `<div class="fam-obtain fo-currency" title="Buy with ${profileEsc(c.name || o.label)}">${c.icon ? `<img src="${profileEsc(c.icon)}" alt="${profileEsc(c.name || '')}">` : ''}<b>${Number(o.amount).toLocaleString('en-GB')}</b> <span>${profileEsc(c.name || o.label)}</span></div>`;
  }
  if (o.type === 'task')
    return `<div class="fam-obtain fo-task">${svg('task')}<span>${profileEsc(o.label)} <b>×${Number(o.count).toLocaleString('en-GB')}</b></span></div>`;
  return `<div class="fam-obtain fo-${profileEsc(o.type)}">${svg(o.type)}<span>${profileEsc(o.label)}</span></div>`;
}
function renderFamiliars() {
  const F = FAMILIARS || {};
  const list = F.list || [];
  const root = $('familiarsBody');
  const groups = F.groups || [...new Set(list.map((f) => f.group || 'Other'))];
  const card = (f) =>
    `<article class="fam-card">${f.image ? `<img src="${profileEsc(f.image)}" alt="${profileEsc(f.name)}" loading="lazy">` : ''}<div>${profileEsc(f.name)}${typeof f.obtain === 'object' ? famObtainHtml(f.obtain) : f.obtain ? `<div class="simple-meta">How to get: ${profileEsc(f.obtain)}</div>` : ''}${(f.effects || []).length ? `<ul>${f.effects.map((e) => `<li>${colourStatusWords(e)}</li>`).join('')}</ul>` : ''}</div></article>`;
  const passive = (g) => {
    const P = (F.passives || {})[g];
    if (!P || !P.length) return '';
    const owned = (F.owned || {})[g] || 0;
    return `<aside class="fam-passive"><div class="fam-passive-title">${profileEsc(g)} passive effect</div><ol>${P.map((p) => `<li class="fp-row${p.scope === 'none' ? ' fp-none' : ''}"><span class="fp-num${p.count <= owned ? ' on' : ''}" title="${p.count <= owned ? "Unlocked in David's game" : 'Collect ' + p.count + ' ' + g + ' familiar' + (p.count > 1 ? 's' : '')}"><span>${p.count}</span></span><div class="fp-text">${famPassiveText(p.text)}${p.scope === 'species' ? ` <span class="fp-scope" data-tip="Applies only to ${profileEsc(g)} familiars, not to the others.">${profileEsc(g)} only</span>` : ''}</div></li>`).join('')}</ol>${(F.passiveNotes || {})[g] ? `<div class="fam-passive-note">${profileEsc(F.passiveNotes[g])}</div>` : ''}</aside>`;
  };
  root.innerHTML = list.length
    ? groups
        .map((g) => {
          const fs = list.filter((f) => (f.group || 'Other') === g);
          return fs.length
            ? `<section class="fam-group"><h3>${profileEsc(g)} <small>${fs.length} familiar${fs.length > 1 ? 's' : ''}</small></h3><div class="fam-row"><div class="fam-grid">${fs.map(card).join('')}</div>${passive(g)}</div></section>`
            : '';
        })
        .join('')
    : `<div class="simple-empty">${profileEsc(F.empty || 'Familiars are coming soon.')}</div>`;
  if (F.passiveNote) root.insertAdjacentHTML('beforeend', `<p class="profile-note">${profileEsc(F.passiveNote)}</p>`);
  if (F.note) root.insertAdjacentHTML('beforeend', `<p class="profile-note">${profileEsc(F.note)}</p>`);
  root.querySelectorAll('.fam-abil').forEach((b) => {
    b.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'touch') famShowAbility(b);
    });
    b.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'touch') hideTip();
    });
    b.addEventListener('focus', () => famShowAbility(b));
    b.addEventListener('blur', hideTip);
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const tip = $('tooltip');
      if (tip.style.display === 'block' && tip.dataset.abil === b.dataset.abil) {
        hideTip();
        tip.dataset.abil = '';
      } else {
        famShowAbility(b);
        tip.dataset.abil = b.dataset.abil;
      }
    });
  });
}
let TITLE_FILTER = { q: '', cat: '', stat: '', owned: false };
function titleStatLabel(s) {
  return s === 'Critical Hit Chance' ? 'Critical Rate' : s;
}
function titleFmt(b) {
  const pct = (GEAR_STATS.percentStats || []).includes(b.stat);
  const v = Number(b.value);
  return `${profileEsc(titleStatLabel(b.stat))} <b>+${pct ? (v % 1 ? v.toFixed(2) : v) + '%' : v}</b>`;
}
function titleSum(list) {
  const o = {};
  list.forEach((t) =>
    (t.passive || []).forEach((b) => {
      o[b.stat] = (o[b.stat] || 0) + Number(b.value);
    }),
  );
  return o;
}
function titleSumHtml(o) {
  const keys = Object.keys(o).sort();
  return keys.length
    ? keys
        .map((k) => `<span class="tt-sum-chip">${titleFmt({ stat: k, value: Math.round(o[k] * 100) / 100 })}</span>`)
        .join('')
    : '<span class="muted">none</span>';
}
function renderTitles() {
  const T = TITLES || {};
  const list = T.list || [];
  const root = $('titlesBody');
  const F = TITLE_FILTER;
  const G = T.grades || {};
  const stats = [...new Set(list.flatMap((t) => (t.passive || []).map((b) => b.stat)))].sort();
  const shown = list.filter(
    (t) =>
      (!F.q || (t.name + ' ' + (t.achievement || '')).toLowerCase().includes(F.q)) &&
      (!F.cat || t.category === F.cat) &&
      (!F.stat || (t.passive || []).some((b) => b.stat === F.stat)) &&
      (!F.owned || selTitles().has(t.name)),
  );
  const own = selectedTitleList();
  const SEL = selTitles();
  root.innerHTML = `<div class="tt-summary"><div><div class="tt-sum-h">Your titles · ${own.length} of ${T.totalCount || list.length} ticked${own.length ? ' · <button type="button" class="tt-clear" id="ttClear">clear</button>' : ''}</div><div class="tt-sum">${titleSumHtml(titleSum(own))}</div></div><div><div class="tt-sum-h">All ${list.length} titles together</div><div class="tt-sum">${titleSumHtml(titleSum(list))}</div></div><p>Tick the titles you own (the box at the start of each row). They're saved in this browser and counted in every hero's end-game stats, and the recommended gear adjusts to them, e.g. when titles push Crit Rate towards 100%. Every owned title adds its passive to <b>all heroes</b>; flat bonuses are added before % bonuses multiply.</p></div>
 <div class="tt-controls"><input type="search" id="ttSearch" placeholder="Search titles or achievements…" value="${profileEsc(F.q)}" autocomplete="off"><select id="ttCat"><option value="">All categories</option>${(T.categories || []).map((c) => `<option${F.cat === c ? ' selected' : ''}>${profileEsc(c)}</option>`).join('')}</select><select id="ttStat"><option value="">All bonuses</option>${stats.map((s) => `<option value="${profileEsc(s)}"${F.stat === s ? ' selected' : ''}>${profileEsc(titleStatLabel(s))}</option>`).join('')}</select><label class="tt-own"><input type="checkbox" id="ttOwned" style="width:auto"${F.owned ? ' checked' : ''}> Ticked only</label><span class="muted">${shown.length} shown</span></div>
 <div class="simple-table-wrap"><table class="simple-table tt-table"><thead><tr><th></th><th>Title</th><th>Passive</th><th>How to get</th></tr></thead><tbody>${shown.map((t) => `<tr class="${SEL.has(t.name) ? 'tt-owned' : ''}"><td class="tt-tick"><button type="button" class="tt-box${SEL.has(t.name) ? ' on' : ''}" data-title="${profileEsc(t.name)}" aria-pressed="${SEL.has(t.name)}" title="${SEL.has(t.name) ? 'Untick' : 'Tick if you own it'}">${SEL.has(t.name) ? '✓' : ''}</button></td><td><b style="color:${(G[t.grade] || {}).color || '#e5e7eb'}">${profileEsc(t.name)}</b></td><td>${(t.passive || []).map(titleFmt).join('<br>') || '<span class="muted">Not checked yet</span>'}</td><td>${t.category ? `<span class="tt-cat" data-c="${profileEsc(t.category)}">${profileEsc(t.category)}</span> ` : ''}${t.achievement ? profileEsc(t.achievement) + (t.category && t.category !== 'Promotion' ? ' <span class="muted">achievement</span>' : '') : '<span class="muted">Hidden in-game once obtained</span>'}${t.inferred ? ' <span class="muted" title="The game hides it once obtained; inferred from the other promotion titles">(inferred)</span>' : ''}</td></tr>`).join('') || '<tr><td colspan="4" class="muted">No titles match.</td></tr>'}</tbody></table></div>
 <p class="profile-note">${profileEsc(T.note || '')}</p>`;
  const s = $('ttSearch');
  s.oninput = () => {
    F.q = s.value.trim().toLowerCase();
    const p = s.selectionStart;
    renderTitles();
    const n = $('ttSearch');
    n.focus();
    n.setSelectionRange(p, p);
  };
  root.querySelectorAll('.tt-box').forEach(
    (b) =>
      (b.onclick = () => {
        const S = selTitles(),
          n = b.dataset.title;
        S.has(n) ? S.delete(n) : S.add(n);
        saveTitles();
        renderTitles();
      }),
  );
  const cl = $('ttClear');
  if (cl)
    cl.onclick = () => {
      selTitles().clear();
      saveTitles();
      renderTitles();
    };
  $('ttCat').onchange = (e) => {
    F.cat = e.target.value;
    renderTitles();
  };
  $('ttStat').onchange = (e) => {
    F.stat = e.target.value;
    renderTitles();
  };
  $('ttOwned').onchange = (e) => {
    F.owned = e.target.checked;
    renderTitles();
  };
}

// Normal and Currency Dungeons are preview-only; all content is read from data.json.
const DNG = { q: '', set: '', slot: '', farm: '', orange: false, selected: {}, hashLoaded: false };
const CURRENCY_DNG_STATE = { selected: {} };
