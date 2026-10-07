const KEYS = {
  sessions: 'studyCatSessions',
  tags: 'studyCatTags',
  prefs: 'studyCatPrefs',
  running: 'studyCatRunning',
  coins: 'studyCatCoins',
  shop: 'studyCatShop',
  admin: 'studyCatAdmin',
  bond: 'studyCatBond'
};
const TAG_COLORS = ['#E07A5F', '#E6B655', '#6FA88C', '#5BA8B5', '#7B93D6', '#B08BD0'];
const UNDERSTANDING_LABEL = { '1': 'もう少し', '2': 'まあまあ', '3': 'バッチリ' };
const RING_RADIUS = 54;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const MIN_MINUTES = 10;
const MAX_MINUTES = 120;
const DEV_CODE = 'matatabi';
const UPDATED_FLAG = 'studyCatJustUpdated';
const MORNING_START = 6;
const MORNING_END = 10;
const BOND_STAGES = [
  { name: 'はじめまして', days: 0, voice: '…', rate: 10 },
  { name: 'なれてきた', days: 3, voice: 'にゃ？', rate: 11 },
  { name: 'なかよし', days: 10, voice: 'にゃーん', rate: 12 },
  { name: 'だいすき', days: 30, voice: 'すりすり', rate: 13 },
  { name: 'あいぼう', days: 60, voice: 'ごろにゃん', rate: 14 },
  { name: 'かぞく', days: 100, voice: 'ごろごろ', rate: 15 }
];
const GOAL_OPTIONS = [10, 15, 30, 60, 90, 120];
const SULK_DAYS = 2;
const AWAY_DAYS = 4;
const SKILL_STAGE = 2;
const NIGHT_HOUR = 18;
const STAMINA_MINUTES = 60;
const HEART_PATH = 'M12 20.5s-7.5-4.6-7.5-10.2C4.5 7.4 6.6 5.5 9 5.5c1.4 0 2.4.7 3 1.6.6-.9 1.6-1.6 3-1.6 2.4 0 4.5 1.9 4.5 4.8 0 5.6-7.5 10.2-7.5 10.2z';

const SHOP = {
  cat: [
    { id: 'cat-noir', name: 'ノワール', price: 0, skill: { id: 'night', name: '夜型', text: '18時以降に始めた勉強でコイン ×1.5' }, images: { idle: 'images/cat-sleep.jpg', running: 'images/cat-back.jpg', done: 'images/cat-sit.jpg' } },
    { id: 'cat-luna', name: 'ルナ', price: 600, skill: { id: 'morning', name: '朝型', text: '朝活ボーナスが ×2 から ×3 に' }, images: { idle: 'images/cat-white-sleep.jpg', running: 'images/cat-white-back.jpg', done: 'images/cat-white-sit.jpg' } },
    { id: 'cat-mike', name: 'ミケ', price: 1000, skill: { id: 'friendly', name: '人なつっこい', text: '目標を達成した日、なつき度 +2日' }, images: { idle: 'images/cat-calico-sleep.jpg', running: 'images/cat-calico-back.jpg', done: 'images/cat-calico-sit.jpg' } },
    { id: 'cat-moka', name: 'モカ', price: 2000, skill: { id: 'calm', name: 'のんびり屋', text: 'すねるまで4日、家出まで6日' }, images: { idle: 'images/cat-scottish-sleep.jpg', running: 'images/cat-scottish-back.jpg', done: 'images/cat-scottish-sit.jpg' } },
    { id: 'cat-leo', name: 'レオ', price: 3000, skill: { id: 'stamina', name: '体力自慢', text: '1回60分以上の勉強でコイン ×1.5' }, images: { idle: 'images/cat-bengal-sleep.jpg', running: 'images/cat-bengal-back.jpg', done: 'images/cat-bengal-sit.jpg' } }
  ],
  gauge: [
    { id: 'gauge-wakaba', name: '若葉', price: 0, color: '#6FA88C' },
    { id: 'gauge-kohaku', name: '琥珀', price: 50, color: '#E6B655' },
    { id: 'gauge-sakura', name: '桜', price: 50, color: '#E8A0B4' },
    { id: 'gauge-mizu', name: '水色', price: 50, color: '#5FC4D0' },
    { id: 'gauge-hotaru', name: '蛍', price: 100, color: '#9AF0C0', glow: true },
    { id: 'gauge-yubae', name: '夕映え', price: 150, color: '#7B93D6', gradientTo: '#E8A0B4' },
    { id: 'gauge-laser', name: 'レーザーポインター', price: 1000, color: '#FF2A2A', neon: true }
  ],
  knob: [
    { id: 'knob-circle', name: '丸', price: 0 },
    { id: 'knob-paw', name: '肉球', price: 500 }
  ],
  theme: [
    { id: 'theme-mayonaka', name: '真夜中', price: 0, bg: '#1d1a4a' },
    { id: 'theme-mori', name: '森', price: 150, bg: '#2f5a46' },
    { id: 'theme-yoi', name: '宵', price: 150, bg: '#4a3270' },
    { id: 'theme-danro', name: '暖炉', price: 150, bg: '#6a3a25' },
    { id: 'theme-sakura', name: '桜', price: 150, bg: '#8a4a62' },
    { id: 'theme-umi', name: '海', price: 150, bg: '#1f5f86' },
    { id: 'theme-maccha', name: '抹茶', price: 150, bg: '#55703a' },
    { id: 'theme-sumi', name: '墨', price: 150, bg: '#3a3a3e' },
    { id: 'theme-yozakura', name: '夜桜', price: 250, bg: '#4a2038', gradient: 'linear-gradient(180deg, #b0607e 0%, #4a2038 75%)' },
    { id: 'theme-shinkai', name: '深海', price: 250, bg: '#0f3550', gradient: 'linear-gradient(180deg, #2a7fa8 0%, #0f3550 80%)' },
    { id: 'theme-yuyake', name: '夕焼け', price: 250, bg: '#6a2e3a', gradient: 'linear-gradient(180deg, #d0704a 0%, #6a2e3a 80%)' },
    { id: 'theme-aurora', name: 'オーロラ', price: 250, bg: '#1d1a4a', gradient: 'linear-gradient(180deg, #3fa08a 0%, #3a3280 60%, #1d1a4a 100%)' },
    { id: 'theme-matte', name: 'マットブラック', price: 500, bg: '#0d0d0d', texture: true },
    { id: 'theme-minato', name: '月夜の港', price: 1000, bg: '#0b1430', image: 'images/wall-minato.jpg', thumb: 'images/wall-minato-thumb.jpg' },
    { id: 'theme-kogen', name: '高原', price: 1000, bg: '#0f1d24', image: 'images/wall-kogen.jpg', thumb: 'images/wall-kogen-thumb.jpg' },
    { id: 'theme-asa', name: '朝のひととき', morningGoal: 7, bg: '#14141c', image: 'images/wall-asa.jpg', thumb: 'images/wall-asa-thumb.jpg' }
  ]
};
const DEFAULT_EQUIP = { cat: 'cat-noir', gauge: 'gauge-wakaba', knob: 'knob-circle', theme: 'theme-mayonaka' };
const STORE_SECTIONS = {
  cat: [['cat', null]],
  gauge: [['gauge', '色'], ['knob', 'つまみ']],
  theme: [['theme', null]]
};
const WALL_DIM = 'linear-gradient(rgba(8, 6, 26, 0.25), rgba(8, 6, 26, 0.45))';
const PAW_SCALE = 0.78;
const MATTE_TEXTURE = `url('data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.07 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}')`;

localStorage.removeItem('studyCatLogs');

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let tags = load(KEYS.tags, []);
if (tags.length === 0) {
  tags = [{ id: 1, name: '勉強', color: TAG_COLORS[2] }];
  save(KEYS.tags, tags);
}
let prefs = load(KEYS.prefs, { minutes: 25, tagId: tags[0].id });
let running = load(KEYS.running, null);
let coins = load(KEYS.coins, 0);
let shop = { owned: [], ...DEFAULT_EQUIP, ...load(KEYS.shop, {}) };
let isAdmin = load(KEYS.admin, false);
let bond = { days: {}, goal: 30, goalAsked: false, creditDate: null, penaltyBase: null, penaltyApplied: 0, returnDate: null, devLastStudy: null, ...load(KEYS.bond, {}) };
let tickTimer = null;
let lastStudyDate = null;

const $ = id => document.getElementById(id);
const timerView = $('timer-view');
const catRing = document.querySelector('.cat-ring');
const ring = $('ring');
const ringProgress = $('ring-progress');
const ringKnob = $('ring-knob');
const ringPaw = $('ring-paw');
const ringCore = $('ring-core');
const catImg = $('cat-img');
const tagBtn = $('btn-tag');
const tagDot = $('tag-dot');
const tagNameEl = $('tag-name');
const timerDisplay = $('timer-display');
const startBtn = $('btn-start');
const drawer = $('drawer');
const logList = $('log-list');
const tagList = $('tag-list');
const storeGrid = $('store-grid');
const storeSeg = $('store-seg');
const setupSheet = $('setup-sheet');
const minuteRow = $('minute-row');
const sheetTags = $('sheet-tags');
const tagModal = $('tag-modal');
const tagModalName = $('tag-modal-name');
const tagModalColors = $('tag-modal-colors');
const tagModalDelete = $('tag-modal-delete');
const doneModal = $('done-modal');
const doneMemo = $('done-memo');
const understandingSelect = $('understanding-select');
const confirmModal = $('confirm-modal');

ringProgress.style.strokeDasharray = RING_LENGTH;
ringCore.style.strokeDasharray = RING_LENGTH;

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function dateStr(ms) {
  const d = new Date(ms);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return `${y}/${Number(m)}/${Number(d)}`;
}

function formatDay(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return `${m}月${d}日（${WEEKDAYS[new Date(y, m - 1, d).getDay()]}）`;
}

function formatClock(ms) {
  const d = new Date(ms);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatRange(session) {
  return `${formatClock(session.startAt ?? session.id - session.minutes * 60000)}〜${formatClock(session.id)}`;
}

function sessionTag(session) {
  const tag = findTag(session.tagId);
  return tag
    ? { key: `id-${tag.id}`, name: tag.name, color: tag.color }
    : { key: `name-${session.tagName}`, name: session.tagName, color: 'var(--text-sub)' };
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function findTag(id) {
  return tags.find(t => t.id === id);
}

function currentTag() {
  return findTag(prefs.tagId) || tags[0];
}

function savePrefs() {
  save(KEYS.prefs, prefs);
}

function isItemUnlocked(item) {
  if (isAdmin) return true;
  return item.price === 0 || shop.owned.includes(item.id);
}

function morningCount() {
  return load(KEYS.sessions, []).filter(s => s.morning).length;
}

function grantMorningRewards() {
  const earned = SHOP.theme.filter(item => item.morningGoal && !shop.owned.includes(item.id) && morningCount() >= item.morningGoal);
  earned.forEach(item => shop.owned.push(item.id));
  if (earned.length) save(KEYS.shop, shop);
  return earned;
}

function equippedItem(category) {
  const item = SHOP[category].find(i => i.id === shop[category]);
  return item && isItemUnlocked(item) ? item : SHOP[category][0];
}

function minuteOptions() {
  const options = [];
  for (let m = MIN_MINUTES; m <= MAX_MINUTES; m += 5) options.push(m);
  return options;
}

function renderCoins() {
  document.querySelectorAll('.coin-count').forEach(el => {
    el.textContent = coins.toLocaleString();
  });
}

function applyGauge() {
  const item = equippedItem('gauge');
  ring.style.setProperty('--gauge', item.color);
  ring.classList.toggle('glow', !!item.glow);
  ring.classList.toggle('neon', !!item.neon);
  if (item.gradientTo) {
    $('gauge-gradient-from').setAttribute('stop-color', item.color);
    $('gauge-gradient-to').setAttribute('stop-color', item.gradientTo);
    ringProgress.style.stroke = 'url(#gauge-gradient)';
  } else {
    ringProgress.style.stroke = '';
  }
}

function wallBackground(item) {
  if (item.image) return `${WALL_DIM}, url(${item.image}) center / cover no-repeat, ${item.bg}`;
  if (item.gradient) return `${item.gradient}, ${item.bg}`;
  if (item.texture) return `${MATTE_TEXTURE}, ${item.bg}`;
  return item.bg;
}

function applyTheme() {
  const item = equippedItem('theme');
  document.documentElement.style.setProperty('--bg', item.bg);
  document.body.style.background = wallBackground(item);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', item.bg);
}

function applyKnob() {
  const paw = equippedItem('knob').id === 'knob-paw';
  ring.classList.toggle('paw', paw);
}

function applyCat() {
  $('done-cat').src = equippedItem('cat').images.done;
  renderBond();
}

function updateLastStudyDate() {
  const dates = load(KEYS.sessions, []).map(s => s.date).sort();
  lastStudyDate = dates[dates.length - 1] || null;
}

function catState() {
  if (running) return 'running';
  return lastStudyDate === dateStr(Date.now()) ? 'done' : 'idle';
}

function setCat(state) {
  const mood = bondMood();
  timerView.classList.toggle('is-sulk', mood === 'sulk' && state !== 'running');
  timerView.classList.toggle('is-away', mood === 'away');
  const src = equippedItem('cat').images[mood === 'sulk' ? 'running' : state];
  if (catImg.getAttribute('src') !== src) catImg.src = src;
  renderBubble();
}

function saveBond() {
  save(KEYS.bond, bond);
}

function daysBetween(from, to) {
  const [fy, fm, fd] = from.split('-').map(Number);
  const [ty, tm, td] = to.split('-').map(Number);
  return Math.round((new Date(ty, tm - 1, td) - new Date(fy, fm - 1, fd)) / 86400000);
}

function bondLastStudy() {
  return isAdmin && bond.devLastStudy ? bond.devLastStudy : lastStudyDate;
}

function missedDays() {
  const last = bondLastStudy();
  if (!last) return 0;
  return Math.max(daysBetween(last, dateStr(Date.now())) - 1, 0);
}

function skillReady(catId = equippedItem('cat').id) {
  return stageIndex(catBondDays(catId)) >= SKILL_STAGE;
}

function hasSkill(id) {
  const cat = equippedItem('cat');
  return cat.skill.id === id && skillReady(cat.id);
}

function moodDays() {
  return hasSkill('calm') ? { sulk: SULK_DAYS + 2, away: AWAY_DAYS + 2 } : { sulk: SULK_DAYS, away: AWAY_DAYS };
}

function bondMood() {
  const missed = missedDays();
  const limits = moodDays();
  if (missed >= limits.away) return 'away';
  if (missed >= limits.sulk) return 'sulk';
  return 'normal';
}

function activeSkill(id) {
  return hasSkill(id) && bondMood() === 'normal';
}

function morningRate() {
  return activeSkill('morning') ? 3 : 2;
}

function catBondDays(catId = equippedItem('cat').id) {
  return bond.days[catId] || 0;
}

function addBondDays(delta) {
  const catId = equippedItem('cat').id;
  bond.days[catId] = Math.max(catBondDays(catId) + delta, 0);
}

function applyBondPenalty() {
  const target = Math.max(missedDays() - moodDays().away + 1, 0);
  const base = bondLastStudy();
  if (bond.penaltyBase !== base) {
    bond.penaltyBase = base;
    bond.penaltyApplied = 0;
  }
  if (target > bond.penaltyApplied) {
    addBondDays(bond.penaltyApplied - target);
    bond.penaltyApplied = target;
  }
  saveBond();
}

function todayMinutes() {
  const today = dateStr(Date.now());
  return load(KEYS.sessions, []).filter(s => s.date === today).reduce((sum, s) => sum + s.minutes, 0);
}

function creditBond() {
  const today = dateStr(Date.now());
  if (bond.creditDate === today || todayMinutes() < bond.goal) return 0;
  const gain = activeSkill('friendly') ? 2 : 1;
  addBondDays(gain);
  bond.creditDate = today;
  saveBond();
  return gain;
}

function stageIndex(days) {
  let index = 0;
  BOND_STAGES.forEach((stage, i) => {
    if (days >= stage.days) index = i;
  });
  return index;
}

function formatRate(rate) {
  return `×${(rate / 10).toFixed(1)}`;
}

function heartsHtml(count) {
  return BOND_STAGES.slice(1).map((_, i) =>
    `<svg class="heart-icon${i < count ? ' on' : ''}" viewBox="0 0 24 24"><path d="${HEART_PATH}" /></svg>`
  ).join('');
}

let bubbleTimer = null;
let bubbleVoice = null;

function renderBubble() {
  const mood = bondMood();
  let text = mood === 'away' ? null : bubbleVoice;
  if (!text && !running && mood === 'sulk') text = 'ぷい';
  if (!text && !running && mood === 'normal' && bond.returnDate === dateStr(Date.now())) text = 'ただいま';
  const bubble = $('cat-bubble');
  bubble.hidden = !text;
  bubble.textContent = text || '';
}

function speak() {
  const mood = bondMood();
  if (mood === 'away') return;
  bubbleVoice = mood === 'sulk' ? 'ふん' : BOND_STAGES[stageIndex(catBondDays())].voice;
  renderBubble();
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => {
    bubbleVoice = null;
    renderBubble();
  }, 2000);
}

function renderBond() {
  applyBondPenalty();
  const mood = bondMood();
  const cat = equippedItem('cat');
  const days = catBondDays(cat.id);
  const index = stageIndex(days);
  $('bond-days').textContent = days;
  $('home-bond').classList.toggle('sad', mood !== 'normal');

  $('bond-me-cat').src = cat.images.done;
  $('bond-me-name').textContent = cat.name;
  $('bond-me-stage').textContent = BOND_STAGES[index].name;
  $('bond-me-hearts').innerHTML = heartsHtml(index);
  $('bond-me-days').textContent = `${days}日`;
  $('bond-me-rate').textContent = `コイン ${formatRate(BOND_STAGES[index].rate)}`;
  $('bond-skill-name').textContent = `スキル：${cat.skill.name}`;
  $('bond-skill-text').textContent = cat.skill.text;
  const skillLeft = BOND_STAGES[SKILL_STAGE].days - days;
  $('bond-skill-state').textContent = skillLeft > 0
    ? `${BOND_STAGES[SKILL_STAGE].name}から使えます（あと${skillLeft}日）`
    : mood === 'normal' ? '使えます' : '機嫌が直ると使えます';
  $('bond-skill').classList.toggle('ready', skillLeft <= 0 && mood === 'normal');
  $('bond-me-mood').hidden = mood === 'normal';
  $('bond-me-mood').textContent = mood === 'away' ? '家出中です。勉強すると帰ってきます' : 'すねています。勉強すると機嫌が直ります';

  const next = BOND_STAGES[index + 1];
  if (next) {
    const current = BOND_STAGES[index];
    $('bond-next-label').textContent = `${next.name} まで`;
    $('bond-next-left').textContent = `あと${next.days - days}日`;
    $('bond-bar').style.width = `${(days - current.days) / (next.days - current.days) * 100}%`;
  } else {
    $('bond-next-label').textContent = 'いちばん上の段階です';
    $('bond-next-left').textContent = '';
    $('bond-bar').style.width = '100%';
  }

  const total = todayMinutes();
  $('bond-today-value').textContent = `${Math.min(total, bond.goal)} / ${bond.goal}分 ›`;
  $('bond-today-note').textContent = bond.creditDate === dateStr(Date.now())
    ? '今日は +1日 しました'
    : `あと${Math.max(bond.goal - total, 0)}分で +1日`;

  $('bond-stages').innerHTML = BOND_STAGES.map((stage, i) =>
    `<div class="bond-stage${i === index ? ' current' : ''}"><span class="bond-hearts">${heartsHtml(i)}</span><span class="bond-stage-name">${stage.name}</span><span class="bond-stage-days">${stage.days}日</span><span class="bond-stage-rate">${formatRate(stage.rate)}</span></div>`
  ).join('');
  setCat(catState());
}

function renderGoalSheet() {
  $('goal-grid').innerHTML = GOAL_OPTIONS.map(m =>
    `<button type="button" class="minute-btn${m === bond.goal ? ' selected' : ''}" data-goal="${m}">${m}分</button>`
  ).join('');
}

function openGoalSheet() {
  bond.goalAsked = true;
  saveBond();
  renderGoalSheet();
  $('goal-sheet').classList.add('show');
}

function closeGoalSheet() {
  $('goal-sheet').classList.remove('show');
}

function setGauge(ratio, backward = false) {
  const clamped = Math.min(ratio, 1);
  const angle = clamped * 2 * Math.PI;
  ringProgress.style.strokeDashoffset = RING_LENGTH * (1 - clamped);
  ringCore.style.strokeDashoffset = RING_LENGTH * (1 - clamped);
  const x = 60 + RING_RADIUS * Math.cos(angle);
  const y = 60 + RING_RADIUS * Math.sin(angle);
  ringKnob.setAttribute('cx', x);
  ringKnob.setAttribute('cy', y);
  ringPaw.setAttribute('transform', `translate(${x} ${y}) rotate(${clamped * 360 + (backward ? 0 : 180)}) scale(${PAW_SCALE}) translate(-12 -12)`);
}

function renderTimer() {
  const tag = running
    ? (findTag(running.tagId) || { name: running.tagName, color: 'var(--text-sub)' })
    : currentTag();
  tagDot.style.background = tag.color;
  tagNameEl.textContent = tag.name;

  if (running) {
    const elapsed = Math.floor((Date.now() - running.startAt) / 1000);
    const remain = Math.max(running.minutes * 60 - elapsed, 0);
    timerDisplay.textContent = formatTime(remain);
    setGauge(remain / (MAX_MINUTES * 60), true);
  } else {
    timerDisplay.textContent = formatTime(prefs.minutes * 60);
    setGauge(prefs.minutes / MAX_MINUTES);
  }

  startBtn.textContent = running ? 'おわる' : 'はじめる';
  timerView.classList.toggle('is-running', !!running);
  setCat(catState());
  renderMorning();
}

function minutesFromPointer(event) {
  const max = MAX_MINUTES;
  const rect = catRing.getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  const angle = (Math.atan2(dx, -dy) + 2 * Math.PI) % (2 * Math.PI);
  const minutes = Math.round(angle / (2 * Math.PI) * max / 5) * 5;
  if (prefs.minutes >= max * 0.75 && minutes <= max * 0.25) return max;
  if (prefs.minutes <= max * 0.25 && minutes >= max * 0.75) return MIN_MINUTES;
  return Math.min(Math.max(minutes, MIN_MINUTES), max);
}

function isOnRing(event) {
  const rect = catRing.getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  const distance = Math.hypot(dx, dy) / rect.width;
  return distance >= 0.38 && distance <= 0.56;
}

catRing.addEventListener('pointerdown', event => {
  if (running || !isOnRing(event)) return;
  catRing.setPointerCapture(event.pointerId);
  catRing.classList.add('dragging');
});

catRing.addEventListener('pointermove', event => {
  if (!catRing.classList.contains('dragging')) return;
  const minutes = minutesFromPointer(event);
  if (minutes === prefs.minutes) return;
  prefs.minutes = minutes;
  renderTimer();
});

function endDrag() {
  if (!catRing.classList.contains('dragging')) return;
  catRing.classList.remove('dragging');
  savePrefs();
}

catRing.addEventListener('pointerup', endDrag);
catRing.addEventListener('pointercancel', endDrag);

function tick() {
  if (!running) return;
  if (Date.now() >= running.startAt + running.minutes * 60000) {
    finish(running.minutes);
    return;
  }
  renderTimer();
}

function startTick() {
  clearInterval(tickTimer);
  tickTimer = setInterval(tick, 1000);
}

function isMorning(ms) {
  const hour = new Date(ms).getHours();
  return hour >= MORNING_START && hour < MORNING_END;
}

function renderMorning() {
  const active = running ? !!running.morning : isMorning(Date.now());
  const rate = running ? running.morningRate || 2 : morningRate();
  $('x2-badge').hidden = !active;
  $('x2-badge').textContent = `×${rate}`;
  $('morning-hint').hidden = !active;
  $('morning-hint-text').textContent = `朝活ボーナス中　コイン×${rate}`;
}

setInterval(() => {
  if (running) return;
  renderMorning();
  renderBond();
}, 30000);

function start() {
  const tag = currentTag();
  const morning = isMorning(Date.now());
  running = { startAt: Date.now(), minutes: prefs.minutes, tagId: tag.id, tagName: tag.name, morning, morningRate: morning ? morningRate() : 1 };
  save(KEYS.running, running);
  renderTimer();
  startTick();
}

function finish(minutes) {
  const record = running;
  running = null;
  localStorage.removeItem(KEYS.running);
  clearInterval(tickTimer);
  hideConfirm(false);
  renderTimer();
  if (minutes < 1) return;

  applyBondPenalty();
  const mood = bondMood();
  const wasAway = mood === 'away';
  const bondRate = mood === 'normal' ? BOND_STAGES[stageIndex(catBondDays())].rate : 10;
  const morningMul = record.morning ? record.morningRate || 2 : 1;
  const skill = equippedItem('cat').skill;
  const skillHit = (activeSkill('night') && new Date(record.startAt).getHours() >= NIGHT_HOUR)
    || (activeSkill('stamina') && minutes >= STAMINA_MINUTES);
  const skillRate = skillHit ? 15 : 10;
  const sessions = load(KEYS.sessions, []);
  const session = {
    id: Date.now(),
    startAt: record.startAt,
    date: dateStr(record.startAt),
    tagId: record.tagId,
    tagName: record.tagName,
    minutes,
    coins: Math.floor(minutes * morningMul * bondRate * skillRate / 100),
    bondRate,
    morningRate: morningMul,
    skillLabel: skillHit ? `${skill.name} ×1.5` : null,
    morning: !!record.morning,
    understanding: null,
    memo: ''
  };
  sessions.push(session);
  save(KEYS.sessions, sessions);
  coins += session.coins;
  save(KEYS.coins, coins);
  const notes = grantMorningRewards().map(item => `${item.name} を手に入れました`);
  const catName = equippedItem('cat').name;
  if (isAdmin) bond.devLastStudy = null;
  updateLastStudyDate();
  if (wasAway) {
    bond.returnDate = dateStr(Date.now());
    saveBond();
    notes.push(`${catName}が帰ってきました`);
  }
  const gain = creditBond();
  if (gain) notes.push(`${catName}のなつき度 +${gain}日`);
  renderCoins();
  renderStore();
  renderLogs();
  renderBond();
  renderTimer();
  openDone(session, notes);
}

startBtn.addEventListener('click', async () => {
  if (!running) {
    start();
    return;
  }
  const minutes = Math.floor((Date.now() - running.startAt) / 60000);
  const message = minutes >= 1
    ? `ここまでの${minutes}分を記録しておわりますか？`
    : '1分未満のため記録されません。おわりますか？';
  const ok = await showConfirm(message, 'おわる');
  if (ok && running) finish(minutes);
});

let lastTouchEnd = 0;
document.addEventListener('touchend', event => {
  const now = Date.now();
  if (now - lastTouchEnd < 350 && !event.target.closest('button, input, textarea, select, a, label, .cat-ring')) event.preventDefault();
  lastTouchEnd = now;
}, { passive: false });

document.addEventListener('dblclick', event => event.preventDefault());

document.addEventListener('contextmenu', event => {
  if (event.target.tagName === 'IMG') event.preventDefault();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  renderBond();
  if (running) tick();
  else renderTimer();
});

let doneSessionId = null;
let doneUnderstanding = null;
let doneInitial = { understanding: null, memo: '' };

let doneFromFinish = false;

function openDone(session, notes = [], editing = false) {
  doneFromFinish = !editing;
  doneSessionId = session.id;
  doneUnderstanding = editing ? session.understanding ?? null : null;
  doneMemo.value = editing ? session.memo ?? '' : '';
  doneInitial = { understanding: doneUnderstanding, memo: doneMemo.value };
  understandingSelect.querySelectorAll('.understanding-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.level === doneUnderstanding);
  });
  $('done-minutes').textContent = `${session.minutes} min`;
  $('done-coins-row').hidden = editing;
  $('done-coins').textContent = `+${session.coins ?? session.minutes}`;
  $('done-bonus').hidden = !session.morning;
  $('done-bonus').textContent = `朝活ボーナス ×${session.morningRate || 2}`;
  $('done-skill-bonus').hidden = !session.skillLabel;
  $('done-skill-bonus').textContent = session.skillLabel || '';
  $('done-bond-bonus').hidden = !(session.bondRate > 10);
  $('done-bond-bonus').textContent = `なつき度 ${formatRate(session.bondRate || 10)}`;
  $('done-unlock').hidden = notes.length === 0;
  $('done-unlock').textContent = notes.join('\n');
  const tag = sessionTag(session);
  $('done-tag').style.setProperty('--tag', tag.color);
  $('done-tag-name').textContent = tag.name;
  $('done-sub').hidden = !editing;
  $('done-sub').textContent = editing ? `${formatDay(session.date)}　${formatRange(session)}` : '';
  $('done-skip').textContent = editing ? 'キャンセル' : 'スキップ';
  doneModal.classList.add('show');
}

function editSession(id) {
  const session = load(KEYS.sessions, []).find(s => s.id === id);
  if (session) openDone(session, [], true);
}

function closeDone() {
  doneModal.classList.remove('show');
  doneSessionId = null;
  if (doneFromFinish && !bond.goalAsked) openGoalSheet();
  doneFromFinish = false;
}

doneModal.addEventListener('click', async event => {
  if (event.target !== doneModal) return;
  const changed = doneUnderstanding !== doneInitial.understanding || doneMemo.value.trim() !== doneInitial.memo.trim();
  if (changed && !await showConfirm('変更を保存せずに閉じますか？', '破棄する', 'danger', '編集を続ける')) return;
  closeDone();
});

understandingSelect.addEventListener('click', event => {
  const btn = event.target.closest('.understanding-btn');
  if (!btn) return;
  doneUnderstanding = doneUnderstanding === btn.dataset.level ? null : btn.dataset.level;
  understandingSelect.querySelectorAll('.understanding-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.level === doneUnderstanding);
  });
});

$('done-skip').addEventListener('click', closeDone);

$('done-save').addEventListener('click', () => {
  const sessions = load(KEYS.sessions, []);
  const session = sessions.find(s => s.id === doneSessionId);
  if (session) {
    session.understanding = doneUnderstanding;
    session.memo = doneMemo.value.trim();
    save(KEYS.sessions, sessions);
    renderLogs();
    if ($('day-sheet').classList.contains('show')) renderDaySheet();
  }
  closeDone();
});

function openDrawer() {
  drawer.classList.add('show');
}

function closeDrawer() {
  drawer.classList.remove('show');
}

$('btn-menu').addEventListener('click', openDrawer);

$('home-coin').addEventListener('click', () => $('page-store').classList.add('show'));

$('home-bond').addEventListener('click', () => {
  renderBond();
  $('page-bond').classList.add('show');
  if (!bond.goalAsked) openGoalSheet();
});

$('bond-today').addEventListener('click', openGoalSheet);

$('goal-grid').addEventListener('click', event => {
  const btn = event.target.closest('[data-goal]');
  if (!btn) return;
  bond.goal = Number(btn.dataset.goal);
  saveBond();
  closeGoalSheet();
  const gain = creditBond();
  if (gain) showToast(`${equippedItem('cat').name}のなつき度 +${gain}日`);
  renderBond();
});

$('goal-sheet').addEventListener('click', event => {
  if (event.target === $('goal-sheet')) closeGoalSheet();
});

catRing.addEventListener('click', event => {
  const rect = catRing.getBoundingClientRect();
  const distance = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2)) / rect.width;
  if (distance < 0.38) speak();
});

drawer.addEventListener('click', event => {
  const item = event.target.closest('.menu-item');
  if (item) {
    if (item.dataset.page === 'page-calendar') {
      const now = new Date();
      calMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      renderCalendar();
    }
    $(item.dataset.page).classList.add('show');
    closeDrawer();
    return;
  }
  if (event.target === drawer) closeDrawer();
});

document.querySelectorAll('.page-close').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.page').classList.remove('show'));
});

function renderSheet() {
  minuteRow.innerHTML = minuteOptions().map(m =>
    `<button type="button" class="minute-btn${m === prefs.minutes ? ' selected' : ''}" data-minutes="${m}">${m}</button>`
  ).join('');
  const tag = currentTag();
  sheetTags.innerHTML = tags.map(t =>
    `<button type="button" class="tag-chip${t.id === tag.id ? ' selected' : ''}" data-id="${t.id}"><span class="tag-dot" style="background:${t.color}"></span>${escapeHtml(t.name)}</button>`
  ).join('') + '<button type="button" class="tag-chip tag-chip-add" data-add="1">＋</button>';
}

function openSheet() {
  if (running) return;
  renderSheet();
  setupSheet.classList.add('show');
  const selected = minuteRow.querySelector('.selected');
  if (selected) minuteRow.scrollLeft = selected.offsetLeft - (minuteRow.clientWidth - selected.offsetWidth) / 2;
}

function closeSheet() {
  setupSheet.classList.remove('show');
}

tagBtn.addEventListener('click', openSheet);
timerDisplay.addEventListener('click', openSheet);
$('setup-sheet-close').addEventListener('click', closeSheet);
setupSheet.addEventListener('click', event => {
  if (event.target === setupSheet) closeSheet();
});

minuteRow.addEventListener('click', event => {
  const btn = event.target.closest('.minute-btn');
  if (!btn) return;
  prefs.minutes = Number(btn.dataset.minutes);
  savePrefs();
  minuteRow.querySelectorAll('.minute-btn').forEach(b => b.classList.toggle('selected', b === btn));
  renderTimer();
});

sheetTags.addEventListener('click', event => {
  const btn = event.target.closest('.tag-chip');
  if (!btn) return;
  if (btn.dataset.add) {
    openTagModal(null);
    return;
  }
  prefs.tagId = Number(btn.dataset.id);
  savePrefs();
  renderSheet();
  renderTimer();
});

let editingTagId = null;
let editingColor = TAG_COLORS[0];

function renderColorRow() {
  tagModalColors.innerHTML = TAG_COLORS.map(c =>
    `<button type="button" class="color-btn${c === editingColor ? ' selected' : ''}" data-color="${c}" style="background:${c}"></button>`
  ).join('');
}

function openTagModal(tag) {
  editingTagId = tag ? tag.id : null;
  editingColor = tag ? tag.color : TAG_COLORS[tags.length % TAG_COLORS.length];
  $('tag-modal-title').textContent = tag ? 'タグを編集' : 'タグを追加';
  tagModalName.value = tag ? tag.name : '';
  tagModalDelete.hidden = !tag || tags.length <= 1;
  renderColorRow();
  tagModal.classList.add('show');
}

function closeTagModal() {
  tagModal.classList.remove('show');
}

tagModalColors.addEventListener('click', event => {
  const btn = event.target.closest('.color-btn');
  if (!btn) return;
  editingColor = btn.dataset.color;
  renderColorRow();
});

$('tag-modal-cancel').addEventListener('click', closeTagModal);

$('tag-modal-save').addEventListener('click', () => {
  const name = tagModalName.value.trim();
  if (!name) return;
  if (editingTagId) {
    const tag = findTag(editingTagId);
    tag.name = name;
    tag.color = editingColor;
  } else {
    const tag = { id: Date.now(), name, color: editingColor };
    tags.push(tag);
    prefs.tagId = tag.id;
    savePrefs();
  }
  save(KEYS.tags, tags);
  closeTagModal();
  renderAllTags();
});

tagModalDelete.addEventListener('click', async () => {
  const tag = findTag(editingTagId);
  closeTagModal();
  const ok = await showConfirm(`タグ「${tag.name}」を削除しますか？\nこれまでの記録は残ります。`, '削除する');
  if (!ok) return;
  tags = tags.filter(t => t.id !== tag.id);
  save(KEYS.tags, tags);
  if (prefs.tagId === tag.id) {
    prefs.tagId = tags[0].id;
    savePrefs();
  }
  renderAllTags();
});

function renderTagList() {
  tagList.innerHTML = tags.map(t =>
    `<button type="button" class="tag-row" data-id="${t.id}"><span class="tag-dot" style="background:${t.color}"></span><span class="tag-row-name">${escapeHtml(t.name)}</span><span class="tag-row-edit">編集</span></button>`
  ).join('');
}

tagList.addEventListener('click', event => {
  const row = event.target.closest('.tag-row');
  if (!row) return;
  openTagModal(findTag(Number(row.dataset.id)));
});

$('btn-add-tag').addEventListener('click', () => openTagModal(null));

function renderAllTags() {
  renderTagList();
  renderTimer();
  renderLogs();
  if (setupSheet.classList.contains('show')) renderSheet();
}

function renderLogs() {
  renderCalendar();
  const sessions = load(KEYS.sessions, []);
  if (sessions.length === 0) {
    logList.innerHTML = '<div class="log-empty">まだ記録がありません。<br>タイマーで勉強をはじめてみましょう。</div>';
    return;
  }
  logList.innerHTML = sessions.slice().sort((a, b) => b.id - a.id).map(s => {
    const { name, color } = sessionTag(s);
    return `
      <div class="log-item" data-id="${s.id}">
        <button type="button" class="log-item-delete" data-id="${s.id}">×</button>
        <div class="log-item-top">
          <span class="log-item-date">${formatDate(s.date)}</span>
          <span class="log-item-minutes">${s.minutes} min</span>
        </div>
        <div class="log-item-tag"><span class="tag-dot" style="background:${color}"></span>${escapeHtml(name)}</div>
        ${s.understanding ? `<div class="log-item-understanding">${UNDERSTANDING_LABEL[s.understanding]}</div>` : ''}
        ${s.memo ? `<div class="log-item-memo">${escapeHtml(s.memo)}</div>` : ''}
      </div>`;
  }).join('');
}

logList.addEventListener('click', async event => {
  const btn = event.target.closest('.log-item-delete');
  if (!btn) {
    const item = event.target.closest('.log-item');
    if (item) editSession(Number(item.dataset.id));
    return;
  }
  const ok = await showConfirm('この記録を削除しますか？', '削除する');
  if (!ok) return;
  const id = Number(btn.dataset.id);
  save(KEYS.sessions, load(KEYS.sessions, []).filter(s => s.id !== id));
  updateLastStudyDate();
  renderLogs();
  renderBond();
  renderTimer();
});

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
const HANKO = '<g class="hanko-ink"><circle cx="20" cy="20" r="16.5" class="hanko-ring" /><ellipse cx="20" cy="22.5" rx="8.2" ry="7" /><path d="M12.6 19.5L12.2 11l6 5.6zM27.4 19.5L27.8 11l-6 5.6z" /></g><g class="hanko-face"><ellipse cx="16.8" cy="22" rx="1" ry="1.3" /><ellipse cx="23.2" cy="22" rx="1" ry="1.3" /><path d="M19.2 24.6h1.6L20 25.6z" /></g>';
let calMonth = null;

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}時間${m}分` : `${m}分`;
}

function sessionsByDate() {
  const map = {};
  load(KEYS.sessions, []).forEach(s => {
    (map[s.date] = map[s.date] || []).push(s);
  });
  return map;
}

function streakDays(byDate) {
  const d = new Date();
  if (!byDate[dateStr(d)]) d.setDate(d.getDate() - 1);
  let count = 0;
  while (byDate[dateStr(d)]) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function renderCalendar() {
  if (!calMonth) return;
  const byDate = sessionsByDate();
  const now = new Date();
  const today = dateStr(now);
  const thisMonth = monthKey(now);

  const monthTotal = Object.keys(byDate)
    .filter(date => date.startsWith(thisMonth))
    .reduce((sum, date) => sum + byDate[date].reduce((a, s) => a + s.minutes, 0), 0);
  $('stat-streak').textContent = `${streakDays(byDate)}日`;
  $('stat-total').textContent = formatDuration(monthTotal);
  $('stat-avg').textContent = formatDuration(Math.round(monthTotal / now.getDate()));

  const shown = monthKey(calMonth);
  const firstMonth = Object.keys(byDate).sort()[0]?.slice(0, 7) || thisMonth;
  $('cal-title').textContent = shown.replace('-', '.');
  $('cal-prev').disabled = shown <= firstMonth;
  $('cal-next').disabled = shown >= thisMonth;

  const year = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const lead = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  let html = '<div class="cal-cell cal-empty"></div>'.repeat(lead);
  for (let d = 1; d <= days; d++) {
    const date = `${shown}-${String(d).padStart(2, '0')}`;
    const studied = !!byDate[date];
    const classes = ['cal-cell', studied && 'studied', date === today && 'today', date > today && 'future'].filter(Boolean).join(' ');
    const stamp = studied
      ? `<svg class="cal-stamp" viewBox="0 0 40 40" style="transform:rotate(${((d * 37) % 30 - 15) / 1.5}deg)">${HANKO}</svg>`
      : '';
    html += `<button type="button" class="${classes}" data-date="${date}"><span class="cal-num">${d}</span>${stamp}</button>`;
  }
  $('cal-grid').innerHTML = html;
}

$('cal-prev').addEventListener('click', () => {
  calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1);
  renderCalendar();
});

$('cal-next').addEventListener('click', () => {
  calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1);
  renderCalendar();
});

let dayDate = null;
const dayOpenTags = new Set();

function renderDaySheet() {
  const sessions = (sessionsByDate()[dayDate] || []).slice().sort((a, b) => a.id - b.id);
  if (sessions.length === 0) {
    $('day-sheet').classList.remove('show');
    return;
  }
  const byTag = {};
  sessions.forEach(s => {
    const tag = sessionTag(s);
    if (!byTag[tag.key]) byTag[tag.key] = { ...tag, minutes: 0, sessions: [] };
    byTag[tag.key].minutes += s.minutes;
    byTag[tag.key].sessions.push(s);
  });
  $('day-title').textContent = formatDay(dayDate);
  $('day-total').textContent = `${sessions.reduce((a, s) => a + s.minutes, 0)} min`;
  $('day-list').innerHTML = Object.values(byTag).sort((a, b) => b.minutes - a.minutes).map(t => {
    const open = dayOpenTags.has(t.key);
    const records = t.sessions.map(s => `
      <button type="button" class="day-record" data-id="${s.id}">
        <span class="day-record-top"><span>${formatRange(s)}</span><span>${s.minutes} min</span></span>
        ${s.understanding ? `<span class="log-item-understanding">${UNDERSTANDING_LABEL[s.understanding]}</span>` : ''}
        ${s.memo ? `<span class="log-item-memo">${escapeHtml(s.memo)}</span>` : ''}
      </button>`).join('');
    return `
      <div class="day-group${open ? ' open' : ''}">
        <button type="button" class="day-row" data-key="${escapeHtml(t.key)}"><span class="tag-dot" style="background:${t.color}"></span><span class="day-row-name">${escapeHtml(t.name)}</span><span class="day-row-min">${t.minutes} min</span><svg class="day-row-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg></button>
        <div class="day-records">${records}</div>
      </div>`;
  }).join('');
}

$('cal-grid').addEventListener('click', event => {
  const cell = event.target.closest('.cal-cell.studied');
  if (!cell) return;
  dayDate = cell.dataset.date;
  dayOpenTags.clear();
  renderDaySheet();
  $('day-sheet').classList.add('show');
});

$('day-list').addEventListener('click', event => {
  const record = event.target.closest('.day-record');
  if (record) {
    editSession(Number(record.dataset.id));
    return;
  }
  const row = event.target.closest('.day-row');
  if (!row) return;
  const key = row.dataset.key;
  if (dayOpenTags.has(key)) dayOpenTags.delete(key);
  else dayOpenTags.add(key);
  row.parentElement.classList.toggle('open');
});

$('day-sheet').addEventListener('click', event => {
  if (event.target === $('day-sheet')) $('day-sheet').classList.remove('show');
});

let storeCategory = 'cat';

function resetScroll(el) {
  el.style.overflowY = 'hidden';
  el.scrollTop = 0;
  requestAnimationFrame(() => {
    el.style.overflowY = '';
  });
}

function itemPreview(category, item) {
  if (category === 'gauge') {
    const stroke = item.gradientTo ? `url(#store-${item.id})` : item.color;
    const defs = item.gradientTo
      ? `<defs><linearGradient id="store-${item.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${item.color}" /><stop offset="1" stop-color="${item.gradientTo}" /></linearGradient></defs>`
      : '';
    const core = item.neon ? '<circle cx="60" cy="60" r="50" class="store-ring-progress store-ring-core" />' : '';
    return `<svg class="store-ring${item.glow ? ' glow' : ''}${item.neon ? ' neon' : ''}" style="--gauge:${item.color}" viewBox="0 0 120 120">${defs}<circle cx="60" cy="60" r="50" class="store-ring-track" /><g class="store-ring-bar"><circle cx="60" cy="60" r="50" class="store-ring-progress" style="stroke:${stroke}" />${core}</g></svg>`;
  }
  if (category === 'cat') {
    return `<img class="store-cat" src="${item.images.done}" alt="">`;
  }
  if (category === 'knob') {
    const gauge = equippedItem('gauge').color;
    const knob = item.id === 'knob-paw'
      ? `<g transform="translate(60 60) rotate(90) scale(2.6) translate(-12 -12)"><g class="paw-edge"><use href="#paw-shape" /></g><g class="paw-foot"><use href="#paw-shape" /></g><g class="paw-bean"><use href="#paw-shape" /></g></g>`
      : `<circle cx="60" cy="60" r="16" class="store-knob" style="fill:${gauge}" />`;
    return `<svg class="store-ring" viewBox="0 0 120 120">${knob}</svg>`;
  }
  const bg = item.image ? `url(${item.thumb}) center / cover no-repeat` : wallBackground(item);
  return `<div class="store-swatch" style="background:${bg}"></div>`;
}

function itemStatus(category, item) {
  if (item.morningGoal && !isItemUnlocked(item)) {
    return `<span class="store-price">朝活 ${Math.min(morningCount(), item.morningGoal)} / ${item.morningGoal}回</span>`;
  }
  if (equippedItem(category).id === item.id) {
    return '<span class="store-badge">使用中</span>';
  } else if (isItemUnlocked(item)) {
    return `<span class="store-badge store-badge-owned">${item.morningGoal ? '獲得済み' : '購入済み'}</span>`;
  }
  return `<span class="store-price"><span class="coin coin-sm"></span>${item.price.toLocaleString()}</span>`;
}

function unavailableReason(category, item) {
  if (item.morningGoal) return `朝活であと${item.morningGoal - morningCount()}回で手に入ります`;
  return 'コインが足りません';
}

function isItemBuyable(category, item) {
  if (isItemUnlocked(item) || item.morningGoal) return false;
  return coins >= item.price;
}

function renderStoreCards(category) {
  return SHOP[category].map(item => {
    const using = equippedItem(category).id === item.id;
    return `
      <button type="button" class="store-card${using ? ' using' : ''}" data-category="${category}" data-id="${item.id}">
        <div class="store-preview">${itemPreview(category, item)}</div>
        <span class="store-name">${item.name}</span>
        ${item.skill ? `<span class="store-skill">${item.skill.name}：${item.skill.text}</span>` : ''}
        ${itemStatus(category, item)}
      </button>`;
  }).join('');
}

function renderStore() {
  storeGrid.innerHTML = STORE_SECTIONS[storeCategory].map(([category, title]) =>
    `${title ? `<div class="store-section-title">${title}</div>` : ''}<div class="store-grid">${renderStoreCards(category)}</div>`
  ).join('');
}

storeSeg.addEventListener('click', event => {
  const btn = event.target.closest('.store-seg-btn');
  if (!btn) return;
  storeCategory = btn.dataset.category;
  storeSeg.querySelectorAll('.store-seg-btn').forEach(b => b.classList.toggle('selected', b === btn));
  renderStore();
  resetScroll(storeGrid.closest('.page-body'));
});

function equip(category, item) {
  shop[category] = item.id;
  save(KEYS.shop, shop);
  applyCat();
  applyGauge();
  applyKnob();
  applyTheme();
}

storeGrid.addEventListener('click', async event => {
  const card = event.target.closest('.store-card');
  if (!card) return;
  const category = card.dataset.category;
  const item = SHOP[category].find(i => i.id === card.dataset.id);

  if (isItemUnlocked(item)) {
    equip(category, item);
    renderStore();
    return;
  }
  if (!isItemBuyable(category, item)) {
    showToast(unavailableReason(category, item));
    return;
  }

  const ok = await showConfirm(`${item.name}を${item.price.toLocaleString()}コインで購入しますか？`, '購入する', 'primary');
  if (!ok || !isItemBuyable(category, item)) return;
  coins -= item.price;
  save(KEYS.coins, coins);
  shop.owned.push(item.id);
  save(KEYS.shop, shop);
  equip(category, item);
  renderCoins();
  renderStore();
  renderTimer();
});

function rollbackLockedItems() {
  ['cat', 'gauge', 'knob', 'theme'].forEach(category => {
    const item = SHOP[category].find(i => i.id === shop[category]);
    if (!item || !isItemUnlocked(item)) shop[category] = DEFAULT_EQUIP[category];
  });
  save(KEYS.shop, shop);
  if (prefs.minutes > MAX_MINUTES) {
    prefs.minutes = MAX_MINUTES;
    savePrefs();
  }
}

function renderDev() {
  $('dev-locked').hidden = isAdmin;
  $('dev-unlocked').hidden = !isAdmin;
}

function refreshShopState() {
  applyCat();
  applyGauge();
  applyKnob();
  applyTheme();
  renderDev();
  renderStore();
  renderTimer();
  if (setupSheet.classList.contains('show')) renderSheet();
}

$('dev-unlock').addEventListener('click', () => {
  const input = $('dev-code');
  if (input.value.trim() !== DEV_CODE) {
    $('dev-error').hidden = false;
    return;
  }
  input.value = '';
  $('dev-error').hidden = true;
  isAdmin = true;
  save(KEYS.admin, isAdmin);
  refreshShopState();
});

$('dev-last-study').addEventListener('click', event => {
  const btn = event.target.closest('[data-shift]');
  if (!btn) return;
  const shift = Number(btn.dataset.shift);
  bond.devLastStudy = shift ? dateStr(Date.now() - shift * 86400000) : null;
  saveBond();
  renderBond();
  showToast(shift ? `最後に勉強した日を${shift}日前にしました` : '最後に勉強した日を元に戻しました');
});

$('dev-bond-apply').addEventListener('click', () => {
  const days = Math.max(Math.floor(Number($('dev-bond-days').value)), 0);
  if (Number.isNaN(days)) return;
  bond.days[equippedItem('cat').id] = days;
  saveBond();
  $('dev-bond-days').value = '';
  renderBond();
  showToast(`なつき日数を${days}日にしました`);
});

$('dev-goal-reset').addEventListener('click', () => {
  bond.goalAsked = false;
  saveBond();
  showToast('目標の案内をもう一度出します');
});

$('dev-off').addEventListener('click', () => {
  isAdmin = false;
  bond.devLastStudy = null;
  saveBond();
  save(KEYS.admin, isAdmin);
  rollbackLockedItems();
  refreshShopState();
});

document.querySelectorAll('.accordion-head').forEach(head => {
  head.addEventListener('click', () => {
    const open = head.getAttribute('aria-expanded') !== 'true';
    head.setAttribute('aria-expanded', open);
    head.nextElementSibling.hidden = !open;
  });
});

let toastTimer = null;

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

let swRegistration = null;
let waitingWorker = null;

function applyUpdate(worker) {
  worker.postMessage({ type: 'SKIP_WAITING' });
}

function showUpdateBanner(worker) {
  waitingWorker = worker;
  $('update-banner').classList.add('show');
}

$('update-btn').addEventListener('click', () => {
  $('update-banner').classList.remove('show');
  if (waitingWorker) applyUpdate(waitingWorker);
});

function waitForInstalled(reg) {
  if (reg.waiting) return Promise.resolve(reg.waiting);
  const worker = reg.installing;
  if (!worker) return Promise.resolve(null);
  return new Promise(resolve => {
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed') resolve(worker);
      if (worker.state === 'redundant') resolve(null);
    });
  });
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    localStorage.setItem(UPDATED_FLAG, '1');
    location.reload();
  });
  navigator.serviceWorker.register('./service-worker.js', { scope: './', updateViaCache: 'none' })
    .then(reg => {
      swRegistration = reg;
      const checkWaiting = () => {
        if (reg.waiting && navigator.serviceWorker.controller) showUpdateBanner(reg.waiting);
      };
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(worker);
        });
      });
      checkWaiting();
      reg.update().catch(() => {});
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return;
        reg.update().catch(() => {});
        checkWaiting();
      });
    })
    .catch(() => {});
}

$('btn-fetch-latest').addEventListener('click', () => {
  if (!swRegistration) {
    showToast('この環境では更新できません');
    return;
  }
  showToast('確認中...');
  swRegistration.update()
    .then(() => waitForInstalled(swRegistration))
    .then(worker => {
      if (worker && navigator.serviceWorker.controller) {
        showToast('最新版を取得しています...');
        applyUpdate(worker);
      } else {
        showToast('最新バージョンです');
      }
    })
    .catch(() => showToast('取得に失敗しました。通信状況をご確認ください'));
});

let confirmResolve = null;

function showConfirm(message, okLabel, tone = 'danger', cancelLabel = 'キャンセル') {
  const okBtn = $('confirm-modal-ok');
  $('confirm-modal-message').textContent = message;
  okBtn.textContent = okLabel;
  $('confirm-modal-cancel').textContent = cancelLabel;
  okBtn.classList.toggle('modal-btn-danger', tone === 'danger');
  okBtn.classList.toggle('modal-btn-primary', tone === 'primary');
  confirmModal.classList.add('show');
  return new Promise(resolve => {
    confirmResolve = resolve;
  });
}

function hideConfirm(result) {
  confirmModal.classList.remove('show');
  if (confirmResolve) {
    confirmResolve(result);
    confirmResolve = null;
  }
}

$('confirm-modal-cancel').addEventListener('click', () => hideConfirm(false));
$('confirm-modal-ok').addEventListener('click', () => hideConfirm(true));

rollbackLockedItems();
grantMorningRewards();
updateLastStudyDate();
applyCat();
applyGauge();
applyKnob();
applyTheme();
renderCoins();
renderDev();
renderStore();
renderTagList();
renderLogs();
renderTimer();
if (running) {
  tick();
  if (running) startTick();
}
registerServiceWorker();
if (localStorage.getItem(UPDATED_FLAG)) {
  localStorage.removeItem(UPDATED_FLAG);
  showToast('アップデートしました');
}
