/* js/07-tierlist-v2-cookbook.js: Beta tier list and Cookbook. Part of the site script, split out of index.html on 10 Nov 2026.
   The files load in order (see index.html) and share one global scope, so code that runs at load time may only use what earlier files define. */
// ---- New tier list (TIER_LIST_V2): public Beta tier list ----
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
  boss: '', // a boss id; renderTierV2() picks the first boss when this isn't one (the "All bosses" tab was removed, David, 13 Nov 2026)
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
  // Awakenings view (David, 13 Nov 2026): foundation only. While it is on every hero is unrated, in every mode;
  // the ratings with all awakenings are agreed with David later. Not remembered between visits.
  awk: false,
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
  if (V2.awk) return { t: undefined };
  if (V2.mode === 'overall')
    return { t: V2.view === 'single' ? H.overall?.single : V2.view === 'groups' ? H.overall?.groups : H.overall?.tier };
  if (V2.mode === 'towers') {
    const w = (H.towers || {})[v2Tower().id];
    return { t: w };
  }
  const b = H.bosses || {};
  return { t: b[V2.boss] };
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
  if (V2.mode === 'towers') {
    // Strong in this tower: the tower's own archetype, and any other hero with a skill that inflicts its status (David, 13 Nov 2026).
    const w = v2Tower();
    return (
      (!!w.archetype && w.archetype === h.archetype) ||
      (!!w.status &&
        ((CHARACTER_PROFILE_DATA[h.name] || {}).skills || []).some((s) =>
          ((s.meta || {}).inflicts || []).includes(w.status),
        ))
    );
  }
  if (V2.mode !== 'bosses') return false;
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
  const box = (label, t0) => {
    const t = V2.awk ? undefined : t0;
    return `<div class="tip-tier"><div class="label">${profileEsc(label)}</div><div class="value" style="background:${t ? v2TierColor(t) : '#3a3f4a'};${t ? '' : 'color:#cbd0d9'}">${t || '?'}</div></div>`;
  };
  let tiers = '';
  if (V2.mode === 'overall')
    tiers =
      box('Overall', H.overall?.tier) + box('Groups', H.overall?.groups) + box('Single target', H.overall?.single);
  else if (V2.mode === 'towers')
    tiers =
      box('Overall', H.overall?.tier) +
      (TOWER_TRIALS.towers || []).map((w) => box(w.name.replace('Tower of ', ''), (H.towers || {})[w.id])).join('');
  else tiers = (D.bosses || []).map((b) => box(b.name, (H.bosses || {})[b.id])).join('');
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
  const how = `<p>${w.text ? `<i>“${profileEsc(w.text)}”</i></p><p>` : ''}In the <b>${profileEsc(w.name || '')}</b>, hits on an enemy with ${st(w.status, w.archetype)} deal <b>+${B.own ?? 400}%</b> damage, so ${profileEsc(w.archetype || '')} heroes are close to required. Damage-over-time statuses add <b>+${B.dot ?? 100}%</b> in every tower; other statuses add nothing.</p><p>${profileEsc(B.text || '')}</p>`;
  const floors = `<p><b>${T.floors || 30} floors</b>, up to ${T.starsPerFloor || 3} stars each: ${(T.conditions || []).map(profileEsc).join('; ')}. ${profileEsc(T.conditionsNote || '')}</p><p>${profileEsc(T.enemyLevels || '')} ${profileEsc(T.entry || '')}</p>`;
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
  const rew = b.hunt
    ? `<details class="v2-panel v2-binfo"><summary>Rewards</summary><div><div class="v2-rew" data-v2rew="${E(b.id)}">${v2BossRewards(b)}</div></div></details>`
    : '';
  return (
    rew +
    `<details class="v2-panel v2-binfo"><summary>Rating Rewards (Same for each difficulty)</summary><div><table class="gx-tbl">${(H.ranks || []).map((r) => `<tr><td style="font-weight:900;font-size:18px;width:40px">${E(r.rank)}</td><td>${Number(r.points).toLocaleString('en-GB')} pts</td><td><span class="gx-mat"><img src="${E(r.icon)}" alt="">${r.amount}× ${E(r.item)}</span></td></tr>`).join('')}</table></div></details>`
  );
}
function v2BossInfo(b) {
  const I = b && b.info;
  if (!I) return v2HuntRanks(b);
  const E = profileEsc;
  const fights = `<p>${E(I.intro || '')}</p><div class="v2-fights">${(I.fights || []).map((f, i) => `<div><b>${i + 1}. ${E(f.name)}</b>${E(f.text || '')}</div>`).join('')}</div>${I.fightsNote ? `<p><b>${E(I.fightsNote)}</b></p>` : ''}`;
  const rew = `<div class="v2-rew" data-v2rew="${E(b.id)}">${v2BossRewards(b)}</div>`;
  const strat = (I.strategy || []).length
    ? `<ul>${I.strategy.map((t) => `<li>${E(t)}</li>`).join('')}</ul>`
    : '<p class="v2-tnote">Signature moves and tips will be added once recorded.</p>';
  return `<details class="v2-panel v2-binfo" open><summary>${E(b.name)}${b.stage ? ' · ' + E(b.stage) : ''}: the fights</summary><div>${fights}</div></details><details class="v2-panel v2-binfo"><summary>Strategy</summary><div>${strat}</div></details><details class="v2-panel v2-binfo"><summary>Rewards</summary><div>${rew}</div></details>`;
}
function renderTierV2() {
  const root = $('tierV2');
  if (!root) return;
  const D = v2Data();
  if (!(D.bosses || []).some((b) => b.id === V2.boss)) V2.boss = (D.bosses || [])[0]?.id || '';
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
      ? (D.bosses || []).find((b) => b.id === V2.boss)?.name
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
  let html = `<div class="v2-banner">BETA · Ratings reflect the agreed tests and are still being reviewed.</div>
 <div class="v2-head"><h2>Tier List <span>(${profileEsc(M.label || '')}${bossName ? ' · ' + profileEsc(bossName) : ''})</span></h2></div>
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
    // One row of tabs per boss type, in the order the types first appear (Hunt bosses above, Raid bosses below; David, 13 Nov 2026).
    const types = [...new Set([...(D.bosses || []).map((b) => b.type), ...Object.keys(un)])];
    const rows = types.map(
      (type) =>
        `<div class="v2-bosses">${(D.bosses || [])
          .filter((b) => b.type === type)
          .map(v2BossTab)
          .join('')}${Array.from(
          { length: un[type] || 0 },
          () =>
            `<div class="v2-boss locked"><span class="v2-boss-text"><span class="v2-boss-name">${profileEsc(type)} boss · not reached yet</span></span></div>`,
        ).join('')}</div>`,
    );
    html += `<div class="v2-boss-rows">${rows.join('')}</div>${v2BossInfo((D.bosses || []).find((b) => b.id === V2.boss))}`;
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
    )}</div><div class="v2-fgroup"><button type="button" class="heroes-filter-btn v2-tagall${V2.tagsOff ? '' : ' active'}" id="v2TagAll" aria-pressed="${!V2.tagsOff}" title="${V2.tagsOff ? 'Show' : 'Hide'} all tags">Tags</button><button type="button" class="heroes-filter-btn v2-tagall${V2.awk ? ' active' : ''}" id="v2AwkAll" aria-pressed="${V2.awk}" title="${V2.awk ? 'Back to the ratings without awakenings' : 'Ratings with all awakenings (not rated yet)'}">Awakenings</button></div></div>`;
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
  {
    const ab = $('v2AwkAll');
    if (ab)
      ab.onclick = () => {
        V2.awk = !V2.awk;
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
  v2HeaderArt();
}
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
// Additional Beta pages.
const ITEMDB = { tab: 'materials', q: '', rar: '', data: {}, ach: null, aq: '', acat: '', aown: '' };
const ITEM_TABS = [
  ['materials', 'Materials'],
  ['ingredients', 'Ingredients'],
  ['important', 'Important'],
  ['quest', 'Quest'],
];

/* Boss header art (David, 12 Nov 2026). PC only (CSS, 1100 px and wider). In Bosses mode with a boss picked, the header grows,
   the boss art (TIER_LIST_V2.bosses[].header) sits in the top corners behind the centred title, and the title takes the boss's look:
   Raids their card colour, font and breathing glow; Hunt bosses split diagonally through the middle letter in their two weakness
   colours, with the weakness icons on the right. Raid art follows the card: humanoid left for 30 s, dragon right for 30 s, on the
   card's own animation clock. */
function v2HeaderArt() {
  const app = document.querySelector('.app-content'),
    hdr = app && app.querySelector(':scope > header');
  if (!hdr) return;
  let layer = $('bossArt');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'bossArt';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML =
      '<div class="ba-art ba-left"></div><div class="ba-art ba-right"></div><div class="ba-icons"></div>';
    app.prepend(layer);
  }
  const b = V2.mode === 'bosses' ? (v2Data().bosses || []).find((x) => x.id === V2.boss) : null,
    art = b && b.header,
    root = document.documentElement;
  root.classList.toggle('boss-art', !!art);
  hdr.classList.remove('ba-raid', 'ba-succubus', 'ba-split', 'ba-one');
  hdr.style.removeProperty('--ba-a');
  hdr.style.removeProperty('--ba-b');
  if (!art) return;
  const L = layer.querySelector('.ba-left'),
    R = layer.querySelector('.ba-right'),
    I = layer.querySelector('.ba-icons'),
    raid = b.type === 'Raid',
    weak = raid ? [] : (b.weak || []).filter((a) => ARCH_COLORS[a]).slice(0, 2);
  L.style.backgroundImage = `url('${absUrl(art.left)}')`;
  R.style.backgroundImage = art.right ? `url('${absUrl(art.right)}')` : 'none';
  layer.classList.toggle('ba-cycle', raid && !!art.right);
  /* Same wall-clock phase as the card's swap (its animation-delay is -(now mod 60) s), so header and card change together.
     A changed delay on a running animation counts from when that animation first started, not from now, so the animation is
     restarted each time (that was the drift David saw after switching bosses or re-drawing the tier list). */
  [L, R].forEach((el) => {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
    el.style.animationDelay = `-${((Date.now() / 1000) % 60).toFixed(3)}s`;
  });
  I.innerHTML = weak
    .map((a) => `<img src="${profileEsc(absUrl('assets/archetypes/' + a.toLowerCase() + '.webp'))}" alt="">`)
    .join('');
  if (raid) hdr.classList.add('ba-raid', ...(String(b.theme || '').includes('succubus') ? ['ba-succubus'] : []));
  else if (weak.length) {
    hdr.style.setProperty('--ba-a', ARCH_COLORS[weak[0]]);
    hdr.style.setProperty('--ba-b', ARCH_COLORS[weak[1] || weak[0]]);
    hdr.classList.add(weak.length > 1 ? 'ba-split' : 'ba-one');
    v2HeaderSplit();
  }
  requestAnimationFrame(v2HeaderSync);
}
/* The diagonal split passes through the centre of the middle letter, counting letters only (not ':' or spaces). */
function v2HeaderSplit() {
  const hdr = document.querySelector('.app-content > header.ba-split'),
    h1 = hdr && hdr.querySelector('h1'),
    t = h1 && h1.firstChild;
  if (!t || t.nodeType !== 3) return;
  const idx = [...t.textContent].map((c, i) => (/[A-Za-z]/.test(c) ? i : -1)).filter((i) => i >= 0);
  if (!idx.length) return;
  const at = idx[Math.floor(idx.length / 2)],
    r = document.createRange();
  r.setStart(t, at);
  r.setEnd(t, at + 1);
  const box = h1.getBoundingClientRect(),
    c = r.getBoundingClientRect();
  if (!box.width) return;
  const a = (105 * Math.PI) / 180,
    len = box.width * Math.abs(Math.sin(a)) + box.height * Math.abs(Math.cos(a)),
    x = (c.left + c.right) / 2 - box.left - box.width / 2,
    y = (c.top + c.bottom) / 2 - box.top - box.height / 2;
  hdr.style.setProperty('--ba-cut', (((x * Math.sin(a) - y * Math.cos(a) + len / 2) / len) * 100).toFixed(3) + '%');
}
/* Keep the title's breathing glow on the selected card's glow clock (the swap follows the wall clock, like the card). */
function v2HeaderSync() {
  const card = document.querySelector('.v2-boss.raid.on');
  if (!card || !document.documentElement.classList.contains('boss-art')) return;
  const glow = card.getAnimations().find((a) => /v2raid|v2succubus/.test(a.animationName || '')),
    h1 = document.querySelector('.app-content > header h1');
  h1?.getAnimations().forEach((a) => {
    if (glow && glow.currentTime != null) a.currentTime = glow.currentTime;
  });
}
window.addEventListener('resize', () => v2HeaderSplit());
document.fonts?.ready.then(() => v2HeaderSplit());

/* Boss rewards by difficulty (David, 12 Nov 2026): circles like the dungeons' (colours from DUNGEONS.difficulties), icons instead of text.
   Entries: {set, rarity} (gear set tile), {rune} (one tile for all 5 types of that grade), {name, icon, amount} (amount may be "1–3"). */
const V2_RDIFF = {};
function v2BossRewards(b) {
  const H = (b && b.hunt) || null,
    I = (b && b.info) || {},
    D = I.difficulties || (H && H.difficulties) || [],
    note = I.rewardsNote || '',
    E = profileEsc;
  if (!D.length) return '';
  const pick = Math.min(V2_RDIFF[b.id] || 0, D.length - 1),
    x = D[pick],
    DC = [
      ...((typeof DUNGEONS !== 'undefined' && DUNGEONS.difficulties) || []),
      ...((H && typeof TIER_LIST_V2 !== 'undefined' && TIER_LIST_V2.huntDifficulties) || []),
    ].reduce((o, v) => ((o[v.name] = v), o), {}),
    grades = ((typeof RUNES !== 'undefined' && RUNES.grades) || []).reduce((o, g) => ((o[g.name] = g), o), {}),
    runeIcon = ((typeof RUNES !== 'undefined' && RUNES.types) || [])[0]?.icon || '';
  const circles = D.map((v, i) => {
    const c = DC[v.name] || {};
    return `<button type="button" class="tr-diff${i === pick ? ' on' : ''}" style="--dc:${E(c.color || '#9aa3ad')}" data-v2rdiff="${i}" aria-pressed="${i === pick}" title="${E(v.name)}">${E(c.roman || String(i + 1))}</button>`;
  }).join('');
  const amt = (a) => (typeof a === 'number' ? a.toLocaleString('en-GB') : E(String(a ?? '')));
  const tile = (r) => {
    if (r.set) {
      const g = (GEAR_DATA || []).find((s) => s.name === r.set) || {},
        col = gxRarColor(r.rarity || 'Orange');
      return `<span class="tr-rw v2-rw-set" style="--set-rarity:${col}" title="${E(r.set)} (${r.rarity === 'Orange' || !r.rarity ? 'Legendary' : E(r.rarity)})"><img src="${E(absUrl(g.icon || ''))}" alt="${E(r.set)}"></span>`;
    }
    if (r.rune) {
      const g = grades[r.rune] || {};
      return `<span class="tr-rw v2-rw-rune" style="--rune:${E(g.color || '#8b8f98')}" title="${E(r.rune)} Runes (all 5 types)"><img src="${E(absUrl(runeIcon))}" alt="${E(r.rune)} Runes"><b>${E(r.rune)}</b></span>`;
    }
    return `<span class="tr-rw" title="${E(r.name)} ×${amt(r.amount)}"><img src="${E(absUrl(r.icon || ''))}" alt="${E(r.name)}"><b>${amt(r.amount)}</b></span>`;
  };
  return `<div class="v2-rdiffs" role="group" aria-label="Difficulty">${circles}<span class="v2-rdiff-name">${E(x.name)} · recommended Lv.${E(String(x.level))}${H && H.members ? ' · ' + E(H.members) + ' players' : ''}</span></div><div class="v2-rtiles">${(x.rewards || []).map((r) => (typeof r === 'string' ? `<span class="v2-rtext">${E(r)}</span>` : tile(r))).join('')}</div>${note ? `<p class="v2-tnote">${E(note)}</p>` : ''}`;
}
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-v2rdiff]'),
    box = btn && btn.closest('[data-v2rew]');
  if (!box) return;
  const b = (v2Data().bosses || []).find((x) => x.id === box.dataset.v2rew);
  if (!b) return;
  V2_RDIFF[b.id] = Number(btn.dataset.v2rdiff);
  box.innerHTML = v2BossRewards(b);
  box.querySelector(`[data-v2rdiff="${V2_RDIFF[b.id]}"]`)?.focus();
});
