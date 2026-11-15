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
    </select></label>
    <label id="finderDifficultyLabel">Difficulty<select id="finderDifficulty"></select></label>
  </div><div id="finderResult" aria-live="polite"></div>`;
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
        ? 'A matching elemental status or an active physical status removes the damage resistance for its duration. One Frost stack opens Frost-weak Hunts. Three trigger Freeze.'
        : 'On this difficulty, the Nightmare and Hell damage-resistance rule is inactive.';
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
      <div class="finder-actions"><a href="${E(routeUrl('tier'))}#${tierHash}">See hero rankings →</a>${boss?.id === 'ursula' ? `<a href="${E(routeUrl('teams'))}#speed">See recorded Ursula teams →</a>` : ''}</div>
      ${teamLinks ? `<h4>Teams to try</h4><ul class="finder-team-list">${teamLinks}</ul>` : ''}
      </div></article>`;
  }
  encounter.onchange = () => update(true);
  difficulty.onchange = () => update();
  update(true);
}

const MECHANICS_GUIDES = [
  {
    id: 'status-effects',
    title: 'Status Effects',
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
    intro: 'Build the next physical window while the enemy’s armour is down.',
    sections: [
      [
        'Filling the gauges',
        'Skills can damage Super Armor and build a status at the same time. A portion of a status gauge and a portion of the Super Armor gauge measure different effects. Castella’s Whirlwind is a fast way to damage Super Armor.',
      ],
      [
        'During Break',
        'The Break window lasts eight seconds and doubles Airborne, Knockdown and Stun buildup. Frost and the damage-over-time statuses keep their normal buildup. Castella’s Stun Blow becomes available on a broken armoured target.',
      ],
      [
        'Damage during Break',
        'Break adds no inherent hit bonus. Break Additional Attack Power, All Status Additional Attack Power, and Break Additional Damage can still raise hits. Break Additional Damage shares the usual Additional Damage pool.',
      ],
    ],
  },
  {
    id: 'nightmare-hunts',
    title: 'Nightmare+ Hunts',
    intro: 'Build a team around the boss’s weakness, then spend the opening.',
    sections: [
      [
        'Remove the resistance',
        'On Nightmare and Hell, resistance leaves a direct hit at 17.1% of its unrestricted damage. A matching elemental status or an active physical status removes the resistance while it is active. Break helps set up physical statuses.',
      ],
      [
        'Choose the opener',
        'Bring a hero who quickly builds a matching element. On Frost-weak bosses, one Frost stack opens the damage window. Follow with your high-damage skills as soon as the status lands. The Boss & Tower Finder lists every Hunt weakness.',
      ],
      [
        'Gallore’s stone fist',
        'The first Break knocks off a fist and lowers Gallore’s Defense even after the boss recovers. An early Break and keeping Frost or Burn active are separate ways to improve damage in this fight.',
      ],
    ],
  },
];

function renderGuides() {
  const E = profileEsc;
  const root = $('guidesBody');
  const urls = { status: routeUrl('tools', { tool: 'damage' }), break: routeUrl('teams'), hunts: routeUrl('finder') };
  const next = [
    [urls.status, 'Open the Damage Calculator'],
    [urls.break, 'See the Armor Break team'],
    [urls.hunts, 'Open the Boss & Tower Finder'],
  ];
  root.innerHTML = `<nav class="guide-index" aria-label="Mechanics guides">${MECHANICS_GUIDES.map((guide) => `<a href="#${E(guide.id)}">${E(guide.title)}</a>`).join('')}</nav>
  ${MECHANICS_GUIDES.map(
    (
      guide,
      index,
    ) => `<article class="mechanics-guide" id="${E(guide.id)}"><h3>${E(guide.title)}</h3><p>${E(guide.intro)}</p>
  ${guide.sections.map(([heading, body]) => `<section><h4>${E(heading)}</h4><p>${formatSkillText(body)}</p></section>`).join('')}
  <a href="${E(next[index][0])}${index === 1 ? '#team=Armor%20Break' : ''}">${E(next[index][1])} →</a></article>`,
  ).join('')}`;
}
