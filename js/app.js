const KEYS = {
  sessions: 'studyCatSessions',
  tags: 'studyCatTags',
  prefs: 'studyCatPrefs',
  running: 'studyCatRunning',
  coins: 'studyCatCoins',
  shop: 'studyCatShop',
  admin: 'studyCatAdmin'
};
const TAG_COLORS = ['#E07A5F', '#E6B655', '#6FA88C', '#5BA8B5', '#7B93D6', '#B08BD0'];
const UNDERSTANDING_LABEL = { '1': 'もう少し', '2': 'まあまあ', '3': 'バッチリ' };
const CAT_IMAGES = { idle: 'images/cat-sleep.jpg', running: 'images/cat-back.jpg' };
const RING_RADIUS = 54;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const MIN_MINUTES = 10;
const DEV_CODE = 'matatabi';
const UPDATED_FLAG = 'studyCatJustUpdated';

const SHOP = {
  gauge: [
    { id: 'gauge-wakaba', name: '若葉', price: 0, color: '#6FA88C' },
    { id: 'gauge-kohaku', name: '琥珀', price: 100, color: '#E6B655' },
    { id: 'gauge-sakura', name: '桜', price: 100, color: '#E8A0B4' },
    { id: 'gauge-mizu', name: '水色', price: 100, color: '#5FC4D0' },
    { id: 'gauge-hotaru', name: '蛍', price: 200, color: '#9AF0C0', glow: true },
    { id: 'gauge-yubae', name: '夕映え', price: 300, color: '#7B93D6', gradientTo: '#E8A0B4' }
  ],
  theme: [
    { id: 'theme-mayonaka', name: '真夜中', price: 0, bg: '#0a0820' },
    { id: 'theme-mori', name: '森', price: 300, bg: '#0d1f18' },
    { id: 'theme-yoi', name: '宵', price: 300, bg: '#1d1028' },
    { id: 'theme-danro', name: '暖炉', price: 300, bg: '#21130d' }
  ],
  time: [
    { id: 'time-120', name: '120分', price: 0, max: 120 },
    { id: 'time-180', name: '180分', price: 300, max: 180, requires: 'time-120' },
    { id: 'time-240', name: '240分', price: 600, max: 240, requires: 'time-180' }
  ]
};
const DEFAULT_EQUIP = { gauge: 'gauge-wakaba', theme: 'theme-mayonaka' };

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
let shop = load(KEYS.shop, { owned: [], ...DEFAULT_EQUIP });
let isAdmin = load(KEYS.admin, false);
let tickTimer = null;

const $ = id => document.getElementById(id);
const timerView = $('timer-view');
const catRing = document.querySelector('.cat-ring');
const ring = $('ring');
const ringProgress = $('ring-progress');
const ringKnob = $('ring-knob');
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

function equippedItem(category) {
  const item = SHOP[category].find(i => i.id === shop[category]);
  return item && isItemUnlocked(item) ? item : SHOP[category][0];
}

function maxMinutes() {
  return Math.max(...SHOP.time.filter(isItemUnlocked).map(i => i.max));
}

function minuteOptions() {
  const options = [];
  for (let m = MIN_MINUTES; m <= maxMinutes(); m += 5) options.push(m);
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
  if (item.gradientTo) {
    $('gauge-gradient-from').setAttribute('stop-color', item.color);
    $('gauge-gradient-to').setAttribute('stop-color', item.gradientTo);
    ringProgress.style.stroke = 'url(#gauge-gradient)';
  } else {
    ringProgress.style.stroke = '';
  }
}

function applyTheme() {
  const item = equippedItem('theme');
  document.documentElement.style.setProperty('--bg', item.bg);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', item.bg);
}

function setCat(state) {
  if (catImg.dataset.state === state) return;
  catImg.dataset.state = state;
  catImg.src = CAT_IMAGES[state];
}

function setGauge(ratio) {
  const clamped = Math.min(ratio, 1);
  const angle = clamped * 2 * Math.PI;
  ringProgress.style.strokeDashoffset = RING_LENGTH * (1 - clamped);
  ringKnob.setAttribute('cx', 60 + RING_RADIUS * Math.cos(angle));
  ringKnob.setAttribute('cy', 60 + RING_RADIUS * Math.sin(angle));
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
    setGauge(remain / (maxMinutes() * 60));
  } else {
    timerDisplay.textContent = formatTime(prefs.minutes * 60);
    setGauge(prefs.minutes / maxMinutes());
  }

  startBtn.textContent = running ? 'おわる' : 'はじめる';
  timerView.classList.toggle('is-running', !!running);
  setCat(running ? 'running' : 'idle');
}

function minutesFromPointer(event) {
  const max = maxMinutes();
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

function start() {
  const tag = currentTag();
  running = { startAt: Date.now(), minutes: prefs.minutes, tagId: tag.id, tagName: tag.name };
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

  const sessions = load(KEYS.sessions, []);
  const session = {
    id: Date.now(),
    date: dateStr(record.startAt),
    tagId: record.tagId,
    tagName: record.tagName,
    minutes,
    understanding: null,
    memo: ''
  };
  sessions.push(session);
  save(KEYS.sessions, sessions);
  coins += minutes;
  save(KEYS.coins, coins);
  renderCoins();
  renderStore();
  renderLogs();
  openDone(session);
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

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') tick();
});

let doneSessionId = null;
let doneUnderstanding = null;

function openDone(session) {
  doneSessionId = session.id;
  doneUnderstanding = null;
  doneMemo.value = '';
  understandingSelect.querySelectorAll('.understanding-btn').forEach(b => b.classList.remove('selected'));
  $('done-minutes').textContent = `${session.minutes} min`;
  $('done-coins').textContent = `+${session.minutes}`;
  $('done-sub').textContent = `${session.tagName}　お疲れさま`;
  doneModal.classList.add('show');
}

function closeDone() {
  doneModal.classList.remove('show');
  doneSessionId = null;
}

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

drawer.addEventListener('click', event => {
  const item = event.target.closest('.menu-item');
  if (item) {
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
  const sessions = load(KEYS.sessions, []);
  if (sessions.length === 0) {
    logList.innerHTML = '<div class="log-empty">まだ記録がありません。<br>タイマーで勉強をはじめてみましょう。</div>';
    return;
  }
  logList.innerHTML = sessions.slice().sort((a, b) => b.id - a.id).map(s => {
    const tag = findTag(s.tagId);
    const name = tag ? tag.name : s.tagName;
    const color = tag ? tag.color : 'var(--text-sub)';
    return `
      <div class="log-item">
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
  if (!btn) return;
  const ok = await showConfirm('この記録を削除しますか？', '削除する');
  if (!ok) return;
  const id = Number(btn.dataset.id);
  save(KEYS.sessions, load(KEYS.sessions, []).filter(s => s.id !== id));
  renderLogs();
});

let storeCategory = 'gauge';

function itemPreview(category, item) {
  if (category === 'gauge') {
    const stroke = item.gradientTo ? `url(#store-${item.id})` : item.color;
    const defs = item.gradientTo
      ? `<defs><linearGradient id="store-${item.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${item.color}" /><stop offset="1" stop-color="${item.gradientTo}" /></linearGradient></defs>`
      : '';
    return `<svg class="store-ring${item.glow ? ' glow' : ''}" style="--gauge:${item.color}" viewBox="0 0 120 120">${defs}<circle cx="60" cy="60" r="50" class="store-ring-track" /><circle cx="60" cy="60" r="50" class="store-ring-progress" style="stroke:${stroke}" /></svg>`;
  }
  if (category === 'theme') {
    return `<div class="store-swatch" style="background:${item.bg}"><i></i></div>`;
  }
  return `<div class="store-time">${item.max}<small>分</small></div>`;
}

function itemStatus(category, item) {
  if (category === 'time') {
    if (isItemUnlocked(item)) return '<span class="store-badge store-badge-owned">解放済み</span>';
    const required = SHOP.time.find(i => i.id === item.requires);
    if (!isItemUnlocked(required)) return `<span class="store-price">${required.name}の購入が先</span>`;
  } else if (equippedItem(category).id === item.id) {
    return '<span class="store-badge">使用中</span>';
  } else if (isItemUnlocked(item)) {
    return '<span class="store-badge store-badge-owned">購入済み</span>';
  }
  return `<span class="store-price"><span class="coin coin-sm"></span>${item.price.toLocaleString()}</span>`;
}

function isItemBuyable(category, item) {
  if (isItemUnlocked(item)) return false;
  if (item.requires && !isItemUnlocked(SHOP[category].find(i => i.id === item.requires))) return false;
  return coins >= item.price;
}

function renderStore() {
  storeGrid.innerHTML = SHOP[storeCategory].map(item => {
    const using = storeCategory !== 'time' && equippedItem(storeCategory).id === item.id;
    const disabled = !isItemUnlocked(item) && !isItemBuyable(storeCategory, item);
    return `
      <button type="button" class="store-card${using ? ' using' : ''}${disabled ? ' disabled' : ''}" data-id="${item.id}">
        <div class="store-preview">${itemPreview(storeCategory, item)}</div>
        <span class="store-name">${item.name}</span>
        ${itemStatus(storeCategory, item)}
      </button>`;
  }).join('');
}

storeSeg.addEventListener('click', event => {
  const btn = event.target.closest('.store-seg-btn');
  if (!btn) return;
  storeCategory = btn.dataset.category;
  storeSeg.querySelectorAll('.store-seg-btn').forEach(b => b.classList.toggle('selected', b === btn));
  renderStore();
});

function equip(category, item) {
  if (category === 'time') return;
  shop[category] = item.id;
  save(KEYS.shop, shop);
  applyGauge();
  applyTheme();
}

storeGrid.addEventListener('click', async event => {
  const card = event.target.closest('.store-card');
  if (!card) return;
  const category = storeCategory;
  const item = SHOP[category].find(i => i.id === card.dataset.id);

  if (isItemUnlocked(item)) {
    equip(category, item);
    renderStore();
    return;
  }
  if (!isItemBuyable(category, item)) return;

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
  ['gauge', 'theme'].forEach(category => {
    const item = SHOP[category].find(i => i.id === shop[category]);
    if (!item || !isItemUnlocked(item)) shop[category] = DEFAULT_EQUIP[category];
  });
  save(KEYS.shop, shop);
  if (prefs.minutes > maxMinutes()) {
    prefs.minutes = maxMinutes();
    savePrefs();
  }
}

function renderDev() {
  $('dev-locked').hidden = isAdmin;
  $('dev-unlocked').hidden = !isAdmin;
}

function refreshShopState() {
  applyGauge();
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

$('dev-off').addEventListener('click', () => {
  isAdmin = false;
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

function showConfirm(message, okLabel, tone = 'danger') {
  const okBtn = $('confirm-modal-ok');
  $('confirm-modal-message').textContent = message;
  okBtn.textContent = okLabel;
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
applyGauge();
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
