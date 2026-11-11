/* js/07-tierlist-v2-cookbook.js: New tier list (preview; IS_PREVIEW and html.pv are set here) and Cookbook. Part of the site script, split out of index.html on 10 Nov 2026.
   The files load in order (see index.html) and share one global scope, so code that runs at load time may only use what earlier files define. */
// ---- New tier list (TIER_LIST_V2): hidden preview, opened with ?tiers=new ----
const V2_ICONS = {
  expert: '<path d="M9 1.5L3.5 9H8l-1 5.5L12.5 7H8z" fill="currentColor"/>',
  easy: '<path d="M8 13.5S2.5 10 2.5 6.2A2.9 2.9 0 018 4.6a2.9 2.9 0 015.5 1.6C13.5 10 8 13.5 8 13.5z" fill="currentColor"/>',
  enabler:
    '<path d="M6 2.5a2 2 0 013.6 0l.4.9h2.5v3h-1a1.6 1.6 0 000 3.2h1v3.9H9v-1a1.6 1.6 0 00-3.2 0v1H2.5V9.6h1a1.6 1.6 0 000-3.2h-1V3.4H5z" fill="currentColor"/>',
  self: '<circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M5.3 8.2l1.9 1.9 3.6-4" stroke="currentColor" stroke-width="1.8" fill="none"/>',
  needs:
    '<path d="M6.5 9.5l3-3M5.2 7.6L3.9 8.9a2.3 2.3 0 003.2 3.2l1.3-1.3M10.8 8.4l1.3-1.3a2.3 2.3 0 00-3.2-3.2L7.6 5.2" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  buffer: '<path d="M8 2.5l4.5 5H9.6V13H6.4V7.5H3.5z" fill="currentColor"/>',
  sa: '<path d="M8 1.8l5 2v4c0 3-2.2 5.2-5 6.4-2.8-1.2-5-3.4-5-6.4v-4z" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M8.6 3.5L7 7.5l2 1-1.6 4" stroke="currentColor" stroke-width="1.4" fill="none"/>',
  karma:
    '<rect x="3.5" y="1.8" width="9" height="12.4" rx="1.4" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M8 5l.9 1.9 2 .3-1.5 1.4.4 2L8 9.6l-1.8 1 .4-2-1.5-1.4 2-.3z" fill="currentColor"/>',
  early:
    '<circle cx="8" cy="10.5" r="3" fill="currentColor"/><path d="M8 2.5v2M3.3 5l1.4 1.4M12.7 5l-1.4 1.4M1.5 10.5h2M12.5 10.5h2" stroke="currentColor" stroke-width="1.5"/><path d="M1.5 13.8h13" stroke="currentColor" stroke-width="1.5"/>',
  late: '<path d="M8 14V7.5M8 8C8 5 6 3.5 3 3.5 3 6.5 5 8 8 8zM8 9.5c0-2.6 1.8-4 4.5-4 0 2.6-1.8 4-4.5 4z" stroke="currentColor" stroke-width="1.4" fill="none"/>',
  gather:
    '<path d="M8 8.2c0-1 .8-1.6 1.7-1.4 1.2.3 1.6 1.8.9 2.8-1 1.4-3.2 1.5-4.4.3C4.6 8.4 5 5.8 6.9 4.9c2.4-1.2 5.3.1 6 2.6.8 2.8-1 5.8-3.9 6.3-3.3.6-6.5-1.6-7-4.9" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  counter:
    '<circle cx="8" cy="8" r="5.6" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="8" cy="8" r="2.6" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="8" cy="8" r=".9" fill="currentColor"/>',
};
let V2 = {
  mode: 'overall',
  boss: 'all',
  tower: 'gale',
  arch: '',
  role: '',
  kit: '',
  q: '',
  view: 'overall',
  tagsOff: (() => {
    try {
      return localStorage.getItem('dsw.v2.tagsOff') === '1';
    } catch (e) {
      return false;
    }
  })(),
  tagFlip: new Set(),
};
const V2_KITS = {
  'Damage / Control':
    '<path d="M3 2.5l7.5 7.5M2.5 3l1.2-.5L13 11.8l-1 1zM13 2.5L5.5 10M13.5 3l-1.2-.5L3 11.8l1 1M2.5 11.5l2 2M13.5 11.5l-2 2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
  Healer: '<path d="M6.3 2.5h3.4v3.8h3.8v3.4H9.7v3.8H6.3V9.7H2.5V6.3h3.8z" fill="currentColor"/>',
  Buffer: '<path d="M8 2.5l4.5 5H9.6V13H6.4V7.5H3.5z" fill="currentColor"/>',
  Tank: '<path d="M8 1.8l5 2v4c0 3-2.2 5.2-5 6.4-2.8-1.2-5-3.4-5-6.4v-4z" fill="currentColor"/>',
};
function v2Data() {
  return TIER_LIST_V2 || {};
}
function v2Hero(name) {
  const D = v2Data();
  let H = (D.heroes || {})[name];
  return H || {};
}
function v2Tower() {
  const L = TOWER_TRIALS.towers || [];
  return L.find((t) => t.id === V2.tower) || L[0] || {};
}
function v2Tier(name) {
  const H = v2Hero(name);
  if (V2.mode === 'overall')
    return { t: V2.view === 'single' ? H.overall?.single : V2.view === 'groups' ? H.overall?.groups : H.overall?.tier };
  if (V2.mode === 'towers') {
    const w = (H.towers || {})[v2Tower().id];
    return { t: w };
  }
  const b = H.bosses || {};
  if (V2.boss === 'all') return { t: b.all };
  return b[V2.boss] ? { t: b[V2.boss] } : { t: b.all, fallback: !!b.all };
}
function v2TierColor(t) {
  return (v2Data().tierColors || {})[t] || tierColor(t);
}
function v2Role(h) {
  return ((v2Data().heroes || {})[h.name] || {}).role || h.role;
}
function v2Chip(key, H, h) {
  const T = (v2Data().tags || {})[key];
  if (!T) return '';
  const ic =
    key === 'awk'
      ? `<img src="${AWAKENINGS.icon || 'assets/awakenings/Awakening_Icon.png'}" alt="">`
      : `<svg viewBox="0 0 16 16" aria-hidden="true">${V2_ICONS[key] || ''}</svg>`;
  let label = profileEsc(T.label),
    tip = T.desc;
  if (key === 'expert' && H.expert) {
    label += ` −${H.expert.drop}`;
    tip = H.expert.reason || tip;
  }
  if (key === 'awk') {
    label = `Needs A${H.awk || '?'}`;
  }
  if (key === 'counter' && V2.mode === 'towers') {
    const w = v2Tower();
    tip = `${w.name} gives ${w.status} +${TOWER_TRIALS.bonus?.own ?? 400}% damage: hits on enemies with ${w.status} deal about 5x as much here.`;
  }
  if (key === 'early' && H.progression?.early) tip = H.progression.early;
  if (key === 'late' && H.progression?.late) tip = H.progression.late;
  return `<span class="v2-tag${key === 'counter' ? ' solid' : ''}" style="--c:${T.color}" data-v2tip="${profileEsc(tip)}">${ic}<span>${label}</span></span>`;
}
function v2AppliesChip(A) {
  const T = (v2Data().tags || {}).applies || {},
    c = (s) => ARCH_COLORS[STATUS_ARCHETYPE[s]] || '#fff';
  const w = [
    ...(A.main || []).map((s) => `<b style="color:${c(s)}">${profileEsc(s)}</b>`),
    ...(A.also || []).map((s) => `<span class="v2-also" style="color:${c(s)}">${profileEsc(s)}</span>`),
  ].join(', ');
  return `<span class="v2-tag" style="--c:${T.color || '#38bdf8'}" data-v2tip="${profileEsc(T.desc || '')}"><svg viewBox="0 0 16 16" aria-hidden="true">${V2_ICONS.enabler}</svg><span>Applies ${w}</span></span>`;
}
function v2NeedsChip(group) {
  const T = (v2Data().tags || {}).needs || {};
  const words = group
    .map((s) => `<b style="color:${ARCH_COLORS[STATUS_ARCHETYPE[s]] || '#fff'}">${profileEsc(s)}</b>`)
    .join(' or ');
  return `<span class="v2-tag" style="--c:${T.color || '#94a3b8'}" data-v2tip="${profileEsc(T.desc || '')}"><svg viewBox="0 0 16 16" aria-hidden="true">${V2_ICONS.needs}</svg><span>Needs ${words}</span></span>`;
}
function v2Counter(h) {
  if (V2.mode === 'towers') return !!v2Tower().archetype && v2Tower().archetype === h.archetype;
  if (V2.mode !== 'bosses' || V2.boss === 'all') return false;
  const b = (v2Data().bosses || []).find((x) => x.id === V2.boss);
  return !!b && (b.weak || []).includes(h.archetype);
}
function v2Card(h) {
  const H = v2Hero(h.name);
  const { t, fallback } = v2Tier(h.name);
  const sig = (KARMA_DATA || []).find((k) => k.signature === h.name);
  const tags = [
    ...(H.tags || [])
      .filter((k) => k !== 'counter')
      .slice(0, 3)
      .map((k) => v2Chip(k, H, h)),
    ...(H.applies ? [v2AppliesChip(H.applies)] : []),
    ...(H.needs || []).slice(0, 2).map(v2NeedsChip),
    ...(v2Counter(h) ? [v2Chip('counter', H, h)] : []),
  ].join('');
  const kb =
    H.signatureKarma && sig
      ? `<span class="v2-karma" data-karma="${profileEsc(sig.name)}" data-v2tip="${profileEsc(`Signature Karma: ${sig.name}. ${sig.exclusive || ''}`)}"><svg viewBox="0 0 16 16" aria-hidden="true">${V2_ICONS.karma}</svg></span>`
      : '';
  const a = latestArrow(h.name);
  const off = V2.tagsOff !== V2.tagFlip.has(h.name);
  return `<div class="hero-card v2-card${tags && off ? ' tags-off' : ''}" tabindex="0" role="button" data-hero="${profileEsc(h.name)}" style="--tier:${t ? v2TierColor(t) : '#4b5563'}"><div class="portrait-wrap"><img class="portrait" src="${h.portrait}" alt="${profileEsc(h.name)}" loading="lazy"><span class="arch-badge"><img src="${h.archIcon}" alt="${profileEsc(h.archetype)}"></span>${a ? `<span class="patch-arrow" data-patch-hero="${profileEsc(h.name)}">${a}</span>` : ''}<span class="tier-chip${fallback ? ' v2-fallback' : ''}">${t || '?'}</span>${kb}</div><div class="hero-name">${profileEsc(h.name)}</div>${tags ? `<button type="button" class="v2-tagtog" aria-expanded="${!off}" aria-label="${off ? 'Show' : 'Hide'} tags" title="${off ? 'Show' : 'Hide'} tags"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="v2-tags">${tags}</div>` : ''}</div>`;
}
function v2TipHtml(h) {
  const H = v2Hero(h.name);
  const D = v2Data();
  const box = (label, t) =>
    `<div class="tip-tier"><div class="label">${profileEsc(label)}</div><div class="value" style="background:${t ? v2TierColor(t) : '#3a3f4a'};${t ? '' : 'color:#cbd0d9'}">${t || '?'}</div></div>`;
  let tiers = '';
  if (V2.mode === 'overall')
    tiers =
      box('Overall', H.overall?.tier) + box('Groups', H.overall?.groups) + box('Single target', H.overall?.single);
  else if (V2.mode === 'towers')
    tiers =
      box('Overall', H.overall?.tier) +
      (TOWER_TRIALS.towers || []).map((w) => box(w.name.replace('Tower of ', ''), (H.towers || {})[w.id])).join('');
  else
    tiers =
      box('All bosses', H.bosses?.all) + (D.bosses || []).map((b) => box(b.name, (H.bosses || {})[b.id])).join('');
  return `<div class="tip-top"><img class="tip-portrait" src="${h.portrait}" alt=""><div><div class="tip-title">${profileEsc(h.name)}</div><div class="tip-meta"><img src="${h.archIcon}" alt="">${profileEsc(h.archetype)} · ${profileEsc(v2Role(h))}</div></div></div><div class="tip-tiers v2-tip-tiers">${tiers}</div>${(() => {
    const l = latestBalanceChange(h.name);
    return l
      ? `<div class="tip-note">${patchArrow(l.c, l.version)} Patch ${profileEsc(l.version)}: ${profileEsc(patchDirLabel(l.c))}${l.c.damagePct != null ? ` (skill damage ${l.c.damagePct > 0 ? '+' : ''}${l.c.damagePct}%${l.c.shiftPct ? `, ${l.c.shiftPct}% moved between skills` : ''})` : ''}</div>`
      : '';
  })()}${H.expert ? `<div class="tip-note"><b style="color:#ef4444">Expert −${H.expert.drop}:</b> ${profileEsc(H.expert.reason || '')}</div>` : ''}<div class="tip-note">Click for the full guide.</div>`;
}
function v2ShowTip(h, el) {
  const tip = $('tooltip');
  tip.innerHTML = v2TipHtml(h);
  tip.style.setProperty('--tier', '#536273');
  tip.style.display = 'block';
  const r = el.getBoundingClientRect();
  let left = r.right + 12;
  if (left + tip.offsetWidth > window.innerWidth - 12) left = r.left - tip.offsetWidth - 12;
  tip.style.left = Math.max(12, left) + 'px';
  tip.style.top = Math.max(12, Math.min(window.innerHeight - tip.offsetHeight - 12, r.top - 12)) + 'px';
}
function v2ModeBtn(key) {
  const M = v2Data().modes?.[key] || {};
  return `<button type="button" class="v2-mode${V2.mode === key ? ' on' : ''}" data-v2mode="${key}" style="${M.image ? `--bg:url('${absUrl(M.image)}')` : ''}"><span class="v2-mode-label">${profileEsc(M.label || key)}</span><span class="v2-mode-sub">${profileEsc(M.sub || '')}</span></button>`;
}
function v2BossTab(b) {
  return `<button type="button" class="v2-boss${b.theme ? ' ' + b.theme : ''}${V2.boss === b.id ? ' on' : ''}" data-v2boss="${b.id}" style="${b.image ? `--bg:url('${absUrl(b.image)}')` : ''};${b.focus ? `background-position:${b.focus}` : ''}">${b.image2 ? `<span class="v2-boss-alt" style="background-image:url('${b.image2}');animation-delay:-${((Date.now() / 1000) % 60).toFixed(2)}s"></span>` : ''}<span class="v2-boss-text">${b.level ? `<span class="v2-lv">Lv.${b.level}</span>` : ''}<span class="v2-boss-name">${profileEsc(b.name)}</span></span></button>`;
}
// Towers mode (TOWER_TRIALS in data.json): tower tabs and the how-it-works / rewards panels.
function v2TowersHtml() {
  const T = TOWER_TRIALS;
  const L = T.towers || [];
  const w = v2Tower();
  const I = T.items || {};
  const B = T.bonus || {};
  const col = (a) => ARCH_COLORS[a] || '#fff';
  const st = (s, a) => `<b style="color:${col(a || STATUS_ARCHETYPE[s])}">${profileEsc(s)}</b>`;
  const item = (k, n) => `<span class="v2-titem"><img src="${I[k]?.icon || ''}" alt="">${n}</span>`;
  const tabs = L.map((t) => {
    const h = HEROES.find((x) => x.archetype === t.archetype);
    return `<button type="button" class="v2-boss v2-tower${t.id === w.id ? ' on' : ''}" data-v2tower="${t.id}" style="--bg:url('${absUrl(T.image)}');background-position:${t.pos || '50% 50%'};--tc:${col(t.archetype)}">${t.crest ? `<img class="v2-tcrest" src="${t.crest}" alt="">` : ''}<span class="v2-boss-text"><span class="v2-lv v2-tlv" style="background:${col(t.archetype)}">${h ? `<img src="${h.archIcon}" alt="">` : ''}${profileEsc(t.status)} +${B.own ?? 400}%</span><span class="v2-boss-name">${profileEsc(t.name)}</span></span></button>`;
  }).join('');
  const dots = (B.dotTested || []).map((s) => st(s)).join(' and ');
  const how = `<p>${w.text ? `<i>“${profileEsc(w.text)}”</i></p><p>` : ''}In the <b>${profileEsc(w.name || '')}</b>, hits on an enemy with ${st(w.status, w.archetype)} deal <b>+${B.own ?? 400}%</b> damage, so ${profileEsc(w.archetype || '')} heroes are close to required. Damage-over-time statuses add <b>+${B.dot ?? 100}%</b> in every tower (measured: ${dots}); other statuses add nothing.${w.measured === false ? ' <span class="v2-tnote">Not measured in this tower yet: assumed to work like the others.</span>' : ''}</p><p>${profileEsc(B.text || '')}</p><p class="v2-tnote">${profileEsc(B.example || '')}</p>`;
  const floors = `<p><b>${T.floors || 30} floors</b>, up to ${T.starsPerFloor || 3} stars each: ${(T.conditions || []).map(profileEsc).join('; ')}. ${profileEsc(T.conditionsNote || '')}</p><p>${profileEsc(T.enemyLevels || '')} ${profileEsc(T.entry || '')}</p><p class="v2-tnote">${profileEsc(T.unlock || '')}</p>`;
  const fr = T.floorRewards || [];
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const cm = T.cumulative || [];
  const cumMem = sum(cm.filter((c) => c[1] === 'memory').map((c) => c[2])),
    cumWh = sum(cm.filter((c) => c[1] === 'whirling').map((c) => c[2]));
  const rewards = `<h5>First clear of each floor</h5><div class="v2-tgrid">${fr.map((n, i) => `<span><small>${i + 1}</small>${item('memory', n)}</span>`).join('')}</div>
 <h5>Stars collected in this tower</h5><div class="v2-tgrid">${cm.map((c) => `<span><small>★${c[0]}</small>${item(c[1], c[2])}</span>`).join('')}</div>
 <p>Per tower: ${item('memory', (sum(fr) + cumMem).toLocaleString('en-GB'))} ${profileEsc(I.memory?.name || '')} (${sum(fr).toLocaleString('en-GB')} from floors, ${cumMem} from stars) and ${item('whirling', cumWh)} ${profileEsc(I.whirling?.name || '')}.</p><p class="v2-tnote">${profileEsc(I.whirling?.use || '')}</p>`;
  return `<div class="v2-bosses">${tabs}</div><details class="v2-panel" open><summary>How the ${profileEsc(w.name || 'tower')} works</summary><div>${how}</div></details><details class="v2-panel"><summary>Floors and stars</summary><div>${floors}</div></details><details class="v2-panel"><summary>Rewards</summary><div>${rewards}</div></details>`;
}
function v2HuntRanks(b) {
  const H = (typeof TIER_LIST_V2 !== 'undefined' && TIER_LIST_V2.huntRatingRewards) || null;
  if (!b || b.type !== 'Hunt' || !H) return '';
  const E = profileEsc;
  return `<details class="v2-panel v2-binfo"><summary>Rating rewards (every Hunt boss, every difficulty)</summary><div><table class="gx-tbl">${(H.ranks || []).map((r) => `<tr><td style="font-weight:900;font-size:18px;width:40px">${E(r.rank)}</td><td>${Number(r.points).toLocaleString('en-GB')} pts</td><td><span class="gx-mat"><img src="${E(r.icon)}" alt="">${r.amount}× ${E(r.item)}</span></td></tr>`).join('')}</table><p class="v2-tnote">${E(H.note || '')}</p></div></details>`;
}
function v2BossInfo(b) {
  const I = b && b.info;
  if (!I) return v2HuntRanks(b);
  const E = profileEsc;
  const fights = `<p>${E(I.intro || '')}</p><div class="v2-fights">${(I.fights || []).map((f, i) => `<div><b>${i + 1}. ${E(f.name)}</b>${E(f.text || '')}</div>`).join('')}</div>${I.fightsNote ? `<p><b>${E(I.fightsNote)}</b></p>` : ''}`;
  const rew =
    (I.difficulties || [])
      .map(
        (x) =>
          `<h5>${E(x.name)} · recommended Lv.${x.level}</h5><ul>${x.rewards.map((r) => `<li>${E(r)}</li>`).join('')}</ul>`,
      )
      .join('') + (I.rewardsNote ? `<p class="v2-tnote">${E(I.rewardsNote)}</p>` : '');
  const strat = (I.strategy || []).length
    ? `<ul>${I.strategy.map((t) => `<li>${E(t)}</li>`).join('')}</ul>`
    : '<p class="v2-tnote">Signature moves and tips will be added once recorded.</p>';
  return `<details class="v2-panel v2-binfo" open><summary>${E(b.name)}${b.stage ? ' · ' + E(b.stage) : ''}: the fights</summary><div>${fights}</div></details><details class="v2-panel v2-binfo"><summary>Strategy</summary><div>${strat}</div></details><details class="v2-panel v2-binfo"><summary>Rewards</summary><div>${rew}</div></details>`;
}
function renderTierV2() {
  const root = $('tierV2');
  if (!root) return;
  const D = v2Data();
  const tiers = D.tiers || ['S', 'A', 'B', 'C'];
  const roles = D.roles || ['Main DPS', 'Sub-DPS', 'Support'];
  const list = HEROES.filter(
    (h) =>
      (!V2.q || h.name.toLowerCase().includes(V2.q)) &&
      (!V2.arch || h.archetype === V2.arch) &&
      (!V2.role || v2Role(h) === V2.role) &&
      (!V2.kit || h.classType === V2.kit),
  );
  const M = D.modes?.[V2.mode] || {};
  const bossName =
    V2.mode === 'bosses'
      ? V2.boss === 'all'
        ? 'All bosses'
        : (D.bosses || []).find((b) => b.id === V2.boss)?.name
      : V2.mode === 'towers'
        ? v2Tower().name
        : '';
  const tagRows = Object.entries(D.tags || {})
    .filter(
      ([k]) =>
        k === 'needs' || k === 'applies' || Object.values(D.heroes || {}).some((h) => (h.tags || []).includes(k)),
    )
    .map(
      ([k, T]) =>
        `<tr><td>${k === 'needs' ? v2NeedsChip(['Airborne']) : v2Chip(k, { awk: 1, expert: { drop: 1 } }, {})}</td><td>${profileEsc(T.desc)}</td></tr>`,
    )
    .join('');
  const experts = Object.entries(D.heroes || {})
    .filter(([, H]) => H.expert)
    .map(([n, H]) => `<li><b>${profileEsc(n)} (−${H.expert.drop}):</b> ${profileEsc(H.expert.reason || '')}</li>`)
    .join('');
  let html = `<div class="v2-banner preview">PREVIEW: hidden from visitors. Ratings are added as we decide them together.</div>
 <div class="v2-head"><h2>Tier List <span>(${profileEsc(M.label || '')}${bossName ? ' · ' + profileEsc(bossName) : ''})</span></h2><button type="button" class="v2-legacy" id="v2Legacy">Legacy view</button></div>
 <details class="v2-panel"><summary>About this tier list</summary><div>${(D.about || []).map((p) => `<p>${profileEsc(p)}</p>`).join('')}</div></details>
 <details class="v2-panel"><summary>Modes</summary><div>${Object.values(D.modes || {})
   .map((m) => `<p><b>${profileEsc(m.label)}</b> (${profileEsc(m.sub)}): ${profileEsc(m.intro || '')}</p>`)
   .join('')}</div></details>
 <details class="v2-panel"><summary>Tags</summary><div><table class="v2-tag-table">${tagRows}<tr><td><span class="v2-karma inline"><svg viewBox="0 0 16 16">${V2_ICONS.karma}</svg></span></td><td>${profileEsc(D.signatureKarmaText || '')}</td></tr></table>${experts ? `<h5>Expert reasons</h5><ul>${experts}</ul>` : ''}</div></details>
 <details class="v2-panel"><summary>Ratings</summary><div><ul class="v2-ratings">${(D.ratings || []).map((r) => `<li><span class="v2-rt" style="background:${v2TierColor(r.tier)}">${profileEsc(r.tier)}</span>${profileEsc(r.text)}</li>`).join('')}</ul></div></details>
 <div class="v2-modes">${['overall', 'bosses', 'towers']
   .filter((k) => D.modes?.[k])
   .map(v2ModeBtn)
   .join('')}</div>`;
  if (V2.mode === 'towers') html += v2TowersHtml();
  if (V2.mode === 'bosses') {
    const un = D.undiscovered || {};
    const locks = Object.entries(un).flatMap(([type, n]) =>
      Array.from(
        { length: n },
        () =>
          `<div class="v2-boss locked"><span class="v2-boss-text"><span class="v2-boss-name">${profileEsc(type)} boss · not reached yet</span></span></div>`,
      ),
    );
    html += `<div class="v2-bosses"><button type="button" class="v2-boss all${V2.boss === 'all' ? ' on' : ''}" data-v2boss="all"><span class="v2-boss-text"><span class="v2-boss-name">All bosses</span></span></button>${(D.bosses || []).map(v2BossTab).join('')}${locks.join('')}</div>${v2BossInfo((D.bosses || []).find((b) => b.id === V2.boss))}`;
  }
  if (V2.mode === 'overall')
    html += `<div class="v2-view" role="group" aria-label="Rating shown">${[
      ['overall', 'Overall'],
      ['single', 'Single target'],
      ['groups', 'Groups'],
    ]
      .map(
        ([k, l]) =>
          `<button type="button" data-v2view="${k}" aria-pressed="${V2.view === k}"${V2.view === k ? ' class="on"' : ''}>${l}</button>`,
      )
      .join('')}</div>`;
  html += `<p class="v2-intro">${profileEsc(M.intro || '')}</p><div class="v2-filters"><input type="search" id="v2Search" placeholder="Search heroes…" value="${profileEsc(V2.q)}" autocomplete="off"><div class="v2-fgroup"><button class="heroes-filter-btn${!V2.arch ? ' active' : ''}" data-v2arch="" title="All archetypes"><span class="all-symbol">✱</span></button>${ARCHES.map(
    (a) => {
      const h = HEROES.find((x) => x.archetype === a);
      return `<button class="heroes-filter-btn${V2.arch === a ? ' active' : ''}" data-v2arch="${profileEsc(a)}" title="${profileEsc(a)}"><img src="${h?.archIcon || ''}" alt=""></button>`;
    },
  ).join(
    '',
  )}</div><div class="v2-fgroup"><button class="heroes-filter-btn${!V2.role ? ' active' : ''}" data-v2role="" title="All roles"><span class="all-symbol">✱</span></button>${roles.map((r) => `<button class="heroes-filter-btn${V2.role === r ? ' active' : ''}" data-v2role="${profileEsc(r)}" title="${profileEsc(r)}"><img src="${ROLE_ICONS[r] || ''}" alt=""></button>`).join('')}</div><div class="v2-fgroup"><button class="heroes-filter-btn${!V2.kit ? ' active' : ''}" data-v2kit="" title="All kit types"><span class="all-symbol">✱</span></button>${Object.entries(
    V2_KITS,
  )
    .map(
      ([k, ic]) =>
        `<button class="heroes-filter-btn v2-kit-btn${V2.kit === k ? ' active' : ''}" data-v2kit="${profileEsc(k)}" title="${profileEsc(k)}"><svg viewBox="0 0 16 16" aria-hidden="true">${ic}</svg></button>`,
    )
    .join(
      '',
    )}</div><div class="v2-fgroup"><button type="button" class="heroes-filter-btn v2-tagall${V2.tagsOff ? '' : ' active'}" id="v2TagAll" aria-pressed="${!V2.tagsOff}" title="${V2.tagsOff ? 'Show' : 'Hide'} all tags">Tags</button></div></div>`;
  const rolesShown = V2.role ? [V2.role] : roles;
  html += `<div class="v2-grid" style="--cols:${rolesShown.length}"><div class="v2-corner"></div>${rolesShown.map((r) => `<div class="v2-rolehead"><img src="${ROLE_ICONS[r] || ''}" alt="">${profileEsc(r)}</div>`).join('')}`;
  const rows = [...tiers, '?'];
  rows.forEach((t) => {
    const inRow = list.filter((h) => (v2Tier(h.name).t || '?') === t);
    if (t === '?' && !inRow.length) return;
    html +=
      `<div class="v2-tierlabel${t === '?' ? ' unrated' : ''}" style="background:${t === '?' ? '#3a3f4a' : v2TierColor(t)}">${t === '?' ? 'Unrated' : t}</div>` +
      rolesShown
        .map((r) => {
          const cs = inRow.filter((h) => v2Role(h) === r);
          return `<div class="v2-cell"><div class="v2-cell-role">${profileEsc(r)}</div>${cs.map(v2Card).join('')}</div>`;
        })
        .join('');
  });
  html += `</div>`;
  root.innerHTML = html;
  root.querySelectorAll('[data-v2mode]').forEach(
    (b) =>
      (b.onclick = () => {
        V2.mode = b.dataset.v2mode;
        renderTierV2();
      }),
  );
  root.querySelectorAll('[data-v2boss]').forEach(
    (b) =>
      (b.onclick = () => {
        V2.boss = b.dataset.v2boss;
        renderTierV2();
      }),
  );
  root.querySelectorAll('[data-v2tower]').forEach(
    (b) =>
      (b.onclick = () => {
        V2.tower = b.dataset.v2tower;
        renderTierV2();
      }),
  );
  root.querySelectorAll('[data-v2arch]').forEach(
    (b) =>
      (b.onclick = () => {
        V2.arch = b.dataset.v2arch;
        renderTierV2();
      }),
  );
  root.querySelectorAll('[data-v2view]').forEach(
    (b) =>
      (b.onclick = () => {
        V2.view = b.dataset.v2view;
        renderTierV2();
      }),
  );
  {
    const tb = $('v2TagAll');
    if (tb)
      tb.onclick = () => {
        V2.tagsOff = !V2.tagsOff;
        V2.tagFlip.clear();
        try {
          localStorage.setItem('dsw.v2.tagsOff', V2.tagsOff ? '1' : '0');
        } catch (e) {}
        renderTierV2();
      };
  }
  root.querySelectorAll('[data-v2role]').forEach(
    (b) =>
      (b.onclick = () => {
        V2.role = b.dataset.v2role;
        renderTierV2();
      }),
  );
  root.querySelectorAll('[data-v2kit]').forEach(
    (b) =>
      (b.onclick = () => {
        V2.kit = b.dataset.v2kit;
        renderTierV2();
      }),
  );
  const s = $('v2Search');
  s.oninput = () => {
    V2.q = s.value.trim().toLowerCase();
    const pos = s.selectionStart;
    renderTierV2();
    const n = $('v2Search');
    n.focus();
    n.setSelectionRange(pos, pos);
  };
  $('v2Legacy').onclick = () => showTierV2(false);
  root.querySelectorAll('.v2-card').forEach((c) => {
    const h = HEROES.find((x) => x.name === c.dataset.hero);
    c.addEventListener('click', (e) => {
      const tt = e.target.closest('.v2-tagtog');
      if (tt) {
        e.stopPropagation();
        hideTip();
        V2.tagFlip.has(h.name) ? V2.tagFlip.delete(h.name) : V2.tagFlip.add(h.name);
        const off = c.classList.toggle('tags-off');
        tt.setAttribute('aria-expanded', !off);
        tt.title = tt.ariaLabel = (off ? 'Show' : 'Hide') + ' tags';
        return;
      }
      if (e.target.closest('.patch-arrow')) {
        e.stopPropagation();
        hideTip();
        openPatchesFor(h.name);
        return;
      }
      if (e.target.closest('.v2-karma')) {
        hideTip();
        openKarmaByName(e.target.closest('.v2-karma').dataset.karma);
        return;
      }
      hideTip();
      openCharacterProfile(h.name);
    });
    c.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCharacterProfile(h.name);
      }
    });
    c.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'touch') v2ShowTip(h, c);
    });
    c.addEventListener('pointerleave', hideTip);
    c.addEventListener('focus', () => v2ShowTip(h, c));
    c.addEventListener('blur', hideTip);
  });
  root.querySelectorAll('.v2-tag[data-v2tip],.v2-karma[data-v2tip]').forEach((el) => {
    el.addEventListener('pointerleave', hideTip);
    el.addEventListener('pointerenter', (e) => {
      e.stopPropagation();
      const tip = $('tooltip');
      tip.innerHTML = `<div class="tip-note" style="margin:0">${profileEsc(el.dataset.v2tip)}</div>`;
      tip.style.display = 'block';
      const r = el.getBoundingClientRect();
      tip.style.left = Math.max(12, Math.min(window.innerWidth - tip.offsetWidth - 12, r.left)) + 'px';
      tip.style.top = Math.min(window.innerHeight - tip.offsetHeight - 12, r.bottom + 8) + 'px';
    });
  });
}
function showTierV2(on) {
  const tp = $('tierPage');
  [...tp.children].forEach((c) => {
    if (c.id !== 'tierV2') c.hidden = on;
  });
  $('tierV2').hidden = !on;
  if (on) renderTierV2();
  else if (!$('v2Back')) {
    const b = document.createElement('button');
    b.id = 'v2Back';
    b.type = 'button';
    b.className = 'v2-legacy';
    b.textContent = 'Back to the new tier list (preview)';
    b.style.margin = '0 0 12px';
    b.onclick = () => {
      b.remove();
      showTierV2(true);
    };
    tp.prepend(b);
  }
}
const IS_PREVIEW = (() => {
  const p = new URLSearchParams(location.search);
  return p.get('tiers') === 'new' || p.get('preview') === '1';
})();
if (IS_PREVIEW)
  document.documentElement.classList.add('pv'); /* html.pv scopes preview-only CSS (block at the end of <style>) */
// ---- Cookbook (COOKBOOK in data.json; preview only) ----
const CB = { m: '', e: '', hide: false, q: '', sel: null };
function cbTicks() {
  try {
    return new Set(JSON.parse(localStorage.getItem('dsw.cooked.v1') || '[]'));
  } catch (e) {
    return new Set();
  }
}
function cbSaveTicks(t) {
  try {
    localStorage.setItem('dsw.cooked.v1', JSON.stringify([...t]));
  } catch (e) {}
}
function cbStars(n, max = 5) {
  return `<span class="cb-stars">${'★'.repeat(n)}<span class="off">${'★'.repeat(Math.max(0, max - n))}</span></span>`;
}
function cbMax(d) {
  return Math.min(5, 1 + Math.floor((4 * d.slots.length) / 3));
}
function cbList() {
  const C = COOKBOOK;
  const out = [];
  const M = C.methods || {};
  Object.keys(M).forEach((m) => {
    const ds = (C.dishes || []).filter((d) => d.method === m);
    ds.forEach((d) => out.push(d));
    for (let i = ds.length; i < M[m].total; i++) out.push({ unk: 1, method: m, id: `unk-${m}-${i}` });
  });
  return out;
}
function renderCookbook() {
  const root = $('cookbookBody');
  if (!root) return;
  const C = COOKBOOK || {};
  if (!C.dishes) {
    root.innerHTML = '';
    return;
  }
  const M = C.methods,
    E = C.effects,
    ING = C.ingredients || [],
    ticks = cbTicks();
  const all = cbList();
  const found = (C.dishes || []).length;
  const ingByName = (n) => ING.find((i) => i.name === n);
  const q = CB.q.toLowerCase();
  const list = all.filter(
    (d) =>
      (!CB.m || d.method === CB.m) &&
      (!CB.e || d.effect === CB.e) &&
      !(CB.hide && d.unk) &&
      (!q ||
        (!d.unk &&
          (d.name.toLowerCase().includes(q) ||
            [...d.slots, ...d.best].some((x) => x.toLowerCase().includes(q)) ||
            d.best.some((b) => (ingByName(b)?.category || '').toLowerCase().includes(q))))),
  );
  if (CB.sel == null) CB.sel = (C.dishes[0] || {}).id;
  const cookedIn = (m) => (C.dishes || []).filter((d) => (!m || d.method === m) && ticks.has(d.id)).length;
  let h =
    `<p class="cb-intro">${profileEsc(C.intro || '')}</p><div class="cb-prog"><div class="cb-pbox"><small>Discovered</small><b>${found} / ${C.total}</b><div class="cb-bar"><i style="width:${(found / C.total) * 100}%;background:#f5b942"></i></div></div>` +
    Object.entries(M)
      .map(([m, v]) => {
        const n = (C.dishes || []).filter((d) => d.method === m).length;
        return `<div class="cb-pbox"><small style="color:${v.color}">${m}</small><b>${n} / ${v.total}</b><div class="cb-bar"><i style="width:${(n / v.total) * 100}%;background:${v.color}"></i></div></div>`;
      })
      .join('') +
    `<div class="cb-pbox"><small>Cooked by you</small><b>${cookedIn()} / ${found}</b><div class="cb-bar"><i style="width:${found ? (cookedIn() / found) * 100 : 0}%;background:#19b9ff"></i></div></div></div>`;
  h += `<div class="cb-filters" role="group" aria-label="Cookbook filters">${['', ...Object.keys(M)].map((k) => `<button type="button" class="cb-chip${CB.m === k ? ' on' : ''}" data-cbm="${k}">${k ? `<span class="cb-dot" style="background:${M[k].color}"></span>${k}` : 'All methods'}</button>`).join('')}<span class="cb-sep"></span>${['', ...Object.keys(E)].map((k) => `<button type="button" class="cb-chip${CB.e === k ? ' on' : ''}" data-cbe="${k}">${k ? `<span class="cb-dot" style="background:${E[k].color}"></span>${k}` : 'All effects'}</button>`).join('')}<span class="cb-sep"></span><button type="button" class="cb-chip${CB.hide ? ' on' : ''}" id="cbHide">Hide undiscovered</button><input type="search" id="cbQ" placeholder="Dish or ingredient… (try “egg”)" value="${profileEsc(CB.q)}" autocomplete="off"></div>`;
  const card = (d) =>
    d.unk
      ? `<button type="button" class="cb-card cb-unk${CB.sel === d.id ? ' sel' : ''}" data-cbd="${d.id}" aria-label="Undiscovered ${d.method} dish"><div class="cb-art"></div><div class="cb-meta"><div class="cb-name">???</div><div class="cb-row"><span class="cb-meth" style="color:${M[d.method].color}">${d.method}</span></div></div></button>`
      : `<button type="button" class="cb-card${CB.sel === d.id ? ' sel' : ''}" data-cbd="${d.id}"><span class="cb-badge" style="background:${E[d.effect].color}" title="${profileEsc(d.effect)}">${E[d.effect].icon}</span>${ticks.has(d.id) ? '<span class="cb-mine">COOKED</span>' : ''}<div class="cb-art" style="background-image:url('${d.image}')"></div><div class="cb-meta"><div class="cb-name">${profileEsc(d.name)}</div><div class="cb-row"><span class="cb-meth" style="color:${M[d.method].color}">${d.method}</span>${cbStars(d.bestStars, cbMax(d))}</div></div></button>`;
  h += `<div class="cb-main"><div class="cb-grid">${list.length ? list.map(card).join('') : '<div class="cb-empty">No dish matches these filters.</div>'}</div><aside class="cb-detail" aria-live="polite">${cbDetail(
    all.find((d) => d.id === CB.sel),
    ticks,
  )}</aside></div>`;
  h += `<section class="cb-calc" aria-labelledby="cbCalcH"><h4 class="cb-h" id="cbCalcH">Star calculator</h4><div class="cb-note">${profileEsc(C.starRule || '')}</div><div class="pick">${[4, 4, 3].map((v, i) => `<label>Slot ${i + 1} <select id="cbS${i}"><option value="0">empty</option>${[1, 2, 3, 4].map((s) => `<option value="${s}"${s === v ? ' selected' : ''}>${s}★ ingredient</option>`).join('')}</select></label>`).join('')}</div><div class="cb-res" id="cbRes"></div></section>`;
  root.innerHTML = h;
  root.querySelectorAll('[data-cbm]').forEach(
    (b) =>
      (b.onclick = () => {
        CB.m = b.dataset.cbm;
        renderCookbook();
      }),
  );
  root.querySelectorAll('[data-cbe]').forEach(
    (b) =>
      (b.onclick = () => {
        CB.e = b.dataset.cbe;
        renderCookbook();
      }),
  );
  $('cbHide').onclick = () => {
    CB.hide = !CB.hide;
    renderCookbook();
  };
  const qi = $('cbQ');
  qi.oninput = () => {
    CB.q = qi.value;
    const p = qi.selectionStart;
    renderCookbook();
    const n = $('cbQ');
    n.focus();
    n.setSelectionRange(p, p);
  };
  root.querySelectorAll('[data-cbd]').forEach(
    (b) =>
      (b.onclick = () => {
        CB.sel = b.dataset.cbd;
        renderCookbook();
      }),
  );
  const tk = $('cbTick');
  if (tk)
    tk.onclick = () => {
      const t = cbTicks();
      t.has(CB.sel) ? t.delete(CB.sel) : t.add(CB.sel);
      cbSaveTicks(t);
      renderCookbook();
    };
  const calc = () => {
    const v = [0, 1, 2].map((i) => +$('cbS' + i).value).filter(Boolean);
    const sum = v.reduce((a, b) => a + b, 0);
    $('cbRes').innerHTML = v.length
      ? `Sum ${sum} → ${cbStars(Math.min(5, 1 + Math.floor(sum / 3)))} dish`
      : 'Pick at least one ingredient.';
  };
  [0, 1, 2].forEach((i) => ($('cbS' + i).onchange = calc));
  calc();
}
function cbDetail(d, ticks) {
  const C = COOKBOOK,
    M = C.methods,
    E = C.effects;
  if (!d) return '';
  if (d.unk)
    return `<div class="cb-dh cb-unk"><div class="cb-art"></div><div><span class="cb-meth" style="color:${M[d.method].color}">${d.method}</span><h3>Unknown dish</h3><div class="cb-note">Not discovered yet. Its ingredients and effect show up here once it has been cooked.</div></div></div>`;
  const ing = (n) => (C.ingredients || []).find((i) => i.name === n);
  const max = cbMax(d);
  const tiers = Object.entries(d.tiers);
  const slot = (s, i) => {
    const b = ing(d.best[i]);
    return `<div class="cb-slot">${b ? `<img src="${b.icon}" alt="">` : ''}<b>${d.fixed ? profileEsc(s) : 'Any ' + profileEsc(s)}</b><small>${b ? `best: ${profileEsc(b.name)} ${'★'.repeat(b.stars)}` : ''}</small></div>`;
  };
  return `<div class="cb-dh"><div class="cb-art" style="background-image:url('${d.image}')"></div><div><span class="cb-meth" style="color:${M[d.method].color}">${d.method}</span><h3>${profileEsc(d.name)}</h3><div class="cb-eff"><span class="cb-dot" style="background:${E[d.effect].color}"></span> ${profileEsc(d.effect)} · ${profileEsc(d.scope)}${d.duration ? ' · ' + profileEsc(d.duration) : ''}</div></div></div>
 <div class="cb-eff">[${profileEsc(d.scope)}] ${profileEsc(d.text.replace('{v}', d.tiers[String(d.bestStars)] || '?'))}</div>
 <h4 class="cb-h">Effect by stars</h4><table><thead><tr><th>Stars</th><th>Value</th></tr></thead><tbody>${Array.from(
   { length: max },
   (_, i) => i + 1,
 )
   .filter((s) => s >= 1 + Math.floor(d.slots.length / 3))
   .map(
     (s) =>
       `<tr class="${s === d.bestStars ? 'hl' : ''}"><td>${cbStars(s, max)}</td><td>${d.tiers[String(s)] ? profileEsc(d.tiers[String(s)]) : '<span class="cb-note">not seen yet</span>'}</td></tr>`,
   )
   .join('')}</tbody></table>
 <h4 class="cb-h">Ingredients</h4><div class="cb-slots" style="grid-template-columns:repeat(${d.slots.length},minmax(0,1fr))">${d.slots.map(slot).join('')}</div>
 <div class="cb-note">${d.fixed ? 'These exact ingredients only (no substitutes in the game).' : 'Any ingredient of the same category fits each slot; higher-star ingredients give a higher-star dish.'} Highlighted row = the best version cooked so far.</div>
 <button type="button" class="cb-tick${ticks.has(d.id) ? ' done' : ''}" id="cbTick">${ticks.has(d.id) ? 'Cooked ✓ (click to undo)' : 'Mark as cooked'}</button>`;
}
// Pages hidden from visitors until launch (David, 29 Oct 2026): shown only in the preview (?tiers=new).
const ITEMDB = { tab: 'materials', q: '', rar: '', data: {}, ach: null, aq: '', acat: '', aown: '' };
const ITEM_TABS = [
  ['materials', 'Materials'],
  ['ingredients', 'Ingredients'],
  ['important', 'Important'],
  ['quest', 'Quest'],
];
