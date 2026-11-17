/* Boss and Tower Finder and public mechanics guides. */
const FINDER_TEAM_NAMES = {
  amplitude: ['Crimson Verdict', 'Armor Break'],
  gale: ['Royal Inferno', 'Venom Cyclone'],
  crushing: ['Thunder Chorus', 'Frost Prison'],
  gauron: ['Crimson Verdict', 'Frost Prison'],
};

function renderFinder() {
  const bosses = v2Data().bosses;
  const towers = TOWER_TRIALS.towers;
  const root = $('finderBody');
  const E = profileEsc;
  function options(items) {
    return items.map((entry) => `<option value="${E(entry.id)}">${E(entry.name)}</option>`).join('');
  }
  root.innerHTML = `<div class="finder-controls">
    <label>Encounter<select id="finderEncounter">
      <optgroup label="Hunts">${options(bosses.filter((b) => b.type === 'Hunt'))}</optgroup>
      <optgroup label="Raids">${options(bosses.filter((b) => b.type === 'Raid'))}</optgroup>
      <optgroup label="Towers of Trials">${options(towers)}</optgroup>
      <optgroup label="Reference"><option value="training-ogre">Lv.90 Training Ogre</option></optgroup>
    </select></label>
    <label id="finderDifficultyLabel">Difficulty<select id="finderDifficulty"></select></label>
  </div><div id="finderResult" aria-live="polite"></div><div id="fightTeam"></div>`;
  const encounter = $('finderEncounter');
  const difficulty = $('finderDifficulty');
  const statusOf = (arch) => Object.keys(STATUS_ARCHETYPE).find((status) => STATUS_ARCHETYPE[status] === arch);

  function update(resetDifficulty = false) {
    const boss = bosses.find((entry) => entry.id === encounter.value);
    const tower = towers.find((entry) => entry.id === encounter.value);
    const entry = boss || tower;
    const levels = boss?.hunt?.difficulties || boss?.info?.difficulties || [];
    if (resetDifficulty) {
      difficulty.replaceChildren(
        ...levels.map(({ name, level }) => new Option(level ? name + ' · Lv.' + level : name, name)),
      );
      difficulty.value = levels.findLast((level) => level.name === 'Hell')?.name || levels.at(-1)?.name || '';
    }
    $('finderDifficultyLabel').hidden = !levels.length;
    if (!entry) {
      $('finderResult').innerHTML =
        '<section class="finder-card"><div class="finder-content"><h3>Lv.90 Training Ogre</h3><p>Compare skill buildup on the same boss training target.</p></div></section>';
      renderFightTeam();
      return;
    }
    const highHunt = boss?.type === 'Hunt' && ['Nightmare', 'Hell'].includes(difficulty.value);
    const weakness = boss?.weak?.map(statusOf).filter(Boolean) || [];
    const statuses = tower ? [tower.status] : weakness;
    const color = ARCH_COLORS[tower?.archetype || boss?.weak?.[0]] || '#31a8e4';
    const art = boss?.image || TOWER_TRIALS.image;
    const tierHash = (tower ? 'tower=' : 'boss=') + entry.id;
    let summary = '';
    if (tower) {
      summary = `${tower.status} adds +${TOWER_TRIALS.bonus.own}% Additional Damage to hits while it is active. The most useful teams apply the status early and spend the window on their strongest hits.`;
    } else if (boss.type === 'Hunt') {
      summary = highHunt
        ? 'A matching elemental status or an active physical status removes the damage resistance for its duration.'
        : 'On this difficulty, the Nightmare and Hell damage-resistance rule is inactive.';
      if (highHunt && weakness.includes('Frost'))
        summary += ' One Frost stack opens Frost-weak Hunts. Three trigger Freeze.';
      if (boss.id === 'gallore')
        summary += ' The first Break knocks off a fist and lowers Gallore’s Defense after the gauge recovers.';
    } else {
      summary = (boss.info?.fights || []).map((fight) => fight.name).join(' → ') + '. ' + (boss.info?.fightsNote || '');
    }
    const names = FINDER_TEAM_NAMES[entry.id];
    const teams = TEAM_DATA.filter((team) =>
      names ? names.includes(team.name) : (boss?.weak || []).includes(team.arch),
    );
    const teamLinks = teams
      .map(
        (team) =>
          `<li><a href="${E(routeUrl('teams'))}#team=${encodeURIComponent(team.name)}">${E(team.name)}</a><span>${formatSkillText(team.combo)}</span></li>`,
      )
      .join('');
    $('finderResult').innerHTML = `<article class="finder-card" style="--finder-accent:${E(color)}">
      <div class="finder-art" style="--finder-art:url('${E(absUrl(art))}')"><h3>${E(entry.name)}</h3></div>
      <div class="finder-content">${statuses.length ? `<div class="finder-status"><span>${tower ? 'Tower status' : 'Weak to'}</span> ${statuses.map(formatSkillText).join(' · ')}</div>` : ''}
      <p>${formatSkillText(summary)}</p>
      <div class="finder-actions"><a href="${E(routeUrl('tier'))}#${tierHash}">See hero rankings →</a>${boss ? guideLink(boss.type.toLowerCase() + '-' + boss.id, 'Open fight guide →') : guideLink('tower-' + tower.id, 'Open tower guide →')}${boss?.id === 'ursula' ? `<a href="${E(routeUrl('teams'))}#speed">See recorded Ursula teams →</a>` : ''}</div>
      ${teamLinks ? `<h4>Teams to try</h4><ul class="finder-team-list">${teamLinks}</ul>` : ''}
      </div></article>`;
    renderFightTeam();
  }
  encounter.onchange = () => update(true);
  difficulty.onchange = () => update();
  update(true);
  difficulty.dataset.defaultDifficulty = difficulty.value;
  wireFightTeam();
}

function finderSelection() {
  const encounter = $('finderEncounter');
  const difficulty = $('finderDifficulty');
  const teamCheck = fightTeamState();
  if (encounter.selectedIndex === 0 && difficulty.value === difficulty.dataset.defaultDifficulty && !teamCheck)
    return null;
  return { encounter: encounter.value, difficulty: difficulty.value, ...(teamCheck ? { teamCheck } : {}) };
}

function selectFinderEncounter(selection) {
  const encounter = $('finderEncounter');
  const difficulty = $('finderDifficulty');
  const entry = [...encounter.options].find((option) => option.value === selection?.encounter);
  encounter.value = (entry || encounter.options[0]).value;
  encounter.onchange();
  if (entry && [...difficulty.options].some((option) => option.value === selection.difficulty)) {
    difficulty.value = selection.difficulty;
    difficulty.onchange();
  }
  applyFightTeamState(selection?.teamCheck);
}

const MECHANICS_GUIDES = [
  {
    id: 'status-effects',
    title: 'Status Effects',
    next: { page: 'tools', tool: 'damage', label: 'Open the Damage Calculator' },
    intro: 'Which status opens a damage window, and which skills can use it?',
    sections: [
      [
        'Physical statuses',
        'Airborne launches, Knockdown floors the target, and Stun interrupts it. Each active physical status adds +100% to the hit-bonus pool. Fill the matching gauge, then use a skill that requires or benefits from that status.',
      ],
      [
        'Poison, Bleed, Burn and Shock',
        'One full stack activates the status and adds +50% to the hit-bonus pool. Over ten seconds, five ticks use 50%, 75% or 100% of the first applier’s Attack at one, two or three stacks. Later stacks strengthen ticks. The direct-hit bonus is +50% for the active status.',
      ],
      [
        'Frost and Freeze',
        'The first Frost stack adds +50% to the hit-bonus pool. Frost has no damage ticks. The third stack triggers Freeze, disabling the enemy and enabling shatter. Cerese’s Shattering Touch also works on Ice Blocks.',
      ],
      [
        'Stacking damage bonuses',
        'Different active statuses add their hit bonuses together. For example, Airborne plus Poison gives a 2.5× hit multiplier before gear effects. Additional Attack Power and Additional Damage are separate parts of the damage calculation.',
      ],
    ],
  },
  {
    id: 'break-super-armor',
    title: 'Break & Super Armor',
    next: { page: 'teams', hash: '#team=Armor%20Break', label: 'See the Armor Break team' },
    intro: 'Build the next physical window while the enemy’s armour is down.',
    sections: [
      [
        'Filling the gauges',
        'Skills can damage Super Armor and build a status at the same time. A portion of a status gauge and a portion of the Super Armor gauge measure different effects. Castella’s Whirlwind is a fast way to damage Super Armor.',
      ],
      [
        'During Break',
        'The Break window lasts eight seconds and doubles Airborne, Knockdown and Stun buildup. Frost and the damage-over-time statuses keep their normal buildup. Some skills can only be used against a target while its Super Armor is broken.',
      ],
      [
        'Damage during Break',
        'Break adds no inherent hit bonus. Break Additional Attack Power, All Status Additional Attack Power, and Break Additional Damage can still raise hits. Break Additional Damage shares the usual Additional Damage pool.',
      ],
    ],
  },
  {
    id: 'defense',
    title: 'Defense, Armor Penetration and Defense Ignore',
    next: { page: 'tools', tool: 'damage', label: 'Compare stats in the Damage Calculator' },
    intro:
      'Enemy Defense reduces hit damage. Armor Penetration subtracts points, and Defense Ignore bypasses a percentage.',
    sections: [
      [
        'How Defense reduces damage',
        'The Defense multiplier is 1,000 ÷ (1,000 + effective Defense). With 1,000 effective Defense, a hit deals 50% of its damage before Defense. At 500, it deals about 66.7%.',
      ],
      [
        'Flat points and percentages',
        'Each point of Armor Penetration subtracts one point of Defense. Defense Ignore scales with the Defense it works on, so the same percentage removes more points from a high-Defense target. At 1,000 Defense, 10% Ignore removes 100 points. At 500 Defense, it removes 50.',
      ],
      [
        'Combining both with a Defense debuff',
        'A Defense debuff and Defense Ignore each multiply the remaining Defense. Armor Penetration applies after both. For an enemy with 1,000 Defense, a 20% Defense debuff and 25% Defense Ignore leave 1,000 × 0.80 × 0.75 = 600 Defense. With 100 Armor Penetration, the hit uses 500 effective Defense.',
      ],
    ],
  },
];

// "Start here" guide for new players (GUIDES.startHere in data.json, 15 Nov 2026): sections of typed blocks.
function guideTeamLink(team, label = team) {
  const E = profileEsc;
  return (
    '<a class="guide-team-link" href="' +
    E(routeUrl('teams', { team })) +
    '" data-ref-type="team" data-ref-key="' +
    E(team) +
    '">' +
    E(label) +
    '</a>' +
    '<button type="button" class="touch-ref-preview guide-team-preview-trigger" aria-label="Preview ' +
    E(team) +
    ' lineup" data-ref-type="team" data-ref-key="' +
    E(team) +
    '">ⓘ</button>'
  );
}

function formatGuideText(raw, format = formatSkillText) {
  const names = TEAM_DATA.map((team) => team.name.replace(/[^\w ]/g, '\\$&'));
  if (!names.length) return format(raw);
  const pattern = new RegExp('\\b(' + names.join('|') + ')\\b', 'g');
  return String(raw)
    .split(pattern)
    .map((part, index) => (index % 2 ? guideTeamLink(part) : format(part)))
    .join('');
}

function startHereHtml(G) {
  const E = profileEsc,
    H = (n) => HEROES.find((h) => h.name === n),
    acc = (h) => (h && ARCH_COLORS[h.archetype]) || '#68c7d5',
    md = (t) => formatGuideText(t, E).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const chips = (names) =>
    names
      .map((n) =>
        n
          .split(' / ')
          .map((x) => {
            const h = H(x);
            return h
              ? `<a class="sh-chip" style="--a:${acc(h)}" href="${E(heroLinkUrl(x))}" data-sh-hero="${E(x)}"><img src="${E(h.portrait)}" alt="">${E(x)}</a>`
              : E(x);
          })
          .join('<span class="sh-or">/</span>'),
      )
      .join('');
  const block = (b) => {
    if (b.type === 'timeline')
      return `<div class="sh-tl">${b.items.map((it) => `<a class="sh-step" style="--a:${acc(H(it.hero))}" href="${E(heroLinkUrl(it.hero))}" data-sh-hero="${E(it.hero)}"><img src="${E((H(it.hero) || {}).portrait || '')}" alt=""><b>${E(it.hero)}</b><small>${E(it.when)}</small></a>`).join('')}</div>`;
    if (b.type === 'tip') return `<div class="sh-tip"><b>Tip:</b> ${md(b.text)}</div>`;
    if (b.type === 'heroes')
      return `<p class="sh-text">${md(b.text)} <span class="sh-chips">${chips(b.heroes)}</span></p>`;
    if (b.type === 'cols')
      return `<div class="sh-cols">${b.items.map((c) => `<div class="sh-box"><h4 style="color:${E(c.color)}">${E(c.title)}</h4><div class="sh-chips">${chips(c.heroes)}</div><p>${formatGuideText(c.text, colourStatusWords)}</p></div>`).join('')}</div>`;
    if (b.type === 'rules')
      return `<div class="sh-rules">${b.items.map((r) => `<div class="sh-rule"><span class="sh-ic" aria-hidden="true">${E(r.icon)}</span><div><h4>${E(r.title)}</h4><p>${formatGuideText(r.text, colourStatusWords)}</p></div></div>`).join('')}</div>`;
    if (b.type === 'steps')
      return `<ol class="sh-steps">${b.items.map((t) => `<li><div>${md(t)}</div></li>`).join('')}</ol>`;
    if (b.type === 'table')
      return `<div class="sh-table"><table><thead><tr>${b.head.map((h) => `<th>${E(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c, i) => (i ? `<td>${E(c)}</td>` : `<td><b>${E(c)}</b></td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
    if (b.type === 'image')
      return `<figure class="sh-fig"><img src="${E(b.src)}" alt="${E(b.caption || '')}" loading="lazy"><figcaption>${E(b.caption || '')}</figcaption></figure>`;
    if (b.type === 'links')
      return `<div class="sh-links">${b.items.map((l) => `<a href="${E(routeUrl(l.page, l.tool ? { tool: l.tool } : {}))}">${E(l.label)} →</a>`).join('')}</div>`;
    return '';
  };
  return `<article class="sh" id="${E(G.id)}"><header class="sh-head"><div class="sh-kicker">${E(G.kicker)}</div><h3>${E(G.title)}</h3><p>${formatGuideText(G.intro, E)}</p><nav class="sh-toc" aria-label="On this page">${G.sections.map((s, i) => guideLink(G.id + '-' + s.id, i + 1 + ' · ' + s.title)).join('')}</nav></header>${G.sections
    .map(
      (s, i) =>
        `<section class="sh-sec" tabindex="-1" id="${E(G.id)}-${E(s.id)}" style="--c:${E(s.color)}"><h4 class="sh-h"><span class="sh-num">${i + 1}</span>${E(s.title)}</h4><p class="sh-sub">${formatGuideText(s.sub, E)}</p>${s.blocks.map(block).join('')}</section>`,
    )
    .join('')}</article>`;
}
// Guide screenshots (GUIDES.articles[].figures, 17 Nov 2026): one image, or a swiper for several.
function guideFigureHtml(images) {
  const E = profileEsc;
  const slide = (im) =>
    `<figure class="gf-slide"><div class="gf-frame"><img src="${E(im.src)}" alt="${E(im.caption)}" loading="lazy"></div><figcaption>${E(im.caption)}</figcaption></figure>`;
  if (images.length === 1) return `<div class="gf">${slide(images[0])}</div>`;
  const dots = images
    .map(
      (_, i) =>
        `<button type="button" aria-label="Screenshot ${i + 1}" data-gf-go="${i}"${i ? '' : ' aria-current="true"'}></button>`,
    )
    .join('');
  return `<div class="gf gf-swiper" data-gf><div class="gf-track">${images.map(slide).join('')}</div>
    <button type="button" class="gf-nav gf-prev" aria-label="Previous screenshot" data-gf-step="-1">‹</button>
    <button type="button" class="gf-nav gf-next" aria-label="Next screenshot" data-gf-step="1">›</button>
    <div class="gf-bar"><span class="gf-count">1 / ${images.length}</span><div class="gf-dots">${dots}</div></div></div>`;
}
function gfIndex(track) {
  return Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
}
function gfSync(box) {
  const track = box.querySelector('.gf-track');
  const n = track.children.length;
  const i = Math.min(n - 1, gfIndex(track));
  box.querySelector('.gf-count').textContent = `${i + 1} / ${n}`;
  box.querySelectorAll('[data-gf-go]').forEach((b, j) => b.toggleAttribute('aria-current', i === j));
  box.querySelector('.gf-prev').disabled = i === 0;
  box.querySelector('.gf-next').disabled = i === n - 1;
}
function gfGo(box, i) {
  const track = box.querySelector('.gf-track');
  const n = track.children.length;
  track.scrollTo({ left: Math.max(0, Math.min(n - 1, i)) * track.clientWidth, behavior: 'smooth' });
}
document.addEventListener('click', (event) => {
  const b = event.target.closest('[data-gf] [data-gf-step], [data-gf] [data-gf-go]');
  if (!b) return;
  const box = b.closest('[data-gf]');
  const track = box.querySelector('.gf-track');
  gfGo(box, b.dataset.gfGo != null ? +b.dataset.gfGo : gfIndex(track) + +b.dataset.gfStep);
});
document.addEventListener(
  'scroll',
  (event) => {
    const box = event.target.closest?.('[data-gf]');
    if (box && event.target.classList.contains('gf-track')) gfSync(box);
  },
  true,
);
document.addEventListener('keydown', (event) => {
  const box = event.target.closest?.('[data-gf]');
  if (!box || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
  event.preventDefault();
  gfGo(box, gfIndex(box.querySelector('.gf-track')) + (event.key === 'ArrowRight' ? 1 : -1));
});

const CARD_EMBLEMS = {
  tier: ['ranks', '#f0c787'],
  teams: ['teams', '#82d1ef'],
  finder: ['finder', '#85dded'],
  heroes: ['heroes', '#a9c8fc'],
  karma: ['karma', '#c3a7f5'],
  gear: ['gear', '#a6c9ee'],
  familiars: ['familiar', '#9fddad'],
  cookbook: ['recipes', '#efb38b'],
  items: ['items', '#9bcdda'],
  trait: ['trait', '#c0a8fa'],
  dungeons: ['dungeon', '#9bc8ee'],
  currency: ['coins', '#f0cc7a'],
  titles: ['titles', '#e7ba86'],
  achievements: ['trophy', '#f2cd82'],
  damage: ['damage', '#f6aa94'],
  level: ['level', '#8bd5c4'],
  news: ['news', '#a1cce8'],
  'start-here': ['journal', '#8fe5ef'],
  'first-investments': ['materials', '#f2ca83'],
  'normal-dungeons': ['dungeon', '#9bc8ee'],
  'currency-dungeons': ['coins', '#f0cc7a'],
  'trait-dungeons': ['trait', '#c0a8fa'],
  'world-bosses': ['world', '#91d7b8'],
  'hunt-overview': ['hunt', '#efb191'],
  'raid-overview': ['raid', '#f99fa8'],
  'tower-overview': ['tower', '#b2b4f6'],
  'status-effects': ['status', '#91e0bb'],
  'break-super-armor': ['break', '#f8ae93'],
  defense: ['defense', '#aacbf7'],
  'gear-rarities': ['gear', '#a6c9ee'],
  'gear-upgrades': ['anvil', '#e7b091'],
  runes: ['rune', '#c2a7f5'],
  exchange: ['exchange', '#9cdac7'],
  'hero-progression': ['progress', '#f0c487'],
};

function guideBoss(id) {
  return v2Data().bosses.find((boss) => boss.type.toLowerCase() + '-' + boss.id === id);
}

function cardEmblem(key) {
  const E = profileEsc;
  const boss = guideBoss(key);
  const towerId = key.startsWith('tower-') ? key.slice(6) : '';
  const tower = TOWER_TRIALS.towers.find((entry) => entry.id === towerId);
  const portrait = (boss?.id === 'gauron' && boss.header?.right) || boss?.header?.left || boss?.portrait;
  if (portrait || tower?.crest) {
    const colour = tower ? ARCH_COLORS[tower.archetype] : ARCH_COLORS[boss.weak[0]] || '#e3818b';
    return `<i class="card-emblem ${boss ? 'card-emblem-portrait' : 'card-emblem-crest'}" style="--emblem:${E(colour)}" aria-hidden="true"><img src="${E(portrait || tower.crest)}" alt="" loading="lazy"></i>`;
  }
  const [glyph, colour] = CARD_EMBLEMS[key] || CARD_EMBLEMS['start-here'];
  return `<i class="card-emblem" style="--emblem:${colour}" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><use href="${E(absUrl('assets/ui/card-emblems.svg'))}#${glyph}"></use></svg></i>`;
}

function guideArticle(id) {
  return MECHANICS_GUIDES.find((guide) => guide.id === id) || GUIDES.articles?.find((guide) => guide.id === id);
}

function guideTarget(hash) {
  const start = GUIDES.startHere;
  if (start && (hash === start.id || start.sections.some((section) => hash === start.id + '-' + section.id)))
    return start.id;
  return guideArticle(hash)?.id;
}

function guideLink(id, label, className = '') {
  const E = profileEsc;
  const tile = className === 'guide-tile';
  const title = tile ? cardEmblem(id) + `<span class="guide-tile-title">${E(label)}</span>` : E(label);
  return `<a class="${className}" href="${E(routeUrl('guides', { guide: id }))}" data-guide-link="${E(id)}">${title}</a>`;
}

function renderGuideLibrary() {
  const E = profileEsc;
  const start = GUIDES.startHere;
  return GUIDES.categories
    .map(({ name, items }) => {
      const featured = items.find((item) => item.ready && item.id === start?.id);
      const banner = featured
        ? `<a class="sh-head guide-banner" href="${E(routeUrl('guides', { guide: featured.id }))}" data-guide-link="${E(featured.id)}">
            ${cardEmblem(featured.id)}<div><span class="sh-kicker">${E(featured.title)}</span><h4>${E(start.title)}</h4>
            <p>Meet your first heroes, build a team and learn where to spend and farm.</p></div><span aria-hidden="true">→</span>
          </a>`
        : '';
      const cards = items
        .filter((item) => item !== featured)
        .map(({ title, ready, id }) =>
          ready
            ? `<li>${guideLink(id, title, 'guide-tile')}</li>`
            : `<li class="guide-tile guide-planned">${E(title)}<small>Planned</small></li>`,
        )
        .join('');
      return `<section class="shortcut-group"><h3 class="gear-section-title shortcut-title">${E(name)}</h3>
        ${banner}${cards ? `<ul class="guide-grid shortcut-grid">${cards}</ul>` : ''}</section>`;
    })
    .join('');
}

function renderGuides(hash = '') {
  const E = profileEsc;
  const id = guideTarget(hash);
  const root = $('guidesBody');
  const current = guideTarget(root.dataset.guide);
  root.dataset.guide = id ? hash : '';
  if (id && current === id) return;
  if (!id) {
    root.innerHTML = renderGuideLibrary();
    return;
  }
  const boss = guideBoss(id);
  const finder = boss && routeUrl('finder', { finder: { encounter: boss.id } });
  const back = `<nav class="guide-index" aria-label="Guide navigation">${guideLink('', '← All guides')}${finder ? `<a href="${E(finder)}">Open in Boss &amp; Tower Finder →</a>` : ''}</nav>`;
  if (id === GUIDES.startHere?.id) {
    const quickLinks = `<nav class="guide-index" aria-label="Combat quick links">${MECHANICS_GUIDES.map((guide) => guideLink(guide.id, guide.title)).join('')}</nav>`;
    root.innerHTML = back + quickLinks + startHereHtml(GUIDES.startHere);
    return;
  }
  const guide = guideArticle(id);
  const next = routeUrl(guide.next.page, guide.next) + (guide.next.hash || '');
  const team = new URLSearchParams(guide.next.hash?.slice(1)).get('team');
  const nextLink = team
    ? guideTeamLink(team, guide.next.label + ' →')
    : '<a href="' + E(next) + '">' + E(guide.next.label) + ' →</a>';
  const accent = boss && (ARCH_COLORS[boss.weak[0]] || '#e3818b');
  const banner = guide.cover
    ? `<div class="guide-fight-art" style="--fight-art:url('${E(absUrl(guide.cover.src))}')"></div>`
    : '';
  const cue = guide.cover
    ? `<aside class="guide-fight-cue"><dl class="guide-pull">
       <div><dt>Watch for</dt><dd>${formatGuideText(guide.cover.cue)}</dd></div>
       ${
         guide.cover.plan
           ? `<div><dt>React</dt><dd>${formatGuideText(guide.cover.plan.react)}</dd></div>
       <div><dt>Burst</dt><dd>${formatGuideText(guide.cover.plan.burst)}</dd></div>`
           : ''
       }
       </dl></aside>`
    : '';
  const prep = boss
    ? `<nav class="guide-prep" aria-label="Fight preparation"><a href="${E(routeUrl('finder', { finder: { encounter: boss.id } }))}">Check a team for this fight →</a>${boss.type === 'Raid' ? dcRaidExampleLinks() : ''}</nav>`
    : '';
  root.innerHTML = `${back}<article class="mechanics-guide${banner ? ' guide-fight' : ''}" id="${E(id)}"${accent ? ' style="--fight-accent:' + E(accent) + '"' : ''}>${banner}<h3>${E(guide.title)}</h3><p>${formatGuideText(guide.intro)}</p>${cue}${prep}
    ${guide.sections
      .map(
        ([heading, body], i) =>
          `<section><h4>${E(heading)}</h4><p>${formatGuideText(body)}</p>${(guide.figures || [])
            .filter((f) => f.after === i)
            .map((f) => guideFigureHtml(f.images))
            .join('')}</section>`,
      )
      .join('')}
    <div class="guide-next">${nextLink}</div></article>`;
  root.querySelectorAll('[data-gf]').forEach(gfSync);
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('[data-guide-link]');
  if (link && isPlainLinkClick(event)) {
    event.preventDefault();
    navNavigate({ page: 'guides', guide: link.dataset.guideLink });
    return;
  }
  const team = event.target.closest('.guide-team-link');
  if (team && isPlainLinkClick(event)) {
    event.preventDefault();
    hideKarmaPopover(0);
    navNavigate({ page: 'teams', team: team.dataset.refKey });
    return;
  }
  const a = event.target.closest('[data-sh-hero]');
  if (!a || !isPlainLinkClick(event)) return;
  event.preventDefault();
  navNavigate({ page: 'hero', hero: a.dataset.shHero });
});
