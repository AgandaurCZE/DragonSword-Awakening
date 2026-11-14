/* js/02-teams-karma.js: Teams page (TEAM_DATA) and Karma page (KARMA_DATA). Part of the site script, split out of index.html on 10 Nov 2026.
   The files load in order (see index.html) and share one global scope, so code that runs at load time may only use what earlier files define. */
// ==== Teams page (TEAM_DATA) ====
/* Teams page (David, 13 Nov 2026): the old teams are no longer listed here; new ones are coming. The tier rows stay, empty, and a
   toggle at the top switches to the end-game speed-run teams (also empty for now). TEAM_DATA itself stays in data.json: the hero
   pages (Synergy) and the gear tools still read it. To list teams again, fill `shown` below. */
const TEAMS_VIEW = { speed: false };
function renderTeams() {
  const board = document.getElementById('teamBoard');
  if (!board) return;
  board.innerHTML = '';
  const controls = document.getElementById('teamsControls');
  if (controls) {
    controls.innerHTML = `<button type="button" class="heroes-filter-btn v2-tagall${TEAMS_VIEW.speed ? ' active' : ''}" id="teamsSpeed" aria-pressed="${TEAMS_VIEW.speed}">End-game speed runs</button>`;
    document.getElementById('teamsSpeed').onclick = () => {
      TEAMS_VIEW.speed = !TEAMS_VIEW.speed;
      renderTeams();
    };
  }
  const shown = [];
  const tiers = ['S', 'A', 'B', 'C'];
  const colors = { S: '#f05258', A: '#ff9d48', B: '#69c9e8', C: '#8b86ef' };
  const heroMap = new Map(HEROES.map((h) => [h.name.toLowerCase(), h]));
  const portrait = (name) => heroMap.get(name.toLowerCase())?.portrait || '';
  // Darken the sampled archetype color slightly so its icon remains distinct against the team title.
  const teamArchColor = (arch) => {
    const hex = ARCH_COLORS[arch];
    if (!hex) return '#555b68';
    const n = parseInt(hex.slice(1), 16),
      r = (n >> 16) & 255,
      g = (n >> 8) & 255,
      b = n & 255;
    const shade = (v) =>
      Math.round(v * 0.78)
        .toString(16)
        .padStart(2, '0');
    return '#' + shade(r) + shade(g) + shade(b);
  };
  for (const tier of tiers) {
    const items = shown.filter((t) => t.tier === tier);
    const group = document.createElement('section');
    group.className = 'team-tier-group';
    const label = document.createElement('div');
    label.className = 'team-tier-label';
    label.style.background = colors[tier];
    label.textContent = tier;
    label.setAttribute('aria-label', tier + ' tier');
    group.append(label);
    const grid = document.createElement('div');
    grid.className = 'team-grid';
    for (const team of items) {
      const card = document.createElement('article');
      card.className = 'team-card';
      card.dataset.teamName = team.name;
      card.style.setProperty('--team-accent', teamArchColor(team.arch));
      const title = document.createElement('div');
      title.className = 'team-title';
      const archHero = HEROES.find((h) => h.archetype === team.arch && h.archIcon);
      if (archHero) {
        const crop = document.createElement('span');
        crop.className = 'team-arch-crop';
        crop.setAttribute('aria-label', team.arch + ' archetype icon');
        const archImg = document.createElement('img');
        archImg.src = archHero.archIcon;
        archImg.alt = '';
        archImg.draggable = false;
        crop.append(archImg);
        title.append(crop);
      }
      const titleText = document.createElement('span');
      titleText.textContent = team.name;
      title.append(titleText);
      card.append(title);
      const body = document.createElement('div');
      body.className = 'team-body';
      const lead = document.createElement('div');
      lead.className = 'team-lead';
      const leadImg = document.createElement('img');
      leadImg.alt = team.lead;
      leadImg.src = portrait(team.lead);
      leadImg.loading = 'lazy';
      leadImg.classList.add('team-character-link');
      leadImg.tabIndex = 0;
      leadImg.title = 'View ' + team.lead + ' in Heroes';
      wireTeamCharacter(leadImg, team.lead);
      lead.append(leadImg);
      const leadName = document.createElement('div');
      leadName.className = 'team-lead-name';
      leadName.textContent = team.lead;
      leadName.insertAdjacentHTML('beforeend', latestArrow(team.lead));
      lead.append(leadName);
      body.append(lead);
      const members = document.createElement('div');
      members.className = 'team-members';
      for (const slot of team.members) {
        const box = document.createElement('div');
        box.className = 'team-slot';
        const pics = document.createElement('div');
        pics.className = 'team-slot-images';
        const names = [slot.name, ...(slot.alts || [])];
        if (names.length > 2) pics.classList.add('many');
        names.forEach((name, i) => {
          if (i > 0) {
            const sep = document.createElement('span');
            sep.className = 'swap-divider';
            sep.textContent = '/';
            pics.append(sep);
          }
          const im = document.createElement('img');
          im.src = portrait(name);
          im.alt = name;
          im.title = 'View ' + name + ' in Heroes';
          im.loading = 'lazy';
          im.classList.add('team-character-link');
          im.tabIndex = 0;
          if (names.length === 1) im.classList.add('single');
          wireTeamCharacter(im, name);
          pics.append(im);
        });
        box.append(pics);
        const nm = document.createElement('div');
        nm.className = 'team-slot-name';
        nm.textContent = slot.name;
        nm.insertAdjacentHTML('beforeend', latestArrow(slot.name));
        box.append(nm);
        if (slot.alts?.length) {
          const alt = document.createElement('div');
          alt.className = 'team-slot-alt';
          alt.textContent = 'Alt: ' + slot.alts.join(' / ');
          box.append(alt);
        }
        members.append(box);
      }
      body.append(members);
      card.append(body);
      const notes = document.createElement('div');
      notes.className = 'team-notes';
      const tags = document.createElement('div');
      tags.className = 'team-tags';
      team.tags.forEach((t) => {
        const x = document.createElement('span');
        x.className = 'team-tag';
        x.innerHTML = formatTeamSkillText(t, team);
        tags.append(x);
      });
      notes.append(tags);
      const note = document.createElement('div');
      note.innerHTML = '<strong>Team fit:</strong> ' + formatTeamSkillText(team.note, team);
      notes.append(note);
      card.append(notes);
      grid.append(card);
    }
    group.append(grid);
    board.append(group);
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
    const heroLink = document.createElement('button');
    heroLink.type = 'button';
    heroLink.className = 'karma-signature-link';
    heroLink.textContent = k.signature;
    heroLink.title = `Open ${k.signature}'s Build and Teams`;
    heroLink.addEventListener('click', () => openCharacterProfile(k.signature, 'build'));
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
  const profile = CHARACTER_PROFILE_DATA[heroName];
  if (!profile) return;
  const norm = (s) =>
    String(s || '')
      .trim()
      .toLowerCase();
  const skill = (profile.skills || []).find(
    (sk) =>
      norm(
        String(sk.skill || '')
          .replace(/\s*\(Lv\.?\s*\d+\).*$/i, '')
          .split(/\s*\(/)[0],
      ) === norm(skillName),
  );
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
  const card = document.createElement('article');
  card.className = 'profile-skill';
  const head = document.createElement('div');
  head.className = 'profile-skill-head';
  const slot = document.createElement('span');
  slot.className = 'profile-skill-slot';
  slot.textContent = skill.slot || 'Skill';
  const title = document.createElement('h4');
  title.textContent = skill.skill || skillName;
  head.append(slot, title);
  const body = document.createElement('div');
  body.className = 'profile-skill-body';
  body.innerHTML = formatSkillText(skill.description || '');
  card.append(head, body);
  const maxMatch = String(skill.skill || '').match(/Lv\.?\s*(\d+)/i),
    maxLevel = maxMatch ? Math.max(1, parseInt(maxMatch[1], 10)) : 1;
  if (maxLevel > 1 && !/mastery\s*\(passive\)/i.test(skill.slot || '')) {
    const controls = document.createElement('div');
    controls.className = 'profile-skill-controls';
    const label = document.createElement('label');
    label.textContent = 'Skill level';
    const range = document.createElement('input');
    range.type = 'range';
    range.min = '1';
    range.max = String(maxLevel);
    range.value = String(maxLevel);
    range.setAttribute('aria-label', skill.skill + ' level');
    const level = document.createElement('span');
    level.className = 'profile-skill-level';
    level.textContent = 'Lv. ' + maxLevel;
    const original = skill.description || '';
    range.addEventListener('input', () => {
      const lv = Number(range.value),
        sf = skillLevelFactor(lv, maxLevel),
        factor = sf.factor;
      level.textContent = sf.est ? 'Lv. ' + lv + ' (est.)' : 'Lv. ' + lv;
      body.innerHTML = formatSkillText(
        original.replace(
          /(Attack Power )(\d+(?:\.\d+)?)(% Damage)/g,
          (m, a, num, c) => a + skillLevelValue(num, factor) + c,
        ),
      );
    });
    controls.append(label, range, level);
    card.append(controls);
  }
  pop.append(card);
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
  if (link) showSkillRef(link);
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
document.addEventListener('focusout', (e) => {
  if (e.target.closest?.('.karma-skill-link')) hideKarmaSkillPopover();
});
document.addEventListener('click', (e) => {
  const link = e.target.closest?.('.karma-skill-link');
  if (!link) return;
  e.preventDefault();
  if (IS_TOUCH) {
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
