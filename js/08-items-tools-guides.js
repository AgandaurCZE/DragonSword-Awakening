/* js/08-items-tools-guides.js: Item Database, Achievements, Tools (damage and levelling calculators), Guides. Part of the site script, split out of index.html on 10 Nov 2026.
   The files load in order (see index.html) and share one global scope, so code that runs at load time may only use what earlier files define. */
// ==== Item Database and Achievements (preview; assets/items/*.json) ====
function itemRarColor(r) {
  return { Grey: '#9aa3ad', Green: '#5fd38d', Blue: '#4aa3ff', Purple: '#b77cf2', Orange: '#ff9f43' }[r] || '#666';
}
async function itemLoad(k) {
  if (ITEMDB.data[k] !== undefined) return;
  try {
    const r = await fetch(`assets/items/${k}.json`);
    ITEMDB.data[k] = r.ok ? (await r.json()).items || [] : [];
  } catch (e) {
    ITEMDB.data[k] = [];
  }
}
async function renderItems() {
  const root = $('itemsBody');
  if (!root) return;
  await itemLoad(ITEMDB.tab);
  const E = profileEsc;
  const L = ITEMDB.data[ITEMDB.tab] || [];
  const rars = [...new Set(L.map((x) => x.rarity).filter(Boolean))];
  const q = ITEMDB.q.toLowerCase();
  const list = L.filter(
    (x) =>
      (!q ||
        (
          x.name +
          ' ' +
          (x.type || '') +
          ' ' +
          (x.description || '') +
          ' ' +
          (x.use || '') +
          ' ' +
          (x.sources || []).join(' ')
        )
          .toLowerCase()
          .includes(q)) &&
      (!ITEMDB.rar || x.rarity === ITEMDB.rar),
  );
  root.innerHTML = `<div class="it-bar">${ITEM_TABS.map(([k, l]) => `<button type="button" class="it-tab${k === ITEMDB.tab ? ' on' : ''}" data-ittab="${k}">${l}</button>`).join('')}</div>
 <div class="it-bar"><input id="itQ" placeholder="Search name, use or source…" value="${E(ITEMDB.q)}"><select id="itRar"><option value="">All rarities</option>${rars.map((r) => `<option${r === ITEMDB.rar ? ' selected' : ''}>${E(r)}</option>`).join('')}</select><span class="gx-note">${list.length} of ${L.length}</span></div>
 ${L.length ? `<div class="it-grid">${list.map((x) => `<div class="it-card" style="--rc:${itemRarColor(x.rarity)}">${x.icon ? `<img src="${E(x.icon)}" alt="" loading="lazy">` : ''}<div><b>${E(x.name)}</b><small>${E(x.type || '')}${x.rarity ? ' · ' + E(x.rarity) : ''}</small>${x.use ? `<p>${E(x.use)}</p>` : ''}${x.description ? `<p style="color:var(--muted);white-space:pre-line">${E(x.description)}</p>` : ''}${(x.sources || []).length ? `<p class="it-src">Where to get: ${x.sources.map(E).join(', ')}</p>` : ''}</div></div>`).join('')}</div>` : '<p class="gd-empty">No items recorded in this tab yet.</p>'}`;
  root.querySelectorAll('[data-ittab]').forEach(
    (b) =>
      (b.onclick = () => {
        ITEMDB.tab = b.dataset.ittab;
        ITEMDB.rar = '';
        renderItems();
      }),
  );
  const qi = $('itQ');
  qi.oninput = () => {
    ITEMDB.q = qi.value;
    const p = qi.selectionStart;
    renderItems().then(() => {
      const n = $('itQ');
      n.focus();
      n.setSelectionRange(p, p);
    });
  };
  $('itRar').onchange = (e) => {
    ITEMDB.rar = e.target.value;
    renderItems();
  };
}
function achTicks() {
  try {
    return JSON.parse(localStorage.getItem('dsw.achievements.v1') || '{}');
  } catch (e) {
    return {};
  }
}
async function renderAchievements() {
  const root = $('achBody');
  if (!root) return;
  if (!ITEMDB.ach) {
    try {
      ITEMDB.ach = await (await fetch('assets/items/achievements.json')).json();
    } catch (e) {
      ITEMDB.ach = { items: [] };
    }
  }
  const E = profileEsc,
    A = ITEMDB.ach,
    L = A.items || [],
    T = achTicks(),
    q = ITEMDB.aq.toLowerCase();
  const cats = ['Explore', 'Quest', 'Collect', 'Combat', 'Special'].filter((c) => L.some((x) => x.category === c));
  const list = L.filter(
    (x) =>
      (!q || (x.name + ' ' + (x.condition || '') + ' ' + (x.title || '')).toLowerCase().includes(q)) &&
      (!ITEMDB.acat || x.category === ITEMDB.acat) &&
      (!ITEMDB.aown || (ITEMDB.aown === 'yes') === !!T[x.name]),
  );
  const done = L.filter((x) => T[x.name]).length;
  const F = A.fame || {},
    FC = F.categories || [];
  root.innerHTML = `${FC.length ? `<div class="ach-note"><b>Fame and stage rewards</b><br>${E(F.text || '')}<div class="ach-cups">${FC.map((c) => `<div class="ach-fame" title="${E(c.description || '')}"><img src="${E(c.icon)}" alt=""><span><b>${E(c.name)}</b><small>${E(c.category)} · ${c.points} per achievement</small><small>Stages at ${(c.stages || []).join(' / ')} Fame</small></span></div>`).join('')}</div></div>` : ''}
 <div class="it-bar"><input id="achQ" placeholder="Search achievement, condition or title…" value="${E(ITEMDB.aq)}"><select id="achCat"><option value="">All categories</option>${cats.map((c) => `<option${c === ITEMDB.acat ? ' selected' : ''}>${c}</option>`).join('')}</select><select id="achOwn"><option value="">All</option><option value="yes"${ITEMDB.aown === 'yes' ? ' selected' : ''}>Ticked</option><option value="no"${ITEMDB.aown === 'no' ? ' selected' : ''}>Not ticked</option></select><span class="gx-note">${done} of ${L.length} ticked</span></div>
 <div class="ach-list">${list.map((x) => `<label class="ach-row${T[x.name] ? ' done' : ''}"><input type="checkbox" data-ach="${E(x.name)}"${T[x.name] ? ' checked' : ''}><span><b>${E(x.name)}</b><small>${E(x.category || '')}${x.target ? ' · target ' + E(x.target) : ''}${x.title ? ' · title: ' + E(x.title) : ''}</small><br>${E(x.condition || '')}</span></label>`).join('') || '<p class="gd-empty">No achievements match.</p>'}</div>`;
  root.querySelectorAll('[data-ach]').forEach(
    (c) =>
      (c.onchange = () => {
        const t = achTicks();
        c.checked ? (t[c.dataset.ach] = 1) : delete t[c.dataset.ach];
        try {
          localStorage.setItem('dsw.achievements.v1', JSON.stringify(t));
        } catch (e) {}
        renderAchievements();
      }),
  );
  const qi = $('achQ');
  qi.oninput = () => {
    ITEMDB.aq = qi.value;
    const p = qi.selectionStart;
    renderAchievements().then(() => {
      const n = $('achQ');
      n.focus();
      n.setSelectionRange(p, p);
    });
  };
  $('achCat').onchange = (e) => {
    ITEMDB.acat = e.target.value;
    renderAchievements();
  };
  $('achOwn').onchange = (e) => {
    ITEMDB.aown = e.target.value;
    renderAchievements();
  };
}
// Damage calculator (Tools page, Beta). Rules and notes come from DAMAGE_CALC and DEFENSE_MODEL.
// ==== Tools (preview): damage calculator ====
function dcCompute(i) {
  const C = DAMAGE_CALC,
    K = DEFENSE_MODEL.K,
    N = (x) => Number(x) || 0;
  const apu = N(i.apu),
    atk = (N(i.attack) * (1 + (apu + N(i.buff)) / 100)) / (1 + apu / 100),
    dots = (STATUS_EFFECTS.damageOverTime || {}).statuses || [],
    tb = TOWER_TRIALS.bonus || {};
  const tower = (TOWER_TRIALS.towers || []).find((t) => t.id === i.tower);
  let aap = 0,
    hit = 0,
    ad = 0;
  const on = [];
  C.statuses.forEach((s) => {
    const r = (i.st || {})[s.name];
    if (!r || !r.on) return;
    on.push(s);
    aap += (N(r.aap) + N(i.all)) * (1 + N(i.inc) / 100);
    hit += s.hitBonus * (i.weak === s.name ? C.weaknessMultiplier : 1);
    ad += N(r.ad) / 100;
    if (tower) ad += (tower.status === s.name ? N(tb.own) : dots.includes(s.name) ? N(tb.dot) : N(tb.other)) / 100;
  });
  const def = N(i.def),
    di = N(i.di),
    ap = N(i.ap),
    eff = (d, p) => Math.max(0, def * (1 - d / 100) - p),
    fac = (d, p) => K / (K + eff(d, p));
  const base = (((atk + aap) * N(i.pct)) / 100) * (1 + hit / 100) * (1 + ad),
    cd = N(i.cd) / 100,
    cr = Math.min(N(i.cr), 100) / 100,
    non = base * fac(di, ap);
  return {
    atk,
    aap,
    hit,
    ad,
    on,
    non,
    crit: non * (1 + cd),
    avg: non * (1 + cr * cd),
    block: 1 - fac(di, ap),
    noAp: base * fac(di, 0),
    noDi: base * fac(0, ap),
    none: base * fac(0, 0),
    over: def * (1 - di / 100) < ap,
    dots: on.filter((s) => dots.includes(s.name)),
  };
}
// Defense of a type at a level: basic curve (straight lines between points) × world factor × type multiplier.
function dcEnemyDef(mult, factor, lv) {
  const c = DEFENSE_MODEL.levelCurve,
    P = Object.keys(c.dungeon)
      .map(Number)
      .sort((a, b) => a - b),
    v = (x) => c.dungeon[String(x)];
  let base;
  const last = P[P.length - 1],
    tested = c.dungeon[String(lv)] != null;
  if (lv <= P[0]) base = (v(P[0]) * lv) / P[0];
  else if (lv >= last) base = (v(last) * lv) / last;
  else {
    const hi = P.findIndex((x) => x >= lv),
      a = P[hi - 1],
      b = P[hi];
    base = v(a) + ((v(b) - v(a)) * (lv - a)) / (b - a);
  }
  return { base, def: base * factor * mult, est: !tested, far: lv < P[0] || lv > 75 };
}
const DC_DEF = {
  hero: '',
  skill: '',
  lv: '',
  pct: '',
  attack: '',
  cd: 50,
  cr: 5,
  ap: 0,
  di: 0,
  apu: '',
  buff: '',
  enemy: 0,
  wboss: 0,
  nmob: 0,
  boss: false,
  typed: false,
  place: 'world',
  elv: 50,
  def: '',
  weak: '',
  tower: '',
  all: 0,
  inc: 0,
  st: {},
};
let DC_S = null;
function dcSave() {
  try {
    localStorage.setItem('dsw.dmgcalc.v1', JSON.stringify(DC_S));
  } catch (e) {}
}
function dcSkills(h) {
  return ((CHARACTER_PROFILE_DATA[h] || {}).skills || []).filter((s) => s.meta && s.meta.attackPct);
}
function dcPct(s, lv) {
  const m = s.meta.maxLevel;
  return !m || m < 2 ? s.meta.attackPct : skillLevelValue(s.meta.attackPct, skillLevelFactor(lv, m).factor);
}
function renderDamageCalc() {
  const root = $('dcRoot');
  if (!root || !DAMAGE_CALC || !DEFENSE_MODEL) return;
  const E = profileEsc,
    C = DAMAGE_CALC;
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem('dsw.dmgcalc.v1') || 'null');
  } catch (e) {}
  const S = (DC_S = { ...DC_DEF, ...(saved || {}) });
  S.st = S.st || {};
  if (!CHARACTER_PROFILE_DATA[S.hero]) S.hero = (HEROES[0] || {}).name || '';
  const enemies = DEFENSE_MODEL.enemies || [],
    types = DEFENSE_MODEL.types || [],
    places = DEFENSE_MODEL.places || [];
  const dcIdx = (v, a) => (Number.isInteger(+v) && a[+v] ? +v : 0),
    nmobs = (places.find((p) => p.enemies) || {}).enemies || [];
  if (!places.some((p) => p.id === S.place)) S.place = 'world';
  S.enemy = dcIdx(S.enemy, types);
  S.wboss = dcIdx(S.wboss, enemies);
  S.nmob = dcIdx(S.nmob, nmobs);
  S.boss = !!S.boss;
  S.typed = !!S.typed;
  S.elv = +S.elv > 0 ? +S.elv : 50;
  const groups = [...new Set(types.map((t) => t.group))];
  const num = (k, l, ph) =>
    `<label class="dc-f"><span>${l}</span><input type="number" min="0" step="any" inputmode="decimal" data-k="${k}" value="${E(S[k])}"${ph ? ` placeholder="${E(ph)}"` : ''}></label>`;
  const rows = C.statuses
    .map((s) => {
      const c = ARCH_COLORS[STATUS_ARCHETYPE[s.name]] || 'var(--text)';
      const r = S.st[s.name] || {};
      return `<tr><td><label class="dc-on"><input type="checkbox" data-st="${E(s.name)}" data-f="on"${r.on ? ' checked' : ''}><b style="color:${c}">${E(s.name)}</b></label></td><td class="n dc-mute">${s.hitBonus ? '+' + s.hitBonus + '%' : 'none'}<span class="dc-xb" data-xh="${E(s.name)}" hidden></span></td><td><input type="number" min="0" step="any" inputmode="decimal" data-st="${E(s.name)}" data-f="aap" aria-label="${E(s.name)} Additional Attack Power" value="${E(r.aap ?? '')}"></td><td><div class="dc-adw"><input type="number" min="0" step="any" inputmode="decimal" data-st="${E(s.name)}" data-f="ad" aria-label="${E(s.name)} Additional Damage %" value="${E(r.ad ?? '')}"><span class="dc-xb" data-xa="${E(s.name)}" hidden></span></div></td></tr>`;
    })
    .join('');
  root.innerHTML = `<div class="gx-box dc-head"><h3>Damage calculator <span class="gx-tag">BETA</span></h3><p class="gx-sub">${E(C.intro)}</p></div><div class="dc"><div class="dc-in">
 <div class="gx-box"><h3>Skill</h3><div class="dc-g"><label class="dc-f"><span>Hero</span><select id="dcHero">${HEROES.map((h) => `<option${h.name === S.hero ? ' selected' : ''}>${E(h.name)}</option>`).join('')}</select></label><label class="dc-f dc-w"><span>Skill</span><select id="dcSkill"></select></label><label class="dc-f"><span>Skill level</span><select id="dcLv"></select></label><label class="dc-f" id="dcVarW"><span>How it's used</span><select id="dcVar"></select></label>${num('pct', 'Skill %')}</div><p class="gx-note" id="dcSkillNote"></p></div>
 <div class="gx-box"><h3>Your stats</h3><p class="gx-sub">${E(C.statsHint)}</p><div class="dc-g">${num('attack', 'Attack')}${num('cd', 'Critical Damage %')}${num('cr', 'Critical Rate %')}${num('ap', 'Armor Penetration')}${num('di', 'Defense Ignore %')}${num('all', 'All Status Additional Attack Power')}${num('inc', 'Status Additional Attack Power Increase %')}</div>
 <details class="dc-more"><summary>Attack buff not on your panel</summary><p class="gx-note">${E(C.buffHint)}</p><div class="dc-g">${num('apu', 'Attack Power Up on panel %')}${num('buff', 'Extra Attack Power %')}</div></details></div>
 <div class="gx-box"><h3>Enemy</h3><div class="dc-where" id="dcWhere" role="group" aria-label="Where">${places.map((p) => `<button type="button" data-place="${E(p.id)}" aria-pressed="${p.id === S.place}"${p.id === S.place ? ' class="on"' : ''}>${E(p.label)}</button>`).join('')}</div><div class="dc-g"><label class="dc-on dc-bossw" id="dcBossW"><input type="checkbox" id="dcBoss"${S.boss ? ' checked' : ''}>Boss</label><label class="dc-f dc-w" id="dcEnemyW"><span>Enemy</span><select id="dcEnemy"></select></label><label class="dc-f" id="dcElvW"><span>Enemy level</span><input type="number" min="1" step="1" inputmode="numeric" id="dcElv" value="${E(S.elv)}"></label>${num('def', 'Enemy Defense')}<label class="dc-f" id="dcWeakW"><span>Weak to (Trait Dungeons)</span><select data-k="weak"><option value="">None</option>${C.statuses
   .filter((s) => s.hitBonus)
   .map((s) => `<option${S.weak === s.name ? ' selected' : ''}>${E(s.name)}</option>`)
   .join(
     '',
   )}</select></label><label class="dc-f" id="dcTowerW"><span>Tower of Trials</span><select data-k="tower"><option value="">Not in a tower</option>${(TOWER_TRIALS.towers || []).map((t) => `<option value="${E(t.id)}"${S.tower === t.id ? ' selected' : ''}>${E(t.name)}</option>`).join('')}</select></label></div><p class="gx-note" id="dcEnemyNote"></p></div>
 <div class="gx-box"><h3>Statuses on the enemy</h3><p class="gx-sub">${E(C.statusHint)}</p><div class="gx-wrap"><table class="gx-tbl dc-st"><thead><tr><th>On enemy</th><th>Hit bonus</th><th>Additional Attack Power</th><th>Additional Damage %</th></tr></thead><tbody>${rows}</tbody></table></div></div>
 </div><aside class="gx-box dc-out" id="dcOut" aria-live="polite"></aside></div>`;
  const skSel = $('dcSkill'),
    lvSel = $('dcLv');
  function fillLv(s, keep) {
    const m = s && s.meta.maxLevel > 1 ? s.meta.maxLevel : 1;
    const lv = keep && +S.lv >= 1 && +S.lv <= m ? +S.lv : m;
    lvSel.innerHTML = Array.from(
      { length: m },
      (_, n) => `<option${n + 1 === lv ? ' selected' : ''}>${n + 1}</option>`,
    ).join('');
    S.lv = lv;
  }
  function dcAdj(s) {
    return s && (C.skillAdjust || []).find((a) => a.hero === S.hero && a.slots.includes(s.slot));
  }
  function dcVars(s) {
    const a = dcAdj(s);
    return (a && a.variants) || [];
  }
  function fillVar(s, keep) {
    const V = dcVars(s),
      many = V.length > 1;
    $('dcVarW').style.display = many ? '' : 'none';
    if (!keep || !V[+S.varIdx]) S.varIdx = 0;
    $('dcVar').innerHTML = V.map(
      (v, n) => `<option value="${n}"${n === +S.varIdx ? ' selected' : ''}>${E(v.label)}</option>`,
    ).join('');
  }
  function setPct(s) {
    if (!s) return;
    const v = dcVars(s)[+S.varIdx];
    S.pct = +(dcPct(s, +S.lv) * (v ? v.mult : 1)).toFixed(1);
    const p = root.querySelector('[data-k="pct"]');
    if (p) p.value = S.pct;
  }
  function skillNote(s) {
    const b = [],
      a = dcAdj(s),
      v = dcVars(s)[+S.varIdx];
    if (a && a.note) b.push(a.note);
    if (v && v.mult !== 1) b.push(C.variantNote);
    if (s && s.meta.requiresAny && s.meta.requiresAny.length)
      b.push('Needs ' + s.meta.requiresAny.join(' or ') + ' on the enemy.');
    if (s && s.meta.inflicts && s.meta.inflicts.length)
      b.push('Inflicts ' + s.meta.inflicts.join(', ') + '; tick it below for the hits that land after that.');
    $('dcSkillNote').textContent = b.join(' ');
  }
  function fillSkills(keep) {
    const L = dcSkills(S.hero);
    if (!keep || !L.some((s) => s.skill === S.skill && s.slot === S.slotName))
      ((S.skill = (L[0] || {}).skill || ''), (S.slotName = (L[0] || {}).slot || ''), (keep = false));
    skSel.innerHTML = L.map(
      (s, n) =>
        `<option value="${n}"${s.skill === S.skill && s.slot === S.slotName ? ' selected' : ''}>${E(s.slot)}: ${E(s.skill.replace(/\s*\(Lv\.\d+\)\s*$/, ''))}</option>`,
    ).join('');
    const cur = L[+skSel.value];
    fillLv(cur, keep);
    fillVar(cur, keep);
    if (!keep || S.pct === '') setPct(cur);
    skillNote(cur);
  }
  fillSkills(!!saved);
  function dcNeeds(sk) {
    const R = (sk && sk.meta && sk.meta.requiresAny) || [],
      A = C.requireAlias || {},
      N = C.requireNoLock || [];
    if (!R.length || R.some((x) => N.includes(x))) return [];
    return [...new Set(R.map((x) => A[x] || x))].filter((x) => C.statuses.some((t) => t.name === x));
  }
  function syncReq() {
    const need = dcNeeds(dcSkills(S.hero)[+skSel.value]),
      eff = JSON.parse(JSON.stringify(S.st || {})),
      ticked = need.filter((n) => S.st[n] && S.st[n].on);
    let force = [],
      lock = [];
    if (need.length === 1) {
      force = need;
      lock = need;
    } else if (need.length > 1) {
      if (!ticked.length) {
        force = [need[0]];
        lock = force;
      } else if (ticked.length === 1) lock = ticked;
    }
    force.forEach((n) => {
      eff[n] = { ...(eff[n] || {}), on: true };
    });
    root.querySelectorAll('input[data-f="on"]').forEach((el) => {
      const n = el.dataset.st,
        l = lock.includes(n);
      el.checked = !!(eff[n] && eff[n].on);
      el.disabled = l;
      const lab = el.closest('.dc-on');
      lab.classList.toggle('dc-locked', l);
      lab.title = l ? C.lockTitle : '';
    });
    return eff;
  }
  function dcTower() {
    return S.place === 'world' ? S.tower : '';
  }
  function dcWeak() {
    return S.place === 'trait' ? S.weak : '';
  }
  function dcExtras() {
    const tw = (TOWER_TRIALS.towers || []).find((t) => t.id === dcTower()),
      tb = TOWER_TRIALS.bonus || {},
      dots = (STATUS_EFFECTS.damageOverTime || {}).statuses || [],
      N = (x) => Number(x) || 0;
    C.statuses.forEach((s) => {
      const q = (a) => root.querySelector(`[${a}="${CSS.escape(s.name)}"]`),
        hx = q('data-xh'),
        ax = q('data-xa'),
        set = (el, v, t) => {
          el.hidden = !v;
          el.textContent = v ? '+' + v + '%' : '';
          el.title = t || '';
        };
      const w = dcWeak() === s.name && s.hitBonus ? s.hitBonus * (C.weaknessMultiplier - 1) : 0;
      set(hx, w, w ? C.weakTip.replace('{s}', s.name).replace('{m}', C.weaknessMultiplier) : '');
      const a = tw ? (tw.status === s.name ? N(tb.own) : dots.includes(s.name) ? N(tb.dot) : N(tb.other)) : 0;
      set(
        ax,
        a,
        a ? C.towerTip.replace('{t}', tw.name).replace('{w}', tw.status === s.name ? C.towerOwn : C.towerDot) : '',
      );
    });
  }
  function draw() {
    dcExtras();
    const eff = syncReq(),
      r = dcCompute({ ...S, weak: dcWeak(), tower: dcTower(), st: eff }),
      out = $('dcOut'),
      fmt = (x) => Math.round(x).toLocaleString('en-GB');
    if (!(+S.attack > 0) || !(+S.pct > 0)) {
      out.innerHTML = `<h3>Result</h3><p class="gx-sub">${E(C.emptyHint)}</p>`;
      return;
    }
    const pc = (a, b) => (b > 0 ? (a / b - 1) * 100 : 0),
      small = [];
    if (+S.ap > 0)
      small.push(
        `Armor Penetration ${E(S.ap)} adds +${pc(r.non, r.noAp).toFixed(1)}% (+${fmt(r.non - r.noAp)} damage).`,
      );
    if (+S.di > 0)
      small.push(`Defense Ignore ${E(S.di)}% adds +${pc(r.non, r.noDi).toFixed(1)}% (+${fmt(r.non - r.noDi)} damage).`);
    if (+S.ap > 0 && +S.di > 0)
      small.push(`Together +${pc(r.non, r.none).toFixed(1)}% (+${fmt(r.non - r.none)} damage).`);
    small.push(`This enemy's Defense still blocks ${(r.block * 100).toFixed(1)}% of the hit.`);
    if (r.over) small.push(C.overNote);
    if (r.dots.length) {
      const t = (STATUS_EFFECTS.damageOverTime || {}).tickPctByStacks || [];
      small.push(
        `${r.dots.map((s) => s.name).join(', ')} ticks: ${t.map((p) => fmt(Math.floor((r.atk * p) / 100))).join(' / ')} at ${t.map((_, n) => n + 1).join(' / ')} stacks, ${(STATUS_EFFECTS.damageOverTime || {}).ticks} ticks each. They ignore Defense and never crit.`,
      );
    }
    const un = [];
    r.on.forEach((s) => {
      if (s.untested) un.push(s.untested);
    });
    if (dcWeak() && !(C.weaknessMeasured || []).includes(dcWeak()) && r.on.some((s) => s.name === dcWeak()))
      un.push(C.weaknessUntested);
    const tw = (TOWER_TRIALS.towers || []).find((t) => t.id === dcTower());
    if (tw && tw.measured === false) un.push(C.towerUntested);
    if (tw && r.dots.some((s) => !((TOWER_TRIALS.bonus || {}).dotTested || []).includes(s.name)))
      un.push(C.towerDotUntested);
    const ei = dcEnemyInfo();
    if (ei && ei.t) {
      if (ei.p.note) un.push(ei.p.note);
      if (ei.t.once) un.push(C.onceNote);
      if (ei.t.note) un.push(ei.t.note);
      if (ei.far) un.push(C.levelFarNote);
      else if (ei.est) un.push(C.levelEstNote);
    }
    out.innerHTML = `<h3>Result</h3><div class="dc-big"><div><span>Non-crit</span><b>${fmt(r.non)}</b></div><div><span>Crit</span><b class="dc-c">${fmt(r.crit)}</b></div>${+S.cr > 0 ? `<div><span>Average at ${E(Math.min(+S.cr, 100))}% Crit Rate</span><b>${fmt(r.avg)}</b></div>` : ''}</div>
  <p class="dc-small">${small.join('<br>')}</p>${un.length ? `<p class="dc-small dc-warn">${[...new Set(un)].map(E).join('<br>')}</p>` : ''}<p class="dc-small">${(C.notes || []).map(E).join('<br>')}</p><p class="dc-small">${E(C.formula)}</p><button type="button" class="dc-reset" id="dcReset">Reset</button>`;
    $('dcReset').onclick = () => {
      try {
        localStorage.removeItem('dsw.dmgcalc.v1');
      } catch (x) {}
      renderDamageCalc();
    };
  }
  $('dcHero').onchange = (e) => {
    S.hero = e.target.value;
    fillSkills(false);
    draw();
    dcSave();
  };
  skSel.onchange = () => {
    const s = dcSkills(S.hero)[+skSel.value];
    S.skill = s.skill;
    S.slotName = s.slot;
    fillLv(s, false);
    fillVar(s, false);
    setPct(s);
    skillNote(s);
    draw();
    dcSave();
  };
  $('dcVar').onchange = (e) => {
    S.varIdx = +e.target.value;
    const s = dcSkills(S.hero)[+skSel.value];
    setPct(s);
    skillNote(s);
    draw();
    dcSave();
  };
  lvSel.onchange = () => {
    S.lv = +lvSel.value;
    setPct(dcSkills(S.hero)[+skSel.value]);
    draw();
    dcSave();
  };
  function dcPlace() {
    return places.find((p) => p.id === S.place) || places[0];
  }
  function dcEnemyInfo() {
    if (S.typed) return null;
    const p = dcPlace(),
      c = DEFENSE_MODEL.levelCurve,
      world = p.id === 'world';
    if (world && S.boss) return { e: enemies[S.wboss] };
    const t =
      S.boss && p.bossMult
        ? { mult: p.bossMult }
        : p.enemies
          ? p.enemies[S.nmob]
          : world
            ? types[S.enemy]
            : { mult: p.mobMult || 1 };
    const factor = world ? c.worldFactor : p.factor || 1;
    return { t, p, factor, ...dcEnemyDef(t.mult, factor, +S.elv) };
  }
  function fillEnemy() {
    const p = dcPlace(),
      world = p.id === 'world',
      sel = $('dcEnemy'),
      custom = `<option value="custom">${E(C.customLabel)}</option>`;
    let body = '',
      val = 0;
    if (world && S.boss) {
      body = `<optgroup label="${E(C.fixedGroup)}">${enemies.map((e, n) => `<option value="${n}">${E(e.name)}${e.level ? ' (Lv.' + e.level + ')' : ''}</option>`).join('')}</optgroup>`;
      val = S.wboss;
    } else if (world) {
      const groups = [...new Set(types.map((t) => t.group))];
      body = groups
        .map(
          (g) =>
            `<optgroup label="${E(g)}">${types.map((t, n) => (t.group === g ? `<option value="${n}">${E(t.name)}</option>` : '')).join('')}</optgroup>`,
        )
        .join('');
      val = S.enemy;
    } else if (p.enemies && !S.boss) {
      body = p.enemies.map((t, n) => `<option value="${n}">${E(t.name)}</option>`).join('');
      val = S.nmob;
    }
    sel.innerHTML = body ? body + custom : '';
    sel.value = S.typed ? 'custom' : String(val);
    $('dcEnemyW').style.display = body ? '' : 'none';
  }
  function applyEnemy() {
    const p = dcPlace(),
      ei = dcEnemyInfo(),
      defEl = root.querySelector('[data-k="def"]');
    fillEnemy();
    $('dcWeakW').style.display = p.id === 'trait' ? '' : 'none';
    $('dcTowerW').style.display = p.id === 'world' ? '' : 'none';
    $('dcBossW').style.display = p.bossMult || p.id === 'world' ? '' : 'none';
    $('dcElvW').style.display = p.id === 'world' && S.boss ? 'none' : '';
    let note = '';
    if (!ei) note = C.typedNote;
    else if (ei.e) {
      S.def = ei.e.defense;
      note = C.fixedNote;
    } else {
      S.def = Math.round(ei.def);
      note = `Basic enemy at Lv.${E(S.elv)}: ${Math.round(ei.base).toLocaleString('en-GB')}${ei.factor !== 1 ? ` × ${ei.factor} (${E(ei.p.label)})` : ''}${ei.t.mult !== 1 ? ` × ${ei.t.mult}` : ''}.`;
    }
    if (ei) defEl.value = S.def;
    $('dcEnemyNote').textContent = note;
  }
  $('dcEnemy').onchange = (e) => {
    const v = e.target.value,
      p = dcPlace();
    S.typed = v === 'custom';
    if (!S.typed) {
      if (p.id === 'world' && S.boss) S.wboss = +v;
      else if (p.id === 'world') S.enemy = +v;
      else S.nmob = +v;
    }
    applyEnemy();
    if (S.typed) root.querySelector('[data-k="def"]').focus();
    draw();
    dcSave();
  };
  $('dcWhere').onclick = (e) => {
    const b = e.target.closest('[data-place]');
    if (!b) return;
    S.place = b.dataset.place;
    S.typed = false;
    $('dcWhere')
      .querySelectorAll('[data-place]')
      .forEach((x) => {
        const on = x === b;
        x.classList.toggle('on', on);
        x.setAttribute('aria-pressed', on);
      });
    applyEnemy();
    draw();
    dcSave();
  };
  $('dcBoss').onchange = (e) => {
    S.boss = e.target.checked;
    S.typed = false;
    applyEnemy();
    draw();
    dcSave();
  };
  $('dcElv').oninput = (e) => {
    if (+e.target.value > 0) {
      S.elv = +e.target.value;
      S.typed = false;
      applyEnemy();
      draw();
      dcSave();
    }
  };
  root.oninput = root.onchange = (e) => {
    const t = e.target;
    if (t.dataset.k) {
      S[t.dataset.k] = t.value;
      if (t.dataset.k === 'def' && !S.typed) {
        S.typed = true;
        applyEnemy();
      }
    } else if (t.dataset.st) {
      const r = (S.st[t.dataset.st] = S.st[t.dataset.st] || {});
      r[t.dataset.f] = t.type === 'checkbox' ? t.checked : t.value;
    } else return;
    draw();
    dcSave();
  };
  applyEnemy();
  draw();
}
// Levelling calculator (Tools page, Beta). Follows the game's item-picking rule; data from LEVEL_COSTS.
// ==== Tools (preview): levelling calculator ====
function lvPlan(kind, from, to, bar, names, skipFirst) {
  const L = LEVEL_COSTS,
    T = L.exp[kind].toNext,
    all = L.items[kind],
    items = all.filter((i) => names.includes(i.name)).sort((a, b) => b.exp - a.exp),
    caps = Object.keys(L.breakthroughs[kind])
      .map(Number)
      .sort((a, b) => a - b);
  const counts = {},
    done = [];
  let total = 0,
    lost = 0,
    left = 0,
    s = from,
    first = true;
  const small = items[items.length - 1];
  while (s < to && small) {
    const cap = caps.find((c) => c > s),
      e = cap && cap < to ? cap : to;
    let need = 0;
    for (let l = s; l < e; l++) need += T[l - 1];
    total += need;
    if (first) {
      need = Math.max(0, need - bar);
      first = false;
    }
    items.forEach((i) => {
      const n = Math.floor(need / i.exp);
      if (n) {
        counts[i.name] = (counts[i.name] || 0) + n;
        need -= n * i.exp;
      }
    });
    let over = 0;
    if (need > 0) {
      counts[small.name] = (counts[small.name] || 0) + 1;
      over = small.exp - need;
    }
    if (caps.includes(e) || e === L.exp[kind].toNext.length + 1) lost += over;
    else left = over;
    s = e;
  }
  caps.forEach((c) => {
    if (c >= from && c < to && !(c === from && skipFirst)) done.push(c);
  });
  const itemGold = Object.entries(counts).reduce((g, [n, k]) => g + k * all.find((i) => i.name === n).gold, 0),
    btGold = done.reduce((g, c) => g + L.breakthroughs[kind][c].gold, 0);
  return { counts, total, lost, left, itemGold, btGold, breakthroughs: done };
}
const LV_DEF = { kind: 'hero', from: 1, to: 70, bar: 0, skip: false, off: [], arch: '', hero: '' };
function lvSrc(name) {
  const D = DUNGEONS || {},
    R = D.rewardItems || {},
    n = name.toLowerCase();
  let best = null;
  (D.normal || []).forEach((x) =>
    (x.difficulties || []).forEach((l, i) =>
      (l.rewards || []).forEach(([k, a]) => {
        if ((R[k]?.name || '').toLowerCase() === n && (!best || a > best.amount))
          best = { dungeon: x.name, diff: (D.difficulties || [])[i]?.name || l.name, amount: a, icon: R[k].icon };
      }),
    ),
  );
  return best;
}
function lvKarmaMats(arch, levels) {
  const K = LEVEL_COSTS.breakthroughs.karmaPattern || {},
    T = K.table || {},
    cry = (K.crystal || {})[arch],
    key = String(arch || '').toLowerCase(),
    TD = TRAIT_DUNGEONS || {},
    boss = (TD.bosses || []).find((b) => b.archetype === arch),
    tot = new Map(),
    add = (n, a, m) => {
      if (n && a) {
        const o = tot.get(n) || { amount: 0, ...m };
        o.amount += a;
        tot.set(n, o);
      }
    };
  levels.forEach((c) => {
    const t = T[c];
    if (!t) return;
    add(cry, t.crystal, { kind: 'crystal' });
    (t.stones || []).forEach(([g, a]) =>
      add(`${g} ${arch} Stone`, a, { kind: 'stone', colour: (K.stoneColour || {})[g] }),
    );
    add('Chronograph of Ages', t.chronograph, { kind: 'chrono', icon: 'assets/items/icons/chronograph-of-ages.webp' });
  });
  const ord = { crystal: 0, stone: 1, chrono: 2 },
    G = ['Low-Grade', 'Intermediate', 'High-Grade'];
  return [...tot]
    .map(([name, m]) => {
      let src = null,
        icon = m.icon || '';
      if (m.kind === 'crystal') {
        src = lvSrc(name);
        icon = src?.icon || 'assets/items/icons/' + name.toLowerCase().replace(/ /g, '-') + '.webp';
      }
      if (m.kind === 'stone') {
        icon = `assets/trait/icons/${key}-${m.colour}.webp`;
        (TD.difficultyLevels || []).forEach((l) =>
          (l.rewards || []).forEach(([k, a]) => {
            if (k === m.colour && boss && (!src || a > src.amount))
              src = { dungeon: boss.name, diff: l.name, amount: a };
          }),
        );
      }
      return {
        name,
        amount: m.amount,
        src,
        icon,
        chrono: m.kind === 'chrono',
        k: ord[m.kind] * 10 + G.findIndex((g) => name.startsWith(g)),
      };
    })
    .sort((a, b) => a.k - b.k);
}
function lvMats(hero, levels) {
  const B = LEVEL_COSTS.breakthroughs,
    T = B.heroTable || {},
    P = B.heroPattern || {},
    h = HEROES.find((x) => x.name === hero);
  if (!h) return [];
  const mon = Object.keys(P.monsterMaterial || {}).find((k) => P.monsterMaterial[k].includes(hero)),
    base = mon === 'Bone Fragment' ? 'Monster Bone Fragment' : mon,
    sec = (P.secondMaterial || {})[h.archetype],
    ins = (P.insignia || {})[h.faction],
    tot = new Map(),
    add = (n, a) => {
      if (n && a) tot.set(n, (tot.get(n) || 0) + a);
    };
  levels.forEach((c) => {
    const t = T[c];
    if (!t) return;
    (t.monster || []).forEach(([g, a]) => mon && add(g + ' ' + base, a));
    add(sec, t.second);
    add(ins, t.insignia);
  });
  const G = ['Lowest-Grade', 'Low-Grade', 'Intermediate'],
    ord = (n) => {
      const g = G.findIndex((x) => n.startsWith(x + ' '));
      return g >= 0 ? g : n === sec ? 3 : 4;
    };
  return [...tot]
    .sort((a, b) => ord(a[0]) - ord(b[0]))
    .map(([name, amount]) => {
      const s = lvSrc(name),
        insg = name === ins;
      return {
        name,
        amount,
        src: s,
        ins: insg,
        icon: s?.icon || (insg ? 'assets/items/icons/' + name.toLowerCase().replace(/ /g, '-') + '.webp' : ''),
      };
    });
}
function lvSave(S) {
  try {
    localStorage.setItem('dsw.lvcalc.v1', JSON.stringify(S));
  } catch (e) {}
}
function renderLevelCalc() {
  const root = $('lvRoot');
  if (!root || !LEVEL_COSTS || !LEVEL_COSTS.calc) return;
  const E = profileEsc,
    L = LEVEL_COSTS,
    C = L.calc,
    fmt = (n) => Number(n).toLocaleString('en-GB');
  let saved = null;
  try {
    saved = JSON.parse(localStorage.getItem('dsw.lvcalc.v1') || 'null');
  } catch (e) {}
  const S = { ...LV_DEF, ...(saved || {}) };
  const max = () => Math.min(L.exp[S.kind].toNext.length + 1, C.maxLevel || Infinity);
  root.innerHTML = `<div class="gx-box dc-head"><h3>Levelling calculator <span class="gx-tag">BETA</span></h3><p class="gx-sub">${E(C.intro)}</p></div><div class="dc"><div class="dc-in"><div class="gx-box"><h3>Level range</h3><div class="dc-g"><label class="dc-f"><span>Levelling</span><select id="lvKind"><option value="hero"${S.kind === 'hero' ? ' selected' : ''}>Hero</option><option value="karma"${S.kind === 'karma' ? ' selected' : ''}>Karma</option></select></label><label class="dc-f"><span>From level</span><input type="number" min="1" max="${max() - 1}" step="1" id="lvFrom" value="${E(S.from)}"></label><label class="dc-f"><span>To level</span><input type="number" min="2" max="${max()}" step="1" id="lvTo" value="${E(S.to)}"></label><label class="dc-f"><span>EXP already in the bar</span><input type="number" min="0" step="1" id="lvBar" value="${E(S.bar)}"></label></div><label class="dc-on lv-skip" id="lvSkipW"><input type="checkbox" id="lvSkip"${S.skip ? ' checked' : ''}><span id="lvSkipT"></span></label></div><div class="gx-box" id="lvHeroBox"><h3>${E(C.heroPick)}</h3><p class="gx-sub">${E(C.heroPickHint)}</p><div class="lv-arch" id="lvArch" role="group" aria-label="Archetype"></div><div class="lv-heroes" id="lvHeroes" role="group" aria-label="Hero"></div></div><div class="gx-box"><h3>Items to use</h3><p class="gx-sub">${E(C.itemsHint)}</p><div class="lv-items" id="lvItems"></div></div></div><aside class="gx-box dc-out" id="lvOut" aria-live="polite"></aside></div>`;
  function pick() {
    const box = $('lvHeroBox'),
      kh = S.kind === 'hero';
    box.querySelector('h3').textContent = kh ? C.heroPick : C.karmaPick;
    box.querySelector('.gx-sub').textContent = kh ? C.heroPickHint : C.karmaPickHint;
    $('lvHeroes').style.display = kh ? '' : 'none';
    const arches = (ARCHES || []).filter((a) => HEROES.some((x) => x.archetype === a));
    $('lvArch').innerHTML = arches
      .map((a) => {
        const ic = HEROES.find((x) => x.archetype === a).archIcon;
        return `<button type="button" data-lva="${E(a)}" title="${E(a)}" aria-label="${E(a)}" aria-pressed="${S.arch === a}"${S.arch === a ? ' class="on"' : ''}><img src="${E(ic)}" alt=""></button>`;
      })
      .join('');
    const hs = HEROES.filter((x) => x.archetype === S.arch);
    $('lvHeroes').innerHTML = hs
      .map(
        (x) =>
          `<button type="button" data-lvh="${E(x.name)}" title="${E(x.name)} · ${E(x.archetype)}" aria-pressed="${S.hero === x.name}"${S.hero === x.name ? ' class="on"' : ''}><img src="${E(x.portrait)}" alt=""><span>${E(x.name)}</span></button>`,
      )
      .join('');
  }
  function items() {
    $('lvItems').innerHTML = L.items[S.kind]
      .map(
        (i) =>
          `<label class="dc-on"><input type="checkbox" data-lvi="${E(i.name)}"${S.off.includes(i.name) ? '' : ' checked'}><img src="${E(i.icon)}" alt=""><span>${E(i.name)} <small class="dc-mute">${fmt(i.exp)} EXP · ${fmt(i.gold)} Gold</small></span></label>`,
      )
      .join('');
  }
  function draw() {
    S.from = Math.min(Math.max(1, Math.round(+S.from) || 1), max() - 1);
    S.to = Math.min(Math.max(S.from + 1, Math.round(+S.to) || 2), max());
    const caps = L.breakthroughs[S.kind],
      isCap = !!caps[S.from];
    $('lvSkipW').style.display = isCap ? '' : 'none';
    if (isCap) $('lvSkipT').textContent = `Breakthrough at level ${S.from} is already done`;
    const names = L.items[S.kind].filter((i) => !S.off.includes(i.name)).map((i) => i.name),
      out = $('lvOut');
    if (!names.length) {
      out.innerHTML = `<h3>Result</h3><p class="gx-sub">${E(C.noItems)}</p>`;
      return;
    }
    const r = lvPlan(S.kind, S.from, S.to, Math.max(0, +S.bar || 0), names, isCap && S.skip),
      rows = L.items[S.kind]
        .filter((i) => r.counts[i.name])
        .map(
          (i) =>
            `<div class="lv-row"><img src="${E(i.icon)}" alt=""><span>${E(i.name)}</span><b>${fmt(r.counts[i.name])}×</b></div>`,
        )
        .join('');
    const hero = (S.kind === 'hero' && S.hero) || (S.kind === 'karma' && S.arch),
      bt = r.breakthroughs
        .map((c) => {
          const b = caps[c],
            ex = hero ? null : Object.entries(b.examples || {})[0];
          return `<div class="lv-bt"><span>Level ${c}</span><b>${fmt(b.gold)} Gold</b>${ex ? `<small class="dc-mute">${E(ex[0])}: ${E(ex[1])}</small>` : ''}</div>`;
        })
        .join('');
    let farm = '';
    {
      const kh = S.kind === 'hero',
        F = (kh ? C.farmExp : C.farmExpKarma) || {},
        cd = (DUNGEONS.currency || []).find((x) => x.name === F.dungeon),
        lvl = cd?.difficulties?.[F.difficulty],
        per = (lvl?.rewards || []).find((x) => x[0] === F.reward)?.[1],
        it = L.items[S.kind].find((i) => i.name === F.item),
        need = Math.max(0, r.total - Math.max(0, +S.bar || 0));
      const mats = hero ? (kh ? lvMats(S.hero, r.breakthroughs) : lvKarmaMats(S.arch, r.breakthroughs)) : [];
      farm =
        `<h5>${E(C.matsTitle)}</h5>` +
        (hero
          ? mats.length
            ? mats
                .map(
                  (m) =>
                    `<div class="lv-row lv-mat"><img src="${E(m.icon)}" alt=""><span>${E(m.name)}<small class="dc-mute">${m.src ? `${E(m.src.dungeon)} · ${E(m.src.diff)}: ${fmt(Math.ceil(m.amount / m.src.amount))} run${Math.ceil(m.amount / m.src.amount) > 1 ? 's' : ''} (${fmt(m.src.amount)} each)` : m.chrono && C.chronographBuy ? `${E(C.chronographBuy.vendor)}: ${fmt(m.amount * C.chronographBuy.gold)} Gold (${fmt(C.chronographBuy.gold)} each) · or Exchange: ${fmt(m.amount * C.chronographBuy.emblems)} Adventurer's Emblems (${fmt(C.chronographBuy.emblems)} each)` : m.ins && C.insigniaBuy ? `${E(C.insigniaBuy.vendor)}: ${fmt(m.amount * C.insigniaBuy.gold)} Gold (${fmt(C.insigniaBuy.gold)} each) · or Exchange: ${fmt(m.amount * C.insigniaBuy.emblems)} Adventurer's Emblems (${fmt(C.insigniaBuy.emblems)} each)` : ''}</small></span><b>${fmt(m.amount)}×</b></div>`,
                )
                .join('')
            : `<p class="dc-small">No breakthroughs in this range.</p>`
          : `<p class="dc-small">${E(kh ? C.heroNone : C.karmaNone)}</p>`);
      if (per && it && need) {
        const runs = Math.ceil(need / (per * it.exp));
        farm += `<div class="lv-row lv-mat"><img src="${E(it.icon)}" alt=""><span>EXP<small class="dc-mute">${E(F.dungeon)} · ${E(lvl.name)}: ${fmt(runs)} run${runs > 1 ? 's' : ''} (${fmt(per)} × ${E(it.name)} each)</small></span><b>${fmt(need)}</b></div>`;
      }
      farm += `<p class="dc-small">${E(kh ? C.farmNote : C.farmNoteKarma)}</p>`;
    }
    out.innerHTML = `<h3>Result</h3><div class="dc-big"><div><span>Total Gold</span><b>${fmt(r.itemGold + r.btGold)}</b></div><div><span>Total EXP</span><b>${fmt(r.total)}</b></div></div><p class="dc-small">Items ${fmt(r.itemGold)} Gold${r.btGold ? ` · breakthroughs ${fmt(r.btGold)} Gold` : ''}</p>${rows ? `<h5>Items</h5>${rows}` : ''}${bt ? `<h5>Breakthroughs</h5>${bt}${hero ? '' : `<p class="dc-small">${E(C.btNote)}</p>`}` : ''}${farm}${r.left ? `<p class="dc-small">${fmt(r.left)} EXP left in the bar afterwards.</p>` : ''}${r.lost ? `<p class="dc-small">${fmt(r.lost)} EXP wasted at level caps, where the last item overshoots.</p>` : ''}<p class="dc-small">${E(C.note)}</p>`;
  }
  const save = () => {
    draw();
    lvSave(S);
  };
  items();
  pick();
  $('lvArch').onclick = (e) => {
    const b = e.target.closest('[data-lva]');
    if (!b) return;
    S.arch = b.dataset.lva;
    if (S.kind === 'hero' && !HEROES.some((x) => x.name === S.hero && x.archetype === S.arch)) S.hero = '';
    pick();
    save();
  };
  $('lvHeroes').onclick = (e) => {
    const b = e.target.closest('[data-lvh]');
    if (!b) return;
    S.hero = b.dataset.lvh;
    pick();
    save();
  };
  $('lvKind').onchange = (e) => {
    S.kind = e.target.value;
    S.off = [];
    if (S.kind === 'hero' && S.hero) {
      const x = HEROES.find((y) => y.name === S.hero);
      if (x) S.arch = x.archetype;
    }
    items();
    pick();
    save();
  };
  [
    ['lvFrom', 'from'],
    ['lvTo', 'to'],
    ['lvBar', 'bar'],
  ].forEach(([id, k]) => {
    $(id).oninput = (e) => {
      if (e.target.value !== '') {
        const mx = +e.target.max;
        if (mx && +e.target.value > mx) e.target.value = mx;
        S[k] = +e.target.value;
        save();
      }
    };
    $(id).onblur = (e) => {
      e.target.value = S[k];
    };
  });
  $('lvSkip').onchange = (e) => {
    S.skip = e.target.checked;
    save();
  };
  $('lvItems').onchange = (e) => {
    const n = e.target.dataset.lvi;
    if (!n) return;
    S.off = S.off.filter((x) => x !== n);
    if (!e.target.checked) S.off.push(n);
    save();
  };
  draw();
}
function renderTools() {
  const t = $('toolTabs');
  if (!t) return;
  let cur = 'damage';
  try {
    cur = localStorage.getItem('dsw.tool') || cur;
  } catch (e) {}
  const tabs = [
    ['damage', 'Damage calculator'],
    ['level', 'Levelling calculator'],
    ['backup', 'Backup & restore'],
  ];
  const show = () => {
    t.innerHTML = tabs
      .map(
        ([k, l]) => `<button type="button" class="${k === cur ? 'on' : ''}" data-tool="${k}">${profileEsc(l)}</button>`,
      )
      .join('');
    $('dcRoot').hidden = cur !== 'damage';
    $('lvRoot').hidden = cur !== 'level';
    $('backupRoot').hidden = cur !== 'backup';
  };
  t.onclick = (e) => {
    const k = e.target.dataset.tool;
    if (!k) return;
    cur = k;
    try {
      localStorage.setItem('dsw.tool', k);
    } catch (x) {}
    show();
    navSchedule();
  };
  renderDamageCalc();
  renderLevelCalc();
  renderSettingsBackup();
  show();
}
// ==== Guides (preview) ====
function renderGuides() {
  const root = $('guidesBody');
  if (!root) return;
  const G = (typeof GUIDES !== 'undefined' && GUIDES) || {};
  const E = profileEsc;
  root.innerHTML = (G.categories || [])
    .map(
      (c) =>
        `<section class="gd-cat"><h3>${E(c.name)}</h3><div class="gd-grid">${(c.items || []).length ? (c.items || []).map((it) => `<button type="button" class="gd-card${it.ready ? '' : ' soon'}" ${it.ready ? '' : 'disabled'}>${it.image ? `<img src="${E(it.image)}" alt="">` : '<span class="gd-ph"></span>'}<span>${E(it.title)}</span>${it.ready ? '<span class="gd-arrow">→</span>' : '<span class="gd-soon">soon</span>'}</button>`).join('') : '<p class="gd-empty">No guides yet.</p>'}</div></section>`,
    )
    .join('');
}

/* Visitor progress backups (Beta, 11 Nov 2026). Part of the Tools page, following the calculators.
   Only the five documented progress keys are exported or restored. No account preset is included. */
const PROGRESS_FORMAT = 'dragonsword-awakening-progress';
const PROGRESS_VERSION = 1;
const PROGRESS_LIMIT = 1024 * 1024;
const PROGRESS_UNDO = 'dsw.progressUndo.v1';
const PROGRESS_KEYS = [
  ['dsw.selectedTitles.v1', 'Titles'],
  ['dsw.achievements.v1', 'Achievements'],
  ['dsw.cooked.v1', 'Cookbook'],
  ['dsw.dmgcalc.v1', 'Damage calculator'],
  ['dsw.lvcalc.v1', 'Levelling calculator'],
];
function progressObject(value, label, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label}: expected an object.`);
  if (Object.keys(value).some((key) => !allowed.includes(key))) throw new Error(`${label}: contains an unknown field.`);
}
function progressNames(value, label, names) {
  if (!Array.isArray(value) || value.length > 5000 || new Set(value).size !== value.length)
    throw new Error(`${label}: expected a list without duplicates.`);
  if (value.some((name) => typeof name !== 'string' || !names.includes(name)))
    throw new Error(`${label}: contains an entry this version of the guide does not recognise.`);
}
function progressNumber(value, label, min = 0, max = 1e12) {
  if (
    value !== '' &&
    ((typeof value !== 'number' && typeof value !== 'string') ||
      (typeof value === 'string' && !value.trim()) ||
      !Number.isFinite(Number(value)) ||
      Number(value) < min ||
      Number(value) > max)
  )
    throw new Error(`${label}: expected a valid number.`);
}
function progressCalculator(value, key) {
  const damage = key === 'dsw.dmgcalc.v1';
  const fields = damage ? [...Object.keys(DC_DEF), 'slotName', 'varIdx'] : Object.keys(LV_DEF);
  progressObject(value, damage ? 'Damage calculator' : 'Levelling calculator', fields);
  for (const [field, v] of Object.entries(value)) {
    if (['hero', 'arch', 'skill', 'slotName', 'place', 'kind', 'weak', 'tower'].includes(field)) {
      if (typeof v !== 'string' || v.length > 300) throw new Error(`Calculator ${field}: expected text.`);
      const choices = {
        hero: ['', ...HEROES.map((h) => h.name)],
        arch: ['', ...ARCHES],
        kind: ['hero', 'karma'],
        place: (DEFENSE_MODEL.places || []).map((p) => p.id),
        weak: ['', ...DAMAGE_CALC.statuses.map((s) => s.name)],
        tower: ['', ...(TOWER_TRIALS.towers || []).map((t) => t.id)],
      };
      if (choices[field] && !choices[field].includes(v)) throw new Error(`Calculator ${field}: unknown selection.`);
    } else if (['boss', 'typed', 'skip'].includes(field)) {
      if (typeof v !== 'boolean') throw new Error(`Calculator ${field}: expected true or false.`);
    } else if (field === 'off') {
      progressNames(
        v,
        'EXP items',
        [...LEVEL_COSTS.items.hero, ...LEVEL_COSTS.items.karma].map((i) => i.name),
      );
    } else if (field === 'st') {
      progressObject(
        v,
        'Damage statuses',
        DAMAGE_CALC.statuses.map((s) => s.name),
      );
      for (const row of Object.values(v)) {
        progressObject(row, 'Damage status', ['on', 'aap', 'ad']);
        if ('on' in row && typeof row.on !== 'boolean') throw new Error('Damage status: expected true or false.');
        for (const f of ['aap', 'ad']) if (f in row) progressNumber(row[f], `Damage status ${f}`);
      }
    } else progressNumber(v, `Calculator ${field}`);
  }
  if (!damage) {
    for (const f of ['from', 'to'])
      if (f in value) {
        progressNumber(value[f], `Level ${f}`, 1, LEVEL_COSTS.calc.maxLevel);
        if (!Number.isInteger(Number(value[f]))) throw new Error('Levels must be whole numbers.');
      }
    if ('from' in value && 'to' in value && Number(value.to) <= Number(value.from))
      throw new Error('The final level must be higher than the starting level.');
  } else if (value.skill || value.slotName) {
    const skills = dcSkills(value.hero);
    if (
      !skills.some((s) => (!value.skill || s.skill === value.skill) && (!value.slotName || s.slot === value.slotName))
    )
      throw new Error('Damage calculator: the selected skill is not available for this hero.');
  }
}
function progressValidate(doc) {
  progressObject(doc, 'Backup', ['format', 'version', 'exportedAt', 'storage']);
  if (doc.format !== PROGRESS_FORMAT || doc.version !== PROGRESS_VERSION)
    throw new Error('This is not a supported DragonSword progress backup.');
  if (typeof doc.exportedAt !== 'string' || !Number.isFinite(Date.parse(doc.exportedAt)))
    throw new Error('The backup date is missing or invalid.');
  const keys = PROGRESS_KEYS.map(([key]) => key);
  progressObject(doc.storage, 'Saved progress', keys);
  if (keys.some((key) => !Object.hasOwn(doc.storage, key))) throw new Error('The backup is incomplete.');
  for (const [key, label] of PROGRESS_KEYS) {
    const value = doc.storage[key];
    if (value === null) continue; // No saved value: an exact restore removes this key.
    if (key === TITLE_KEY)
      progressNames(
        value,
        label,
        TITLES.list.map((t) => t.name),
      );
    else if (key === 'dsw.cooked.v1')
      progressNames(
        value,
        label,
        COOKBOOK.dishes.map((d) => d.id),
      );
    else if (key === 'dsw.achievements.v1') {
      progressObject(
        value,
        label,
        (ITEMDB.ach.items || []).map((a) => a.name),
      );
      if (Object.values(value).some((v) => ![0, 1, false, true].includes(v)))
        throw new Error('Achievements: invalid tick.');
    } else progressCalculator(value, key);
  }
  return doc;
}
async function progressCatalogue() {
  if (!ITEMDB.ach) {
    const r = await fetch('assets/items/achievements.json');
    if (!r.ok) throw new Error('Could not load achievements. Please try again.');
    ITEMDB.ach = await r.json();
  }
  if (!Array.isArray(ITEMDB.ach.items) || !ITEMDB.ach.items.length)
    throw new Error('Could not load achievements. Please reload and try again.');
}
function progressSnapshot() {
  return Object.fromEntries(PROGRESS_KEYS.map(([key]) => [key, localStorage.getItem(key)]));
}
function progressDocument() {
  const storage = Object.fromEntries(
    Object.entries(progressSnapshot()).map(([key, raw]) => [key, raw === null ? null : JSON.parse(raw)]),
  );
  return progressValidate({
    format: PROGRESS_FORMAT,
    version: PROGRESS_VERSION,
    exportedAt: new Date().toISOString(),
    storage,
  });
}
function progressWriteRaw(values) {
  for (const [key] of PROGRESS_KEYS) {
    if (values[key] === null) localStorage.removeItem(key);
    else localStorage.setItem(key, values[key]);
  }
}
function progressUndoRecord() {
  const raw = localStorage.getItem(PROGRESS_UNDO);
  if (!raw) return null;
  const r = JSON.parse(raw);
  progressObject(r, 'Recovery copy', ['version', 'storage']);
  if (r.version !== 1) throw new Error('Unsupported recovery copy.');
  progressObject(
    r.storage,
    'Recovery copy',
    PROGRESS_KEYS.map(([key]) => key),
  );
  for (const [key] of PROGRESS_KEYS)
    if (r.storage[key] !== null && typeof r.storage[key] !== 'string') throw new Error('Incomplete recovery copy.');
  return r;
}
function progressRestore(doc) {
  progressValidate(doc);
  const before = progressSnapshot(),
    previousUndo = localStorage.getItem(PROGRESS_UNDO);
  // Save recovery before touching progress. A quota failure here leaves all five keys untouched.
  localStorage.setItem(PROGRESS_UNDO, JSON.stringify({ version: 1, storage: before }));
  try {
    progressWriteRaw(
      Object.fromEntries(
        PROGRESS_KEYS.map(([key]) => [key, doc.storage[key] === null ? null : JSON.stringify(doc.storage[key])]),
      ),
    );
  } catch (error) {
    try {
      progressWriteRaw(before);
      if (previousUndo === null) localStorage.removeItem(PROGRESS_UNDO);
      else localStorage.setItem(PROGRESS_UNDO, previousUndo);
    } catch (rollback) {
      throw new Error(
        'Storage failed during restore. Your recovery copy is saved; use Undo last restore after freeing browser storage.',
      );
    }
    throw new Error('The browser could not save the backup. Your previous progress has been kept.');
  }
}
function progressUndo() {
  const undo = progressUndoRecord();
  if (!undo) throw new Error('There is no restore to undo.');
  const before = progressSnapshot();
  try {
    progressWriteRaw(undo.storage);
    localStorage.removeItem(PROGRESS_UNDO);
  } catch (error) {
    try {
      progressWriteRaw(before);
    } catch (rollback) {
      throw new Error(
        'Browser storage is unavailable. The recovery copy is still saved; free storage and try Undo again.',
      );
    }
    throw new Error('Could not undo the restore. Nothing has been changed; please try again.');
  }
}
function progressDownload(doc) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(doc, null, 2) + '\n'], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `dragonsword-progress-${doc.exportedAt.slice(0, 10)}.json`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function progressReload(message) {
  try {
    sessionStorage.setItem('dsw.progressNotice', message);
  } catch (e) {}
  location.reload();
}
function renderSettingsBackup() {
  const root = $('backupRoot');
  if (!root) return;
  root.innerHTML = `<section class="gx-box progress-backup"><h3>Backup &amp; restore</h3>
    <p>Save your title ticks, achievements, cooked dishes and both calculator settings to a file. Keep a copy to move your progress between browsers or devices.</p>
    <div class="progress-actions"><button type="button" id="progressExport">Download backup</button>
    <label for="progressFile">Open a backup <input type="file" id="progressFile" accept=".json,application/json"></label>
    <button type="button" id="progressUndo" disabled>Undo last restore</button></div>
    <p id="progressStatus" role="status" aria-live="polite"></p>
    <section id="progressReview" class="progress-review" aria-labelledby="progressReviewTitle" hidden>
    <h4 id="progressReviewTitle">Review before restoring</h4><p id="progressDate"></p><ul id="progressSummary"></ul>
    <p>This replaces all five saved sections with the backup, including empty sections. Other browser preferences stay as they are. A recovery copy of your current progress will be saved before anything changes.</p>
    <button type="button" id="progressRestore">Restore this backup</button> <button type="button" id="progressCancel">Cancel</button></section></section>`;
  let pending = null,
    revision = 0;
  const status = (text) => {
    $('progressStatus').textContent = text;
  };
  const reset = () => {
    pending = null;
    $('progressReview').hidden = true;
    $('progressFile').value = '';
  };
  try {
    $('progressUndo').disabled = !progressUndoRecord();
  } catch (e) {
    status(e.message);
  }
  try {
    const notice = sessionStorage.getItem('dsw.progressNotice');
    if (notice) {
      status(notice);
      sessionStorage.removeItem('dsw.progressNotice');
    }
  } catch (e) {}
  $('progressExport').onclick = async () => {
    try {
      await progressCatalogue();
      progressDownload(progressDocument());
      status('Backup downloaded. Keep it somewhere safe.');
    } catch (e) {
      status('Could not export your progress: ' + e.message);
    }
  };
  $('progressFile').onchange = async () => {
    const file = $('progressFile').files[0],
      current = ++revision;
    pending = null;
    $('progressReview').hidden = true;
    if (!file) return;
    try {
      if (file.size > PROGRESS_LIMIT) throw new Error('The file is too large (maximum 1 MB).');
      const text = await file.text();
      await progressCatalogue();
      const doc = progressValidate(JSON.parse(text));
      if (current !== revision) return;
      pending = doc;
      $('progressDate').textContent = `Backup saved: ${new Date(doc.exportedAt).toLocaleString('en-GB')}`;
      const list = $('progressSummary');
      list.replaceChildren();
      for (const [key, label] of PROGRESS_KEYS) {
        const value = doc.storage[key],
          row = document.createElement('li');
        const count =
          value === null
            ? null
            : Array.isArray(value)
              ? value.length
              : key === 'dsw.achievements.v1'
                ? Object.values(value).filter(Boolean).length
                : null;
        row.textContent = `${label}: ${value === null ? 'not saved — will reset' : count === null ? 'saved settings' : count + ' ticked'}`;
        list.append(row);
      }
      $('progressReview').hidden = false;
      status('File checked. Review it below; nothing has been changed.');
      $('progressRestore').focus();
    } catch (e) {
      if (current === revision) {
        reset();
        status('Cannot restore this file: ' + e.message);
      }
    }
  };
  $('progressCancel').onclick = () => {
    revision++;
    reset();
    status('Cancelled. Your progress has not changed.');
  };
  $('progressRestore').onclick = () => {
    if (!pending) return;
    try {
      progressRestore(pending);
      progressReload('Backup restored. Undo last restore is available on this browser.');
    } catch (e) {
      status(e.message);
      try {
        $('progressUndo').disabled = !progressUndoRecord();
      } catch (x) {}
    }
  };
  $('progressUndo').onclick = () => {
    try {
      progressUndo();
      progressReload('Restore undone. Your previous progress is back.');
    } catch (e) {
      status(e.message);
    }
  };
}
