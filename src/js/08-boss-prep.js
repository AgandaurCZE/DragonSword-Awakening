/* Boss preparation uses codex triggers and target-specific status buildup. */
const PHYSICAL_BUILDUP = new Set(['Airborne', 'Knockdown', 'Stun']);
let fightReadings;
let fightRequest;
const FIGHT_CHECK = { heroes: ['', '', ''], build: 'mastery', broken: false };

function lookupFightReadings() {
  if (fightReadings) return Promise.resolve(fightReadings);
  if (!fightRequest) {
    fightRequest = fetch('data/combat-reference.json?v=1')
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data) => (fightReadings = data))
      .catch(() => null)
      .finally(() => (fightRequest = null));
  }
  return fightRequest;
}

function fightSkillName(skill) {
  return String(skill || '')
    .split(/\s*\(/)[0]
    .trim();
}

function fightStatusName(status) {
  if (['Frozen', 'Freeze'].includes(status)) return 'Freeze';
  if (status === 'Super Armor Break') return 'Break';
  return status;
}

function fightBuildup(row, encounter, difficulty, broken) {
  if (row.status === 'Super Armor') return null;
  if (encounter.id === 'training-ogre') {
    if (row.broken && !broken) return null;
    const mult = PHYSICAL_BUILDUP.has(row.status) && broken && !row.broken ? 2 : 1;
    return { fraction: row.fraction * mult, approximate: mult !== 1 };
  }
  if (encounter.type !== 'Hunt' || !['Nightmare', 'Hell'].includes(difficulty) || (row.broken && !broken)) return null;
  const physical = PHYSICAL_BUILDUP.has(row.status);
  const weak = (encounter.weak || []).includes(STATUS_ARCHETYPE[row.status]);
  const mult = physical ? 0.5 * (broken && !row.broken ? 2 : 1) : weak ? 1.36 : 0.2;
  return { fraction: row.fraction * mult, approximate: true };
}

function fightSkills(hero, rows, build) {
  const skills = [];
  for (const skill of CHARACTER_PROFILE_DATA[hero]?.skills || []) {
    if (/^(MODE|Mastery)/i.test(skill.slot)) continue;
    const name = fightSkillName(skill.skill);
    const inflicts = (skill.meta?.inflicts || []).map(fightStatusName);
    const needs = (skill.meta?.requiresAny || []).map(fightStatusName);
    const triggerText = skill.description?.split('Activation Conditions:').at(1)?.split('\n')[0] || '';
    if (hero === 'Castella' && name === 'Stun Blow') needs.push('Break');
    if (hero === 'Cerese' && name === 'Shattering Touch') needs.push('Ice Block');
    if (hero === 'Othello' && name === 'Frozen Burst') needs.push('Ice Spears');
    if (hero === 'Othello' && name === 'Ice Grab') needs.push('Knockdown');
    const readings = rows.filter((row) => row.skill === name);
    const statuses = new Set([...inflicts, ...readings.map((row) => row.status).filter((s) => s !== 'Super Armor')]);
    if (hero === 'Kalien' && name === 'Fox Grab' && build === 'a6') needs.push('Burn');
    if (statuses.size || needs.length || /^Special [AB]$/.test(skill.slot))
      skills.push({ name, slot: skill.slot, statuses, needs: [...new Set(needs)], triggerText });
  }
  return skills;
}

function fightTeamState() {
  return FIGHT_CHECK.heroes.some(Boolean) || FIGHT_CHECK.broken || FIGHT_CHECK.build !== 'mastery'
    ? { heroes: [...FIGHT_CHECK.heroes], build: FIGHT_CHECK.build, broken: FIGHT_CHECK.broken }
    : null;
}

function applyFightTeamState(state) {
  const used = new Set();
  FIGHT_CHECK.heroes = [0, 1, 2].map((i) => {
    const name = state?.heroes?.[i];
    if (!HEROES.some((hero) => hero.name === name) || used.has(name)) return '';
    used.add(name);
    return name;
  });
  FIGHT_CHECK.build = ['base', 'a6'].includes(state?.build) ? state.build : 'mastery';
  FIGHT_CHECK.broken = state?.broken === true;
  if (FIGHT_CHECK.heroes.some(Boolean)) $('fightCheck').open = true;
  renderFightTeam();
}

function renderFightTeam() {
  const root = $('fightTeam');
  const body = $('fightTeamResults');
  if (!root || !body) return;
  const id = $('finderEncounter').value;
  const difficulty = $('finderDifficulty').value;
  const foe = TIER_LIST_V2.bosses.find((b) => b.id === id) || TOWER_TRIALS.towers.find((t) => t.id === id) || { id };
  const huntGate = foe.type === 'Hunt' && ['Nightmare', 'Hell'].includes(difficulty);
  const weak = (foe.weak || []).flatMap((arch) =>
    Object.keys(STATUS_ARCHETYPE).filter((s) => STATUS_ARCHETYPE[s] === arch && !['Frozen', 'Freeze'].includes(s)),
  );
  const wanted = foe.status ? [foe.status] : weak;
  const E = profileEsc;
  for (const [i, name] of FIGHT_CHECK.heroes.entries()) {
    const select = $('fightHero' + i);
    select.value = name;
    for (const option of select.options)
      option.disabled = option.value !== name && !!option.value && FIGHT_CHECK.heroes.includes(option.value);
  }
  $('fightBuild').value = FIGHT_CHECK.build;
  $('fightBroken').checked = FIGHT_CHECK.broken;
  $('fightPreset').value = '';
  const active = FIGHT_CHECK.heroes.filter(Boolean);
  if (!active.length) {
    body.innerHTML = '<p>Pick your heroes or load a team to see their status coverage and Signal triggers.</p>';
    return;
  }
  const tier = FIGHT_CHECK.build;
  const include = (row) => row.stage === 'A0' || (tier !== 'base' && row.stage === 'Mastery') || tier === 'a6';
  const roster = active.map((name) => {
    const readings = (fightReadings?.buildup || []).filter((row) => row.hero === name && include(row));
    return { name, readings, skills: fightSkills(name, readings, tier) };
  });
  const enemyLabel = foe.id === 'training-ogre' ? 'Lv.90 Training Ogre' : foe.name;
  const skillLink = (hero, name) => '<a href="' + E(heroLinkUrl(hero, 'skills', name)) + '">' + E(name) + '</a>';
  let modeNote = huntGate
    ? 'A completed weak elemental stack or an active physical status opens the boss’s damage window. Physical buildup is lower here and doubles during Break.'
    : foe.type === 'Raid'
      ? 'Raid bosses resist buildup more strongly. Use the skill list for coverage and the Training Ogre numbers for comparison.'
      : foe.status
        ? 'Keeping ' + foe.status + ' active opens this tower’s main damage window.'
        : 'Super Armor and target resistance affect the size and timing of the opening.';
  const allStatuses = new Set(roster.flatMap((member) => member.skills.flatMap((skill) => [...skill.statuses])));
  if (huntGate && !wanted.some((s) => allStatuses.has(s))) {
    modeNote += [...PHYSICAL_BUILDUP].some((s) => allStatuses.has(s))
      ? ' This lineup will rely on physical openings to remove the resistance.'
      : ' This lineup has no listed way to remove the resistance.';
  } else if (foe.status && !allStatuses.has(foe.status)) {
    modeNote += ' The lineup has no listed source of ' + foe.status + '.';
  }
  const frostNote =
    wanted.includes('Frost') || roster.some((member) => member.skills.some((skill) => skill.needs.includes('Freeze')))
      ? '<p class="fight-frost">' +
        formatSkillText(
          (huntGate && wanted.includes('Frost')
            ? 'One full Frost stack opens this Hunt and activates the hit bonus. '
            : 'One full Frost stack activates the hit bonus. ') +
            'Three trigger Freeze and enable shatter. Ice Blocks can also enable some skills.',
        ) +
        '</p>'
      : '';
  const hint = huntGate
    ? 'Approximate shares of one stack or physical gauge on ' +
      enemyLabel +
      ' · weak elemental ×1.36, other elemental ×0.2, physical ×0.5 before Break.'
    : foe.id === 'training-ogre'
      ? 'A percentage is the share of one stack or gauge for the listed cast or sequence.'
      : 'Numbers below use the Lv.90 Training Ogre as a reference.';
  const coverage = [
    ...new Set([
      ...wanted,
      ...(huntGate ? PHYSICAL_BUILDUP : []),
      ...roster.flatMap((member) => member.skills.flatMap((sk) => [...sk.statuses])),
    ]),
  ];
  function coverageRow(status) {
    const sources = roster.flatMap((member) =>
      member.skills.filter((skill) => skill.statuses.has(status)).map((skill) => ({ ...skill, hero: member.name })),
    );
    const canStart = sources.filter((skill) => !skill.needs.length && !skill.slot.startsWith('Special'));
    const follow = sources.filter((skill) => !canStart.includes(skill));
    const links = roster
      .map(({ name }) => {
        const casts = [...new Set([...canStart, ...follow].filter((s) => s.hero === name).map((s) => s.name))];
        return casts.length
          ? '<span class="fight-source"><b>' +
              E(name) +
              '</b> · ' +
              casts.map((cast) => skillLink(name, cast)).join(', ') +
              '</span>'
          : '';
      })
      .join('');
    const priority = wanted.includes(status) || (huntGate && PHYSICAL_BUILDUP.has(status));
    return (
      '<li' +
      (priority ? ' class="fight-priority"' : '') +
      '><strong>' +
      formatSkillText(status) +
      '</strong><span>' +
      (links || 'No source in this lineup') +
      (sources.length && !canStart.length ? '<small>Requires a Signal or another setup.</small>' : '') +
      '</span></li>'
    );
  }
  function skillReadings(member, row) {
    const onFoe = fightBuildup(row, foe, difficulty, FIGHT_CHECK.broken);
    const value = (v) => new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2 }).format(v * 100) + '%';
    const target = onFoe
      ? (onFoe.approximate ? '≈' : '') + value(onFoe.fraction)
      : foe.id === 'training-ogre' && row.status === 'Super Armor' && !FIGHT_CHECK.broken
        ? value(row.fraction)
        : '—';
    return (
      '<tr><th scope="row">' +
      (row.skill ? skillLink(member.name, row.skill) : E(row.label)) +
      (row.skill && row.label !== row.skill
        ? '<small>' + E(row.label.slice(row.skill.length).trim()) + '</small>'
        : '') +
      '</th><td>' +
      E(row.stage) +
      '</td><td>' +
      formatSkillText(row.status) +
      '</td><td>' +
      value(row.fraction) +
      (row.broken ? '<small>During Break</small>' : '') +
      '</td><td>' +
      target +
      '</td></tr>'
    );
  }
  const articles = roster.map((member) => {
    const handoffs = member.skills.filter((skill) => skill.slot.startsWith('Special'));
    const rage = (fightReadings?.rage || []).filter((row) => row.hero === member.name);
    const balance = (fightReadings?.balance || []).filter((row) => row.hero === member.name);
    const link = '<a href="' + E(heroLinkUrl(member.name)) + '">' + E(member.name) + '</a>';
    return (
      '<section class="fight-member"><h4>' +
      link +
      '</h4>' +
      (handoffs.length
        ? '<ul class="fight-handoffs">' +
          handoffs
            .map(
              (skill) =>
                '<li>' +
                skillLink(member.name, skill.name) +
                '<span>' +
                (skill.needs.length
                  ? formatSkillText(skill.needs.join(' or ')) +
                    (skill.triggerText.includes('an ally') ? ' · on an ally' : '')
                  : skill.triggerText
                    ? formatSkillText(skill.triggerText.trim())
                    : 'See skill for its trigger') +
                '</span></li>',
            )
            .join('') +
          '</ul>'
        : '') +
      (fightReadings
        ? '<details' +
          (roster.length === 1 ? ' open' : '') +
          '><summary>Per-skill buildup and Rage</summary><div class="fight-table"><table><thead><tr>' +
          '<th>Cast or sequence</th><th>Build</th><th>Effect</th><th>Ogre</th><th>Here</th></tr></thead><tbody>' +
          member.readings.map((row) => skillReadings(member, row)).join('') +
          '</tbody></table></div>' +
          (rage.length || balance.length
            ? '<p>Relative changes in patch 1.1.0</p><ul>' +
              [...rage, ...balance]
                .map(
                  ({ skill, metric, effect, percent }) =>
                    '<li>' +
                    skillLink(member.name, skill) +
                    ' · ' +
                    E(effect || 'Rage ' + metric) +
                    ' ' +
                    (percent > 0 ? '+' : '−') +
                    Math.abs(percent) +
                    '%</li>',
                )
                .join('') +
              '</ul>'
            : '') +
          '</details>'
        : '') +
      '</section>'
    );
  });
  body.innerHTML =
    '<p class="fight-context">' +
    E(modeNote) +
    '</p>' +
    frostNote +
    '<ul class="fight-coverage">' +
    coverage.map(coverageRow).join('') +
    '</ul>' +
    '<p class="fight-scale">' +
    E(hint) +
    ' Signal Skills need their trigger and cooldown. Skill and Ultimate availability depends on Rage.</p>' +
    '<div class="fight-roster">' +
    articles.join('') +
    '</div>';
}

function wireFightTeam() {
  const root = $('fightTeam');
  const E = profileEsc;
  const options = HEROES.map((hero) => '<option>' + E(hero.name) + '</option>').join('');
  root.innerHTML =
    '<details class="fight-check" id="fightCheck"><summary>Check my team</summary><div class="fight-team-inner">' +
    '<div class="fight-team-controls">' +
    [0, 1, 2]
      .map(
        (i) =>
          '<label>Hero ' +
          (i + 1) +
          '<select id="fightHero' +
          i +
          '"><option value="">Choose a hero</option>' +
          options +
          '</select></label>',
      )
      .join('') +
    '<label>Load a team<select id="fightPreset"><option value="">Choose a team</option>' +
    TEAM_DATA.map((team) => '<option>' + E(team.name) + '</option>').join('') +
    '</select></label><label>Build reference<select id="fightBuild"><option value="base">A0</option><option value="mastery">A0 + Mastery</option>' +
    '<option value="a6">Through A6</option></select></label><label class="fight-break"><input type="checkbox" id="fightBroken">During Break</label></div>' +
    '<div id="fightTeamResults"></div></div></details>';
  function draw() {
    renderFightTeam();
    if (FIGHT_CHECK.heroes.some(Boolean) && !fightReadings)
      lookupFightReadings().then((data) => {
        renderFightTeam();
        if (!data && FIGHT_CHECK.heroes.some(Boolean))
          $('fightTeamResults').insertAdjacentHTML(
            'beforeend',
            '<p>Per-skill values could not load. Change a selection to retry.</p>',
          );
      });
  }
  $('fightCheck').ontoggle = () => {
    if ($('fightCheck').open) draw();
  };
  root.onchange = (event) => {
    const id = event.target.id;
    if (id === 'fightBuild') FIGHT_CHECK.build = event.target.value;
    else if (id === 'fightBroken') FIGHT_CHECK.broken = event.target.checked;
    else if (id === 'fightPreset') {
      const team = TEAM_DATA.find((t) => t.name === event.target.value);
      if (team) FIGHT_CHECK.heroes = [0, 1, 2].map((i) => team.members[i]?.name || '');
    } else FIGHT_CHECK.heroes[Number(id.slice(-1))] = event.target.value;
    draw();
  };
}
