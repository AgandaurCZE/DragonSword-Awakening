/* js/03-profile.js: Shared text helpers (formatSkillText, profileEsc) and the hero profile page. Part of the site script, split out of index.html on 10 Nov 2026.
   The files load in order (see index.html) and share one global scope, so code that runs at load time may only use what earlier files define. */
// ==== Shared text helpers: skill text, numbers, escaping ====
function formatSkillText(text) {
  const S = STATUS_ARCHETYPE || {};
  const names =
    [...new Set([...Object.keys(S), ...(ARCHES || [])])].sort((a, b) => b.length - a.length).join('|') || '(?!)';
  const re = new RegExp(
    [
      '(Attack Power )(\\d+(?:\\.\\d+)?%)( Damage)',
      '\\b(' + names + ')( \\d+ stacks?(?: or more)?)\\b',
      '\\b(\\d+ (?:or more )?)(' + names + ')( [Ss]tacks?)\\b',
      '\\b(\\d+ (?:or more )?stacks? of )(' + names + ')\\b',
      '\\b(' + names + ')\\b',
      '(\\[[^\\]]+\\]|Super Armor|Taunt)',
      '(\\d+(?:\\.\\d+)?(?:%| seconds?\\b| times(?: or more)?))',
    ].join('|'),
    'gi',
  );
  const col = (w) => {
    const key = Object.keys(S).find((k) => k.toLowerCase() === String(w).toLowerCase());
    const arch = Object.keys(ARCH_COLORS || {}).find((k) => k.toLowerCase() === String(w).toLowerCase());
    return ARCH_COLORS[S[key] || arch] || '';
  };
  const st = (w, inner) => `<b class="sk-status" style="--sk-color:${col(w)}">${profileEsc(inner)}</b>`;
  const line = (s) => {
    let out = '',
      last = 0,
      m;
    re.lastIndex = 0;
    while ((m = re.exec(s))) {
      out += profileEsc(s.slice(last, m.index));
      last = re.lastIndex;
      if (m[1]) out += profileEsc(m[1]) + '<b class="sk-num">' + profileEsc(m[2]) + '</b>' + profileEsc(m[3]);
      else if (m[4]) out += st(m[4], m[4] + m[5]);
      else if (m[7]) out += st(m[7], m[6] + m[7] + m[8]);
      else if (m[10]) out += st(m[10], m[9] + m[10]);
      else if (m[11]) out += st(m[11], m[11]);
      else if (m[12]) out += '<b class="sk-effect">' + profileEsc(m[12]) + '</b>';
      else if (m[13]) out += '<b class="sk-num">' + profileEsc(m[13]) + '</b>';
    }
    out += profileEsc(s.slice(last));
    return /^\s*Activation Conditions?\b/i.test(s) ? '<span class="sk-cond">' + out + '</span>' : out;
  };
  return String(text || '')
    .split('\n')
    .map(line)
    .join('\n');
}
let currentProfileName = '';
const SKILL_MAX_TO_LV1 = 1.75; // max-level weight = Lv.1 weight x 1.75 (verified on every skill patched in 1.1.0)
// Value at a lower level: round(max / 1.75 x level multiplier) (47 of 57 in-game checks exact, the other 10 are 1 off). Max level stays exactly as in the codex.
function skillLevelValue(num, factor) {
  const n = Number(num);
  return factor >= 0.9999 ? n : Math.round(n * factor);
}
// Fill null entries evenly between the nearest known values. Returns {values, est[]}.
function fillSteps(arr) {
  const v = arr.slice(),
    est = v.map((x) => x == null);
  for (let i = 0; i < v.length; i++) {
    if (v[i] != null) continue;
    let a = i - 1,
      b = i + 1;
    while (b < v.length && v[b] == null) b++;
    v[i] = v[a] + ((v[b] - v[a]) * (i - a)) / (b - a);
  }
  return { values: v, est };
}
// Skill level multiplier relative to the max level (SKILL_LEVEL_MULTIPLIERS in data.json). est = level not measured.
function skillLevelFactor(lv, maxLevel) {
  const t = (SKILL_LEVEL_MULTIPLIERS.byMaxLevel || {})[String(maxLevel)];
  if (t && t.length === maxLevel) {
    const f = fillSteps(t);
    return { factor: f.values[lv - 1] / f.values[maxLevel - 1], est: f.est[lv - 1] };
  }
  return { factor: (1 + ((SKILL_MAX_TO_LV1 - 1) * (lv - 1)) / (maxLevel - 1)) / SKILL_MAX_TO_LV1, est: lv < maxLevel };
}
function profileEsc(v) {
  return String(v ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
}
function formatAwakeningText(raw, heroName) {
  let text = String(raw || '');
  const skills = [];
  const addSkills = (name) => {
    for (const sk of CHARACTER_PROFILE_DATA[name]?.skills || []) {
      const displayName = String(sk.skill || '')
        .replace(/\s*\(Lv\.?\s*\d+\).*$/i, '')
        .trim()
        .split(/\s*\(/)[0]
        .trim();
      if (displayName && !skills.some((x) => x.displayName.toLowerCase() === displayName.toLowerCase()))
        skills.push({ displayName, heroName: name });
    }
  };
  addSkills(heroName);
  for (const h of HEROES) {
    if (h.name !== heroName) addSkills(h.name);
  }
  const matches = [],
    lower = text.toLowerCase();
  for (const sk of skills) {
    const needle = sk.displayName.toLowerCase();
    let at = lower.indexOf(needle);
    while (at >= 0) {
      const before = text[at - 1] || '',
        after = text[at + needle.length] || '';
      if (!/[a-z0-9]/i.test(before) && !/[a-z0-9]/i.test(after)) {
        matches.push({ at, end: at + needle.length, matched: text.slice(at, at + needle.length), skill: sk });
        at = lower.indexOf(needle, at + needle.length);
      } else at = lower.indexOf(needle, at + 1);
    }
  }
  matches.sort((a, b) => a.at - b.at || b.end - a.end);
  const chosen = [];
  let end = -1;
  for (const m of matches) {
    if (m.at < end) continue;
    chosen.push(m);
    end = m.end;
  }
  for (let i = chosen.length - 1; i >= 0; i--) {
    const m = chosen[i];
    m.token = 'AWAKENINGSKILLTOKEN' + i + 'X';
    text = text.slice(0, m.at) + m.token + text.slice(m.end);
  }
  let html = formatSkillText(text);
  for (const m of chosen) {
    const link =
      '<button type="button" class="karma-skill-link" data-karma-skill="' +
      profileEsc(m.skill.displayName) +
      '" data-karma-hero="' +
      profileEsc(m.skill.heroName) +
      '" aria-label="View ' +
      profileEsc(m.skill.heroName) +
      ' skill ' +
      profileEsc(m.skill.displayName) +
      '" title="Hover to preview skill; click to open Skills">' +
      profileEsc(m.matched) +
      '</button>';
    html = html.replace(m.token, link);
  }
  return html;
}
// Awakening names, text, stat effects and 0-5 ratings come from AWAKENINGS in data.json.
function awakeningRatingLabel(n) {
  return (AWAKENINGS.ratingScale || [])[n] || '';
}
function renderProfileAwakenings(hero) {
  const aw = (AWAKENINGS.heroes || {})[hero.name] || { best: 1, list: [] },
    bestRoot = $('profileBestAwakening'),
    root = $('profileAwakenings');
  if (!bestRoot || !root) return;
  const entry = (level) =>
    (aw.list || []).find((a) => a.level === level) || {
      level,
      name: 'Awakening ' + level,
      text: '',
      rating: 0,
      why: '',
    };
  const card = (level, isBest = false) => {
    const article = document.createElement('article');
    article.className = isBest ? 'profile-awakening-best' : 'profile-awakening';
    const a = entry(level),
      rating = a.rating || 0,
      heading = document.createElement('strong');
    heading.className = 'profile-awakening-label';
    let icon = null;
    if (!isBest) {
      icon = document.createElement('img');
      icon.className = 'awakening-title-icon';
      icon.src = AWAKENINGS.icon || 'assets/awakenings/Awakening_Icon.png';
      icon.alt = '';
      icon.setAttribute('aria-hidden', 'true');
    }
    const copy = document.createElement('span');
    copy.className = 'awakening-heading-copy';
    const title = document.createElement('span');
    title.className = 'awakening-name';
    title.textContent = 'A' + level + ' · ' + (a.name || 'Awakening ' + level);
    const ratingRow = document.createElement('span');
    ratingRow.className = 'awakening-rating';
    ratingRow.setAttribute('role', 'img');
    ratingRow.setAttribute('aria-label', rating + ' of 5 diamonds lit — ' + awakeningRatingLabel(rating));
    if (a.why) ratingRow.title = a.why;
    for (let i = 1; i <= 5; i++) {
      const d = document.createElement('span');
      d.className = 'awakening-diamond' + (i <= rating ? ' lit' : '');
      ratingRow.append(d);
    }
    const ratingText = document.createElement('span');
    ratingText.className = 'awakening-rating-label';
    ratingText.textContent = awakeningRatingLabel(rating);
    copy.append(title, ratingRow, ratingText);
    if (icon) heading.append(icon);
    heading.append(copy);
    const desc = document.createElement('div');
    desc.className = 'profile-awakening-desc';
    desc.innerHTML = a.text
      ? formatAwakeningText(a.text, hero.name).replace(/\n/g, '<br>')
      : 'Awakening details are not available yet.';
    if (a.why) {
      const w = document.createElement('p');
      w.className = 'awakening-why';
      w.textContent = a.why;
      desc.append(w);
    }
    article.append(heading, desc);
    return article;
  };
  bestRoot.replaceChildren(card(aw.best || 1, true));
  root.replaceChildren();
  for (let i = 1; i <= 6; i++) root.append(card(i));
}
function setupSearchClearButtons() {
  for (const id of ['search', 'heroesSearch', 'gearSearch', 'karmaSearch']) {
    const input = $(id);
    if (!input || input.closest('.search-clear-wrap')) continue;
    const wrap = document.createElement('div');
    wrap.className = 'search-clear-wrap';
    input.parentNode.insertBefore(wrap, input);
    wrap.append(input);
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'search-clear-btn';
    clear.textContent = '×';
    clear.setAttribute('aria-label', 'Clear search');
    clear.title = 'Clear search';
    clear.hidden = !input.value;
    clear.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    });
    input.addEventListener('input', () => {
      clear.hidden = !input.value;
    });
    wrap.append(clear);
  }
}
// ==== Hero profile page ====
function openCharacterProfile(name, initialTab = 'skills') {
  const h = HEROES.find((x) => x.name.toLowerCase() === String(name).toLowerCase());
  if (!h) return;
  currentProfileName = h.name;
  hideTip();
  if (typeof refPinned !== 'undefined') refPinned = null;
  {
    const kp = $('karmaPopover');
    kp.hidden = true;
    kp.innerHTML = '';
  }
  {
    const sp = document.getElementById('karmaSkillPopover');
    if (sp) sp.hidden = true;
  }
  Object.values(PAGE_IDS).forEach((id) => ($(id).hidden = true));
  $('profilePage').hidden = false;
  $('profilePage').style.setProperty('--hero-accent', ARCH_COLORS[h.archetype] || '#68c7d5');
  document.querySelectorAll('.nav-item').forEach((x) => x.classList.toggle('active', x.dataset.page === 'tier'));
  document.title = 'DragonSword: Awakening — ' + h.name;
  $('profileName').textContent = h.name;
  $('profileCrumbName').textContent = h.name;
  $('profilePortrait').src = h.portrait;
  $('profilePortrait').alt = h.name;
  $('profileUpdated').textContent = 'Character guide · workbook data · End-game tier ' + (h.tiers['End-game'] || '—');
  $('profileIntro').innerHTML =
    `Guide and build for <button type="button" data-back-tier="1">${profileEsc(h.name)}</button> from DragonSword: Awakening. <button type="button" data-back-tier="1">${profileEsc(h.name)}</button> is a character from the <strong>${profileEsc(h.archetype)}</strong> archetype. To learn more about ${profileEsc(h.name)}, check the sections below. Use the tabs to quickly switch to the kind of information you're looking for.`;
  $('profileQuickInfo').innerHTML =
    `<div class="profile-quick-info-list"><div class="profile-quick-info-row"><strong>Archetype:</strong> <span class="profile-quick-arch"><img src="${h.archIcon}" alt="">${profileEsc(h.archetype)}</span></div><div class="profile-quick-info-row"><strong>Role:</strong> <span>${profileEsc(h.role)}</span></div>${h.faction ? `<div class="profile-quick-info-row"><strong>Faction:</strong> <span>${profileEsc(h.faction)}</span></div>` : ''}<div class="profile-quick-info-row"><strong>Kit:</strong> <span>${profileEsc(h.classType || '')}</span></div>${h.obtain?.method ? `<div class="profile-quick-info-row"><strong>How to get:</strong> <span>${profileEsc(h.obtain.method + (h.obtain.cost ? ' (' + h.obtain.cost + ')' : ''))}</span></div>` : ''}<div class="profile-quick-info-row"><strong>End-game tier:</strong> <span class="profile-tier-large" style="background:${tierColor(h.tiers['End-game'] || '—')}">${profileEsc(h.tiers['End-game'] || '—')}</span></div></div>`;
  const data = CHARACTER_PROFILE_DATA[h.name] || { skills: [], karma: '', gear: '' };
  renderProfileAwakenings(h);
  const skillRoot = $('profileSkillsGrid');
  skillRoot.innerHTML = '';
  (data.skills || []).forEach((sk, i) => {
    const slot = String(sk.slot || '');
    if (/^MODE SWITCH/i.test(slot)) {
      const modeName =
        String(sk.skill || '')
          .replace(/^Mode:\s*/i, '')
          .trim() || slot.replace(/^MODE SWITCH\s*[—-]?\s*/i, '').trim();
      const heading = document.createElement('div');
      heading.className = 'profile-mode-heading';
      heading.innerHTML = `<small>ALTERNATE MODE</small><span>${profileEsc(modeName)}</span>`;
      skillRoot.append(heading);
      return;
    }
    const maxMatch = sk.skill.match(/Lv\.?\s*(\d+)/i),
      maxLevel = maxMatch ? Math.max(1, parseInt(maxMatch[1], 10)) : 10;
    const isPassive = /mastery\s*\(passive\)/i.test(slot);
    const card = document.createElement('article');
    card.className = 'profile-skill' + (isPassive ? ' profile-skill-passive' : '');
    card.dataset.slot = slot.replace(/\s*\(.*$/, '');
    const head = document.createElement('div');
    head.className = 'profile-skill-head';
    head.innerHTML = `<span class="profile-skill-slot">${profileEsc(slot.replace(/^Auto attack/, 'Basic Attack Combo'))}</span><h4>${profileEsc(sk.skill)}</h4>`;
    const body = document.createElement('div');
    body.className = 'profile-skill-body';
    body.innerHTML = formatSkillText(sk.description);
    card.append(head, body);
    // Mastery/passive effects are fixed: they do not have a skill-level slider.
    if (!isPassive && maxLevel > 1) {
      const controls = document.createElement('div');
      controls.className = 'profile-skill-controls';
      const label = document.createElement('label');
      label.textContent = 'Skill level';
      const range = document.createElement('input');
      range.type = 'range';
      range.min = '1';
      range.max = String(maxLevel);
      range.value = String(maxLevel);
      range.setAttribute('aria-label', `${sk.skill} level`);
      const level = document.createElement('span');
      level.className = 'profile-skill-level';
      level.textContent = `Lv. ${maxLevel}`;
      const original = sk.description;
      function updateSkill() {
        const lv = Number(range.value),
          sf = skillLevelFactor(lv, maxLevel),
          factor = sf.factor;
        level.textContent = sf.est ? `Lv. ${lv} (est.)` : `Lv. ${lv}`;
        body.innerHTML = formatSkillText(
          original.replace(
            /(Attack Power )(\d+(?:\.\d+)?)(% Damage)/g,
            (m, a, num, c) => a + skillLevelValue(num, factor) + c,
          ),
        );
      }
      range.addEventListener('input', updateSkill);
      controls.append(label, range, level);
      card.append(controls);
    }
    skillRoot.append(card);
  });
  groupProfileSkills(skillRoot);
  renderProfileStatus(h, data);
  renderProfileProsCons(data, h.name);
  renderProfileReview(h, data);
  renderProfileBuild(h, data);
  const startTab = ['skills', 'review', 'build'].includes(initialTab) ? initialTab : 'skills';
  document
    .querySelectorAll('.profile-tab')
    .forEach((b) => b.classList.toggle('active', b.dataset.profileTab === startTab));
  document
    .querySelectorAll('.profile-tabpanel')
    .forEach((p) =>
      p.classList.toggle(
        'active',
        p.id === { skills: 'profileSkills', review: 'profileReview', build: 'profileBuild' }[startTab],
      ),
    );
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Status effects box (Skills tab): damage-over-time statuses this hero inflicts, from STATUS_EFFECTS in data.json.
function renderProfileStatus(h, data) {
  const root = $('profileStatus');
  root.innerHTML = '';
  const dot = STATUS_EFFECTS.damageOverTime;
  if (!dot) return;
  const by = {};
  (data.skills || []).forEach((sk) =>
    ((sk.meta || {}).inflicts || []).forEach((st) => {
      if (dot.statuses.includes(st))
        (by[st] = by[st] || []).push(
          String(sk.skill || '')
            .replace(/\s*\(Lv\.?\s*\d+\)\s*$/, '')
            .replace(/\s*\([^)]*\)\s*$/, '')
            .trim(),
        );
    }),
  );
  const list = dot.statuses.filter((st) => by[st]);
  if (!list.length) return;
  const head = document.createElement('h3');
  head.className = 'profile-subhead';
  head.textContent = 'Status Effects';
  root.append(head);
  const rows = dot.tickPctByStacks
    .map((p, i) => `<tr><td>${i + 1}</td><td>${p}% of Attack</td><td>${p * dot.ticks}% of Attack</td></tr>`)
    .join('');
  list.forEach((st) => {
    const arch = STATUS_ARCHETYPE[st],
      col = ARCH_COLORS[arch] || '#fff',
      icon = (HEROES.find((x) => x.archetype === arch) || {}).archIcon;
    const item = document.createElement('article');
    item.className = 'profile-build-item';
    item.innerHTML = `<div class="profile-build-head">${icon ? `<img class="status-icon" src="${icon}" alt="">` : ''}<div><h4 style="color:${col}">${profileEsc(st)} · damage over time</h4><small>Inflicted by: ${profileEsc([...new Set(by[st])].join(', '))}</small></div></div><div class="profile-build-desc"><table class="status-table"><thead><tr><th>Stacks</th><th>Each tick</th><th>All ${dot.ticks} ticks (~${dot.durationSeconds} s)</th></tr></thead><tbody>${rows}</tbody></table><ul class="status-rules">${dot.rules.map((r) => `<li>${profileEsc(r)}</li>`).join('')}<li>Maximum ${dot.maxStacks} stacks.</li></ul></div>`;
    root.append(item);
  });
  const note = document.createElement('p');
  note.className = 'profile-note';
  note.textContent = `The same rules apply to ${dot.statuses.slice(0, -1).join(', ')} and ${dot.statuses.slice(-1)}, measured on training dummies. ${dot.untested || ''}`;
  root.append(note);
}

// Pros & Cons (Review tab) from CHARACTER_PROFILE_DATA[hero].pros / .cons. Status and archetype names are coloured by archetype.
const PC_ICON = {
  pro: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11"/><path d="M12 6.5v11M6.5 12h11"/></svg>',
  con: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11"/><path d="M6.5 12h11"/></svg>',
};
// Names of skills, Karmas and sets that contain a status or archetype word (e.g. "Venom Cutter") are left uncoloured.
let _protectedNames = null;
function protectedNames() {
  if (_protectedNames) return _protectedNames;
  const words = [...Object.keys(STATUS_ARCHETYPE), ...Object.keys(ARCH_COLORS)];
  const has = (n) => words.some((w) => new RegExp('\\b' + w + '\\b').test(n));
  const names = new Set();
  Object.values(CHARACTER_PROFILE_DATA).forEach((p) =>
    (p.skills || []).forEach((sk) => {
      const n = String(sk.skill || '')
        .replace(/\s*\(Lv\.?\s*\d+\)\s*$/, '')
        .replace(/\s*\([^)]*\)\s*$/, '')
        .trim();
      if (n && has(n)) names.add(n);
    }),
  );
  KARMA_DATA.forEach((k) => {
    if (has(k.name)) names.add(k.name);
  });
  GEAR_DATA.forEach((g) => {
    if (has(g.name)) names.add(g.name);
  });
  return (_protectedNames = [...names].sort((a, b) => b.length - a.length));
}
function colourStatusWords(text) {
  const words = [...Object.keys(STATUS_ARCHETYPE), ...Object.keys(ARCH_COLORS)].sort((a, b) => b.length - a.length);
  if (!words.length) return profileEsc(text);
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rx = new RegExp('\\b(' + words.map(esc).join('|') + ')\\b', 'g');
  const prot = protectedNames();
  const keep = [];
  let t = profileEsc(text);
  if (prot.length)
    t = t.replace(new RegExp('\\b(' + prot.map((n) => esc(profileEsc(n))).join('|') + ')(?![\\w])', 'g'), (m) => {
      keep.push(m);
      return '\u0000' + (keep.length - 1) + '\u0000';
    });
  t = t.replace(rx, (w) => {
    const col = ARCH_COLORS[STATUS_ARCHETYPE[w] || w];
    return col ? `<b style="color:${col}">${w}</b>` : w;
  });
  return t.replace(/\u0000(\d+)\u0000/g, (m, i) => keep[i]);
}
function renderProfileProsCons(data, hero) {
  [
    ['profilePros', data.pros, 'pro'],
    ['profileCons', data.cons, 'con'],
  ].forEach(([id, list, kind]) => {
    const ul = $(id);
    if (!ul) return;
    ul.innerHTML =
      list && list.length
        ? list
            .map(
              (t) =>
                `<li><span class="pc-icon pc-icon-${kind}">${PC_ICON[kind]}</span><span>${richText(t, hero)}</span></li>`,
            )
            .join('')
        : `<li class="pc-empty">Not written yet.</li>`;
  });
}

// ---------- Full review (Review tab) from CHARACTER_PROFILE_DATA[hero].review ----------
// Rich text: [[hero:Name]], [[skill:Skill]] (own hero) or [[skill:Hero/Skill]], [[karma:Name]], [[set:Name]], [[awk:Hero/5]] or [[awk:5]],
// optional label after '|' ([[skill:Shadow Grab|her grab]]), **bold**. Status and archetype names are coloured automatically.
let refPopTimer = null,
  refPinned = null;
function findSkill(hero, name) {
  const n = (s) =>
    String(s || '')
      .replace(/\s*\(Lv\.?\s*\d+\)\s*$/, '')
      .replace(/\s*\([^)]*\)\s*$/, '')
      .trim()
      .toLowerCase();
  const p = CHARACTER_PROFILE_DATA[hero];
  return p && (p.skills || []).find((sk) => !/^MODE SWITCH/i.test(sk.slot) && n(sk.skill) === n(name));
}
function refLabel(type, key, hero) {
  if (type === 'skill') {
    const [h, sk] = key.includes('/') ? key.split('/') : [hero, key];
    return sk;
  }
  if (type === 'awk') {
    const [h, l] = key.includes('/') ? key.split('/') : [hero, key];
    const a = ((AWAKENINGS.heroes[h] || {}).list || []).find((x) => String(x.level) === String(l));
    return a ? `A${l} · ${a.name}` : `A${l}`;
  }
  return key;
}
function richText(text, hero) {
  const out = [];
  let last = 0;
  const rx = /\[\[(hero|skill|karma|set|awk):([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  let m;
  const plain = (t) => colourStatusWords(t);
  while ((m = rx.exec(text))) {
    out.push(plain(text.slice(last, m.index)));
    const [, type, key, label] = m;
    const k = key.trim(),
      full = (type === 'skill' || type === 'awk') && !k.includes('/') ? `${hero}/${k}` : k;
    out.push(
      `<span class="ref ref-${type}" tabindex="0" role="button" data-ref-type="${type}" data-ref-key="${profileEsc(full)}">${profileEsc(label || refLabel(type, k, hero))}</span>`,
    );
    last = rx.lastIndex;
  }
  out.push(plain(text.slice(last)));
  return out.join('').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
function refCardHtml(type, key) {
  if (type === 'hero') {
    const h = HEROES.find((x) => x.name === key);
    if (!h) return '';
    const t = h.tiers || {};
    return `<div class="ref-card"><div class="ref-head"><img class="ref-portrait" src="${h.portrait}" alt=""><div><div class="ref-title">${profileEsc(h.name)}</div><div class="ref-meta"><img src="${h.archIcon}" alt="">${colourStatusWords(h.archetype)} · ${profileEsc(h.role)}</div><div class="ref-meta">Kit: ${profileEsc(h.classType)}${h.faction ? ` · ${profileEsc(h.faction)}` : ''}</div><div class="ref-tiers">${['Early-game', 'Mid-game', 'End-game'].map((p) => `<span style="background:${tierColor(t[p])}">${p.split('-')[0]} ${t[p] || '—'}</span>`).join('')}</div>${(() => {
      const l = latestBalanceChange(h.name);
      return l
        ? `<div class="ref-patch">${patchArrow(l.c, l.version)} Patch ${l.version}: ${profileEsc(patchDirLabel(l.c))}${l.c.damagePct != null ? ` (skill damage ${l.c.damagePct > 0 ? '+' : ''}${l.c.damagePct}%${l.c.shiftPct ? `, ${l.c.shiftPct}% moved between skills` : ''})` : ''}</div>`
        : '';
    })()}</div></div><button type="button" class="ref-open" data-open-hero="${profileEsc(h.name)}">Open ${profileEsc(h.name)}'s guide →</button></div>`;
  }
  if (type === 'skill') {
    const [h, n] = key.split('/');
    const sk = findSkill(h, n);
    if (!sk) return '';
    return `<div class="ref-card"><div class="ref-kicker">${profileEsc(h)} · ${profileEsc(sk.slot)}</div><div class="ref-title">${profileEsc(sk.skill)}</div><div class="ref-body">${formatSkillText(sk.description)}</div></div>`;
  }
  if (type === 'set') {
    const g = GEAR_DATA.find((x) => x.name === key);
    if (!g) return '';
    return `<div class="ref-card"><div class="ref-head"><img class="ref-icon" src="${g.icon}" alt=""><div><div class="ref-title">${profileEsc(g.name)}</div><div class="ref-meta">${profileEsc(g.source)}</div></div></div><div class="ref-body"><b>(2)</b> ${colourStatusWords(g.two)}<br><b>(3)</b> ${colourStatusWords(g.three)}</div></div>`;
  }
  if (type === 'awk') {
    const [h, l] = key.split('/');
    const a = ((AWAKENINGS.heroes[h] || {}).list || []).find((x) => String(x.level) === String(l));
    if (!a) return '';
    return `<div class="ref-card"><div class="ref-kicker">${profileEsc(h)} · Awakening ${l} · rated ${a.rating}/5</div><div class="ref-title">${profileEsc(a.name)}</div><div class="ref-body">${formatSkillText(a.text)}<div class="ref-why">${profileEsc(a.why)}</div></div></div>`;
  }
  return '';
}
function skillRefParts(a) {
  return a.classList.contains('karma-skill-link')
    ? [a.dataset.karmaHero, a.dataset.karmaSkill]
    : String(a.dataset.refKey).split('/');
}
function showSkillRef(anchor, withButton = false) {
  const [h, n] = skillRefParts(anchor);
  hideKarmaPopover(0);
  showKarmaSkillPopover(anchor, h, n);
  const pop = document.getElementById('karmaSkillPopover');
  if (!pop || pop.hidden) return;
  clearTimeout(karmaSkillHideTimer);
  if (withButton && !pop.querySelector('.ref-open')) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ref-open';
    b.textContent = `Open ${n} on ${h}'s Skills tab →`;
    b.addEventListener('click', () => {
      hideKarmaSkillPopover(0);
      navigateRef('skill', h + '/' + n);
    });
    pop.firstElementChild.append(b);
  }
}
function flashEl(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.style.outline = '3px solid var(--hero-accent,#68c7d5)';
  el.style.outlineOffset = '2px';
  setTimeout(() => {
    el.style.outline = '';
    el.style.outlineOffset = '';
  }, 1800);
}
function openKarmaByName(name) {
  document.querySelector('.nav-item[data-page="karma"]').click();
  if (typeof activeKarmaArch !== 'undefined') {
    activeKarmaArch = '';
    renderKarmaFilters();
  }
  const search = $('karmaSearch');
  search.value = name;
  renderKarmas();
  const n = (v) =>
    String(v || '')
      .trim()
      .toLowerCase();
  flashEl(
    [...document.querySelectorAll('.karma-card')].find(
      (c) => n(c.querySelector('.karma-card-title')?.textContent) === n(name),
    ),
  );
}
function navigateRef(type, key) {
  refPinned = null;
  hideKarmaPopover(0);
  hideKarmaSkillPopover(0);
  hideTip();
  if (type === 'hero') {
    openCharacterProfile(key, 'skills');
    return;
  }
  if (type === 'karma') {
    openKarmaByName(key);
    return;
  }
  if (type === 'set') {
    openGearSet(key);
    return;
  }
  const [h, n] = key.split('/');
  if (type === 'skill') {
    openCharacterProfile(h, 'skills');
    const sk = findSkill(h, n);
    if (sk)
      setTimeout(
        () =>
          flashEl(
            [...document.querySelectorAll('#profileSkillsGrid .profile-skill')].find(
              (c) => c.querySelector('h4')?.textContent === sk.skill,
            ),
          ),
        60,
      );
    return;
  }
  if (type === 'awk') {
    openCharacterProfile(h, 'review');
    setTimeout(() => flashEl(document.querySelectorAll('#profileAwakenings > *')[Number(n) - 1]), 60);
  }
}
const REF_OPEN_LABEL = {
  karma: (k) => `Open ${k} in the Karma tab →`,
  set: (k) => `Open ${k} in Gear Sets →`,
  awk: (k) => `Show A${k.split('/')[1]} on ${k.split('/')[0]}'s Review tab →`,
};
function showRefPopover(anchor, type = anchor.dataset.refType, key = anchor.dataset.refKey, withButton = false) {
  if (type === 'skill') {
    showSkillRef(anchor, withButton);
    return;
  }
  hideKarmaSkillPopover(0);
  clearTimeout(refPopTimer);
  clearTimeout(karmaPopTimer);
  const pop = $('karmaPopover');
  pop.innerHTML = '';
  if (type === 'karma') {
    const k = findKarma(key);
    if (!k) return;
    pop.style.setProperty('--karma-accent', KARMA_ACCENTS[k.archetype] || '#39b9e8');
    pop.append(buildKarmaCard(k));
  } else {
    const html = refCardHtml(type, key);
    if (!html) return;
    pop.innerHTML = html;
  }
  if (withButton && REF_OPEN_LABEL[type]) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ref-open';
    b.textContent = REF_OPEN_LABEL[type](key);
    b.addEventListener('click', () => navigateRef(type, key));
    pop.firstElementChild.append(b);
  }
  pop.hidden = false;
  const r = anchor.getBoundingClientRect(),
    w = pop.offsetWidth,
    hgt = pop.offsetHeight;
  let left = r.left,
    top = r.bottom + 8;
  if (r.height > 60 && r.right + w + 12 < window.innerWidth) {
    left = r.right + 10;
    top = r.top;
  }
  if (left + w > window.innerWidth - 12) left = window.innerWidth - w - 12;
  if (left < 12) left = 12;
  if (top + hgt > window.innerHeight - 12) top = r.top - hgt - 8;
  if (top < 12) top = 12;
  pop.style.left = left + 'px';
  pop.style.top = top + 'px';
}
function hideRefPopover(delay = 150) {
  if (refPinned) return;
  hideKarmaPopover(delay);
}
document.addEventListener('pointerover', (e) => {
  if (e.pointerType === 'touch') return;
  const a = e.target.closest('.ref:not(.ref-skill)');
  if (a && !refPinned) showRefPopover(a);
});
document.addEventListener('pointerout', (e) => {
  if (e.pointerType === 'touch') return;
  const a = e.target.closest('.ref:not(.ref-skill)');
  if (a && !refPinned && !$('karmaPopover').contains(e.relatedTarget)) hideRefPopover();
});
document.addEventListener('click', (e) => {
  const open = e.target.closest('[data-open-hero]');
  if (open) {
    navigateRef('hero', open.dataset.openHero);
    return;
  }
  const a = e.target.closest('.ref');
  if (a) {
    e.preventDefault();
    if (IS_TOUCH) {
      if (refPinned === a) {
        refPinned = null;
        hideKarmaPopover(0);
        hideKarmaSkillPopover(0);
        return;
      }
      refPinned = a.classList.contains('ref-skill') ? null : a;
      showRefPopover(a, undefined, undefined, true);
      return;
    }
    navigateRef(a.dataset.refType, a.dataset.refKey);
    return;
  }
  if (refPinned && !e.target.closest('#karmaPopover')) {
    refPinned = null;
    hideKarmaPopover(0);
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && refPinned) {
    refPinned = null;
    hideKarmaPopover(0);
  }
  const a = e.target.closest && e.target.closest('.ref');
  if (a && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    a.click();
  }
});
const RV_SLOT_SHORT = {
  'Auto attack': 'AUTO',
  'Jump attack': 'JUMP',
  'Dash attack': 'DASH ATK',
  Dash: 'DODGE',
  Skill: 'SKILL',
  Ultimate: 'ULT',
  'Special A': 'SP-A',
  'Special B': 'SP-B',
};
function rvChip(hero, token) {
  let h = hero,
    n = token;
  if (token.includes('/')) [h, n] = token.split('/');
  const sk = findSkill(h, n);
  if (!sk) return `<span class="rv-chip rv-chip-note">${colourStatusWords(token)}</span>`;
  const slot = String(sk.slot).replace(/\s*\(.*$/, '');
  const other = h !== hero ? HEROES.find((x) => x.name === h) : null;
  const oc = other ? ARCH_COLORS[other.archetype] || '' : '';
  return `<span class="rv-chip ref ref-skill${other ? ' rv-chip-other' : ''}"${oc ? ` style="--chip-accent:${oc}"` : ''} tabindex="0" role="button" data-ref-type="skill" data-ref-key="${profileEsc(h + '/' + n)}"><small>${RV_SLOT_SHORT[slot] || profileEsc(slot)}</small>${profileEsc(n)}${h !== hero ? ` <em>(${profileEsc(h)})</em>` : ''}</span>`;
}
function renderProfileReview(h, data) {
  const root = $('profileReviewBody');
  if (!root) return;
  const R = data.review;
  const accent = ARCH_COLORS[h.archetype] || '#68c7d5';
  if (!R) {
    root.innerHTML = '<div class="profile-placeholder">A full review for this hero hasn\'t been written yet.</div>';
    return;
  }
  const P = (a) => (a || []).map((t) => `<p>${richText(t, h.name)}</p>`).join('');
  const L = (a) => `<ul class="rv-list">${(a || []).map((t) => `<li>${richText(t, h.name)}</li>`).join('')}</ul>`;
  const card = (tag, title, body) =>
    `<section class="rv-card"><div class="rv-card-head"><span class="rv-tag">${tag}</span><h4>${title}</h4></div><div class="rv-card-body">${body}</div></section>`;
  const ob = h.obtain || {};
  const parts = [];
  parts.push(card('OVERVIEW', `${profileEsc(h.name)} in short`, P(R.summary)));
  const v = R.verdict || {};
  parts.push(
    card(
      'VERDICT',
      'Should I get ' + (R.pronoun === 'him' ? 'him' : R.pronoun === 'them' ? 'them' : 'her') + '?',
      `<div class="rv-verdict"><span class="rv-verdict-badge" data-level="${profileEsc(v.level || '')}">${profileEsc(v.label || '')}</span><span class="rv-obtain">${profileEsc(ob.method ? 'How to get: ' + ob.method + (ob.cost ? ' (' + ob.cost + ')' : '') : 'How to get: not recorded yet')}</span></div>${P(v.text)}`,
    ),
  );
  if (R.howToPlay) {
    const H = R.howToPlay;
    let body = '';
    if (H.loop)
      body += `<h5>Gameplay loop</h5><ol class="rv-steps">${H.loop.map((t) => `<li>${richText(t, h.name)}</li>`).join('')}</ol>`;
    if (H.combos)
      body +=
        `<h5>Combos</h5><div class="rv-legend">Built from the skills' activation conditions in the codex, not timed in-game. Hover or tap a skill to see it.</div>` +
        H.combos
          .map(
            (c) =>
              `<div class="rv-combo"><div class="rv-combo-name">${profileEsc(c.name)}</div><div class="rv-chips">${c.sequence.map((t) => rvChip(h.name, t)).join('<span class="rv-arrow">→</span>')}</div><div class="rv-combo-note">${richText(c.note || '', h.name)}</div></div>`,
          )
          .join('');
    parts.push(card('HOW TO PLAY', 'Role, loop and combos', P(H.intro) + body));
  }
  if (R.kit)
    parts.push(
      card(
        'KIT',
        'Kit analysis',
        R.kit.map((k) => `<div class="rv-kit"><h5>${richText(k.title, h.name)}</h5>${L(k.points)}</div>`).join(''),
      ),
    );
  if (R.investment) {
    const I = R.investment;
    let body = '';
    if (I.skills)
      body += `<h5>Skill levels</h5><div class="rv-prio">${I.skills.map((s) => `<div class="rv-prio-row"><span class="rv-prio-badge" data-p="${profileEsc(s.priority)}">${profileEsc(s.priority)}</span><div>${richText(s.text, h.name)}</div></div>`).join('')}</div>`;
    if (I.awakening) body += `<h5>Awakenings</h5>${P(I.awakening)}`;
    if (I.karma) body += `<h5>Karma</h5>${P(I.karma)}`;
    if (I.gear) body += `<h5>Gear</h5>${P(I.gear)}`;
    parts.push(card('INVESTMENT', 'What to invest in', body));
  }
  if (R.teams) parts.push(card('TEAMS', 'Teams and partners', P(R.teams)));
  {
    const ph = renderProfilePatches(h);
    if (ph) parts.push(card('PATCHES', 'Patch history', ph));
  }
  const t = h.tiers || {};
  parts.push(
    `<div class="rv-ratings">${['Early-game', 'Mid-game', 'End-game'].map((p) => `<div class="rv-rating"><div class="rv-rating-box" style="background:${tierColor(t[p])}">${t[p] || '—'}</div><div class="rv-rating-label">${p}</div></div>`).join('')}</div><p class="profile-note">Tiers from the guide's Tier List · patch ${profileEsc(patchText())}. Review written ${profileEsc(R.updated || '')}; numbers come from the codex and the measured damage rules in the guide.</p>`,
  );
  root.innerHTML = parts.join('');
  root
    .querySelectorAll('[data-open-patches]')
    .forEach((b) => (b.onclick = () => openPatchesFor(b.dataset.openPatches)));
}

// Skills tab layout: Basic Moves (auto, jump, dash attack, dodge), then a "Skills" divider with Skill/Ultimate, Special A/B
// and Mastery centred below. Alternate-mode sections (heading + their cards) stay after that, in data order.
function groupProfileSkills(root) {
  const kids = [...root.children],
    m = kids.findIndex((x) => x.classList.contains('profile-mode-heading'));
  const main = m < 0 ? kids : kids.slice(0, m),
    rest = m < 0 ? [] : kids.slice(m);
  const BASIC = ['Auto attack', 'Jump attack', 'Dash attack', 'Dash'],
    SKILL = ['Skill', 'Ultimate', 'Special A', 'Special B', 'Mastery'];
  const pick = (order) =>
    order.flatMap((o) =>
      main.filter((c) => (c.dataset.slot || '').startsWith(o) && (o !== 'Dash' || c.dataset.slot === 'Dash')),
    );
  const basic = pick(BASIC),
    skills = pick(SKILL),
    other = main.filter((c) => !basic.includes(c) && !skills.includes(c));
  const divider = (t) => {
    const h = document.createElement('h3');
    h.className = 'gear-section-title profile-skills-divider';
    h.textContent = t;
    return h;
  };
  root.innerHTML = '';
  root.append(divider('Basic Moves'));
  basic.forEach((c) => root.append(c));
  root.append(divider('Skills'));
  [...skills, ...other, ...rest].forEach((c) => root.append(c));
}

let activeGearFilter = 'all';
// Identify elemental/status sets using the same mapping as skill and Karma text.
