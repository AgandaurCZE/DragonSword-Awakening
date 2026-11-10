/* js/04-gear-builds.js: Gear page, gear extras (upgrade calculator, runes), builds and the live optimiser (JS port of tools/hero_stats.py). Part of the site script, split out of index.html on 10 Nov 2026.
   The files load in order (see index.html) and share one global scope, so code that runs at load time may only use what earlier files define. */
// ==== Gear page (GEAR_DATA; extras in renderGearPreview) ====
function gearArchetype(g){
 const text=`${g.name||''} ${g.two||''} ${g.three||''}`.toLowerCase();
 const statuses=Object.keys(STATUS_ARCHETYPE||{}).sort((a,b)=>b.length-a.length);
 for(const status of statuses){
  if(text.includes(status.toLowerCase()))return STATUS_ARCHETYPE[status];
 }
 return '';
}
function renderGear(){
 const q=($('gearSearch')?.value||'').trim().toLowerCase();
 const rows=GEAR_DATA.filter(g=>(activeGearFilter==='all'||g.source===activeGearFilter)&&(!q||(g.name+' '+g.source+' '+g.two+' '+g.three).toLowerCase().includes(q)));
 $('gearCount').textContent=`Showing ${rows.length} of ${GEAR_DATA.length} Gear Sets`;
 const root=$('gearGrid');root.innerHTML='';
 if(!rows.length){root.innerHTML='<div class="gear-empty">No gear sets match this search.</div>';return}
 const general=rows.filter(g=>g.source==='Normal Dungeons');
 const archetypeSets=rows.filter(g=>g.source!=='Normal Dungeons');
 const makeSection=(title,items,isGeneral)=>{
  if(!items.length)return;
  const section=document.createElement('section');section.className='gear-section'+(isGeneral?' gear-section-general':' gear-section-archetype');
  const heading=document.createElement('h3');heading.className='gear-section-title';
  if(isGeneral&&IS_PREVIEW){
   const link=document.createElement('a');link.href='#dungeons';link.textContent=title;link.style.color='inherit';link.style.textDecoration='none';link.style.cursor='pointer';
   link.addEventListener('click',e=>{e.preventDefault();openDungeons();});heading.append(link);
  }else heading.textContent=title;
  section.append(heading);
  const grid=document.createElement('div');grid.className='gear-grid';
  items.forEach(g=>{
   const card=document.createElement('article');card.className='gear-card';card.id='gear-set-'+g.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');card.dataset.source=g.source;
   const archetype=gearArchetype(g);const color=ARCH_COLORS[archetype]||'';
   if(color)card.style.setProperty('--gear-arch-color',color);
   card.innerHTML=`<div class="gear-card-head"><div class="gear-icon-wrap"><img src="${g.icon}" alt="${profileEsc(g.name)} icon"></div><div><h3>${profileEsc(g.name)}</h3><div class="gear-source">${profileEsc(g.source)}</div></div></div><div class="gear-effects"><div class="gear-effect"><b>(2) Piece</b> ${formatSkillText(g.two)}</div><div class="gear-effect"><b>(3) Piece</b> ${formatSkillText(g.three)}</div></div>`;
   if(isGeneral&&IS_PREVIEW){
    const name=card.querySelector('.gear-card-head h3');const link=document.createElement('a');link.href='#dungeons?set='+encodeURIComponent(g.name);link.textContent=g.name;link.style.color='inherit';link.style.textDecoration='none';link.style.cursor='pointer';
    link.addEventListener('click',e=>{e.preventDefault();openDungeons({set:g.name});});name.textContent='';name.append(link);
   }
   grid.append(card);
  });
  section.append(grid);root.append(section);
 };
 makeSection('General sets',general,true);
 makeSection('Archetype sets',archetypeSets,false);
}

/* Gear page extras (preview only): upgrade calculator, Disassemble returns, Runes */
const GX={rar:'Orange',from:0,to:15};
function gxGreedy(x){const out=[];(GEAR_UPGRADE.expMaterials||[]).forEach(m=>{const k=Math.floor(x/m.exp);if(k){out.push([m,k]);x-=k*m.exp;}});return out;}
function gxFeed(x){const out=gxGreedy(x);const left=x-out.reduce((a,[m,k])=>a+m.exp*k,0);if(left>0){const sh=GEAR_UPGRADE.expMaterials[GEAR_UPGRADE.expMaterials.length-1];const e=out.find(([m])=>m===sh);e?e[1]++:out.push([sh,1]);}return out;}
function gxMats(list){return list.length?`<span class="gx-mats">${list.map(([m,k])=>`<span class="gx-mat" title="${profileEsc(m.name)} (${m.exp.toLocaleString('en-GB')} EXP)"><img src="${m.icon}" alt="">${k}× <span class="gx-mname">${profileEsc(m.name)}</span></span>`).join('')}</span>`:'—';}
function gxAdd(acc,list){list.forEach(([m,k])=>{const e=acc.find(([x])=>x===m);e?e[1]+=k:acc.push([m,k]);});return acc.sort((a,b)=>b[0].exp-a[0].exp);}
function gxReturn(rar,lv){const U=GEAR_UPGRADE,L=U.levels[rar]||[];const inv=L.slice(0,lv).reduce((a,x)=>a+x[0],0);return gxGreedy((U.refund.base[rar]||0)+Math.floor(inv*U.refund.rate));}
function gxRarColor(r){return {Green:'#5fd38d',Blue:'#4aa3ff',Purple:'#b77cf2',Orange:'#ff9f43'}[r]||'#fff';}
function renderGearPreview(){const root=$('gearPreview');if(!root||!IS_PREVIEW||typeof GEAR_UPGRADE==='undefined')return;root.hidden=false;
 const U=GEAR_UPGRADE,L=U.levels[GX.rar]||[];const max=L.length;GX.to=Math.min(Math.max(GX.to,1),max);GX.from=Math.min(GX.from,GX.to-1);
 const inf=(U.inferred||{})[GX.rar]||[];let eT=0,gT=0,gUnknown=false;const matT=[];
 const rows=[];for(let i=GX.from;i<GX.to;i++){const [e,g0]=L[i];const feed=gxFeed(e);const gi=feed.every(([m])=>m.gold!=null)?feed.reduce((a,[m,k])=>a+m.gold*k,0):null;const g=gi??g0;eT+=e;if(g==null)gUnknown=true;else gT+=g;gxAdd(matT,feed);
  rows.push(`<tr><td>+${i} → +${i+1}</td><td class="n">${e.toLocaleString('en-GB')}${inf.includes(i)?' <span class="gx-est">(inferred)</span>':''}</td><td class="n">${g==null?'?':g.toLocaleString('en-GB')}</td><td>${gxMats(feed)}</td></tr>`);}
 const opt=(n,sel,lo,hi)=>Array.from({length:hi-lo+1},(_,k)=>k+lo).map(v=>`<option value="${v}"${v===sel?' selected':''}>+${v}</option>`).join('');
 const C=U.crafting[GX.rar]||{};
 const R=typeof RUNES!=='undefined'?RUNES:null;
 const runes=R?`<section class="gx-box"><h3>Runes<span class="gx-tag">PREVIEW</span></h3><p class="gx-sub">${profileEsc(R.note)}</p>
  <div class="rn-types">${R.types.map(t=>`<div class="rn-type" style="--c:${t.color}">${t.icon?`<span class="rn-ico" style="-webkit-mask-image:url('${t.icon}');mask-image:url('${t.icon}')"></span>`:''}<b>Rune of ${profileEsc(t.name)}</b><small>${profileEsc(t.line)}</small><div>${profileEsc(t.gameStat||t.stat)}</div></div>`).join('')}</div>
  <div class="rn-cols"><div><h4 style="margin:0">Grades</h4><div class="rn-grades">${R.grades.map(g=>`<span class="rn-grade" style="--c:${g.color}" title="Raid: ${profileEsc(g.raid)}">${profileEsc(g.name)}</span>`).join('<span style="color:var(--muted)">›</span>')}</div>
  <div class="gx-wrap"><table class="gx-tbl"><tr><th>Values seen</th>${R.types.map(t=>`<th style="color:${t.color}">${profileEsc(t.name)}</th>`).join('')}</tr>${R.grades.map(g=>`<tr><td style="color:${g.color};font-weight:800">${profileEsc(g.name)}<br><small style="color:var(--muted);font-weight:400">Raid ${profileEsc(g.raid)}</small></td>${R.types.map(t=>`<td>${((R.seen[g.name]||{})[t.name]||[]).join(', ')||'<span style="color:var(--muted)">–</span>'}</td>`).join('')}</tr>`).join('')}</table></div>
  <ul>${R.rules.map(x=>`<li>${profileEsc(x)}</li>`).join('')}</ul></div>${R.image?`<figure style="margin:0"><img src="${R.image}" alt="Rune Synthesis screen" loading="lazy"><figcaption class="gx-note">Synthesis: five Damaged runes of mixed types give one random Intact rune.</figcaption></figure>`:''}</div></section>`:'';
 root.innerHTML=`<div class="gx"><section class="gx-box"><h3>Upgrade calculator<span class="gx-tag">PREVIEW</span></h3><p class="gx-sub">Equipment EXP and Gold per upgrade level. The same for every slot and set.</p>
  <div class="gx-ctl"><div class="gx-rar">${Object.keys(U.levels).reverse().map(r=>`<button type="button" data-gxrar="${r}" style="--rc:${gxRarColor(r)}" class="${r===GX.rar?'on':''}">${r}</button>`).join('')}</div>
  <label>From <select id="gxFrom">${opt(0,GX.from,0,max-1)}</select></label><label>to <select id="gxTo">${opt(0,GX.to,1,max)}</select></label></div>
  <div class="gx-wrap"><table class="gx-tbl"><tr><th>Level</th><th class="n">EXP</th><th class="n">Gold</th><th>Materials (as the game auto-selects)</th></tr>${rows.join('')}
  <tr class="tot"><td>Total</td><td class="n">${eT.toLocaleString('en-GB')}</td><td class="n">${gT.toLocaleString('en-GB')}${gUnknown?' + ?':''}</td><td>${gxMats(matT)}</td></tr></table></div>
  <p class="gx-note">Materials: the game fills each level with the largest Equipment EXP materials that don't overshoot the bar, then one Mana Shard if anything is left (it overshoots by 100). The extra EXP carries over to the next level (measured), which this table doesn't follow, so it can be a little off. Gold is paid per item used (Mana Shard 300, Crystal 700, Ore 2,000), so it's worked out from the items picked; where a Raw Mana Stone is picked the game's own figure is shown, as its Gold price isn't known yet.</p>
  <div class="gx-ret"><b>Disassemble returns</b> 80% of the Equipment EXP spent on a piece, plus its base materials. Gold isn't returned, and anything under 200 EXP is lost, so disassemble several pieces at once (their leftovers add up: the extra Mana Shard per pair).<br>
  ${GX.rar} at +${GX.from}: ${gxMats(gxReturn(GX.rar,GX.from))}<br>${GX.rar} at +${GX.to}: ${gxMats(gxReturn(GX.rar,GX.to))}<br>
  <span class="gx-note">Plus ${profileEsc(C.normal||'')}${C.archetype?`; archetype sets: ${profileEsc(C.archetype)}`:''}.</span></div>
  <p class="gx-note">Upgrading a piece you'll scrap later loses 20% of the EXP you put in and all of the Gold, at every level, so no level is a better point to disassemble at. Upgrade only what you'll keep.</p></section>${runes}</div>`;
 root.querySelectorAll('[data-gxrar]').forEach(b=>b.onclick=()=>{GX.rar=b.dataset.gxrar;GX.from=0;GX.to=(U.levels[GX.rar]||[]).length;renderGearPreview();});
 $('gxFrom').onchange=e=>{GX.from=+e.target.value;if(GX.to<=GX.from)GX.to=GX.from+1;renderGearPreview();};
 $('gxTo').onchange=e=>{GX.to=+e.target.value;if(GX.from>=GX.to)GX.from=GX.to-1;renderGearPreview();};}
$('gearSearch').addEventListener('input',renderGear);
document.querySelectorAll('[data-gear-filter]').forEach(b=>b.addEventListener('click',()=>{activeGearFilter=b.dataset.gearFilter;document.querySelectorAll('[data-gear-filter]').forEach(x=>x.classList.toggle('active',x===b));renderGear()}));
$('gearReset').addEventListener('click',()=>{$('gearSearch').value='';activeGearFilter='all';document.querySelectorAll('[data-gear-filter]').forEach(x=>x.classList.toggle('active',x.dataset.gearFilter==='all'));renderGear()});
function openGearSet(name){document.querySelector('.nav-item[data-page="gear"]').click();activeGearFilter='all';$('gearSearch').value='';document.querySelectorAll('[data-gear-filter]').forEach(x=>x.classList.toggle('active',x.dataset.gearFilter==='all'));renderGear();const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');const target=GEAR_DATA.find(g=>norm(g.name)===norm(name));if(target){const el=$('gear-set-'+target.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'));if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.style.outline='3px solid #36b4df';setTimeout(()=>el.style.outline='',1800)}}}

// Hover / keyboard focus on a Best Karma row shows that Karma's card, built live from KARMA_DATA.
let karmaPopTimer=null;
function findKarma(name){const n=s=>String(s||'').trim().toLowerCase().replace(/[.,;:!?]+$/,'').trim();return KARMA_DATA.find(k=>n(k.name)===n(name));}
function showKarmaPopover(anchor,name){
 const k=findKarma(name);if(!k)return;clearTimeout(karmaPopTimer);
 const pop=$('karmaPopover');pop.innerHTML='';pop.style.setProperty('--karma-accent',KARMA_ACCENTS[k.archetype]||'#39b9e8');
 pop.append(buildKarmaCard(k));pop.hidden=false;
 const r=anchor.getBoundingClientRect(),w=pop.offsetWidth,hgt=pop.offsetHeight;
 let left=r.right+12;if(left+w>window.innerWidth-12)left=r.left-w-12;let top=r.top;
 if(left<12){left=Math.max(12,Math.min(window.innerWidth-w-12,r.left+24));top=r.bottom+6;if(top+hgt>window.innerHeight-12)top=r.top-hgt-6;}
 if(top+hgt>window.innerHeight-12)top=window.innerHeight-hgt-12;if(top<12)top=12;
 pop.style.left=left+'px';pop.style.top=top+'px';
}
function hideKarmaPopover(delay=150){if(typeof refPinned!=='undefined'&&refPinned&&delay!==0)return;clearTimeout(karmaPopTimer);karmaPopTimer=setTimeout(()=>{const p=$('karmaPopover');p.hidden=true;p.innerHTML=''},delay);}
$('karmaPopover').addEventListener('mouseenter',()=>clearTimeout(karmaPopTimer));$('karmaPopover').addEventListener('mouseleave',()=>hideKarmaPopover());
$('karmaPopover').addEventListener('focusin',()=>clearTimeout(karmaPopTimer));$('karmaPopover').addEventListener('focusout',()=>hideKarmaPopover());
function wireKarmaPopover(item,name){
 item.addEventListener('mouseenter',()=>showKarmaPopover(item,name));item.addEventListener('mouseleave',()=>hideKarmaPopover());
 item.addEventListener('focus',()=>showKarmaPopover(item,name));item.addEventListener('blur',()=>hideKarmaPopover());item.addEventListener('click',()=>hideKarmaPopover(0),true);
}
// ---------- Gear builds and end-game stat totals (data: HERO_BUILDS, GEAR_STATS, HERO_BASE_STATS, KARMA_DATA, GEAR_DATA) ----------
const GEAR_SLOTS=['Helmet','Chest','Legs','Gloves','Boots'];
const KARMA_TRAIT_STAT={'Attack Power':'Attack Power Up','Critical Rate':'Critical Hit Chance','Max HP':'Max HP Up','Defense':'Defense Up'};
function statIsPct(s){return (GEAR_STATS.percentStats||[]).includes(s)||/Additional Damage$|^Defense Ignore$/.test(s);}
function fmtStat(s,v,sign){const pct=statIsPct(s);const r=pct?Math.round(v*100)/100:Math.round(v);return (sign&&v>=0?'+':'')+(pct?r.toLocaleString('en-GB',{maximumFractionDigits:2})+'%':r.toLocaleString('en-GB'));}
function heroSets(name){const B=(CHARACTER_PROFILE_DATA[name]||{}).build;if(B&&B.sets&&B.sets.length)return B.sets.map(s=>({set:GEAR_DATA.find(g=>g.name===s.set),pieces:s.pieces})).filter(x=>x.set);const g=String((CHARACTER_PROFILE_DATA[name]||{}).gear||'').replace(/^Recommended Gear sets:\s*/i,'').split(/\.\s*Main stats:/i)[0];
 return g.split(/\s*\+\s*/).map(x=>{const m=x.match(/^(\d+)\s+(.+)$/);if(!m)return null;const set=GEAR_DATA.find(s=>s.name.toLowerCase()===m[2].trim().toLowerCase());return set?{set,pieces:Number(m[1])}:null}).filter(Boolean);}
// Title passives (TITLES in data.json), summed per stat. Not shown on the page yet.
// mode 'all' = every title with a known passive (end-game target); 'owned' = only titles marked obtained.
// To show them in the totals: treat flat stats like gear flats and 'Up' % like gear %, i.e. add before the multiply in endgameStats().

// ---- Selected titles (per viewer, browser storage) and the live gear optimiser ----
const TITLE_KEY='dsw.selectedTitles.v1';let SEL_TITLES=null;
function selTitles(){if(SEL_TITLES)return SEL_TITLES;if(typeof IS_PREVIEW!=='undefined'&&!IS_PREVIEW){SEL_TITLES=new Set();return SEL_TITLES;}let v=[];try{v=JSON.parse(localStorage.getItem(TITLE_KEY)||'[]')||[]}catch(e){}SEL_TITLES=new Set(Array.isArray(v)?v:[]);return SEL_TITLES;}
function saveTitles(){try{localStorage.setItem(TITLE_KEY,JSON.stringify([...selTitles()]))}catch(e){}}
function selectedTitleList(){const S=selTitles();return (TITLES.list||[]).filter(t=>S.has(t.name));}
function selectedTitleBonus(){const o={},src={};selectedTitleList().forEach(t=>(t.passive||[]).forEach(b=>{o[b.stat]=(o[b.stat]||0)+Number(b.value);(src[b.stat]=src[b.stat]||[]).push(`${t.name}: ${b.stat} +${b.value}${statIsPct(b.stat)?'%':''}`)}));return {o,src};}
function statusOfArch(a){let s='';Object.entries(STATUS_ARCHETYPE||{}).forEach(([w,ar])=>{if(ar===a&&w!=='Frozen'&&w!=='Freeze')s=w});return s;}
// Port of tools/hero_stats.py damage_index / subs_for / best_damage (same order, same tie-break), plus title bonuses.
function optDamageIndex(name,pieces,extra){const hb=HERO_BASE_STATS[name],k=KARMA_DATA.find(x=>x.signature===name);const kb={};const add=(s,v)=>kb[s]=(kb[s]||0)+Number(v);
 (k.traits||[]).forEach(t=>add(KARMA_TRAIT_STAT[t.label]||t.label,parseFloat(String(t.a6))));(((AWAKENINGS.heroes||{})[name]||{}).list||[]).forEach(a=>(a.effects||[]).forEach(e=>add(e.stat,e.value)));Object.entries(extra||{}).forEach(([s,v])=>add(s,v));
 let flat=hb['Attack']+Number(k.base['Attack'])+(kb['Attack']||0),pct=kb['Attack Power Up']||0,cr=hb['Critical Hit Chance']+(kb['Critical Hit Chance']||0),cd=hb['Critical Damage']+(kb['Critical Damage']||0);
 Object.entries(pieces).forEach(([s,p])=>{const G=GEAR_STATS.slots[s];[[p.main,(G.main[p.main]||[])[15]||0],...p.subs.map(x=>[x,G.sub[x]||0])].forEach(([st,v])=>{if(st==='Attack')flat+=v;else if(st==='Attack Power Up')pct+=v;else if(st==='Critical Hit Chance')cr+=v;else if(st==='Critical Damage')cd+=v;});});
 return [flat*(1+pct/100)*(1+Math.min(cr,100)/100*cd/100),cr];}
function optSubsFor(slot,main,prio){return prio.filter(s=>s in GEAR_STATS.slots[slot].sub).slice(0,5);}
function optBest(name,fixed,dmgSlots,prio,extra){const arch=(HEROES.find(h=>h.name===name)||{}).archetype;const extras=['Defense Ignore',statusOfArch(arch)+' Additional Attack Power','Armor Penetration','All Status Effect Additional Attack Power'];const P=prio.concat(extras);
 const M=['Attack Power Up','Critical Hit Chance','Critical Damage'];let best=null;const n=dmgSlots.length;
 for(let i=0;i<Math.pow(3,n);i++){const combo=[];let x=i;for(let j=n-1;j>=0;j--){combo[j]=M[x%3];x=Math.floor(x/3);}
  const pieces={};Object.entries(fixed).forEach(([s,p])=>pieces[s]={main:p.main,subs:[...p.subs]});dmgSlots.forEach((s,j)=>pieces[s]={main:combo[j],subs:optSubsFor(s,combo[j],P)});
  for(;;){const cr=optDamageIndex(name,pieces,extra)[1];let c=Object.keys(pieces).filter(s=>pieces[s].subs.includes('Critical Hit Chance')).map(s=>[GEAR_STATS.slots[s].sub['Critical Hit Chance'],s]).sort((a,b)=>a[0]-b[0]||(a[1]<b[1]?-1:a[1]>b[1]?1:0)).filter(([v])=>cr-v>=100);if(!c.length)break;
   const p=pieces[c[0][1]];const rest=P.filter(q=>q!=='Critical Hit Chance'&&!p.subs.includes(q));p.subs=p.subs.filter(q=>q!=='Critical Hit Chance').concat(rest.slice(0,1));}
  const score=optDamageIndex(name,pieces,extra)[0];const key=[Math.round(score*1000)/1000,-Object.values(pieces).filter(p=>p.main==='Critical Hit Chance').length];
  if(!best||key[0]>best[0][0]||(key[0]===best[0][0]&&key[1]>best[0][1]))best=[key,pieces];}
 const out={};GEAR_SLOTS.forEach(s=>out[s]=best[1][s]);return out;}
function optSetExtra(name){const b=HERO_BUILDS[name]||{};const ex={};const sets=((CHARACTER_PROFILE_DATA[name]||{}).build||{}).sets||[];const three=(sets.find(s=>s.pieces===3)||{}).set;
 if(three==='Blazing Flames')ex['Critical Hit Chance']=15;const two=b.setChoice&&b.setChoice.set;if(two==='Battle Will')ex['Attack Power Up']=(ex['Attack Power Up']||0)+6;if(two==='The Infiltrator')ex['Critical Hit Chance']=(ex['Critical Hit Chance']||0)+9;return ex;}
function liveBuild(name){const b=HERO_BUILDS[name];if(!b)return null;const T=selectedTitleBonus().o;const tb={};['Attack','Attack Power Up','Critical Hit Chance','Critical Damage'].forEach(s=>{if(T[s])tb[s]=T[s]});
 if(!Object.keys(tb).length||!HERO_BASE_STATS[name]||!KARMA_DATA.find(x=>x.signature===name))return {pieces:b.pieces,adjusted:false};
 let pieces;if(b.type==='Damage'){const ex=optSetExtra(name);Object.entries(tb).forEach(([s,v])=>ex[s]=(ex[s]||0)+v);pieces=optBest(name,{},GEAR_SLOTS,['Attack Power Up','Critical Hit Chance','Critical Damage','Attack'],ex);}
 else if(b.type==='Support'){pieces=optBest(name,{Chest:b.pieces.Chest,Legs:b.pieces.Legs},['Helmet','Gloves','Boots'],['Max HP Up','Attack Power Up','Critical Hit Chance','Critical Damage'],tb);}
 else return {pieces:b.pieces,adjusted:false};
 const changed=GEAR_SLOTS.filter(s=>JSON.stringify(pieces[s])!==JSON.stringify(b.pieces[s]));return {pieces,adjusted:true,changed};}
function endgameStats(name,piecesOverride){
 const base=HERO_BASE_STATS[name],build0=HERO_BUILDS[name],k=KARMA_DATA.find(x=>x.signature===name);if(!base||!build0)return null;const build=piecesOverride?Object.assign({},build0,{pieces:piecesOverride}):build0;const TT=selectedTitleBonus();
 const own={},setv={},awk={},src={},awkSrc={},set=[];const add=(o,s,v,from,where=src)=>{o[s]=(o[s]||0)+v;if(from)(where[s]=where[s]||[]).push(from)};
 const parts={Attack:{hero:base['Attack'],karma:0,gear:0},Defense:{hero:base['Defense'],karma:0,gear:0},'Max HP':{hero:base['Max HP'],karma:0,gear:0}};
 ['Critical Hit Chance','Critical Damage'].forEach(s=>add(own,s,base[s]||0));
 if(k){Object.entries(k.base||{}).forEach(([s,v])=>{if(parts[s])parts[s].karma+=Number(v)});
  (k.traits||[]).forEach(t=>add(own,KARMA_TRAIT_STAT[t.label]||t.label,parseFloat(t.a6)));}
 const lv=build.level??15;
 GEAR_SLOTS.forEach(slot=>{const p=build.pieces[slot],g=GEAR_STATS.slots[slot];if(!p||!g)return;
  const one=(s,v)=>{if(parts[s])parts[s].gear+=v;else add(own,s,v)};
  one(p.main,(g.main[p.main]||[])[lv]||0);(p.subs||[]).forEach(s=>one(s,g.sub[s]||0));});
 heroSets(name).forEach(({set,pieces})=>{const bon=[...(set.twoBonus||[]),...(pieces>=3?(set.threeBonus||[]):[])];
  bon.forEach(b=>add(setv,b.stat,b.value,`${set.name} (${pieces}-piece): ${b.stat} +${b.value}%${b.condition?' '+b.condition:''}`));});
 // All six awakenings (always on for a fully awakened hero): AWAKENINGS[hero].list[].effects
 (((AWAKENINGS.heroes||{})[name]||{}).list||[]).forEach(a=>(a.effects||[]).forEach(e=>add(awk,e.stat,e.value,`A${a.level} · ${a.name}: ${e.stat} +${e.value}%`,awkSrc)));
 const rows=[];
 [['Attack','Attack Power Up'],['Defense','Defense Up'],['Max HP','Max HP Up']].forEach(([s,pct])=>{const P=parts[s],flat=P.hero+P.karma+P.gear;
  const ownTotal=flat*(1+(own[pct]||0)/100),withSet=flat*(1+((own[pct]||0)+(setv[pct]||0))/100),withAwk=flat*(1+((own[pct]||0)+(setv[pct]||0)+(awk[pct]||0))/100);
  const withTtl=(flat+(TT.o[s]||0))*(1+((own[pct]||0)+(setv[pct]||0)+(awk[pct]||0)+(TT.o[pct]||0))/100);
  rows.push({stat:s,own:ownTotal,set:withSet-ownTotal,awk:withAwk-withSet,ttl:withTtl-withAwk,ttlTip:[...(TT.src[s]||[]),...(TT.src[pct]||[])].join('\n'),awkTip:(awkSrc[pct]||[]).join('\n'),tip:`Hero Lv.70${base.estimated?' (estimated)':''}: ${fmtStat(s,P.hero)}\nSignature Karma (A6): ${fmtStat(s,P.karma)}\nGear (flat): ${fmtStat(s,P.gear)}\n${pct}: ${fmtStat(pct,own[pct]||0,true)}`,setTip:(src[pct]||[]).join('\n')});});
 const skip=new Set(['Attack Power Up','Defense Up','Max HP Up']);
 const order=['Critical Hit Chance','Critical Damage','Defense Ignore','Armor Penetration'];
 const keys=[...new Set([...Object.keys(own),...Object.keys(setv),...Object.keys(awk),...Object.keys(TT.o).filter(s=>!['Attack','Defense','Max HP'].includes(s))])].filter(s=>!skip.has(s));
 keys.sort((a,b)=>{const ia=order.indexOf(a),ib=order.indexOf(b);return (ia<0?99:ia)-(ib<0?99:ib)||a.localeCompare(b)});
 keys.forEach(s=>rows.push({stat:s,own:own[s]||0,set:setv[s]||0,awk:awk[s]||0,ttl:TT.o[s]||0,ttlTip:(TT.src[s]||[]).join('\n'),tip:'',setTip:(src[s]||[]).join('\n'),awkTip:(awkSrc[s]||[]).join('\n')}));
 return {rows,build,base};
}
function renderBuildStats(h){
 const root=$('profileGearStats'),eg=$('profileEndgame');root.innerHTML='';eg.innerHTML='';
 const build0=HERO_BUILDS[h.name];const LB=build0?liveBuild(h.name):null;const build=build0?Object.assign({},build0,{pieces:LB.pieces}):null;
 if(!build){root.innerHTML='<div class="profile-placeholder">No gear build recorded for this hero yet.</div>';return}
 const lv=build.level??15;
 root.parentNode.querySelectorAll('.build-why').forEach(x=>x.remove());const intro=document.createElement('p');intro.className='profile-note build-why';intro.innerHTML=`<strong>${profileEsc(build.type)} build.</strong> ${profileEsc(build.why)}`+(LB.adjusted?` <span class="eg-ttl-key">Adjusted live for your ${selectedTitleList().length} selected title${selectedTitleList().length===1?'':'s'}</span>: ${LB.changed.length?'main stats or substats change on '+LB.changed.join(', ')+' (marked gold).':'the recommended stats stay the same.'}`:'');root.before(intro);
 GEAR_SLOTS.forEach(slot=>{const p=build.pieces[slot],g=GEAR_STATS.slots[slot];if(!p||!g)return;
  const el=document.createElement('div');el.className='profile-gear-piece build-piece'+(LB.adjusted&&LB.changed.includes(slot)?' build-piece-changed':'');
  el.innerHTML=`<strong>${slot}</strong><div class="profile-main-stat-value">${profileEsc(p.main)}<span class="build-main-val">${fmtStat(p.main,(g.main[p.main]||[])[lv]||0,true)}</span></div>`+
   `<ul class="build-subs">${(p.subs||[]).map(s=>`<li><span>${profileEsc(s)}</span><b>${fmtStat(s,g.sub[s]||0,true)}</b></li>`).join('')}</ul>`;
  root.append(el);});
 const res=endgameStats(h.name,LB.pieces);if(!res)return;
 const note=document.createElement('p');note.className='profile-note';
 note.innerHTML=`Fully built at level 70: signature Karma at Ascension 6, ${profileEsc(build.rarity||'Orange')} gear at +${lv} with the stats above. <span class="eg-set-key">Green values</span> come from the recommended gear sets, <span class="eg-awk-key">purple values</span> from the hero's awakenings (all six unlocked) and <span class="eg-ttl-key">gold values</span> from the titles you've ticked on the Titles tab (${selectedTitleList().length} selected); hover for the source.`+
  (res.base.estimated?' <span class="eg-est">Hero base stats are estimates</span> from measured levels 1–30 until the level-70 values are confirmed in-game.':'');
 eg.append(note);
 const grid=document.createElement('div');grid.className='eg-grid';
 res.rows.forEach(r=>{const row=document.createElement('div');row.className='eg-row';const total=r.own+r.set+(r.awk||0)+(r.ttl||0);
  const tipAttr=t=>t?` data-tip="${profileEsc(t)}" tabindex="0"`:'';
  let val=`<b class="eg-total">${fmtStat(r.stat,total)}</b>`;
  const hasSet=Math.abs(r.set)>0.001,hasAwk=Math.abs(r.awk||0)>0.001,hasTtl=Math.abs(r.ttl||0)>0.001;
  if(hasSet||hasAwk||hasTtl){val+=`<span class="eg-own"${tipAttr(r.tip)}>${fmtStat(r.stat,r.own)}</span>`;if(hasSet)val+=`<span class="eg-set"${tipAttr(r.setTip)}>${fmtStat(r.stat,r.set,true)}</span>`;if(hasAwk)val+=`<span class="eg-awk"${tipAttr(r.awkTip)}>${fmtStat(r.stat,r.awk,true)}</span>`;if(hasTtl)val+=`<span class="eg-ttl"${tipAttr(r.ttlTip)}>${fmtStat(r.stat,r.ttl,true)}</span>`;}
  else if(r.tip)val=`<b class="eg-total"${tipAttr(r.tip)}>${fmtStat(r.stat,total)}</b>`;
  if(r.stat==='Critical Hit Chance'&&total>100)val+=`<span class="eg-cap" data-tip="Crit Rate above 100% is wasted. Since patch 1.1.0, hits crit exactly at your Crit Rate and monsters have no critical resistance, so 100% already means every hit crits." tabindex="0">over 100%</span>`;
  row.innerHTML=`<span class="eg-label">${profileEsc(r.stat)}</span><span class="eg-val">${val}</span>`;grid.append(row);});
 eg.append(grid);
}
function renderProfileBuild(h,data){
 const karmaRoot=$('profileKarmas');karmaRoot.innerHTML='';
 const text=String(data.karma||'');let signature='',alternatives='';
 const mainPart=text.replace(/^Recommended Karma:\s*/i,'').split(/Alternatives?:/i)[0].trim();
 const recommendedParts=mainPart.split(/\s*\+\s*/).map(x=>x.trim()).filter(Boolean);
 const altMatch=text.match(/Alternatives?:\s*(.*)$/i);if(altMatch)alternatives=altMatch[1].trim();
 if(recommendedParts[0])signature=recommendedParts[0].replace(/\s*\(signature\)/i,'').trim();
 const B=data.build&&data.build.karma;if(B&&B.signature){signature=B.signature;recommendedParts[0]=B.signature+' (signature)';recommendedParts[1]=B.second||'';alternatives=(B.alternatives||[]).join(', ');}
 const rows=[];if(signature)rows.push({title:signature,kind:/signature/i.test(recommendedParts[0]||'')?'Signature':'Recommended',desc:'Recommended Karma from the master workbook.'});
 const bestAlternative=recommendedParts[1]||alternatives.split(',').map(x=>x.trim()).filter(Boolean)[0]||'';
 if(bestAlternative)rows.push({title:bestAlternative,kind:'Best alternative',desc:'Alternative listed in the master workbook.'});
 const genericKarmaByArchetype={Amplitude:'Pounding Heart',Crushing:'Scattered Pulse',Gale:'Wings of the Sky',Bloodburst:'Blooming Blood',Blazeflame:'Leg Scale of Blazing Flames',Frostbite:'Season of Bitter Cold',Thunderbolt:'Flash Claws',Venom:'Dominating Head',Breaker:'A Cut Above'};
 const archetypeKey=Object.keys(genericKarmaByArchetype).find(a=>a.toLowerCase()===String(h.archetype||'').toLowerCase())||Object.keys(genericKarmaByArchetype).find(a=>a.toLowerCase()===String((HEROES.find(x=>x.name===h.name)||{}).archetype||'').toLowerCase());
 const genericKarma=GENERIC_KARMA[h.archetype]||genericKarmaByArchetype[archetypeKey]||'Generic Karma';
 rows.push({title:genericKarma,kind:'Generic',desc:'Generic fallback Karma for this archetype, with Max HP% and Defense% trait effects.'});
 rows.forEach((r,i)=>{const item=document.createElement('article');item.className='profile-build-item profile-karma-link';item.tabIndex=0;item.setAttribute('role','link');item.setAttribute('aria-label',`Open ${r.title} in Karma tab`);const kArt=(KARMA_DATA||[]).find(k=>k.name.toLowerCase()===String(r.title||'').trim().toLowerCase())?.image;item.innerHTML=`<div class="profile-build-head"><div class="profile-build-icon${kArt?' karma-row-art':''}">${kArt?`<img src="${profileEsc(kArt)}" alt="">`:'✦'}</div><div><h4>${profileEsc(r.title)}</h4><small>${profileEsc(r.kind)} · View in Karma Codex ↗</small></div></div><div class="profile-build-desc">${profileEsc(r.desc)}</div>`;const openKarma=()=>{document.querySelector('.nav-item[data-page="karma"]').click();activeKarmaArch='';renderKarmaFilters();const search=$('karmaSearch');const karmaTitle=String(r.title||'').trim().replace(/[.,;:!?]+$/,'').trim();search.value=karmaTitle;renderKarmas();const cards=[...document.querySelectorAll('.karma-card')];const normalizeKarmaName=value=>String(value||'').trim().toLowerCase().replace(/[.,;:!?]+$/,'').trim();const target=cards.find(c=>normalizeKarmaName(c.querySelector('.karma-card-title')?.textContent)===normalizeKarmaName(karmaTitle));if(target){target.scrollIntoView({behavior:'smooth',block:'center'});target.style.outline='3px solid #68c7d5';target.style.outlineOffset='2px';setTimeout(()=>{target.style.outline='';target.style.outlineOffset=''},1800)}else{search.focus()}};item.addEventListener('click',openKarma);item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openKarma()}});wireKarmaPopover(item,r.title);karmaRoot.append(item)});
 const gearRoot=$('profileGearSets');gearRoot.innerHTML='';
 const gearText=String(data.gear||'');let setText=gearText.replace(/^Recommended Gear sets:\s*/i,'');
 const gearNames=setText.split(/\. Main stats:/i)[0].split(/\. Substats:/i)[0].trim();
 const gearParts=gearNames?gearNames.split(/\s*\+\s*/).map(x=>x.trim()).filter(Boolean):[];
 const normGear=s=>String(s||'').replace(/^\d+\s*/,'').replace(/[^a-z0-9]/gi,'').toLowerCase();
 const matched=(data.build&&data.build.sets&&data.build.sets.length?data.build.sets.map(s=>s.set):gearParts.map(part=>part.replace(/^\d+\s*/,''))).map(name=>GEAR_DATA.find(g=>normGear(g.name)===normGear(name))).filter(Boolean);
 if(!matched.length)gearRoot.innerHTML='<div class="profile-placeholder">Recommended gear combination will be added after testing.</div>';
 matched.forEach((g,i)=>{const item=document.createElement('article');item.className='profile-build-item profile-gear-link';item.tabIndex=0;item.setAttribute('role','link');item.title='Click to view this gear set in the Gear tab';item.innerHTML=`<div class="profile-build-head"><div class="profile-build-icon"><img src="${g.icon}" alt=""></div><div><h4>${profileEsc(g.name)}</h4><small>${i===0?'Recommended 3-piece set':'Recommended 2-piece set'} · View in Gear Sets ↗</small></div></div><div class="profile-gear-detail"><b>(2)</b> ${profileEsc(g.two)}<br><b>(3)</b> ${profileEsc(g.three)}</div>`;item.addEventListener('click',()=>openGearSet(g.name));item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openGearSet(g.name)}});gearRoot.append(item)});
 renderBuildStats(h);
 if(IS_PREVIEW)gmMount(h);
 const sy=$('profileSynergy');sy.innerHTML='';const relevant=TEAM_DATA.filter(t=>t.members.some(m=>[m.name,...(m.alts||[])].some(n=>n.toLowerCase()===h.name.toLowerCase())));
 if(!relevant.length)sy.innerHTML='<div class="profile-placeholder">No team entry currently lists this character. Synergy recommendations can be added to the Teams workbook.</div>';
 relevant.forEach(t=>{const item=document.createElement('article');item.className='profile-synergy';const lead=HEROES.find(x=>x.name.toLowerCase()===t.lead.toLowerCase());item.innerHTML=`${lead?`<img src="${lead.portrait}" alt="${profileEsc(t.lead)}">`:''}<div><button type="button" data-team-link="${profileEsc(t.name)}">${profileEsc(t.name)} · ${profileEsc(t.tier)} Tier</button><div class="profile-note">${profileEsc(t.note)}</div></div>`;item.querySelector('[data-team-link]').addEventListener('click',()=>{document.querySelector('.nav-item[data-page="teams"]').click();const target=[...document.querySelectorAll('.team-card')].find(el=>el.dataset.teamName===t.name);if(target){target.scrollIntoView({behavior:'smooth',block:'center'});target.style.outline='3px solid #68c7d5';setTimeout(()=>target.style.outline='',1800)}});sy.append(item)});
}
function closeCharacterProfile(){hideTip();$('profilePage').hidden=true;$('tierPage').hidden=false;document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.page==='tier'));document.title='DragonSword: Awakening — Visual tier list';window.scrollTo({top:0,behavior:'instant'})}
$('profileBackTier').addEventListener('click',closeCharacterProfile);
document.querySelectorAll('[data-profile-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.profile-tab').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.profile-tabpanel').forEach(p=>p.classList.toggle('active',p.id==={skills:'profileSkills',review:'profileReview',build:'profileBuild'}[b.dataset.profileTab]));}));
document.getElementById('profileIntro').addEventListener('click',e=>{if(e.target.closest('[data-back-tier]'))closeCharacterProfile()});

/* ===== Preview: team-aware gear model (Claude, 10 Nov 2026). A port of tools/team_gear.py: keep the two identical.
   Settings live in data.json GEAR_MODEL. Shown on the hero Build tab only with ?tiers=new, in place of the old build boxes. ===== */
/*GM-START*/
const GM_MAINS=['Attack','Attack Power Up','Critical Hit Chance','Critical Damage'],GM_SLOTS=['Helmet','Chest','Legs','Gloves','Boots'];
const GM_TRAIT={'Attack Power':'Attack Power Up','Critical Rate':'Critical Hit Chance','Max HP':'Max HP Up','Defense':'Defense Up'};
const GM_RUNE={Focus:'Critical Hit Chance',Amplification:'Critical Damage',Determination:'gearAttack'};
const gmKey=st=>st==='Attack'?'gearAttack':st;
function gmHeroBase(h,awk,sig){const c={},add=(k,v)=>{c[k]=(c[k]||0)+v};
 (TITLES.list||[]).forEach(t=>(t.passive||[]).forEach(p=>add(p.stat,p.value)));
 const b=HERO_BASE_STATS[h]||{},k=(KARMA_DATA||[]).find(x=>x.signature===h);
 c.flat=(b.Attack||0)+(c.Attack||0)+(k?parseFloat(k.base.Attack)||0:0);
 add('Critical Hit Chance',b['Critical Hit Chance']||0);add('Critical Damage',b['Critical Damage']||0);
 if(sig&&k)(k.traits||[]).forEach(t=>add(GM_TRAIT[t.label]||t.label,parseFloat(t.a6)||0));
 ((((AWAKENINGS||{}).heroes||{})[h]||{}).list||[]).slice(0,awk).forEach(a=>(a.effects||[]).forEach(e=>add(e.stat,e.value)));
 return c;}
/* S: [[status, uptime], ...] in the order picked; 'Other' = a status with no AAP substat offered.
   Stats sit in a Float64Array for speed (one build = 320 main-stat choices x 25 substat picks); the arithmetic is Python's, in the same order. */
const GM_CORE=['flat','gearAttack','Attack Power Up','Critical Hit Chance','Critical Damage','Defense Ignore','Armor Penetration','All Status Effect Additional Attack Power','Status Effect Additional Attack Power Increase'];
function gmIndex(S){const names=GM_CORE.slice();S.forEach(([s])=>names.push(s+' Additional Attack Power',s+' Additional Damage'));const ix={};names.forEach((n,i)=>{if(!(n in ix))ix[n]=i});return {names,ix,aap:S.map(([s])=>ix[s+' Additional Attack Power']),ad:S.map(([s])=>ix[s+' Additional Damage']),u:S.map(([,u])=>u)};}
function gmPA(a,X){const atk=(a[0]+a[1])*(1+a[2]/100),u=X.u;let aap=0,us=0;for(let i=0;i<u.length;i++)aap+=u[i]*a[X.aap[i]];for(let i=0;i<u.length;i++)us+=u[i];aap+=a[7]*us;aap*=1+a[8]/100;return atk+aap;}
function gmPE(a,def){return Math.max(0,def*(1-Math.min(a[5],100)/100)-a[6]);}
function gmPC(a){return 1+Math.min(a[3],100)/100*a[4]/100;}
function gmPD(a,X){let ad=0;const u=X.u;for(let i=0;i<u.length;i++)ad+=u[i]*a[X.ad[i]];return 1+ad/100;}
const gmCombine=(A,E,C,D)=>A*1000/(1000+E)*C*D;
function gmValueA(a,X,def){return gmCombine(gmPA(a,X),gmPE(a,def),gmPC(a),gmPD(a,X));}
function gmValue(c,S,def){const X=gmIndex(S),a=new Float64Array(X.names.length);for(const n in X.ix)a[X.ix[n]]=c[n]||0;return gmValueA(a,X,def);}
function gmSetBase(base0,s3,s2){const c=Object.assign({},base0),set=n=>(GEAR_DATA||[]).find(g=>g.name===n)||{},add=l=>(l||[]).forEach(x=>{c[x.stat]=(c[x.stat]||0)+x.value});
 add(set(s3).twoBonus);add(set(s3).threeBonus);add(set(s2).twoBonus);return c;}
function gmBuild(base,S,def){const G=GEAR_STATS.slots,lv=(typeof GEAR_MODEL!=='undefined'&&GEAR_MODEL.level)||15,X=gmIndex(S),N=X.names.length;
 const subsOk=['Attack','Attack Power Up','Critical Hit Chance','Critical Damage','Defense Ignore','Armor Penetration','All Status Effect Additional Attack Power','Status Effect Additional Attack Power Increase'].concat(S.filter(([s])=>s!=='Other').map(([s])=>s+' Additional Attack Power'));
 const subK=subsOk.map(st=>X.ix[gmKey(st)]),subG=subK.map(q=>q===5||q===6?1:q===3||q===4?2:0),subV=GM_SLOTS.map(s=>subsOk.map(st=>G[s].sub[st]||0));
 const b0=new Float64Array(N);for(const n in X.ix)b0[X.ix[n]]=base[n]||0;
 let best=null;const c=new Float64Array(N);
 for(let i=0;i<4;i++)for(let j=i;j<4;j++)for(let k=j;k<4;k++)for(let ch=0;ch<4;ch++)for(let lg=0;lg<4;lg++){
  const mains={Helmet:GM_MAINS[i],Gloves:GM_MAINS[j],Boots:GM_MAINS[k],Chest:GM_MAINS[ch],Legs:GM_MAINS[lg]};c.set(b0);
  for(const s in mains)c[X.ix[gmKey(mains[s])]]+=G[s].main[mains[s]][lv];
  const used=GM_SLOTS.map(()=>new Uint8Array(subsOk.length)),cnt=[0,0,0,0,0],picks=GM_SLOTS.map(()=>[]);
  for(let n=0;n<25;n++){const A=gmPA(c,X),E=gmPE(c,def),C=gmPC(c),D=gmPD(c,X),cur=gmCombine(A,E,C,D);let pg=0,ps=-1,pt=-1;
   for(let si=0;si<5;si++){if(cnt[si]>=5)continue;const us=used[si],sv=subV[si];
    for(let t=0;t<subsOk.length;t++){if(us[t])continue;const kk=subK[t],v0=c[kk],grp=subG[t];c[kk]=v0+sv[t];
     const val=grp===1?gmCombine(A,gmPE(c,def),C,D):grp===2?gmCombine(A,E,gmPC(c),D):gmCombine(gmPA(c,X),E,C,D);
     const gain=val-cur;c[kk]=v0;if(ps<0||gain>pg){pg=gain;ps=si;pt=t;}}}
   c[subK[pt]]+=subV[ps][pt];used[ps][pt]=1;cnt[ps]++;picks[ps].push(subsOk[pt]);}
  const v=gmValueA(c,X,def);if(best===null||v>best.v){const co={};X.names.forEach((nm,q)=>{if(X.ix[nm]===q)co[nm]=c[q]});const subs={};GM_SLOTS.forEach((s,q)=>subs[s]=picks[q]);best={v,mains,subs,c:co};}}
 return best;}
function gmRunes(mix){const P=((RUNES||{}).seen||{}).Perfect||{},out={};for(const t in mix){const vals=(P[t]||[]).map(x=>parseFloat(x)).filter(x=>!isNaN(x));if(!vals.length||!GM_RUNE[t])continue;out[t]=Math.max(...vals);}return out;}
function gmAddRunes(base,mix,top){const c=Object.assign({},base);for(const t in mix){if(!top[t])continue;const k=GM_RUNE[t];c[k]=(c[k]||0)+mix[t]*top[t];}return c;}
/* 3-piece: every set but excludeSets. 2-piece: a set whose 2-piece Additional Damage needs a status counts only when that status is ticked,
   so the others are left out (they add nothing; the Python search tries them and ranks them lower). */
function gmPairs(S){const ex=new Set(GEAR_MODEL.excludeSets||[]),on=new Set((S||[]).map(([s])=>s)),sets=(GEAR_DATA||[]).filter(g=>!ex.has(g.name)),out=[];
 const useful=g=>(g.twoBonus||[]).every(x=>!/ Additional Damage$/.test(x.stat)||on.has(x.stat.replace(' Additional Damage','')));
 sets.forEach(a=>sets.forEach(b=>{if(a!==b&&(!S||useful(b)))out.push([a.name,b.name])}));return out;}
/*GM-END*/
const GM_STATE={};
const gmShort=s=>({'Attack':'Attack','Attack Power Up':'Attack Power Up','Critical Hit Chance':'Crit Rate','Critical Damage':'Crit Damage','Defense Ignore':'Defense Ignore','Armor Penetration':'Armor Penetration','All Status Effect Additional Attack Power':'All Status AAP','Status Effect Additional Attack Power Increase':'Status AAP Increase'}[s]||s.replace(' Additional Attack Power',' AAP'));
function gmDefaults(h){const M=GEAR_MODEL,arch=(HEROES.find(x=>x.name===h)||{}).archetype,own=Object.keys(STATUS_ARCHETYPE||{}).find(s=>STATUS_ARCHETYPE[s]===arch&&(M.statuses||[]).includes(s));
 const awkN=((((AWAKENINGS||{}).heroes||{})[h]||{}).list||[]).length;
 return {def:(M.defense[0]||{}).value||1825,half:true,awk:Math.min(6,awkN),sig:!!(KARMA_DATA||[]).find(k=>k.signature===h),runes:true,st:((M.teamStatuses||{})[h]||(own?[own]:[])).slice()};}
function gmMount(h){if(!GEAR_MODEL||!GEAR_STATS||!GEAR_STATS.slots)return;const panel=$('profileBuild');if(!panel)return;
 ['profileGearSets','profileGearStats','profileEndgame'].forEach(id=>{const el=$(id);if(!el)return;el.style.display='none';let hd=el.previousElementSibling;while(hd&&!hd.classList.contains('profile-subhead'))hd=hd.previousElementSibling;if(hd)hd.style.display='none';});
 panel.querySelectorAll('.build-why').forEach(x=>x.style.display='none');
 let box=$('gmBox');if(!box){const hd=document.createElement('h3');hd.className='profile-subhead';hd.id='gmHead';hd.textContent='Best Gear';box=document.createElement('div');box.id='gmBox';box.className='gm-box';const syn=$('profileSynergy').previousElementSibling;panel.insertBefore(hd,syn);panel.insertBefore(box,syn);}
 const o=GM_STATE[h.name]||(GM_STATE[h.name]=gmDefaults(h.name));gmDraw(h,o);}
function gmDraw(h,o){const M=GEAR_MODEL,box=$('gmBox'),hasSig=!!(KARMA_DATA||[]).find(k=>k.signature===h.name);
 const seg=(name,opts,cur)=>'<div class="gm-seg" role="group">'+opts.map(([v,l,t])=>`<button type="button" data-gm="${name}" data-v="${profileEsc(v)}" class="${String(v)===String(cur)?'on':''}" aria-pressed="${String(v)===String(cur)}"${t?` title="${profileEsc(t)}"`:''}>${profileEsc(l)}</button>`).join('')+'</div>';
 box.innerHTML=`<div class="gm-controls">
  <div><span class="gm-lab">Enemy</span>${seg('def',M.defense.map(x=>[x.value,x.label,x.tip]),o.def)}</div>
  <div><span class="gm-lab">Physical statuses up</span>${seg('half',[[1,'Half the time'],[0,'All the time']],o.half?1:0)}</div>
  <div><span class="gm-lab">Awakenings</span>${seg('awk',[0,1,2,3,4,5,6].map(n=>[n,'A'+n]),o.awk)}</div>
  <div><span class="gm-lab">Signature Karma (A6)</span>${hasSig?seg('sig',[[1,'On'],[0,'Off']],o.sig?1:0):'<span class="gm-none">none</span>'}</div>
  <div><span class="gm-lab">Perfect runes</span>${seg('runes',[[1,'Best mix'],[0,'None']],o.runes?1:0)}</div>
  <div class="gm-st"><span class="gm-lab">Statuses the team keeps on the target</span><div class="gm-chips">${M.statuses.map(s=>`<label class="gm-chip"><input type="checkbox" data-gm-st="${profileEsc(s)}"${s==='Other'?' title="A status with no AAP substat: it still counts for All Status AAP"':''}${o.st.includes(s)?' checked':''}>${profileEsc(s)}</label>`).join('')}</div></div>
 </div><div id="gmOut" class="gm-out"><p class="profile-note">Working out the best gear…</p></div>`;
 box.querySelectorAll('[data-gm]').forEach(b=>b.onclick=()=>{const k=b.dataset.gm,v=Number(b.dataset.v);o.open=0;o[k]=(k==='def'||k==='awk')?v:!!v;gmDraw(h,o);});
 box.querySelectorAll('[data-gm-st]').forEach(cb=>cb.onchange=()=>{const s=cb.dataset.gmSt;o.open=0;o.st=M.statuses.filter(x=>x===s?cb.checked:o.st.includes(x));gmDraw(h,o);});
 gmRun(h,o);}
function gmRun(h,o){const M=GEAR_MODEL,out=$('gmOut'),token=(o.token=(o.token||0)+1);
 if(!o.st.length){out.innerHTML='<p class="profile-note">Tick at least one status.</p>';return;}
 const ck=JSON.stringify([o.def,o.half,o.awk,o.sig,o.runes,o.st]);if(o.cache&&o.cache.k===ck){gmShow(h,o,o.cache.rows,o.cache.top);return;}/* same settings as last time: redraw at once (Back button keeps its scroll place) */
 const phys=new Set(M.physical||[]),S=o.st.map(s=>[s,o.half&&phys.has(s)?0.5:1]);
 const top=gmRunes(M.runeMix||{}),base0=gmHeroBase(h.name,o.awk,o.sig),base=o.runes?gmAddRunes(base0,M.runeMix||{},top):base0;
 const pairs=gmPairs(S),res=[];let i=0;
 const step=()=>{if(o.token!==token||!$('gmOut'))return;const t0=performance.now();
  while(i<pairs.length&&performance.now()-t0<40){const [a,b]=pairs[i++];const r=gmBuild(gmSetBase(base,a,b),S,o.def);res.push(Object.assign(r,{s3:a,s2:b}));}
  if(i<pairs.length){out.innerHTML=`<p class="profile-note">Working out the best gear… ${Math.round(100*i/pairs.length)}%</p>`;setTimeout(step,0);return;}
  res.sort((x,y)=>y.v-x.v);const seen=new Set(),rows=res.filter(r=>{const k=r.s3+'|'+r.s2;if(seen.has(k))return false;seen.add(k);return true}).slice(0,GM_ROWS);
  if(!o.runes){o.cache={k:ck,rows};gmShow(h,o,rows);return;}
  /* runes: try all 21 mixes of 5 Perfect runes (Crit Rate, Crit Damage, Attack at the top values seen) on each listed pair, then re-rank */
  const top5=gmRunes({Focus:1,Amplification:1,Determination:1}),mixes=[];for(let cr=0;cr<=5;cr++)for(let cd=0;cd+cr<=5;cd++)mixes.push({Focus:cr,Amplification:cd,Determination:5-cr-cd});
  let ri=0,mi=0;const bestOf=rows.map(()=>null);
  const step2=()=>{if(o.token!==token||!$('gmOut'))return;const t1=performance.now();
   while(ri<rows.length&&performance.now()-t1<40){const r=rows[ri],mix=mixes[mi];const b=gmBuild(gmSetBase(gmAddRunes(base0,mix,top5),r.s3,r.s2),S,o.def);if(!bestOf[ri]||b.v>bestOf[ri].v)bestOf[ri]=Object.assign(b,{s3:r.s3,s2:r.s2,mix});if(++mi>=mixes.length){mi=0;ri++;}}
   if(ri<rows.length){out.innerHTML=`<p class="profile-note">Fitting runes… ${Math.round(100*ri/rows.length)}%</p>`;setTimeout(step2,0);return;}
   bestOf.sort((x,y)=>y.v-x.v);o.cache={k:ck,rows:bestOf,top:top5};gmShow(h,o,bestOf,top5);};
  setTimeout(step2,0);};
 setTimeout(step,30);}
const GM_ROWS=6;
function gmRuneText(mix,top,short){if(!mix)return '';const rn={Focus:'Crit Rate',Amplification:'Crit Damage',Determination:'Attack'};return Object.entries(mix).filter(([,n])=>n).map(([t,n])=>short?`${n} ${rn[t]}`:`${n} × ${rn[t]} (${t}, ${fmtStat(GM_RUNE[t]==='gearAttack'?'Attack':GM_RUNE[t],top[t])})`).join(short?' + ':' + ');}
function gmShow(h,o,rows,top){const out=$('gmOut'),G=GEAR_STATS.slots,lv=GEAR_MODEL.level||15,set=n=>(GEAR_DATA||[]).find(g=>g.name===n)||{},best=rows[0];
 const icon=n=>{const g=set(n);return g.icon?`<img src="${profileEsc(g.icon)}" alt="" title="${profileEsc(n)}">`:''};
 const detail=r=>{const c=r.c,g=k=>c[k]||0;
  const pieces=GM_SLOTS.map(s=>{const m=r.mains[s];return `<div class="profile-gear-piece build-piece"><strong>${s}</strong><div class="profile-main-stat-value">${profileEsc(gmShort(m))}<span class="build-main-val">${fmtStat(m,G[s].main[m][lv],true)}</span></div><ul class="build-subs">${r.subs[s].map(st=>`<li><span>${profileEsc(gmShort(st))}</span><b>${fmtStat(st,G[s].sub[st],true)}</b></li>`).join('')}</ul></div>`;}).join('');
  const tot=[['Attack',(g('flat')+g('gearAttack'))*(1+g('Attack Power Up')/100),'Attack'],['Attack Power Up',g('Attack Power Up'),'Attack Power Up'],['Crit Rate',g('Critical Hit Chance'),'Critical Hit Chance'],['Crit Damage',g('Critical Damage'),'Critical Damage'],['Defense Ignore',g('Defense Ignore'),'Defense Ignore']];
  const aap=[...o.st.filter(s=>s!=='Other').map(s=>s+' Additional Attack Power'),'All Status Effect Additional Attack Power','Status Effect Additional Attack Power Increase'].filter(k=>g(k)>0);
  const setLine=n=>{const s=set(n);return `<button type="button" class="gm-setlink" data-gm-set="${profileEsc(n)}">${icon(n)}<span><b>${profileEsc(n)}</b> ${n===r.s3?'(3) '+profileEsc(s.three)+' · (2) '+profileEsc(s.two):'(2) '+profileEsc(s.two)}</span></button>`;};
  return `<div class="gm-detail">${setLine(r.s3)}${setLine(r.s2)}<div class="profile-gear-pieces">${pieces}</div>${r.mix?`<p class="profile-note"><strong>Runes:</strong> ${gmRuneText(r.mix,top)}, one per piece.</p>`:''}<div class="eg-grid gm-tot">${tot.map(([l,v,k])=>`<div class="eg-row"><span class="eg-label">${l}</span><span class="eg-val"><b class="eg-total">${k==='Attack'?Math.round(v).toLocaleString('en-GB'):fmtStat(k,v)}</b>${k==='Critical Hit Chance'&&v>100?'<span class="eg-cap">over 100%</span>':''}</span></div>`).join('')}${aap.map(k=>`<div class="eg-row"><span class="eg-label">${profileEsc(gmShort(k))}</span><span class="eg-val"><b class="eg-total">${fmtStat(k,g(k))}</b></span></div>`).join('')}</div></div>`;};
 const row=(r,n)=>{const c=r.c,g=k=>c[k]||0,pct=100*r.v/best.v;
  const chips=[['Crit',fmtStat('Critical Hit Chance',g('Critical Hit Chance'))+' / '+fmtStat('Critical Damage',g('Critical Damage'))],['Defense Ignore',fmtStat('Defense Ignore',g('Defense Ignore'))],['Attack Power Up',fmtStat('Attack Power Up',g('Attack Power Up'))]].concat(r.mix?[['Runes',gmRuneText(r.mix,top,true)]]:[]);
  return `<div class="gm-row${n===o.open?' open':''}" data-gm-row="${n}"><button type="button" class="gm-row-head" aria-expanded="${n===o.open}"><span class="gm-pct-badge">${pct>=99.995?'100':pct.toFixed(2)}%</span><span class="gm-icons">${icon(r.s3)}${icon(r.s2)}</span><span class="gm-names">${profileEsc(r.s3)} <small>(3-PC)</small> + ${profileEsc(r.s2)} <small>(2-PC)</small></span><span class="gm-chev" aria-hidden="true">⌄</span></button><div class="gm-chips2">${chips.map(([l,v])=>`<span class="gm-chip2">${l}: <b>${profileEsc(v)}</b></span>`).join('')}</div>${n===o.open?detail(r):''}</div>`;};
 if(o.open==null||o.open>=rows.length)o.open=0;
 out.innerHTML=`<div class="gm-list">${rows.map(row).join('')}</div>
  <p class="profile-note gm-why">% = damage of each set pair compared with the best (100%), each with its own best main stats, substats${o.runes?' and runes':''}. Level 70, Orange gear at +${lv}, all ${(TITLES.list||[]).length} titles, ${o.sig?'signature Karma at Ascension 6':'no signature Karma traits'}, awakenings A${o.awk}. Every 3-piece effect and every 2-piece bonus is counted as active, and a status's Additional Damage and AAP (Additional Attack Power) count only while that status is up${o.half?'; physical statuses count half the time':''}. Substats are picked one at a time for the biggest gain, five per piece. Real uptime depends on how you play, so treat pairs within about 1% as a tie. Python reference: <code>tools/team_gear.py</code>.</p>`;
 out.querySelectorAll('[data-gm-row] .gm-row-head').forEach(b=>b.onclick=()=>{const n=Number(b.parentNode.dataset.gmRow);o.open=o.open===n?-1:n;gmShow(h,o,rows,top);});
 out.querySelectorAll('[data-gm-set]').forEach(b=>b.onclick=()=>openGearSet(b.dataset.gmSet));}
