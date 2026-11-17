(() => {
  const root = document.getElementById('timingWorkbench');
  if (!root) return;
  const byId = (id) => document.getElementById(id);
  const video = byId('timingVideo');
  const openingLink = document.querySelector('a[href="#timingWorkbench"]');
  if (location.hash === '#timingWorkbench') root.open = true;
  if (openingLink) openingLink.onclick = () => { root.open = true; };
  const stateKey = 'dsw.testkit.timing.v1';
  const fmt = (value, digits = 3) => value.toFixed(digits);
  let marks = [null, null];
  let videoUrl = '';
  let clip = '';
  let saved = [];
  try {
    const rows = JSON.parse(localStorage.getItem(stateKey) || '[]');
    if (Array.isArray(rows)) saved = rows;
  } catch (error) {}
  const status = (text) => { byId('timingStatus').textContent = text; };
  const basis = () => byId('timingBasis').value;
  function fps() {
    const value = Number(byId('timingFps').value);
    return Number.isFinite(value) && value >= 1 && value <= 240 ? value : null;
  }
  function canMark() {
    return !!videoUrl && video.readyState >= 2 && video.paused && !video.seeking && (basis() === 'timestamps' || !!fps());
  }
  function fillValue(id) {
    const text = byId(id).value;
    const value = Number(text);
    return text !== '' && Number.isFinite(value) && value >= 0 && value <= 100 ? value : null;
  }
  function reading() {
    const a = marks[0], b = marks[1];
    if (a == null || b == null || b <= a) return null;
    const mode = byId('timingMode').value;
    const elapsed = b - a;
    if (mode === 'signal') return { mode, elapsed };
    const before = fillValue('timingFillA'), after = fillValue('timingFillB');
    if (before == null || after == null) return null;
    return { mode, elapsed, gauge: byId('timingGauge').value, before, after, gaugeChange: after - before };
  }
  function resultText(r) {
    if (!r) return 'Mark A, then mark B at a later time.';
    if (r.mode === 'signal') return fmt(r.elapsed) + ' s between Signal marks';
    const change = r.gaugeChange;
    return r.gauge + ' gauge ' + fmt(r.before, 1) + '% → ' + fmt(r.after, 1) + '% · ' +
      (change < 0 ? 'spent ' : 'gained ') + fmt(Math.abs(change), 1) + ' percentage points';
  }
  function update() {
    const rate = fps();
    const time = video.currentTime || 0;
    const frames = basis() === 'frames';
    byId('timingClock').textContent = videoUrl && video.readyState
      ? fmt(time) + ' s' + (frames && rate ? ' · frame ' + Math.floor(time * rate + 0.0001) : '')
      : 'Load a clip to begin';
    const canSeek = !!videoUrl && video.readyState >= 1;
    byId('timingBack').disabled = byId('timingNext').disabled = !canSeek || !frames || !rate || video.seeking;
    byId('timingGo').disabled = !canSeek || video.seeking;
    byId('timingA').disabled = byId('timingB').disabled = !canMark();
    byId('timingClear').disabled = marks.every((mark) => mark == null);
    byId('timingMarkA').textContent = marks[0] == null ? '—' : fmt(marks[0]) + ' s';
    byId('timingMarkB').textContent = marks[1] == null ? '—' : fmt(marks[1]) + ' s';
    const signal = byId('timingMode').value === 'signal';
    byId('timingGaugeFields').hidden = signal;
    byId('timingA').textContent = signal ? 'A · Signal spent' : 'A · Before action';
    byId('timingB').textContent = signal ? 'B · Signal usable' : 'B · After action';
    const result = reading();
    const needFill = !signal && marks.every((m) => m != null) && marks[1] > marks[0] && !result;
    byId('timingResult').textContent = needFill ? 'Enter the gauge fill percentage at both marks.' : resultText(result);
    byId('timingSave').disabled = !result;
  }
  function moveTime(target) {
    if (!Number.isFinite(target) || !videoUrl || video.readyState < 1) return;
    video.pause();
    const end = Number.isFinite(video.duration) ? Math.max(0, video.duration - 0.001) : Infinity;
    video.currentTime = Math.max(0, Math.min(end, target));
    update();
  }
  function moveFrame(direction) {
    const rate = fps();
    if (!rate) return;
    const frame = Math.floor(video.currentTime * rate + 0.0001);
    // Seek to the centre of the desired constant-rate frame, away from rounded frame boundaries.
    moveTime((Math.max(0, frame + direction) + 0.5) / rate);
  }
  function persist(next) {
    try {
      localStorage.setItem(stateKey, JSON.stringify(next));
      saved = next;
      return true;
    } catch (error) {
      status('This browser could not save the reading.');
      return false;
    }
  }
  function drawSaved() {
    const list = byId('timingSaved');
    list.replaceChildren(...saved.map((row) => {
      const li = document.createElement('li');
      const text = document.createElement('span');
      text.textContent = [row.hero, row.skill, 'patch ' + row.patch, row.target, resultText(row.result)].join(' · ');
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'ghost';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove ' + row.hero + ' ' + row.skill + ' reading');
      remove.onclick = () => {
        if (persist(saved.filter((entry) => entry.id !== row.id))) {
          drawSaved();
          status('Reading removed.');
        }
      };
      li.append(text, remove);
      return li;
    }));
    byId('timingExport').disabled = !saved.length;
    byId('timingEmpty').hidden = saved.length > 0;
  }
  byId('timingFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    videoUrl = URL.createObjectURL(file);
    clip = file.name;
    marks = [null, null];
    byId('timingFillA').value = byId('timingFillB').value = '';
    video.src = videoUrl;
    video.load();
    video.hidden = false;
    status('');
    update();
  });
  ['loadedmetadata', 'loadeddata', 'seeked', 'seeking', 'timeupdate', 'play', 'pause', 'ended'].forEach((name) => video.addEventListener(name, update));
  video.addEventListener('error', () => status('This browser could not open that video. Try a supported MP4 or WebM clip.'));
  byId('timingBack').onclick = () => moveFrame(-1);
  byId('timingNext').onclick = () => moveFrame(1);
  byId('timingGo').onclick = () => {
    if (byId('timingSeek').value !== '') moveTime(Number(byId('timingSeek').value));
  };
  byId('timingClear').onclick = () => {
    marks = [null, null];
    byId('timingFillA').value = byId('timingFillB').value = '';
    update();
  };
  ['timingA', 'timingB'].forEach((id, index) => {
    byId(id).onclick = () => {
      if (!canMark()) return;
      const time = video.currentTime;
      marks[index] = basis() === 'frames' ? Math.floor(time * fps() + 0.0001) / fps() : time;
      update();
    };
  });
  ['timingBasis', 'timingFps', 'timingMode', 'timingGauge', 'timingFillA', 'timingFillB'].forEach((id) =>
    byId(id).addEventListener('input', () => {
      if (['timingBasis', 'timingMode', 'timingFps', 'timingGauge'].includes(id)) marks = [null, null];
      update();
    }));
  byId('timingForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const result = reading();
    if (!result) return;
    const form = new FormData(event.target);
    const row = {
      id: crypto.randomUUID(), clip, basis: basis(), fps: basis() === 'frames' ? fps() : null, marks: [...marks], result, createdAt: new Date().toISOString(),
      ...Object.fromEntries(['hero', 'skill', 'patch', 'target', 'setup'].map((key) => [key, String(form.get(key) || '').trim()])),
    };
    if (!row.hero || !row.skill || !row.patch || !row.target) return status('Enter the hero, skill, patch and target.');
    if (persist([row, ...saved])) {
      drawSaved();
      status('Reading saved in this browser.');
    }
  });
  byId('timingExport').onclick = () => {
    const data = { format: 'dragonsword-timing', version: 1, readings: saved };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dragonsword-timing.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  window.addEventListener('pagehide', (event) => {
    if (videoUrl && !event.persisted) URL.revokeObjectURL(videoUrl);
  });
  drawSaved();
  update();
})();
