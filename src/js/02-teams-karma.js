/* js/02-teams-karma.js: Teams page (TEAM_DATA) and Karma page (KARMA_DATA). Part of the site script, split out of index.html on 10 Nov 2026.
   The files load in order (see index.html) and share one global scope, so code that runs at load time may only use what earlier files define. */
// ==== Teams page (TEAM_DATA and TEAM_SPEED_RUNS) ====
const TEAMS_VIEW = { speed: false };

function teamPortrait(hero, small = false, showRole = true) {
  const role = v2Role(hero);
  const portrait = document.createElement('a');
  portrait.className = 'team-portrait team-character-link' + (small ? ' team-portrait-alt' : '');
  portrait.setAttribute('aria-label', hero.name + ' · Build and Teams');
  portrait.innerHTML = `<img src="${profileEsc(hero.portrait)}" alt="" loading="lazy"><span class="team-portrait-name">${profileEsc(hero.name)}${showRole ? latestArrow(hero.name) : ''}</span>`;
  if (showRole) {
    const label = document.createElement('span');
    label.className = 'team-role';
    label.textContent = role;
    portrait.prepend(label);
  }
  wireTeamCharacter(portrait, hero);
  return portrait;
}

function teamCard(team, heroes) {
  const card = document.createElement('article');
  card.className = 'team-card';
  card.dataset.teamName = team.name;
  card.style.setProperty('--team-accent', ARCH_COLORS[team.arch] || team.accent);
  const archIcon = HEROES.find((hero) => hero.archetype === team.arch)?.archIcon;
  card.innerHTML = `<h3 class="team-title">${archIcon ? `<span class="team-arch-crop"><img src="${profileEsc(archIcon)}" alt=""></span>` : ''}<span>${profileEsc(team.name)} <small>${profileEsc(team.arch)}</small></span></h3><div class="team-body"><div class="team-lead"></div><div class="team-members"></div></div><p class="team-notes">${formatTeamSkillText(team.note, team)}</p>`;
  const face = teamPortrait(heroes.get(team.lead), false, false);
  face.classList.add('team-face');
  face.querySelector('.team-portrait-name').remove();
  card.querySelector('.team-lead').append(face);
  const members = card.querySelector('.team-members');
  for (const slot of team.members) {
    const section = document.createElement('div');
    section.className = 'team-slot';
    if (slot.name === null) {
      section.innerHTML = '<span class="team-flex-icon" aria-hidden="true">+</span><strong>Flex</strong>';
    } else {
      section.append(teamPortrait(heroes.get(slot.name)));
      for (const name of slot.alts || []) {
        const slash = document.createElement('span');
        slash.className = 'swap-divider';
        slash.textContent = '/';
        section.append(slash, teamPortrait(heroes.get(name), true));
      }
    }
    members.append(section);
  }
  return card;
}

function renderTeams() {
  const board = $('teamBoard');
  const button = $('teamsSpeed');
  const speed = TEAMS_VIEW.speed;
  button.setAttribute('aria-pressed', String(speed));
  button.classList.toggle('active', speed);
  button.onclick = () => {
    TEAMS_VIEW.speed = !speed;
    renderTeams();
  };
  $('teamsHeading').textContent = speed ? 'Ursula speed runs' : 'Team Tier List';
  $('teamsIntroText').textContent = speed
    ? 'Ursula reaches phase two faster than Gauron and offers better end-game rewards.'
    : 'Same-archetype teams become more valuable as you progress into the end game.';
  $('teamsFootnote').textContent = speed
    ? 'Other well-invested teams can also clear quickly if you know the boss and your rotation.'
    : '';
  board.replaceChildren();
  const heroes = new Map(HEROES.map((hero) => [hero.name, hero]));
  const groups = speed
    ? TEAM_SPEED_RUNS.map((group, index) => ({
        ...group,
        color: index === 0 ? TIER_LIST_V2.tierColors['S+'] : TIER_COLORS.S,
      }))
    : ['S', 'A', 'B'].map((tier) => ({
        label: tier,
        color: { S: '#f05258', A: '#ff9d48', B: '#69c9e8' }[tier],
        teams: TEAM_DATA.filter((team) => team.tier === tier),
      }));
  for (const group of groups) {
    const section = document.createElement('section');
    section.className = 'team-tier-group' + (speed ? ' team-speed-group' : '');
    const heading = document.createElement('h3');
    heading.className = 'team-tier-label';
    heading.style.backgroundColor = group.color;
    heading.textContent = group.label;
    if (!speed) heading.setAttribute('aria-label', group.label + ' tier');
    section.append(heading);
    const grid = document.createElement('div');
    grid.className = 'team-grid';
    for (const team of group.teams) {
      if (speed) {
        const lineup = document.createElement('article');
        lineup.className = 'team-run';
        lineup.append(...team.map((name) => teamPortrait(heroes.get(name), false, false)));
        grid.append(lineup);
      } else {
        grid.append(teamCard(team, heroes));
      }
    }
    section.append(grid);
    board.append(section);
  }
}

let activeKarmaArch = '';
// Ascension 0..6: even steps between the two recorded values (a0 = Lv.1 pre-Ascension, a6 = Lv.70 Ascension 6).
// Karma trait per Ascension = A0 x multiplier (KARMA_ASCENSION in data.json); any null multiplier is filled evenly and flagged est.
// ==== Karma page (KARMA_DATA) ====
function karmaLevels(t) {
  const pct = /%$/.test(String(t.a0));
  const a = parseFloat(t.a0);
  const R = KARMA_ASCENSION.rounding || { percent: 1, flat: 5 };
  const f = fillSteps(KARMA_ASCENSION.multipliers || [1, null, null, null, null, null, 5]);
  const unit = pct ? R.percent || 1 : R.flat || 5;
  const fmt = (n) => String(Math.round(n / unit) * unit) + (pct ? '%' : '');
  return { levels: f.values.map((m, i) => (i === 0 ? String(t.a0) : i === 6 ? String(t.a6) : fmt(a * m))), est: f.est };
}
function renderKarmaFilters() {
  const root = document.getElementById('karmaArchFilters');
  if (!root) return;
  root.innerHTML = '';
  const all = document.createElement('button');
  all.className = 'karma-arch-btn' + (!activeKarmaArch ? ' active' : '');
  all.textContent = '✱';
  all.title = 'All archetypes';
  all.setAttribute('aria-label', 'All archetypes');
  all.onclick = () => {
    activeKarmaArch = '';
    renderKarmaFilters();
    renderKarmas();
  };
  root.append(all);
  ARCHES.forEach((a) => {
    const hero = HEROES.find((h) => h.archetype === a);
    const b = document.createElement('button');
    b.className = 'karma-arch-btn' + (activeKarmaArch === a ? ' active' : '');
    b.title = a;
    b.setAttribute('aria-label', a);
    if (hero?.archIcon) b.innerHTML = `<img src="${hero.archIcon}" alt="">`;
    else b.textContent = a.slice(0, 1);
    b.onclick = () => {
      activeKarmaArch = activeKarmaArch === a ? '' : a;
      renderKarmaFilters();
      renderKarmas();
    };
    root.append(b);
  });
}
const KARMA_ACCENTS = {
  Venom: '#39b9e8',
  Amplitude: '#d88bff',
  Crushing: '#ff9e49',
  Gale: '#5ed4c8',
  Bloodburst: '#ef6480',
  Blazeflame: '#ff9d48',
  Frostbite: '#69c9e8',
  Thunderbolt: '#f3d35b',
  Breaker: '#9b8cff',
};
// One Karma card, built from KARMA_DATA. Used by the Karma tab and by the hover popover on character pages.
function buildKarmaCard(k) {
  const esc = profileEsc;
  const card = document.createElement('article');
  card.className = 'karma-card';
  card.dataset.karmaName = k.name;
  const kh = document.createElement('div');
  kh.className = 'karma-card-head';
  const mark = document.createElement('div');
  mark.className = 'karma-card-mark';
  mark.textContent = k.signature ? '✦' : '◇';
  mark.title = k.signature ? 'Signature Karma' : 'Generic Karma';
  if (k.image) {
    mark.classList.add('karma-card-art');
    mark.innerHTML = `<img src="${esc(k.image)}" alt="" loading="lazy">${k.signature ? '<span class="karma-art-star">✦</span>' : ''}`;
  }
  kh.append(mark);
  const info = document.createElement('div');
  info.style.minWidth = '0';
  info.style.flex = '1';
  const titleRow = document.createElement('div');
  titleRow.className = 'karma-card-title-row';
  const name = document.createElement('h4');
  name.className = 'karma-card-title';
  name.textContent = k.name;
  titleRow.append(name);
  const select = document.createElement('select');
  select.className = 'karma-awakening-select';
  select.setAttribute('aria-label', `Ascension level for ${k.name}`);
  select.title = 'Ascension level';
  for (let a = 0; a <= 6; a++) {
    const opt = document.createElement('option');
    opt.value = String(a);
    opt.textContent = 'A' + a;
    select.append(opt);
  }
  titleRow.append(select);
  info.append(titleRow);
  const meta = document.createElement('div');
  meta.className = 'karma-card-meta';
  const kind = document.createElement('span');
  kind.className = 'karma-kind' + (!k.signature ? ' generic' : '');
  if (k.signature) {
    kind.append(document.createTextNode('Signature · '));
    const heroLink = document.createElement('a');
    heroLink.href = heroLinkUrl(k.signature, 'build');
    heroLink.className = 'karma-signature-link';
    heroLink.textContent = k.signature;
    heroLink.title = `Open ${k.signature}'s Build and Teams`;
    heroLink.addEventListener('click', (event) => {
      if (!isPlainLinkClick(event)) return;
      event.preventDefault();
      navNavigate({ page: 'hero', hero: k.signature, tab: 'build' });
    });
    kind.append(heroLink);
  } else kind.textContent = 'Generic Karma';
  meta.append(kind);
  const src = document.createElement('span');
  src.className = 'karma-source';
  src.textContent = 'Source: ' + k.source;
  meta.append(src);
  info.append(meta);
  kh.append(info);
  card.append(kh);
  const effect = document.createElement('div');
  effect.className = 'karma-effect';
  if (k.traits && k.traits.length) {
    const traitTitle = document.createElement('div');
    traitTitle.className = 'karma-trait-title';
    traitTitle.textContent = 'Karma trait';
    effect.append(traitTitle);
    for (const t of k.traits) {
      const line = document.createElement('div');
      line.className = 'karma-trait-line';
      const label = document.createElement('span');
      label.textContent = t.label;
      line.append(label);
      const value = document.createElement('b');
      value.className = 'karma-trait-value';
      const lv = karmaLevels(t);
      value.dataset.traitLevels = JSON.stringify(lv.levels);
      value.dataset.traitEst = JSON.stringify(lv.est);
      value.textContent = lv.levels[0];
      const step = document.createElement('small');
      step.className = 'karma-trait-step';
      step.textContent = '';
      const right = document.createElement('span');
      right.className = 'karma-trait-right';
      right.append(step, value);
      line.append(right);
      effect.append(line);
    }
  }
  if (k.exclusive) {
    const ex = document.createElement('div');
    ex.className = 'karma-exclusive';
    ex.innerHTML = '<strong>Signature exclusive effect</strong><div>' + formatKarmaExclusive(k) + '</div>';
    effect.append(ex);
  }
  card.append(effect);
  const stats = document.createElement('div');
  stats.className = 'karma-stats';
  const statHeading = document.createElement('div');
  statHeading.className = 'karma-stat-heading';
  statHeading.textContent = 'Base stats · Lv. 70 / Ascension 6';
  stats.append(statHeading);
  for (const [label, value] of Object.entries(k.base || {})) {
    const st = document.createElement('div');
    st.className = 'karma-stat';
    st.dataset.karmaStat = label;
    st.innerHTML = esc(label) + ': <b>' + esc(value) + '</b>';
    stats.append(st);
  }
  card.append(stats);
  select.addEventListener('change', () => {
    const level = Number(select.value);
    card.querySelectorAll('[data-trait-levels]').forEach((node) => {
      try {
        const levels = JSON.parse(node.dataset.traitLevels || '[]'),
          est = JSON.parse(node.dataset.traitEst || '[]');
        node.textContent = levels[level] ?? levels[0] ?? '';
        const s = node.parentNode && node.parentNode.querySelector('.karma-trait-step');
        if (s) s.textContent = est[level] ? 'est.' : '';
      } catch {}
    });
  });
  return card;
}
// Link skill names mentioned by a signature effect to the exact skill data for that hero.
function formatKarmaExclusive(k) {
  const raw = String(k.exclusive || '');
  const profile = CHARACTER_PROFILE_DATA[k.signature];
  const skills = (profile?.skills || [])
    .map((sk) => {
      const full = String(sk.skill || '')
        .replace(/\s*\(Lv\.?\s*\d+\).*$/i, '')
        .trim();
      const name = full.split(/\s*\(/)[0].trim();
      return name ? { ...sk, displayName: name } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.displayName.length - a.displayName.length);
  const aliases = [];
  if (k.signature === 'Dana') aliases.push({ phrase: 'Chako is summoned', skillName: 'Summon Chako' });
  if (k.signature === 'Eileen') aliases.push({ phrase: 'Banner Maid', skillName: 'Vanguard Banner' });
  const matches = [];
  let text = raw;
  for (const alias of aliases) {
    const sk = skills.find((x) => x.displayName.toLowerCase() === alias.skillName.toLowerCase());
    if (!sk) continue;
    const at = text.toLowerCase().indexOf(alias.phrase.toLowerCase());
    if (at < 0) continue;
    const token = 'KARMASKILLTOKEN' + matches.length + 'X';
    matches.push({ token, skill: sk, matched: text.slice(at, at + alias.phrase.length) });
    text = text.slice(0, at) + token + text.slice(at + alias.phrase.length);
  }
  for (const sk of skills) {
    const lower = text.toLowerCase(),
      needle = sk.displayName.toLowerCase();
    let at = lower.indexOf(needle);
    while (at >= 0) {
      const before = text[at - 1] || '',
        after = text[at + needle.length] || '';
      if (!/[a-z0-9]/i.test(before) && !/[a-z0-9]/i.test(after)) break;
      at = lower.indexOf(needle, at + 1);
    }
    if (at >= 0) {
      const token = 'KARMASKILLTOKEN' + matches.length + 'X';
      matches.push({ token, skill: sk, matched: text.slice(at, at + needle.length) });
      text = text.slice(0, at) + token + text.slice(at + needle.length);
    }
  }
  let html = formatSkillText(text);
  for (const m of matches) {
    const link =
      '<button type="button" class="karma-skill-link" data-karma-skill="' +
      profileEsc(m.skill.displayName) +
      '" data-karma-hero="' +
      profileEsc(k.signature) +
      '" aria-label="View ' +
      profileEsc(k.signature) +
      ' skill ' +
      profileEsc(m.skill.displayName) +
      '" title="Hover to preview skill; click to open Skills">' +
      profileEsc(m.matched) +
      '</button>';
    html = html.replace(m.token, link);
  }
  return html;
}
function showKarmaSkillPopover(anchor, heroName, skillName) {
  const skill = findSkill(heroName, skillName);
  if (!skill) return;
  let pop = document.getElementById('karmaSkillPopover');
  if (!pop) {
    pop = document.createElement('div');
    pop.id = 'karmaSkillPopover';
    pop.className = 'karma-skill-popover';
    pop.hidden = true;
    document.body.append(pop);
    pop.addEventListener('mouseenter', () => clearTimeout(karmaSkillHideTimer));
    pop.addEventListener('mouseleave', () => hideKarmaSkillPopover());
  }
  pop.innerHTML = '';
  {
    const hh = HEROES.find((x) => x.name === heroName);
    pop.style.setProperty('--hero-accent', (hh && ARCH_COLORS[hh.archetype]) || '#68c7d5');
  }
  pop.append(buildProfileSkillCard(skill));
  pop.hidden = false;
  const r = anchor.getBoundingClientRect(),
    w = pop.offsetWidth,
    h = pop.offsetHeight;
  let left = r.left,
    top = r.bottom + 8;
  if (left + w > window.innerWidth - 12) left = window.innerWidth - w - 12;
  if (top + h > window.innerHeight - 12) top = r.top - h - 8;
  pop.style.left = Math.max(12, left) + 'px';
  pop.style.top = Math.max(12, top) + 'px';
}
let karmaSkillHideTimer = null;
function hideKarmaSkillPopover(delay = 180) {
  clearTimeout(karmaSkillHideTimer);
  karmaSkillHideTimer = setTimeout(() => {
    const pop = document.getElementById('karmaSkillPopover');
    if (pop) pop.hidden = true;
  }, delay);
}
const IS_TOUCH = window.matchMedia && window.matchMedia('(hover: none)').matches;
document.addEventListener('pointerover', (e) => {
  if (e.pointerType === 'touch') return;
  const link = e.target.closest?.('.karma-skill-link, .ref-skill');
  if (link && !link.contains(e.relatedTarget)) showSkillRef(link);
});
document.addEventListener('pointerout', (e) => {
  if (e.pointerType === 'touch') return;
  const link = e.target.closest?.('.karma-skill-link, .ref-skill');
  if (
    link &&
    !link.contains(e.relatedTarget) &&
    !document.getElementById('karmaSkillPopover')?.contains(e.relatedTarget)
  )
    hideKarmaSkillPopover();
});
document.addEventListener('focusin', (e) => {
  const link = e.target.closest('.team-skill-link');
  if (link?.matches(':focus-visible')) showSkillRef(link);
});
document.addEventListener('focusout', (e) => {
  if (
    e.target.closest?.('.karma-skill-link') &&
    !document.getElementById('karmaSkillPopover')?.contains(e.relatedTarget)
  )
    hideKarmaSkillPopover();
});
document.addEventListener('click', (e) => {
  const link = e.target.closest?.('.karma-skill-link');
  if (!link || (link.matches('a') && !isPlainLinkClick(e))) return;
  e.preventDefault();
  if (IS_TOUCH && !link.classList.contains('team-skill-link')) {
    showSkillRef(link, true);
    return;
  }
  hideKarmaSkillPopover(0);
  navigateRef('skill', link.dataset.karmaHero + '/' + link.dataset.karmaSkill);
});
document.addEventListener('pointerdown', (e) => {
  const pop = document.getElementById('karmaSkillPopover');
  if (pop && !pop.hidden && !pop.contains(e.target) && !e.target.closest('.karma-skill-link, .ref-skill'))
    hideKarmaSkillPopover(0);
});
function renderKarmas() {
  const board = document.getElementById('karmaBoard');
  if (!board) return;
  const query = (document.getElementById('karmaSearch')?.value || '').trim().toLowerCase();
  const found = KARMA_DATA.filter(
    (k) =>
      (!activeKarmaArch || k.archetype === activeKarmaArch) &&
      (!query ||
        [k.name, k.archetype, k.signature || '', k.source, k.exclusive || '', ...(k.traits || []).map((t) => t.label)]
          .join(' ')
          .toLowerCase()
          .includes(query)),
  );
  document.getElementById('karmaResultCount').textContent = `Showing ${found.length} of ${KARMA_DATA.length} Karmas`;
  board.innerHTML = '';
  const colors = KARMA_ACCENTS;
  const archOrder = [
    'Venom',
    'Blazeflame',
    'Frostbite',
    'Thunderbolt',
    'Breaker',
    'Bloodburst',
    'Gale',
    'Crushing',
    'Amplitude',
  ];
  for (const arch of archOrder) {
    const items = found.filter((k) => k.archetype === arch);
    if (!items.length) continue;
    const section = document.createElement('section');
    section.className = 'karma-arch-section';
    section.style.setProperty('--karma-accent', colors[arch] || '#39b9e8');
    const head = document.createElement('div');
    head.className = 'karma-arch-heading';
    const hero = HEROES.find((h) => h.archetype === arch);
    if (hero?.archIcon) {
      const img = document.createElement('img');
      img.src = hero.archIcon;
      img.alt = arch;
      head.append(img);
    }
    const title = document.createElement('h3');
    title.textContent = arch;
    head.append(title);
    const count = document.createElement('span');
    count.textContent = `${items.length} Karmas`;
    head.append(count);
    section.append(head);
    const grid = document.createElement('div');
    grid.className = 'karma-grid';
    for (const k of items) {
      grid.append(buildKarmaCard(k));
    }
    section.append(grid);
    board.append(section);
  }
  if (!found.length)
    board.innerHTML = '<div class="karma-empty">No Karmas match your search or archetype filter.</div>';
  karmaLevelInit();
}
// Skill text: damage values bold, status effects bold in their archetype colour, Activation Conditions in red.

/* Base stats at another Karma level (Claude, 11 Nov 2026; every level since 13 Nov). Only measured values are shown: every card
   shows its stat type's table from KARMA_LEVELLING.measured (Balanced, Attack, Defense, High Attack), which holds every level
   from 1 to 70 and the values before and after each breakthrough (David, 13 Nov). A level missing from a table shows a dash. */
let KARMA_LV = 'Lv70';
function karmaLevelTables() {
  return (KARMA_LEVELLING || {}).measured || {};
}
const karmaLvLabel = (k) =>
  k
    .replace(/^Lv(\d+)/, 'Lv. $1')
    .replace(' before breakthrough', ', before breakthrough')
    .replace(' after breakthrough', ', after breakthrough');
function karmaLevelInit() {
  const T = karmaLevelTables(),
    keys = (T.Balanced && Object.keys(T.Balanced)) || ['Lv1', 'Lv70'],
    ctl = document.querySelector('#karmaPage .karma-controls');
  if (ctl && !document.getElementById('karmaLevel')) {
    const w = document.createElement('label');
    w.className = 'karma-level-pick';
    w.innerHTML =
      '<span>Base stats at</span><select id="karmaLevel">' +
      keys
        .map(
          (k) =>
            `<option value="${profileEsc(k)}"${k === KARMA_LV ? ' selected' : ''}>${profileEsc(karmaLvLabel(k))}</option>`,
        )
        .join('') +
      '</select>';
    ctl.append(w);
    w.querySelector('select').addEventListener('change', (e) => {
      KARMA_LV = e.target.value;
      karmaLevelApply();
    });
  }
  karmaLevelApply();
}
function karmaLevelApply() {
  const T = karmaLevelTables(),
    order = (KARMA_LEVELLING || {}).order || ['Attack', 'Defense', 'Max HP'],
    lv = KARMA_LV;
  document.querySelectorAll('#karmaBoard .karma-card').forEach((card) => {
    const k = KARMA_DATA.find((x) => x.name === card.dataset.karmaName);
    if (!k) return;
    const h = card.querySelector('.karma-stat-heading');
    if (h) h.textContent = 'Base stats · ' + karmaLvLabel(lv) + (lv === 'Lv70' ? ' / Ascension 6' : '');
    const row =
      lv === 'Lv70' ? null : lv === 'Lv1' ? order.map((s) => (k.baseLv1 || {})[s]) : (T[k.statType] || {})[lv];
    card.querySelectorAll('[data-karma-stat]').forEach((st) => {
      const s = st.dataset.karmaStat,
        i = order.indexOf(s),
        v = lv === 'Lv70' ? (k.base || {})[s] : row && i >= 0 ? row[i] : null;
      st.innerHTML =
        profileEsc(s) +
        ': <b>' +
        (v == null ? '<span class="karma-unmeasured">—</span>' : profileEsc(String(v))) +
        '</b>';
    });
  });
}
