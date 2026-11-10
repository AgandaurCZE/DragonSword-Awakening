/* js/01-core.js: Globals, data placeholders and shared helpers ($, tierColor). Part of the site script, split out of index.html on 10 Nov 2026.
   The files load in order (see index.html) and share one global scope, so code that runs at load time may only use what earlier files define. */
// All data is loaded from data.json at start-up (the loader is in js/09-startup.js).
/* ===== Map of the site script (Claude, 10 Nov 2026). Sections start with a "// ==" line; the file is in brackets.
   Globals and helpers ...... let HEROES, $, absUrl, tierColor (01-core)
   Teams page ............... renderTeams (02-teams-karma)
   Karma page ............... renderKarmas, buildKarmaCard (02-teams-karma)
   Shared text helpers ...... formatSkillText, profileEsc (03-profile)
   Hero profile ............. openCharacterProfile, renderProfileReview, renderProfileBuild (03-profile; closeCharacterProfile in 04)
   Reference pop-ups ........ showRefPopover (03-profile), showKarmaPopover (04-gear-builds)
   Gear page ................ renderGear, renderGearPreview: upgrade calculator, runes (04-gear-builds)
   Builds and optimiser ..... endgameStats, optBest, liveBuild: JS port of tools/hero_stats.py, keep both in step (04-gear-builds)
   Legacy tier list ......... render, makeCard: public page (05-tierlist-heroes-patches)
   Heroes, Patch Notes ...... renderHeroes, renderPatches, latestBalanceChange (05)
   Familiars, Titles ........ renderFamiliars, renderTitles (05)
   Dungeons ................. renderDungeons, renderCurrencyDungeons, renderTrait (06-dungeons)
   New tier list (preview) .. IS_PREVIEW, renderTierV2, v2Card, v2TipHtml (07-tierlist-v2-cookbook)
   Cookbook (preview) ....... renderCookbook (07)
   Items, Achievements, Tools, Guides (preview) .. renderItems, renderAchievements, renderDamageCalc, renderLevelCalc, renderGuides (08-items-tools-guides)
   Start-up ................. applyPreviewGate, startApp, the data.json loader (09-startup, loaded last)
   Preview gate: IS_PREVIEW (?tiers=new or ?preview=1), PREVIEW_PAGES, html.pv for preview-only CSS (end of css/site.css). */
let HEROES=[],ROLE_ICONS={},ARCHES=[],TIER_ORDER=[],TIER_COLORS={},TEAM_DATA=[],KARMA_DATA=[],CHARACTER_PROFILE_DATA={},GEAR_DATA=[],DATA_META={},ARCH_COLORS={},STATUS_ARCHETYPE={},GEAR_STATS={slots:{},percentStats:[]},HERO_BASE_STATS={},HERO_BUILDS={},HERO_STAT_MODEL={},TITLES={list:[]},AWAKENINGS={heroes:{},ratingScale:[]},GENERIC_KARMA={},SKILL_LEVEL_MULTIPLIERS={byMaxLevel:{}},KARMA_ASCENSION={multipliers:[1,null,null,null,null,null,5]},STATUS_EFFECTS={},PATCH_NOTES={},FAMILIARS={},TRAIT_DUNGEONS={},UI_ICONS={},TIER_LIST_V2={},TOWER_TRIALS={},COOKBOOK={},GEAR_UPGRADE={levels:{},expMaterials:[],refund:{base:{}},crafting:{}},RUNES=null,GUIDES={categories:[]},DAMAGE_CALC=null,DEFENSE_MODEL=null,LEVEL_COSTS=null;
let activeArch='';
let activeRole='';
const $=id=>document.getElementById(id);
/* Image paths put into CSS variables (--bg, --dng-art, …) must be absolute: since the CSS lives in css/site.css, the browser would resolve them against css/ (10 Nov 2026). */
const absUrl=p=>p?new URL(p,document.baseURI).href:p;
function tierColor(t){return TIER_COLORS[t]||'#6b7280'}
function wireTeamCharacter(element,name){
 const hero=HEROES.find(h=>h.name.toLowerCase()===name.toLowerCase());
 if(hero){
  element.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')showHeroCard(hero,element)});
  element.addEventListener('pointerleave',e=>{if(!$('karmaPopover').contains(e.relatedTarget))hideKarmaPopover()});
 }
 element.addEventListener('click',()=>{
  if(hero){navigateRef('hero',hero.name);return;}
  hideTip();
  const heroesButton=document.querySelector('.nav-item[data-page="heroes"]');
  if(heroesButton)heroesButton.click();
  const search=document.getElementById('heroesSearch');
  if(search){search.value=name;activeHeroesArch='';activeHeroesRole='';renderHeroesFilters();renderHeroes();}
 });
 element.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();element.click();}});
}
// Turn exact character skill names in a team note/tag into the same hoverable links used by Karma.
function formatTeamSkillText(raw,team){
 const roster=[team.lead,...(team.members||[]).flatMap(slot=>[slot.name,...(slot.alts||[])])].filter(Boolean);
 const orderedHeroes=[...roster.map(name=>HEROES.find(h=>h.name.toLowerCase()===name.toLowerCase())).filter(Boolean),...HEROES.filter(h=>!roster.some(n=>n.toLowerCase()===h.name.toLowerCase()))];
 const skills=[];
 for(const hero of orderedHeroes){
  const profile=CHARACTER_PROFILE_DATA[hero.name];
  for(const sk of profile?.skills||[]){
   const displayName=String(sk.skill||'').replace(/\s*\(Lv\.?\s*\d+\).*$/i,'').trim().split(/\s*\(/)[0].trim();
   if(displayName&&!skills.some(x=>x.displayName.toLowerCase()===displayName.toLowerCase()&&x.heroName===hero.name))skills.push({heroName:hero.name,displayName,skill:sk});
  }
 }
 skills.sort((a,b)=>b.displayName.length-a.displayName.length);
 const matches=[];let text=String(raw||'');
 for(const sk of skills){
  const lower=text.toLowerCase(),needle=sk.displayName.toLowerCase();let at=lower.indexOf(needle);
  while(at>=0){
   const before=text[at-1]||'',after=text[at+needle.length]||'';
   if(!/[a-z0-9]/i.test(before)&&!/[a-z0-9]/i.test(after))break;
   at=lower.indexOf(needle,at+1);
  }
  if(at<0)continue;
  const token='TEAMSKILLTOKEN'+matches.length+'X';
  matches.push({token,skill:sk,matched:text.slice(at,at+needle.length)});
  text=text.slice(0,at)+token+text.slice(at+needle.length);
 }
 let html=formatSkillText(text);
 for(const m of matches){
  const link='<button type="button" class="karma-skill-link" data-karma-skill="'+profileEsc(m.skill.displayName)+'" data-karma-hero="'+profileEsc(m.skill.heroName)+'" aria-label="View '+profileEsc(m.skill.heroName)+' skill '+profileEsc(m.skill.displayName)+'" title="Hover to preview skill; click to open Skills">'+profileEsc(m.matched)+'</button>';
  html=html.replace(m.token,link);
 }
 return html;
}
