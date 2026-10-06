if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js', { scope: './', updateViaCache: 'none' });
  });
}

const KEYS = {
  sessions: 'studyCatSessions',
  tags: 'studyCatTags',
  prefs: 'studyCatPrefs',
  running: 'studyCatRunning'
};
const TAG_COLORS = ['#E07A5F', '#E6B655', '#6FA88C', '#5BA8B5', '#7B93D6', '#B08BD0'];
const MINUTE_OPTIONS = Array.from({ length: 23 }, (_, i) => 10 + i * 5);
const UNDERSTANDING_LABEL = { '1': 'もう少し', '2': 'まあまあ', '3': 'バッチリ' };
const CAT_IMAGES = { idle: 'images/cat-sleep.jpg', running: 'images/cat-back.jpg' };
const RING_LENGTH = 2 * Math.PI * 54;

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
let tickTimer = null;

const $ = id => document.getElementById(id);
const timerView = $('timer-view');
const ringProgress = $('ring-progress');
const catImg = $('cat-img');
const tagBtn = $('btn-tag');
const tagDot = $('tag-dot');
const tagNameEl = $('tag-name');
const timerDisplay = $('timer-display');
const startBtn = $('btn-start');
const logList = $('log-list');
const tagList = $('tag-list');
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

function setCat(state) {
  if (catImg.dataset.state === state) return;
  catImg.dataset.state = state;
  catImg.src = CAT_IMAGES[state];
}

function renderTimer() {
  const tag = running
    ? (findTag(running.tagId) || { name: running.tagName, color: 'var(--text-sub)' })
    : currentTag();
  tagDot.style.background = tag.color;
  tagNameEl.textContent = tag.name;

  if (running) {
    const total = running.minutes * 60;
    const elapsed = Math.floor((Date.now() - running.startAt) / 1000);
    timerDisplay.textContent = formatTime(Math.max(total - elapsed, 0));
    ringProgress.style.strokeDashoffset = RING_LENGTH * (1 - Math.min(elapsed / total, 1));
  } else {
    timerDisplay.textContent = formatTime(prefs.minutes * 60);
    ringProgress.style.strokeDashoffset = RING_LENGTH;
  }

  startBtn.textContent = running ? 'やめる' : '始める';
  timerView.classList.toggle('is-running', !!running);
  setCat(running ? 'running' : 'idle');
}

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
    ? `ここまでの${minutes}分を記録して終了しますか？`
    : '1分未満のため記録されません。終了しますか？';
  const ok = await showConfirm(message, '終了する');
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

function renderSheet() {
  minuteRow.innerHTML = MINUTE_OPTIONS.map(m =>
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
    logList.innerHTML = '<div class="log-empty">まだ記録がありません。<br>タイマーで勉強を始めてみましょう。</div>';
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

let confirmResolve = null;

function showConfirm(message, okLabel) {
  $('confirm-modal-message').textContent = message;
  $('confirm-modal-ok').textContent = okLabel;
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

document.querySelector('.tabbar').addEventListener('click', event => {
  const btn = event.target.closest('.tabbar-btn');
  if (!btn) return;
  document.querySelectorAll('.tabbar-btn').forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.id === btn.dataset.tab));
});

renderTagList();
renderLogs();
renderTimer();
if (running) {
  tick();
  if (running) startTick();
}
