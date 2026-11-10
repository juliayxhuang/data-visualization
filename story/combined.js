/* The Big O — combined draft.
   Sections: picker + ring (from main.js), six groups / nights / loudness, age, menu + crescendo,
   pairing drawings, solo vs partner, non-monogamy. Each study's numbers stay in its own section.
   Sound engine adapted from the orgasm-gap project (gap_sonification.html / article.html). */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const SVGNS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ================= data (transcribed; see data/raw and research/notes) ================= */
// Frederick et al. (2018), Figure 1 / Table 1: usually-always orgasm when intimate, past month.
const GROUPS = {
  'female:straight': { id: 'het_w', label: 'straight women', percent: 65, n: 24102, sex: 'f' },
  'female:bisexual': { id: 'bi_w', label: 'bisexual women', percent: 66, n: 1112, sex: 'f' },
  'female:lesbian':  { id: 'les', label: 'lesbian women', percent: 86, n: 340, sex: 'f' },
  'male:straight':   { id: 'het_m', label: 'straight men', percent: 95, n: 26032, sex: 'm' },
  'male:bisexual':   { id: 'bi_m', label: 'bisexual men', percent: 88, n: 550, sex: 'm' },
  'male:gay':        { id: 'gay', label: 'gay men', percent: 89, n: 452, sex: 'm' }
};
const RING_ORDER = ['female:straight', 'female:bisexual', 'female:lesbian', 'male:straight', 'male:bisexual', 'male:gay'];

// Frederick et al. (2018), Table 5: straight women, % usually-always by what happened in the last encounter (cells with n >= 20).
// Keys: o = received oral, v = vaginal intercourse, h = genital stimulation (hands), k = deep kissing.
const TABLE5 = [
  { o: 1, v: 0, h: 1, k: 1, p: 80 }, { o: 1, v: 1, h: 1, k: 1, p: 77 }, { o: 1, v: 0, h: 1, k: 0, p: 73 },
  { o: 1, v: 1, h: 0, k: 1, p: 71 }, { o: 1, v: 1, h: 1, k: 0, p: 69 }, { o: 1, v: 0, h: 0, k: 1, p: 69 },
  { o: 0, v: 1, h: 1, k: 1, p: 67 }, { o: 1, v: 0, h: 0, k: 0, p: 62 }, { o: 1, v: 1, h: 0, k: 0, p: 60 },
  { o: 0, v: 0, h: 1, k: 1, p: 60 }, { o: 0, v: 1, h: 1, k: 0, p: 59 }, { o: 0, v: 1, h: 0, k: 1, p: 57 },
  { o: 0, v: 0, h: 0, k: 1, p: 54 }, { o: 0, v: 0, h: 1, k: 0, p: 52 }, { o: 0, v: 0, h: 0, k: 0, p: 37 },
  { o: 0, v: 1, h: 0, k: 0, p: 35 }
];
const MENU_ITEMS = [['v', 'Intercourse'], ['o', 'She received oral sex'], ['h', 'Hands'], ['k', 'Deep kissing']];

// Herbenick et al. (2010), Table 3: weighted % answering yes to orgasm at the most recent partnered
// sexual event, with printed 95% CIs (data/raw/herbenick-2010-age-event-orgasm.csv).
const AGE_EVENT = [
  { age: '18–24', women: [61.2, 52.0, 69.6], men: [85.7, 80.7, 88.8] },
  { age: '25–29', women: [57.8, 51.4, 64.0], men: [91.4, 86.6, 94.7] },
  { age: '30–39', women: [65.3, 58.6, 71.4], men: [92.8, 88.8, 95.5] },
  { age: '40–49', women: [68.5, 62.1, 74.3], men: [93.3, 88.6, 96.8] },
  { age: '50–59', women: [70.7, 62.5, 77.8], men: [86.8, 81.9, 90.8] }
];

// Hensel et al. (2021), Table 6: ever used, weighted %, N = 2,877. Drawings = Julia's originals (copies),
// as in experiments/processing-pairing-landscape; box = measured crop [x, y, w, h] in the 2732 x 2048 PNG.
const PAIRING = [
  { label: 'Self-applied finger', pct: 30.9, file: 'assets/pairing/IMG_1744.PNG', box: [1148, 308, 516, 1344] },
  { label: 'Self-applied toy', pct: 20.1, file: 'assets/pairing/IMG_1731.PNG', box: [364, 276, 1876, 1524] },
  { label: 'Partner-applied finger', pct: 43.1, file: 'assets/pairing/IMG_1744.PNG', box: [1148, 308, 516, 1344] },
  { label: 'Partner-applied toy', pct: 17.5, file: 'assets/pairing/IMG_1732.PNG', box: [596, 96, 1488, 1444] }
];

// Anderson et al. (2025): Hedges' g, positive = non-monogamous more satisfied.
const CNM = [
  { label: 'Relationship satisfaction', g: -0.05, lo: -0.20, hi: 0.10, k: 29 },
  { label: 'Sexual satisfaction', g: 0.06, lo: -0.07, hi: 0.18, k: 17 }
];

/* ================= audio ================= */
let ctx = null, master = null, bus = null, noiseBuf = null, soundOn = false, samplesReady = null;
const timers = [];
function ensureAudio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -10; comp.ratio.value = 4;
    const verb = ctx.createConvolver(), len = Math.floor(ctx.sampleRate * 2.4), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    verb.buffer = ir; const wet = ctx.createGain(); wet.gain.value = 0.15;
    master.connect(comp); comp.connect(ctx.destination); master.connect(verb); verb.connect(wet); wet.connect(comp);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    samplesReady = loadSamples();
  }
  if (ctx.state === 'suspended') ctx.resume();
  if (!bus) { bus = ctx.createGain(); bus.connect(master); }
}
function setSound(on) {
  soundOn = on;
  const b = $('#sound'); b.textContent = on ? 'sound on' : 'sound off'; b.setAttribute('aria-pressed', on);
  if (on) ensureAudio(); else stopAll();
}
let onStop = [];
function stopAll() {
  for (const id of timers) clearTimeout(id); timers.length = 0;
  if (bus) { const old = bus, t = ctx.currentTime; old.gain.setValueAtTime(old.gain.value, t); old.gain.linearRampToValueAtTime(0, t + 0.08); setTimeout(() => old.disconnect(), 150); bus = null; }
  $$('.hear.on').forEach(b => b.classList.remove('on'));
  $$('.loud-row.now').forEach(r => r.classList.remove('now'));
  const fns = onStop; onStop = []; fns.forEach(f => f());
}
// A play button: turns sound on, stops whatever was playing, runs fn. Click again to stop.
function hear(btn, fn) {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('on')) { stopAll(); return; }
    setSound(true); stopAll(); ensureAudio(); btn.classList.add('on'); fn(btn);
  });
}
const later = (sec, f) => timers.push(setTimeout(f, sec * 1000));
const atAudio = (t, f) => later(Math.max(0, t - ctx.currentTime), f);

// Voices by gender (a listening convention): women about an octave higher, formants ~18% higher.
const VOX = { m: { fm: 1.00, f0: 110, trim: 1 }, f: { fm: 1.18, f0: 220, trim: 0.79 } };
const VT = { hit: 4.0, miss: 4.7, pulse: 7.1 };
const VOWELS = { a: [[800, 1], [1150, 0.5], [2900, 0.22]], o: [[500, 1], [800, 0.45], [2830, 0.12]], u: [[320, 1], [800, 0.3], [2300, 0.08]] };
function makeVoice(t, stopT, out, breath, level, vowel, sex) {
  const fm = VOX[sex].fm;
  const post = ctx.createGain(); post.gain.value = level * VOX[sex].trim; post.connect(out);
  const src = ctx.createOscillator(); src.type = 'sawtooth';
  const n = ctx.createBufferSource(); n.buffer = noiseBuf; n.loop = true;
  const ng = ctx.createGain(); ng.gain.value = breath;
  const pre = ctx.createGain(); pre.gain.value = 0.35;
  src.connect(pre); n.connect(ng); ng.connect(pre);
  const fs = VOWELS[vowel].map(([f, a]) => {
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * fm; bp.Q.value = 9;
    const g = ctx.createGain(); g.gain.value = a * 3; pre.connect(bp); bp.connect(g); g.connect(post); return { bp, g };
  });
  src.start(t); src.stop(stopT); n.start(t); n.stop(stopT);
  return { freq: src.frequency, morph(to, t0, t1) { VOWELS[to].forEach(([f, a], i) => {
    fs[i].bp.frequency.setValueAtTime(fs[i].bp.frequency.value, t0); fs[i].bp.frequency.linearRampToValueAtTime(f * fm, t1);
    fs[i].g.gain.setValueAtTime(fs[i].g.gain.value, t0); fs[i].g.gain.linearRampToValueAtTime(a * 3, t1); }); } };
}
function vibrato(param, t, stopT, freq, cents, rate) {
  const l = ctx.createOscillator(); l.frequency.value = rate;
  const g = ctx.createGain(); g.gain.value = freq * (Math.pow(2, cents / 1200) - 1);
  l.connect(g); g.connect(param); l.start(t); l.stop(stopT);
}
const panNode = v => { const p = ctx.createStereoPanner(); p.pan.value = v; p.connect(bus); return p; };

// recordings: CC0 Freesound clips the student picked (samples/manifest.json). A group never gets another
// gender's clip. Slicing and level matching (A-weighted gain_db) follow the sound lab, so levels match it.
const recs = { yay: [], sad: [], woo: [], grunt: [] };
function sliceRecording(buf, sex, whole) {
  const ch = buf.getChannelData(0), sr = buf.sampleRate, hop = Math.floor(sr * 0.02), env = [];
  for (let i = 0; i + hop <= ch.length; i += hop) { let s = 0; for (let j = i; j < i + hop; j++) s += ch[j] * ch[j]; env.push(Math.sqrt(s / hop)); }
  const thr = env.reduce((m, x) => Math.max(m, x), 0) * 0.06, segs = [];
  const mk = (x, y) => ({ buf, sex, start: x * 0.02, dur: (y - x) * 0.02, gain: 1.5 * Math.min(20, 0.03 / (env.slice(x, y).reduce((m, v) => Math.max(m, v), 0) + 1e-6)) });
  if (whole) { const a = env.findIndex(v => v > thr), b = env.length - [...env].reverse().findIndex(v => v > thr); return [mk(a, b)]; }
  let st = -1, quiet = 0;
  const push = (a, b) => { for (let x = a; x < b; x += 150) { const y = Math.min(b, x + 150); if ((y - x) * 0.02 >= 0.15) segs.push(mk(x, y)); } };
  env.forEach((v, k) => { if (v > thr) { if (st < 0) st = k; quiet = 0; } else if (st >= 0 && ++quiet >= 8) { push(st, k - quiet + 1); st = -1; quiet = 0; } });
  if (st >= 0) push(st, env.length);
  return segs;
}
async function loadSamples() {
  try {
    const m = await fetch('samples/manifest.json', { cache: 'no-cache' }).then(r => r.json());
    for (const kind of Object.keys(recs)) for (const x of (m[kind] || [])) {
      const buf = await ctx.decodeAudioData(await fetch('samples/' + x.file).then(r => r.arrayBuffer()));
      let segs = sliceRecording(buf, x.voice, !!x.whole);
      if (x.clip != null) segs = [].concat(x.clip).map(c => segs[c]).filter(Boolean);
      if (x.gain_db) segs.forEach(s => s.gain *= Math.pow(10, x.gain_db / 20));
      recs[kind].push(...segs);
    }
  } catch (e) { /* no recordings: synthesized fallbacks */ }
}
function playRec(kind, sex, t, out, level = 1, maxLen = 3) {
  // one clip per gender per sound: always the student's pick for that voice (no mixing, no rotation)
  const r = recs[kind].find(x => x.sex === sex);
  if (!r) return false;
  const src = ctx.createBufferSource(); src.buffer = r.buf;
  const g = ctx.createGain(), len = Math.min(maxLen, r.dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(r.gain * level, t + 0.02);
  g.gain.setValueAtTime(r.gain * level, t + Math.max(0.03, len - 0.06)); g.gain.linearRampToValueAtTime(0.0001, t + len);
  src.connect(g); g.connect(out); src.start(t, r.start, len); src.stop(t + len + 0.05);
  return true;
}
function playYay(sex, t, out, level) {
  if (playRec('yay', sex, t, out, level)) return;
  const dur = 0.65, g = ctx.createGain(); g.connect(out);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.06 * level, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const f = VOX[sex].f0 * 2, v = makeVoice(t, t + dur + 0.05, g, 0.25, 8, 'a', sex);
  v.freq.setValueAtTime(f * 1.1, t); v.freq.exponentialRampToValueAtTime(f * 1.3, t + dur * 0.3); v.freq.exponentialRampToValueAtTime(f * 0.95, t + dur);
}
function playSad(sex, t, out, level) {
  if (playRec('sad', sex, t, out, level)) return;
  const dur = 0.9, g = ctx.createGain(); g.connect(out);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05 * level, t + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const f = VOX[sex].f0 * 1.4, v = makeVoice(t, t + dur + 0.05, g, 0.4, 6, 'o', sex);
  v.freq.setValueAtTime(f, t); v.freq.exponentialRampToValueAtTime(f * 0.7, t + dur); v.morph('u', t + 0.2, t + dur);
}

// encounters: a woo when someone gets there, a disappointed "aww"/sigh when they don't.
// Only a men's woo was picked; women use their picked yay until a women's woo is chosen.
function playGotThere(sex, t, out) {
  if (playRec('woo', sex, t, out, 1, 1.4)) return;
  playYay(sex, t, out, 1);
}
function playMissed(sex, t, out) { playSad(sex, t, out, 1); }

// a short voiced "hah" for the crescendo
function playPulse(t, sex, out, level) {
  const g = ctx.createGain(); g.connect(out);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.06 * level, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  const f = VOX[sex].f0 * 1.15, v = makeVoice(t, t + 0.2, g, 0.5, VT.pulse, 'a', sex);
  v.freq.setValueAtTime(f, t); v.freq.exponentialRampToValueAtTime(f * 0.85, t + 0.16);
}

// loudness instruments (design and measured level trims from the sound lab)
const LOUD_C = 2, LOUD_REF = 0.16, LOUD_DUR = 1.6;
const loudAmp = p => Math.pow(p, LOUD_C / 0.6);   // Stevens: loudness ~ pressure^0.6; loudness ~ p^2 here (2x exaggerated)
// measured level trims (A-weighted, from the sound lab) so no instrument sounds louder by nature
const INSTR = { cello: 1.445, horn: 1.334, clarinet: 1.047, bassoon: 1.622, violin: 0.804, flute: 0.923, oboe: 0.603, trumpet: 1.259 };
const INSTR_NAME = { cello: 'cello', horn: 'French horn', clarinet: 'clarinet', bassoon: 'bassoon', violin: 'violin', flute: 'flute', oboe: 'oboe', trumpet: 'muted trumpet' };
// each group keeps its own note (men low, women high); the reader can swap instruments, one group per instrument
const GROUP_NOTE = { het_m: 110, gay: 164.81, bi_m: 220, het_w: 440, les: 329.63, bi_w: 277.18 };
const groupInstr = { het_m: 'cello', gay: 'horn', bi_m: 'clarinet', het_w: 'violin', les: 'flute', bi_w: 'oboe' };
function playInstr(key, t, dur, f, out) {
  const pre = ctx.createGain(); pre.gain.value = INSTR[key]; pre.connect(out);
  const env = ctx.createGain(); env.connect(pre);
  const atk = { cello: 0.12, violin: 0.1, horn: 0.08, flute: 0.1, clarinet: 0.04, bassoon: 0.05, oboe: 0.04, trumpet: 0.03 }[key];
  env.gain.setValueAtTime(0.0001, t); env.gain.linearRampToValueAtTime(1, t + atk);
  const stopT = t + dur + 0.05, srcs = [];
  const osc = (type, hz, gain, dest) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = hz; const g = ctx.createGain(); g.gain.value = gain; o.connect(g); g.connect(dest); srcs.push(o); return o; };
  const filt = (type, hz, q = 0.7, gain = 0) => { const b = ctx.createBiquadFilter(); b.type = type; b.frequency.value = hz; b.Q.value = q; b.gain.value = gain; return b; };
  const chain = (...n) => { for (let i = 0; i < n.length - 1; i++) n[i].connect(n[i + 1]); return n[0]; };
  const vib = (oscs, rate, cents, delay) => { const l = ctx.createOscillator(); l.frequency.value = rate; const lg = ctx.createGain();
    lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * (Math.pow(2, cents / 1200) - 1), t + delay); l.connect(lg); oscs.forEach(o => lg.connect(o.frequency)); srcs.push(l); };
  if (key === 'cello' || key === 'violin') {
    const c = key === 'cello', inp = chain(filt('peaking', c ? 400 : 2800, 1.2, c ? 6 : 5), filt('lowpass', c ? 1500 : 3800), env);
    const a = osc('sawtooth', f, 0.5, inp), b = osc('sawtooth', f * Math.pow(2, 4 / 1200), 0.5, inp); vib([a, b], c ? 5.5 : 6, c ? 12 : 14, 0.35);
  } else if (key === 'horn') {
    const lp = filt('lowpass', 300, 1); lp.frequency.setValueAtTime(300, t); lp.frequency.linearRampToValueAtTime(1100, t + 0.15);
    chain(lp, env); osc('sawtooth', f, 0.7, lp); osc('sine', f, 0.4, env);
  } else if (key === 'clarinet') {
    osc('square', f, 0.6, chain(filt('lowpass', 2000), env));
    const n = ctx.createBufferSource(); n.buffer = noiseBuf; n.loop = true; const ng = ctx.createGain(); ng.gain.value = 0.02; n.connect(ng); ng.connect(chain(filt('bandpass', 2500, 1), env)); srcs.push(n);
  } else if (key === 'trumpet') {   // muted brass: narrow and nasal
    osc('sawtooth', f, 1, chain(filt('bandpass', 1500, 2), filt('lowpass', 3000), env));
  } else if (key === 'bassoon') {   // double reed, low: saw through a broad formant
    osc('sawtooth', f, 1, chain(filt('bandpass', 500, 0.8), filt('lowpass', 1500), env));
  } else if (key === 'oboe') {
    const a = osc('sawtooth', f, 1, chain(filt('highpass', 600), filt('peaking', 1400, 2, 8), filt('lowpass', 4500), env)); vib([a], 5.5, 8, 0.3);
  } else {
    const a = osc('sine', f, 0.8, env), b = osc('sine', f * 2, 0.12, env), c = osc('sine', f * 3, 0.04, env); vib([a, b, c], 5, 10, 0.3);
    const n = ctx.createBufferSource(); n.buffer = noiseBuf; n.loop = true; const ng = ctx.createGain(); ng.gain.value = 0.05; n.connect(ng); ng.connect(chain(filt('bandpass', f * 2, 3), env)); srcs.push(n);
  }
  for (const x of srcs) { x.start(t); x.stop(stopT); }
}
function playLoud(g, t, dur = LOUD_DUR) {
  const out = ctx.createGain(); out.connect(bus);
  const peak = LOUD_REF * loudAmp(g.percent / 100);
  out.gain.setValueAtTime(0.0001, t); out.gain.linearRampToValueAtTime(peak, t + 0.08);
  out.gain.setValueAtTime(peak, t + dur - 0.3); out.gain.linearRampToValueAtTime(0.0001, t + dur);
  playInstr(groupInstr[g.id], t, dur, GROUP_NOTE[g.id], out);
}

/* ================= 3. picker + ring ================= */
let chosen = null;   // key into GROUPS, used only by the first side-scroll step
function ringDots(parent, percent, cx, cy, R, r, animate) {
  parent.replaceChildren();
  for (let i = 0; i < 100; i++) {
    const a = -Math.PI / 2 + 2 * Math.PI * i / 100;
    const dot = svgEl('circle', { cx: cx + R * Math.cos(a), cy: cy + R * Math.sin(a), r, fill: i < percent ? 'currentColor' : 'none', stroke: 'currentColor', 'stroke-width': r / 3 });
    if (animate) { dot.classList.add('result-dot'); dot.style.animationDelay = `${i * 10}ms`; }
    parent.append(dot);
  }
}
function initPicker() {
  const genderChoices = $$('input[name="study-category"]'), orientationChoices = $$('input[name="orientation-category"]');
  const question = $('#gender-question'), genderOptions = $('#gender-options'), orientationStep = $('#orientation-step');
  const result = $('#result-section');
  const reset = () => {
    result.hidden = true; orientationStep.hidden = true; genderOptions.hidden = false;
    [...genderChoices, ...orientationChoices].forEach(c => c.checked = false);
    question.scrollIntoView({ block: 'start' }); genderChoices[0].focus({ preventScroll: true });
  };
  for (const c of genderChoices) c.addEventListener('change', () => {
    const female = c.value === 'female';
    $('#gay-option').hidden = female; $('#lesbian-option').hidden = !female;
    orientationChoices.forEach(o => o.checked = false);
    genderOptions.hidden = true; orientationStep.hidden = false;
    question.scrollIntoView({ block: 'start' }); orientationStep.querySelector('input').focus({ preventScroll: true });
  });
  for (const c of orientationChoices) c.addEventListener('change', () => {
    const gc = $('input[name="study-category"]:checked'), key = `${gc.value}:${c.value}`, g = GROUPS[key];
    if (!g) return;
    chosen = key;
    $('#result-percent').textContent = `${g.percent}%`;
    $('#result-group').textContent = g.label;
    $('#result-summary').textContent = `In this survey, ${g.percent}% of ${g.label} said they usually or always reach orgasm when they're intimate with someone (past month; ${g.n.toLocaleString()} people).`;
    result.hidden = false; result.scrollIntoView({ block: 'start' });
    requestAnimationFrame(() => ringDots($('#result-dots'), g.percent, 400, 400, 300, 4.5, true));
    updateRings(currentRingState);
  });
  $('#change-answer').addEventListener('click', reset);
}

/* ================= 4. six rings, twenty nights, loudness ================= */
let currentRingState = 'mine';
function buildRings() {
  const box = $('#ring-grid');
  for (const key of RING_ORDER) {
    const g = GROUPS[key], cell = document.createElement('div');
    cell.className = 'mini-ring'; cell.dataset.id = g.id;
    const svg = svgEl('svg', { viewBox: '0 0 200 200', 'aria-hidden': 'true' }), grp = svgEl('g');
    svg.append(grp); ringDots(grp, g.percent, 100, 100, 82, 2.8, false);
    cell.innerHTML = `<div class="ring-center"><span class="ring-pct">${g.percent}%</span><span class="ring-label">of ${g.label}</span></div>`;
    cell.prepend(svg);
    const you = document.createElement('span'); you.className = 'ring-you'; cell.append(you);
    box.append(cell);
  }
}
// Where each ring sits in each step: centre x (% of width), centre y (% of height), scale, opacity.
// The groups the text is talking about move to the front and grow; the rest fade out, then come back.
const GRID = { het_w: [17, 25], bi_w: [50, 25], les: [83, 25], het_m: [17, 73], bi_m: [50, 73], gay: [83, 73] };
const RING_LAYOUTS = {
  mine: {},
  straight: { het_m: [28, 50, 1.5, 1], het_w: [72, 50, 1.5, 1] },
  lesbian: { les: [28, 50, 1.5, 1], het_w: [72, 50, 1.5, 1] },
  bisexual: { les: [17, 50, 1, 0.45], bi_w: [50, 50, 1.25, 1], het_w: [83, 50, 1, 0.45] }
};
function updateRings(state) {
  currentRingState = state;
  const layout = RING_LAYOUTS[state], zoomed = Object.keys(layout).length > 0;
  const mine = chosen && GROUPS[chosen].id;
  for (const cell of $$('.mini-ring')) {
    const id = cell.dataset.id, [gx, gy] = GRID[id];
    const [cx, cy, s, o] = layout[id] || (zoomed ? [gx, gy, 0.6, 0] : [gx, gy, 1, 1]);
    cell.style.left = `${cx - 15}%`;
    cell.style.top = `${cy - 18.75}%`;   // a ring is 30% of the width = 37.5% of the stage height
    cell.style.transform = `scale(${s})`;
    cell.style.opacity = o;
    cell.setAttribute('aria-hidden', o === 0);
    cell.querySelector('.ring-you').textContent = state === 'mine' && id === mine ? 'you picked' : '';
  }
  $('#step-mine').innerHTML = chosen
    ? `Here's the group you picked, <strong>${GROUPS[chosen].label}</strong>, next to the other five.`
    : `Here's every group in the study, side by side.`;
}

const NIGHTS = 20;
const pair = { a: 'male:straight', b: 'female:straight' };   // default: the two biggest groups
const nightsFor = key => Math.round(GROUPS[key].percent / 5);   // 95% -> 19 of 20, 65% -> 13 of 20
const singular = g => g.label.replace(/women$/, 'woman').replace(/men$/, 'man');
let nightPlan = null;
function planNights() {
  const mk = key => shuffle([...Array(NIGHTS)].map((_, i) => i < nightsFor(key)));
  nightPlan = { a: mk(pair.a), b: mk(pair.b) };
}
function drawNights(upTo = NIGHTS, now = -1) {
  $('#night-label-a').textContent = singular(GROUPS[pair.a]);
  $('#night-label-b').textContent = singular(GROUPS[pair.b]);
  const rows = { a: $('#nights-a'), b: $('#nights-b'), both: $('#nights-both') };
  for (const [k, el] of Object.entries(rows)) {
    if (!el.children.length) for (let i = 0; i < NIGHTS; i++) el.append(document.createElement('i'));
    [...el.children].forEach((d, i) => {
      const yes = k === 'both' ? nightPlan.a[i] && nightPlan.b[i] : nightPlan[k][i];
      const shown = i < upTo;
      d.classList.toggle('on', shown && yes);
      d.classList.toggle('miss', shown && !yes);
      d.classList.toggle('now', i === now);
      d.style.opacity = shown ? '' : '.2';
    });
  }
}
function buildPairPick() {
  for (const side of ['a', 'b']) {
    const sel = $('#pair-' + side);
    for (const key of RING_ORDER) { const o = document.createElement('option'); o.value = key; o.textContent = `a ${singular(GROUPS[key])} (${GROUPS[key].percent}%)`; sel.append(o); }
    sel.value = pair[side];
    sel.addEventListener('change', () => { pair[side] = sel.value; stopAll(); planNights(); drawNights(); });
  }
}
function buildLoud() {
  const box = $('#loud-rows');
  const list = Object.values(GROUPS).sort((a, b) => b.percent - a.percent);
  for (const g of list) {
    const row = document.createElement('div'); row.className = 'loud-row'; row.dataset.id = g.id;
    const options = Object.keys(INSTR).map(k => `<option value="${k}">${INSTR_NAME[k]}</option>`).join('');
    row.innerHTML = `<button type="button" aria-label="Play ${g.label}">▶</button><div>${g.label}<select class="instr-pick" aria-label="Instrument for ${g.label}">${options}</select></div><div class="loud-bar"><i style="width:${g.percent}%"></i></div><div class="pct">${g.percent}%</div>`;
    row.querySelector('button').addEventListener('click', () => { setSound(true); stopAll(); ensureAudio(); playLoud(g, ctx.currentTime + 0.05); flash(row, 0, LOUD_DUR); });
    const sel = row.querySelector('select'); sel.value = groupInstr[g.id];
    sel.addEventListener('change', () => {
      // one group per instrument: whoever had this instrument takes this group's old one
      const taken = Object.keys(groupInstr).find(id => id !== g.id && groupInstr[id] === sel.value);
      if (taken) groupInstr[taken] = groupInstr[g.id];
      groupInstr[g.id] = sel.value;
      $$('.loud-row').forEach(r => { r.querySelector('select').value = groupInstr[r.dataset.id]; });
      if (soundOn) { stopAll(); ensureAudio(); playLoud(g, ctx.currentTime + 0.05); flash(row, 0, LOUD_DUR); }
    });
    box.append(row);
  }
  return list;
}
function flash(row, delay, dur) { later(delay, () => row.classList.add('now')); later(delay + dur, () => row.classList.remove('now')); }

/* ================= 5. age ================= */
// Same design as the Processing image (AgeEventCompare): each drawing's bottom sits on 0%, its top
// reaches its percentage, original proportions kept, women first in each pair. Drawn live so each
// drawing can be hovered/focused, and redrawn at the screen's width.
const AGE_ART = {   // crop boxes of Julia's drawings (same as the picker)
  women: { href: 'assets/female.png', box: [888, 160, 992, 1644] },
  men: { href: 'assets/male.png', box: [480, 220, 1616, 1652] }
};
let ageState = 'intro';
function buildAge() {
  renderAge();
  let t = 0; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(renderAge, 150); });
}
function renderAge() {
  const wrap = $('#age-wrap'), svg = $('#age-svg'), tip = $('#age-tip');
  const W = wrap.clientWidth || 1000, availH = wrap.clientHeight || 400;
  const L = 52, R = 12, top = 34, labelsH = 62;
  const asp = k => AGE_ART[k].box[2] / AGE_ART[k].box[3];
  // total width in units of plot height: drawings + small gap inside a pair + larger gap between pairs
  const innerGap = 0.05, pairGap = 0.2;
  const units = AGE_EVENT.reduce((s, a) => s + a.women[0] / 100 * asp('women') + a.men[0] / 100 * asp('men'), 0) + 5 * innerGap + 4 * pairGap;
  const plotH = Math.max(80, Math.min((W - L - R) / units, availH - top - labelsH));
  const H = top + plotH + labelsH, base = top + plotH, y = p => base - p / 100 * plotH;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('height', H); svg.replaceChildren();
  const used = units * plotH; let x = L + Math.max(0, (W - L - R - used) / 2);
  // axis: 0% and 100% labels, baseline only
  svg.append(svgEl('line', { x1: L - 6, x2: W - R, y1: base, y2: base, stroke: 'currentColor', 'stroke-width': 1.5 }));
  for (const p of [0, 100]) { const t = svgEl('text', { x: L - 12, y: y(p) + 5, 'text-anchor': 'end', class: 'age-axis' }); t.textContent = p + '%'; svg.append(t); }
  const gaps = svgEl('g', { class: 'age-gaps' });
  AGE_EVENT.forEach((a, i) => {
    const pair = svgEl('g', { class: 'age-pair', 'data-age': a.age }); let pairStart = x, tops = {};
    for (const k of ['women', 'men']) {
      const [pct, lo, hi] = a[k], h = pct / 100 * plotH, w = h * asp(k), [bx, by, bw, bh] = AGE_ART[k].box;
      const g = svgEl('g', { class: 'age-mark', tabindex: 0, role: 'img', 'aria-label': `${k === 'women' ? 'Women' : 'Men'}, ${a.age}: ${pct}% said yes` });
      g.append(svgEl('rect', { x, y: y(pct), width: w, height: h, fill: 'transparent' }));   // hover target
      const art = svgEl('svg', { x, y: y(pct), width: w, height: h, viewBox: `${bx} ${by} ${bw} ${bh}`, preserveAspectRatio: 'xMidYMax meet', overflow: 'visible' });
      art.append(svgEl('image', { href: AGE_ART[k].href, width: 2732, height: 2048, filter: 'url(#red-ink)' }));
      g.append(art);
      const lab = svgEl('text', { x: x + w / 2, y: y(pct) - 8, 'text-anchor': 'middle', class: 'age-pct' }); lab.textContent = pct + '%'; g.append(lab);
      const who = svgEl('text', { x: x + w / 2, y: base + 20, 'text-anchor': 'middle', class: 'age-who' }); who.textContent = k === 'women' ? 'Women' : 'Men'; g.append(who);
      const show = ev => {
        $$('.age-mark').forEach(m => m.classList.toggle('faded', m !== g));
        tip.innerHTML = `<strong>${k === 'women' ? 'Women' : 'Men'}, ${a.age}</strong><br>${pct}% said yes<br><span>95% CI ${lo}–${hi}%</span>`;
        tip.hidden = false;
        const r = wrap.getBoundingClientRect(), px = ev && ev.clientX != null ? ev.clientX - r.left : x + w / 2, py = ev && ev.clientY != null ? ev.clientY - r.top : y(pct);
        tip.style.left = Math.min(px + 14, r.width - 190) + 'px'; tip.style.top = Math.max(0, py - 70) + 'px';
      };
      const hide = () => { $$('.age-mark').forEach(m => m.classList.remove('faded')); tip.hidden = true; };
      g.addEventListener('pointermove', show); g.addEventListener('pointerleave', hide);
      g.addEventListener('focus', () => show(null)); g.addEventListener('blur', hide);
      pair.append(g);
      tops[k] = { x, w, pct };
      x += w + (k === 'women' ? innerGap * plotH : 0);
    }
    const ageLab = svgEl('text', { x: (pairStart + x) / 2, y: base + 48, 'text-anchor': 'middle', class: 'age-band' }); ageLab.textContent = a.age; pair.append(ageLab);
    svg.append(pair);
    // gap bracket between the two tops (shown in the "bands" step for 25–29 and 50–59)
    const gx = tops.women.x + tops.women.w + innerGap * plotH / 2, gap = Math.round(a.men[0] - a.women[0]);
    const br = svgEl('g', { class: 'age-gap', 'data-age': a.age });
    br.append(svgEl('line', { x1: gx, x2: gx, y1: y(a.men[0]), y2: y(a.women[0]), stroke: 'currentColor', 'stroke-width': 2 }));
    for (const p of [a.men[0], a.women[0]]) br.append(svgEl('line', { x1: gx - 5, x2: gx + 5, y1: y(p), y2: y(p), stroke: 'currentColor', 'stroke-width': 2 }));
    const gl = svgEl('text', { x: gx, y: y((a.men[0] + a.women[0]) / 2) + 5, 'text-anchor': 'middle', class: 'age-gap-label' }); gl.textContent = `${gap} pts`;
    br.append(gl); gaps.append(br);
    x += pairGap * plotH;
  });
  svg.append(gaps);
  updateAge(ageState);
}
function updateAge(state) {
  ageState = state;
  const focus = state === 'bands' ? ['25–29', '50–59'] : null;
  $$('.age-pair').forEach(p => p.classList.toggle('dim', state === 'intro' || (!!focus && !focus.includes(p.dataset.age))));
  $$('.age-gap').forEach(g => g.classList.toggle('on', !!focus && focus.includes(g.dataset.age)));
}

/* ================= 6. menu (clickable; number only, no sound) ================= */
let menu = { v: 1, o: 0, h: 0, k: 0 };
function lookupMenu() { return TABLE5.find(r => MENU_ITEMS.every(([k]) => r[k] === menu[k])); }
function buildMenu() {
  const box = document.getElementById('chips');
  for (const [k, label] of MENU_ITEMS) {
    const c = document.createElement('button'); c.type = 'button'; c.className = 'chip'; c.textContent = label; c.dataset.k = k;
    c.addEventListener('click', () => { menu[k] = menu[k] ? 0 : 1; drawMenu(); });
    box.append(c);
  }
}
function drawMenu() {
  document.querySelectorAll('.chip').forEach(c => { c.classList.toggle('on', !!menu[c.dataset.k]); c.setAttribute('aria-pressed', !!menu[c.dataset.k]); });
  const row = lookupMenu(), names = MENU_ITEMS.filter(([k]) => menu[k]).map(([, l]) => l.toLowerCase());
  document.getElementById('menu-pct').textContent = row ? row.p + '%' : '–';
  document.getElementById('menu-caption').innerHTML = row
    ? `of straight women whose last encounter was <strong>${names.length ? names.join(' + ') : 'none of these four'}</strong> usually or always orgasm`
    : 'Too few women reported exactly this combination to show.';
}

/* ================= time to orgasm: the sound lab's crescendo (crowd version) =================
   Each line is one simulated person (MODELED). Pitch rises f0 * 2^(1.5 * t / T), so everyone reaches the
   same top note at their own time T. T ~ LogNormal fitted to a published average (no public distributions
   exist; the spread is an assumption). Model and sources: orgasm_gap_dataset.json models.crescendo_lognormal,
   approved by the student 2026-11-06. A dot = reached orgasm; a line that fades = drawn as not reaching it,
   at a rate from Herbenick et al. (2010). 1 modeled minute = 1 second. */
const CROWD_GROUPS = {
  women_partnered: { label: 'Women, with a partner', short: 'women with a partner', sex: 'f', center: 'mean', min: 14, sigma: 0.532, noP: 0.356,
    note: 'Rowland et al. (2018) average, 14 min; spread borrowed from a stopwatch study (Bhat & Shastry 2020); 35.6% fade out = Herbenick et al. (2010), no orgasm at the most recent event' },
  women_solo: { label: 'Women, on their own', short: 'women on their own', sex: 'f', center: 'mean', min: 8, sigma: 0.532, noP: 0, unknownNo: true,
    note: 'Rowland et al. (2018) average, 8 min; no published rate for not reaching orgasm, so nobody fades out (which overstates it)' },
  men_partnered: { label: 'Men, with a partner', short: 'men with a partner', sex: 'm', center: 'median', min: 5.4, sigma: 0.756, noP: 0.087,
    note: 'a stopwatch study reported in the press: 5.4 min from penetration to ejaculation, not the whole encounter, treated as a median; 8.7% fade out = Herbenick et al. (2010)' }
};
const CROWD_N = 16, CROWD_CLIP = 45, CROWD_OCT = 1.5, CROWD_F0 = { m: 110, f: 196 };
const crowdPick = { a: 'men_partnered', b: 'women_partnered' };
let crowd = null, crowdRun = null, crowdSeed = 7;
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function gauss(rng) { let u = 0; while (!u) u = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng()); }
function rollCrowd() {
  const rng = mulberry32(crowdSeed * 31 + 5);
  crowd = [];
  for (const side of ['a', 'b']) {
    const g = CROWD_GROUPS[crowdPick[side]];
    const mu = g.center === 'median' ? Math.log(g.min) : Math.log(g.min) - g.sigma * g.sigma / 2;
    const k = Math.round(g.noP * CROWD_N), order = [...Array(CROWD_N).keys()];
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    const no = new Set(order.slice(0, k));
    for (let i = 0; i < CROWD_N; i++) {
      const T = Math.min(CROWD_CLIP, Math.exp(mu + g.sigma * gauss(rng)));
      crowd.push({ side, sex: g.sex, T, reaches: !no.has(i), u: 0.45 + 0.4 * rng(), start: rng() * 0.6 });
    }
  }
}
function crowdReadout() {
  return ['a', 'b'].map(side => {
    const g = CROWD_GROUPS[crowdPick[side]], v = crowd.filter(x => x.side === side), ts = v.map(x => x.T).sort((p, q) => p - q);
    const med = (ts[7] + ts[8]) / 2;
    return `<span class="crowd-key ${side}">${g.label}</span>: median of this crowd <strong>${med.toFixed(1)} min</strong>, <strong>${v.filter(x => !x.reaches).length} of ${CROWD_N}</strong> fade out${g.unknownNo ? ' (no published rate)' : ''}.`;
  }).join('<br>');
}
function drawCrowd() {
  const cv = document.getElementById('crowd-canvas'); if (!cv || !crowd) return;
  const dpr = window.devicePixelRatio || 1, Wc = cv.clientWidth, Hc = cv.clientHeight;
  if (cv.width !== Math.round(Wc * dpr)) { cv.width = Math.round(Wc * dpr); cv.height = Math.round(Hc * dpr); }
  const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, Wc, Hc);
  const padL = 14, padR = 14, padT = 16, padB = 34;
  const maxMin = Math.max(10, Math.ceil(crowd.reduce((m, x) => Math.max(m, x.T), 0) / 5) * 5);
  const X = m => padL + (m / maxMin) * (Wc - padL - padR), Y = f => Hc - padB - f * (Hc - padB - padT);
  const nowMin = crowdRun ? (ctx.currentTime - crowdRun.t0) : null;
  c.font = '14px "ABC Gramercy Trial", Georgia, serif'; c.textBaseline = 'alphabetic';
  for (let m = 0; m <= maxMin; m += 5) {
    c.strokeStyle = 'rgba(207,11,46,.12)'; c.lineWidth = 1; c.beginPath(); c.moveTo(X(m), padT); c.lineTo(X(m), Hc - padB); c.stroke();
    c.fillStyle = '#cf0b2e'; c.fillText(m === 0 ? '0 min (modeled)' : String(m), X(m) - (m === 0 ? 2 : 6), Hc - 10);
  }
  for (const v of crowd) {
    const rgb = v.side === 'a' ? '207,11,46' : '17,17,17', base = 0.85;   // first group red, second group black
    const startMin = crowdRun ? v.start : 0, stopMin = v.reaches ? v.T : v.T * v.u;
    const shown = nowMin == null ? stopMin : Math.min(stopMin, nowMin - startMin);
    if (shown <= 0) continue;
    const steps = 40;
    for (let i = 0; i < steps; i++) {
      const m0 = shown * i / steps, m1 = shown * (i + 1) / steps;
      let a = base * (nowMin == null ? 0.7 : 1);
      if (!v.reaches) a *= 1 - Math.pow(m1 / stopMin, 3) * 0.9;   // fading lines thin out
      c.strokeStyle = `rgba(${rgb},${a})`; c.lineWidth = 2;
      c.beginPath(); c.moveTo(X(startMin + m0), Y(m0 / v.T)); c.lineTo(X(startMin + m1), Y(m1 / v.T)); c.stroke();
    }
    if (v.reaches && shown >= v.T) { c.fillStyle = `rgb(${rgb})`; c.beginPath(); c.arc(X(startMin + v.T), Y(1), 5, 0, Math.PI * 2); c.fill(); }
  }
  if (nowMin != null) { c.strokeStyle = 'rgba(207,11,46,.5)'; c.lineWidth = 1; c.beginPath(); c.moveTo(X(nowMin), padT); c.lineTo(X(nowMin), Hc - padB); c.stroke(); }
}
function showCrowd() {
  rollCrowd(); drawCrowd();
  document.getElementById('crowd-readout').innerHTML = crowdReadout();
  document.getElementById('crowd-notes').innerHTML = ['a', 'b'].filter((s, i, arr) => arr.findIndex(t => crowdPick[t] === crowdPick[s]) === i)
    .map(s => `<strong>${CROWD_GROUPS[crowdPick[s]].label}:</strong> ${CROWD_GROUPS[crowdPick[s]].note}.`).join(' ');
}
function buildCrowd() {
  for (const side of ['a', 'b']) {
    const sel = document.getElementById('crowd-' + side);
    for (const [id, g] of Object.entries(CROWD_GROUPS)) { const o = document.createElement('option'); o.value = id; o.textContent = g.label; sel.append(o); }
    sel.value = crowdPick[side];
    sel.addEventListener('change', () => { crowdPick[side] = sel.value; stopAll(); showCrowd(); });
  }
  document.getElementById('crowd-new').addEventListener('click', () => { crowdSeed++; stopAll(); showCrowd(); });
  for (const [id, opts, def] of [['crowd-tone', CRESC_TONES, 'triangle'], ['crowd-finish', CRESC_FINISH, 'yay']]) {
    const sel = document.getElementById(id);
    for (const [k, l] of Object.entries(opts)) { const o = document.createElement('option'); o.value = k; o.textContent = l; sel.append(o); }
    sel.value = def; sel.addEventListener('change', () => stopAll());
  }
  let t = 0; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(drawCrowd, 150); });
  showCrowd();
}
// Sound options (from the sound lab): the rising sound, and the sound at the finish.
// Human sounds climb in each person's register (men lower); abstract tones share one starting note.
const CRESC_TONES = { triangle: 'Soft tone', sine: 'Pure tone', sawtooth: 'Bright tone' };
const CRESC_FINISH = { yay: 'Yay', woo: 'Woo', bell: 'Bell', grunt: 'Grunt (tennis)' };
const ABSTRACT_F0 = 150;
function crescTone() { return document.getElementById('crowd-tone').value; }
function crescFinish() { return document.getElementById('crowd-finish').value; }
// Finish sounds follow the sound lab: the student's one picked clip for that gender, and if there is
// none (women's woo) a synthesized one in that voice, never another gender's clip or another sound.
function playFinish(sex, t, out) {
  const kind = crescFinish();
  if (kind === 'grunt') { playGrunt(sex, t, out, 1.3); return; }
  if (kind === 'woo') {
    if (playRec('woo', sex, t, out, 1, 1.4)) return;
    const dur = 0.85, vt = sex === 'm' ? 220 : 440, g = ctx.createGain(); g.connect(out);   // "woo!": an "oo" whooping up
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.06, t + 0.08);
    g.gain.linearRampToValueAtTime(0.045, t + dur * 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const v = makeVoice(t, t + dur + 0.05, g, 0.3, sex === 'f' ? 6.3 : 4, 'u', sex);
    v.freq.setValueAtTime(vt * 0.85, t); v.freq.exponentialRampToValueAtTime(vt * 1.35, t + dur * 0.35); v.freq.exponentialRampToValueAtTime(vt * 1.15, t + dur);
    return;
  }
  if (kind === 'bell') {   // men's bell an octave below women's; men's +3.4 dB to sound as loud
    const b = ctx.createOscillator(); b.type = 'sine'; b.frequency.value = sex === 'm' ? 440 : 880;
    const bg = ctx.createGain(); bg.gain.setValueAtTime(0.0001, t); bg.gain.linearRampToValueAtTime(sex === 'm' ? 0.089 : 0.06, t + 0.01);
    bg.gain.exponentialRampToValueAtTime(0.0001, t + 1.4); b.connect(bg); bg.connect(out); b.start(t); b.stop(t + 1.5);
    return;
  }
  playYay(sex, t, out, 0.6);
}
function playGrunt(sex, t, out, level) {   // recorded grunt in that voice, or a synthesized one
  if (playRec('grunt', sex, t, out, level, 1.2)) return;
  const dur = 0.22, freq = VOX[sex].f0 * 1.1, g = ctx.createGain(); g.connect(out);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.06 * level, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const v = makeVoice(t, t + dur + 0.05, g, 0.7, 4, 'a', sex);
  v.freq.setValueAtTime(freq * 0.9, t); v.freq.exponentialRampToValueAtTime(freq * 0.7, t + dur);
}
// one person's crescendo: climbs 1.5 octaves to their time T, then the finish sound; or fades out and sighs
function playRise(v, t, out) {
  const tone = crescTone(), T = v.T;
  const human = false, f0 = ABSTRACT_F0, top = f0 * Math.pow(2, CROWD_OCT);
  const g = ctx.createGain(); g.connect(out);
  const stopT = v.reaches ? t + T + 0.4 : t + T * v.u + 2.6;
  let freq;
  if (human) freq = makeVoice(t, stopT, g, 0.15, 3.4, 'a', v.sex).freq;
  else {
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(700, t); lp.frequency.exponentialRampToValueAtTime(2600, t + T);
    const o = ctx.createOscillator(); o.type = tone; o.connect(lp); lp.connect(g); o.start(t); o.stop(stopT);
    freq = o.frequency;
  }
  freq.setValueAtTime(f0, t); freq.exponentialRampToValueAtTime(top, t + T);   // f0 * 2^(1.5 t / T)
  const peakG = tone === 'sawtooth' ? 0.05 : 0.045;
  g.gain.setValueAtTime(0.0001, t);
  if (v.reaches) {
    g.gain.exponentialRampToValueAtTime(peakG, t + T); g.gain.exponentialRampToValueAtTime(0.0001, t + T + 0.35);
    playFinish(v.sex, t + T, out);
  } else {
    const fadeAt = t + T * v.u, peak = 0.0001 * Math.pow(peakG / 0.0001, v.u);
    g.gain.exponentialRampToValueAtTime(peak, fadeAt); g.gain.linearRampToValueAtTime(0.0001, fadeAt + 2.5);
    playSad(v.sex, fadeAt + 0.8, out, 0.6);
  }
}
async function playCrowd(btn) {
  await Promise.race([samplesReady, new Promise(r => setTimeout(r, 3000))]);
  if (!btn.classList.contains('on')) return;
  const t0 = ctx.currentTime + 0.1; let end = t0;
  const outA = panNode(-0.6), outB = panNode(0.6);
  for (const v of crowd) {
    const t = t0 + v.start; playRise(v, t, v.side === 'a' ? outA : outB);
    end = Math.max(end, t + v.T * (v.reaches ? 1 : v.u) + 2.6);
  }
  crowdRun = { t0 };
  let raf = 0; const frame = () => { drawCrowd(); if (crowdRun) raf = requestAnimationFrame(frame); }; raf = requestAnimationFrame(frame);
  onStop.push(() => { crowdRun = null; cancelAnimationFrame(raf); drawCrowd(); });
  later(end - ctx.currentTime, () => { btn.classList.remove('on'); crowdRun = null; drawCrowd(); });
}

/* ================= 7. pairing drawings, solo vs partner ================= */
async function alphaBox(src) {   // trims the transparent margin, like the Processing size sketch
  const img = new Image(); img.src = src; await img.decode();
  const s = 4, w = Math.ceil(img.naturalWidth / s), h = Math.ceil(img.naturalHeight / s);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const c = cv.getContext('2d'); c.drawImage(img, 0, 0, w, h);
  const d = c.getImageData(0, 0, w, h).data; let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 20) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return { W: img.naturalWidth, H: img.naturalHeight, x: x0 * s, y: y0 * s, w: (x1 - x0 + 1) * s, h: (y1 - y0 + 1) * s };
}
function buildPairing() {
  // Every drawing gets the same bounding-box area (proportions kept), like the Processing sketch:
  // with the tallest (the finger) as 1, each height is sqrt(A / aspect) with A = the finger's aspect.
  const asp = p => p.box[2] / p.box[3], A = Math.min(...PAIRING.map(asp));
  const row = document.getElementById('pairing-row');
  PAIRING.forEach(p => {
    const [x, y, w, h] = p.box, rel = Math.sqrt(A / asp(p));
    const cell = document.createElement('div'); cell.className = 'pair-item'; cell.tabIndex = 0;
    cell.setAttribute('aria-label', `${p.label}: ${p.pct}% said yes`);
    // the percentage sits centred over the drawing and fades in on hover/focus
    cell.innerHTML = `<div class="pair-art"><svg viewBox="${x} ${y} ${w} ${h}" style="height:calc(var(--pair-h) * ${rel.toFixed(4)})" aria-hidden="true"><image href="${p.file}" width="2732" height="2048" filter="url(#red-ink)"/></svg><div class="pair-pct" aria-hidden="true">${p.pct}%</div></div>
      <div class="pair-label">${p.label}</div>`;
    row.append(cell);
  });
}

/* ================= 8. non-monogamy ================= */
function buildCnm() {
  const svg = $('#cnm-chart'), L = 250, R = 700, lo = -0.3, hi = 0.3, X = v => L + (v - lo) / (hi - lo) * (R - L);
  svg.append(svgEl('line', { x1: X(0), x2: X(0), y1: 10, y2: 170, stroke: 'currentColor', 'stroke-width': 1.5 }));
  const z = svgEl('text', { x: X(0), y: 195, 'text-anchor': 'middle', 'font-size': 16 }); z.textContent = 'no difference'; svg.append(z);
  const l1 = svgEl('text', { x: X(0) - 12, y: 228, 'text-anchor': 'end', 'font-size': 14, 'font-style': 'italic' }); l1.textContent = '← monogamous more satisfied'; svg.append(l1);
  const l2 = svgEl('text', { x: X(0) + 12, y: 228, 'font-size': 14, 'font-style': 'italic' }); l2.textContent = 'non-monogamous more satisfied →'; svg.append(l2);
  CNM.forEach((c, i) => {
    const yy = 55 + i * 80;
    const t = svgEl('text', { x: 0, y: yy + 6, 'font-size': 19 }); t.textContent = c.label; svg.append(t);
    const s = svgEl('text', { x: 0, y: yy + 28, 'font-size': 14, 'font-style': 'italic' }); s.textContent = `${c.k} studies`; svg.append(s);
    svg.append(svgEl('line', { x1: X(c.lo), x2: X(c.hi), y1: yy, y2: yy, stroke: 'currentColor', 'stroke-width': 3, 'stroke-linecap': 'round' }));
    svg.append(svgEl('circle', { cx: X(c.g), cy: yy, r: 8, fill: 'currentColor' }));
  });
}

/* ================= scroll ================= */
const SCENES = {
  rings: st => updateRings(st),
  nights: () => drawNights(),
  loud: () => {},
  crowd: () => drawCrowd(),
  age: st => updateAge(st),
  menu: st => {
    if (st === 'vaginal') menu = { v: 1, o: 0, h: 0, k: 0 };
    if (st === 'full') menu = { v: 0, o: 1, h: 1, k: 1 };
    drawMenu();
  }
};
let active = { step: null, scene: null };
function activate(step) {
  if (active.step === step) return;
  const section = step.closest('.scrolly'), sc = step.dataset.scene;
  if (active.scene && active.scene !== sc) stopAll();   // leaving a scene stops its sound
  active = { step, scene: sc };
  $$('.step').forEach(s => s.classList.toggle('is-active', s === step));
  section.querySelectorAll('.scene').forEach(s => s.classList.toggle('on', s.dataset.scene === sc));
  SCENES[sc](step.dataset.state);
}

function init() {
  // always open at the title (a reload would otherwise land mid-page)
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  initPicker(); buildRings(); buildPairPick(); planNights(); drawNights(); const loudList = buildLoud();
  buildAge(); buildMenu(); drawMenu(); buildPairing(); buildCrowd();
  $$('.scrolly').forEach(s => { const first = s.querySelector('.step'); s.querySelectorAll('.scene').forEach(x => x.classList.toggle('on', x.dataset.scene === first.dataset.scene)); SCENES[first.dataset.scene](first.dataset.state); });
  updateAge('intro');

  $('#sound').addEventListener('click', () => setSound(!soundOn));
  hear($('#hear-nights'), async btn => {
    planNights(); drawNights(0);
    await Promise.race([samplesReady, new Promise(r => setTimeout(r, 3000))]);   // first play: wait for the clips
    if (!btn.classList.contains('on')) return;
    const t0 = ctx.currentTime + 0.15, gap = 0.75, outA = panNode(-0.6), outB = panNode(0.6);
    const sa = GROUPS[pair.a].sex, sb = GROUPS[pair.b].sex;
    for (let i = 0; i < NIGHTS; i++) {
      const t = t0 + i * gap, a = nightPlan.a[i], b = nightPlan.b[i];
      a ? playGotThere(sa, t, outA) : playMissed(sa, t, outA);
      b ? playGotThere(sb, t + 0.05, outB) : playMissed(sb, t + 0.05, outB);
      atAudio(t, () => drawNights(i + 1, i));
    }
    onStop.push(() => drawNights());
    later(0.15 + NIGHTS * gap + 2, () => { btn.classList.remove('on'); drawNights(); });
  });
  hear($('#hear-loud-seq'), btn => {
    const rows = $$('.loud-row'), t0 = ctx.currentTime + 0.1, step = LOUD_DUR + 0.5;
    loudList.forEach((g, i) => { playLoud(g, t0 + i * step); flash(rows[i], 0.1 + i * step, LOUD_DUR); });
    later(0.1 + loudList.length * step, () => btn.classList.remove('on'));
  });
  hear($('#hear-loud-all'), btn => {
    const rows = $$('.loud-row'), t0 = ctx.currentTime + 0.1;
    loudList.forEach((g, i) => { playLoud(g, t0, 4); flash(rows[i], 0.1, 4); });
    later(4.3, () => btn.classList.remove('on'));
  });
  // (the 20-woman crescendo in the menu section was removed at the student's request)
  hear(document.getElementById('crowd-play'), playCrowd);

  // the step that crosses the trigger line becomes active: mid-screen on wide layouts,
  // lower down on narrow ones where the graphic is pinned over the top ~58% of the screen
  let io = null;
  const narrowQuery = matchMedia('(max-width: 860px)');
  const observe = () => {
    if (io) io.disconnect();
    io = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) activate(e.target); },
      { rootMargin: narrowQuery.matches ? '-72% 0px -24% 0px' : '-45% 0px -45% 0px' });
    $$('.step').forEach(s => io.observe(s));
  };
  observe();
  narrowQuery.addEventListener('change', observe);
}
init();
