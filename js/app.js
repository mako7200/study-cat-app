if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js', { scope: './', updateViaCache: 'none' });
  });
}

const STORAGE_KEY = 'studyCatLogs';
const UNDERSTANDING_LABEL = { '1': 'もう少し', '2': 'まあまあ', '3': 'バッチリ' };

const dateInput = document.getElementById('input-date');
const themeInput = document.getElementById('input-theme');
const minutesInput = document.getElementById('input-minutes');
const memoInput = document.getElementById('input-memo');
const understandingSelect = document.getElementById('understanding-select');
const submitBtn = document.getElementById('btn-submit');
const logList = document.getElementById('log-list');
const confirmModal = document.getElementById('confirm-modal');
const confirmModalCancel = document.getElementById('confirm-modal-cancel');
const confirmModalOk = document.getElementById('confirm-modal-ok');

let selectedUnderstanding = null;

function loadLogs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function todayStr() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return `${y}/${Number(m)}/${Number(d)}`;
}

dateInput.value = todayStr();
dateInput.max = todayStr();

function renderLogs() {
  const logs = loadLogs();
  logList.innerHTML = '';

  if (logs.length === 0) {
    logList.innerHTML = '<div class="log-empty">まだ記録がありません。今日の学習を記録してみましょう。</div>';
    return;
  }

  logs.slice().sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return b.id - a.id;
  }).forEach(log => {
    const item = document.createElement('div');
    item.className = 'log-item';
    item.innerHTML = `
      <button type="button" class="log-item-delete" data-id="${log.id}">×</button>
      <div class="log-item-top">
        <span class="log-item-date">${formatDate(log.date)}</span>
        <span class="log-item-minutes">${log.minutes}分</span>
      </div>
      <div class="log-item-theme">${escapeHtml(log.theme)}</div>
      ${log.understanding ? `<div class="log-item-understanding">${UNDERSTANDING_LABEL[log.understanding]}</div>` : ''}
      ${log.memo ? `<div class="log-item-memo">${escapeHtml(log.memo)}</div>` : ''}
    `;
    logList.appendChild(item);
  });
}

let confirmResolve = null;

function showConfirm() {
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

confirmModalCancel.addEventListener('click', () => hideConfirm(false));
confirmModalOk.addEventListener('click', () => hideConfirm(true));

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

understandingSelect.addEventListener('click', event => {
  const btn = event.target.closest('.understanding-btn');
  if (!btn) return;
  const level = btn.dataset.level;
  selectedUnderstanding = selectedUnderstanding === level ? null : level;
  understandingSelect.querySelectorAll('.understanding-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.level === selectedUnderstanding);
  });
});

submitBtn.addEventListener('click', () => {
  const theme = themeInput.value.trim();
  const minutes = parseInt(minutesInput.value, 10);

  if (!theme || !minutes || minutes <= 0 || !dateInput.value) {
    return;
  }

  const logs = loadLogs();
  logs.push({
    id: Date.now(),
    date: dateInput.value,
    theme,
    minutes,
    understanding: selectedUnderstanding,
    memo: memoInput.value.trim()
  });
  saveLogs(logs);

  dateInput.value = todayStr();
  themeInput.value = '';
  minutesInput.value = '';
  memoInput.value = '';
  selectedUnderstanding = null;
  understandingSelect.querySelectorAll('.understanding-btn').forEach(b => b.classList.remove('selected'));

  renderLogs();
});

logList.addEventListener('click', async event => {
  const btn = event.target.closest('.log-item-delete');
  if (!btn) return;
  const ok = await showConfirm();
  if (!ok) return;
  const id = Number(btn.dataset.id);
  const logs = loadLogs().filter(log => log.id !== id);
  saveLogs(logs);
  renderLogs();
});

renderLogs();
