/* ============================================
   WARMLY — app.js
   寵物繪製、任務邏輯、頁面切換
   ============================================ */

// ========== STATE ==========
const state = {
  selectedPet: 'cat',
  selectedAcc: 'none',
  petName: '小橘',
  currentTask: 0,
  photoTaken: false,
  xp: 630
};


// ========== PET DRAWING ENGINE ==========
const PetDrawer = {
  colors: {
    cat:     { body: '#E8A870', belly: '#F5D4B0', outline: '#B07040', ear: '#E89060', nose: '#E07878', eye: '#3A2810' },
    dog:     { body: '#D4A060', belly: '#F0D090', outline: '#A07030', ear: '#C89050', nose: '#3A2810', eye: '#3A2810' },
    rabbit:  { body: '#F0E8E0', belly: '#FFF8F2', outline: '#C0A898', ear: '#F0C0C0', nose: '#E07878', eye: '#3A2810' },
    hamster: { body: '#D4907A', belly: '#F0C4A8', outline: '#A06048', ear: '#E0A090', nose: '#C06060', eye: '#3A2810' }
  },

  draw(canvas, petType, acc, size) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const c = this.colors[petType];
    const s = size || 1;

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(s, s);

    switch (petType) {
      case 'cat':    this.drawCat(ctx, c, acc); break;
      case 'dog':    this.drawDog(ctx, c, acc); break;
      case 'rabbit': this.drawRabbit(ctx, c, acc); break;
      case 'hamster':this.drawHamster(ctx, c, acc); break;
    }
    ctx.restore();
  },

  // ---- 工具函數 ----
  fillCircle(ctx, x, y, r, color) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
  },
  strokeCircle(ctx, x, y, r, color, lw) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = color; ctx.lineWidth = lw || 1.5; ctx.stroke();
  },
  fillRoundRect(ctx, x, y, w, h, r, color) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
  },

  // ---- 配件繪製 ----
  drawAcc(ctx, acc, headY) {
    if (acc === 'hat') {
      this.fillRoundRect(ctx, -18, headY - 34, 36, 8, 3, '#3A2810');
      this.fillRoundRect(ctx, -11, headY - 54, 22, 22, 4, '#3A2810');
      ctx.fillStyle = '#C67B5C';
      this.fillRoundRect(ctx, -12, headY - 34, 24, 4, 2, '#C67B5C');
    } else if (acc === 'bow') {
      ctx.fillStyle = '#E87878';
      ctx.beginPath(); ctx.moveTo(0, headY - 36);
      ctx.bezierCurveTo(-16, headY - 46, -22, headY - 32, 0, headY - 36);
      ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, headY - 36);
      ctx.bezierCurveTo(16, headY - 46, 22, headY - 32, 0, headY - 36);
      ctx.fill();
      this.fillCircle(ctx, 0, headY - 36, 4, '#C04040');
    } else if (acc === 'flower') {
      const petals = ['#E8A870','#E87878','#F0D080','#A8D870','#80C8E8'];
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const px = Math.cos(angle) * 18;
        const py = (headY - 20) + Math.sin(angle) * 6;
        this.fillCircle(ctx, px, py, 5, petals[i]);
      }
      this.fillCircle(ctx, 0, headY - 20, 4, '#F0D080');
    } else if (acc === 'glasses') {
      ctx.strokeStyle = '#3A2810'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(-10, headY + 2, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(50,50,80,0.6)'; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(10, headY + 2, 7, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-3, headY + 2); ctx.lineTo(3, headY + 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-24, headY); ctx.lineTo(-17, headY + 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(17, headY + 2); ctx.lineTo(24, headY); ctx.stroke();
    }
  },

  // ---- 各動物繪製 ----
  drawCat(ctx, c, acc) {
    this.fillCircle(ctx, 0, 14, 22, c.body);
    this.fillCircle(ctx, 0, 16, 16, c.belly);
    ctx.beginPath(); ctx.moveTo(18, 22);
    ctx.bezierCurveTo(36, 14, 40, -4, 28, -10);
    ctx.strokeStyle = c.body; ctx.lineWidth = 7; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-18, -18); ctx.lineTo(-28, -34); ctx.lineTo(-8, -24); ctx.closePath();
    ctx.fillStyle = c.ear; ctx.fill();
    ctx.beginPath(); ctx.moveTo(18, -18); ctx.lineTo(28, -34); ctx.lineTo(8, -24); ctx.closePath();
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(-17, -20); ctx.lineTo(-24, -30); ctx.lineTo(-10, -24); ctx.closePath();
    ctx.fillStyle = '#F0B090'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(17, -20); ctx.lineTo(24, -30); ctx.lineTo(10, -24); ctx.closePath();
    ctx.fill();
    this.fillCircle(ctx, 0, -16, 22, c.body);
    this.fillCircle(ctx, -7, -14, 4.5, c.eye);
    this.fillCircle(ctx, 7, -14, 4.5, c.eye);
    this.fillCircle(ctx, -6, -13, 2, '#fff');
    this.fillCircle(ctx, 8, -13, 2, '#fff');
    this.fillCircle(ctx, 0, -8, 3.5, c.nose);
    ctx.strokeStyle = '#A08060'; ctx.lineWidth = 1;
    for (let sign of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(sign * 4, -7); ctx.lineTo(sign * 20, -9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sign * 4, -7); ctx.lineTo(sign * 20, -4); ctx.stroke();
    }
    this.drawAcc(ctx, acc, -32);
  },

  drawDog(ctx, c, acc) {
    this.fillCircle(ctx, 0, 14, 22, c.body);
    this.fillCircle(ctx, 0, 16, 14, c.belly);
    ctx.beginPath(); ctx.moveTo(20, 10);
    ctx.bezierCurveTo(34, 0, 38, -14, 30, -18);
    ctx.strokeStyle = c.body; ctx.lineWidth = 8; ctx.stroke();
    this.fillRoundRect(ctx, -28, -16, 14, 22, 7, c.ear);
    this.fillRoundRect(ctx, 14, -16, 14, 22, 7, c.ear);
    this.fillCircle(ctx, 0, -14, 22, c.body);
    this.fillRoundRect(ctx, -10, -12, 20, 14, 8, c.belly);
    this.fillCircle(ctx, 0, -8, 5, c.nose);
    this.fillCircle(ctx, -8, -18, 4.5, c.eye);
    this.fillCircle(ctx, 8, -18, 4.5, c.eye);
    this.fillCircle(ctx, -7, -17, 2, '#fff');
    this.fillCircle(ctx, 9, -17, 2, '#fff');
    this.drawAcc(ctx, acc, -32);
  },

  drawRabbit(ctx, c, acc) {
    this.fillCircle(ctx, 0, 16, 20, c.body);
    this.fillCircle(ctx, 0, 18, 12, c.belly);
    this.fillRoundRect(ctx, -16, -48, 10, 34, 5, c.body);
    this.fillRoundRect(ctx, 6, -48, 10, 34, 5, c.body);
    this.fillRoundRect(ctx, -13, -46, 4, 28, 3, c.ear);
    this.fillRoundRect(ctx, 9, -46, 4, 28, 3, c.ear);
    this.fillCircle(ctx, 0, -14, 20, c.body);
    this.fillCircle(ctx, -6, -16, 4, c.eye);
    this.fillCircle(ctx, 6, -16, 4, c.eye);
    this.fillCircle(ctx, -5, -15, 1.8, '#fff');
    this.fillCircle(ctx, 7, -15, 1.8, '#fff');
    this.fillCircle(ctx, 0, -9, 3, c.nose);
    ctx.strokeStyle = '#D0C0B0'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-2, -8); ctx.lineTo(-16, -10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(2, -8); ctx.lineTo(16, -10); ctx.stroke();
    this.drawAcc(ctx, acc, -46);
  },

  drawHamster(ctx, c, acc) {
    this.fillCircle(ctx, 0, 18, 20, c.body);
    this.fillCircle(ctx, 0, 20, 14, c.belly);
    this.fillCircle(ctx, -20, -8, 12, c.belly);
    this.fillCircle(ctx, 20, -8, 12, c.belly);
    this.fillCircle(ctx, 0, -12, 22, c.body);
    this.fillCircle(ctx, -7, -14, 4, c.eye);
    this.fillCircle(ctx, 7, -14, 4, c.eye);
    this.fillCircle(ctx, -6, -13, 1.8, '#fff');
    this.fillCircle(ctx, 8, -13, 1.8, '#fff');
    this.fillCircle(ctx, 0, -7, 3.5, c.nose);
    this.fillCircle(ctx, -16, -28, 7, c.ear);
    this.fillCircle(ctx, 16, -28, 7, c.ear);
    this.fillCircle(ctx, -16, -28, 4, '#F0B0A0');
    this.fillCircle(ctx, 16, -28, 4, '#F0B0A0');
    this.drawAcc(ctx, acc, -30);
  }
};

// ========== TASKS ==========
const tasks = [
  {
    type: '📷 拍照任務',
    title: '拍下今天讓你停下來的畫面',
    desc: '不需要完美。可能是一片落葉、一個表情、窗外的天空。讓直覺引導你的鏡頭。',
    mode: 'photo'
  },
  {
    type: '✍️ 文字記錄',
    title: '描述現在的自己，像在寫給陌生人',
    desc: '假設一個完全不認識你的人讀到這段話。你希望他理解你今天的什麼？',
    mode: 'text'
  },
  {
    type: '🌿 感恩日記',
    title: '今天有什麼讓你想說「謝謝」？',
    desc: '可以很小：一杯溫水、一個眼神。三件事，不用多。',
    mode: 'gratitude'
  },
  {
    type: '💬 每日三言',
    title: '今天學到了什麼？放下了什麼？',
    desc: '三句話：今天學到____、今天放下____、明天我想____。讓牠陪你整理思緒。',
    mode: 'three'
  }
];

// ========== REVIEW DATA ==========
const reviewData = {
  cafe: { name: '暖日咖啡 · Soleil', sub: '📍 大安區 · 已打卡 1 次 · 快樂值 +25' },
  park: { name: '大安森林公園', sub: '📍 大安區 · 已打卡 2 次 · 快樂值 +20' },
  book: { name: '誠品書店 · 信義旗艦', sub: '📍 信義區 · 尚未打卡' }
};

// ========== PET SELECTION ==========
function selectPet(type) {
  state.selectedPet = type;
  document.querySelectorAll('.pet-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.pet === type);
  });
  redrawAllPreviews();
}

function selectAcc(acc) {
  state.selectedAcc = acc;
  document.querySelectorAll('.acc-item').forEach(el => {
    el.classList.toggle('active', el.dataset.acc === acc);
  });
  redrawAllPreviews();
}

function redrawAllPreviews() {
  ['cat','dog','rabbit','hamster'].forEach(type => {
    const c = document.getElementById('preview-' + type);
    if (c) PetDrawer.draw(c, type, type === state.selectedPet ? state.selectedAcc : 'none', 0.78);
  });
}

function confirmPet() {
  const nameInput = document.getElementById('pet-name-input');
  if (nameInput.value.trim()) state.petName = nameInput.value.trim();
  updatePetUI();
  showScreen('task');
}

function updatePetUI() {
  document.getElementById('room-pet-name').textContent = state.petName;
  document.getElementById('journal-pet-name').textContent = state.petName;
  document.getElementById('task-pet-hint').textContent = `完成任務，讓${state.petName}更快樂 🐾`;

  
  const mainCanvas = document.getElementById('pet-canvas');
  if (mainCanvas) PetDrawer.draw(mainCanvas, state.selectedPet, state.selectedAcc, 1.8);

  const moods = {
    cat: '溫柔陪伴中...',
    dog: '搖著尾巴等你！',
    rabbit: '靜靜療癒著你',
    hamster: '圓滾滾的關心'
  };
  document.getElementById('room-pet-stage').textContent = moods[state.selectedPet] || '';

  const completeBtn = document.getElementById('task-complete-btn');
if (completeBtn) {
  completeBtn.textContent = `完成任務，讓${state.petName}更快樂 🐾`;
}
}

// ========== TASK RENDERING ==========
function renderTask() {
  const t = tasks[state.currentTask];
  const card = document.getElementById('task-card');

  let inputHtml = '';
  if (t.mode === 'photo') {
    inputHtml = state.photoTaken
      ? `<div class="photo-preview-area">🐾</div>`
      : `<div class="task-photo-btn" onclick="takePhoto()">
           <div class="task-photo-icon">
             <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#A05840" stroke-width="2">
               <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
               <circle cx="12" cy="13" r="4"/>
             </svg>
           </div>
           點此拍一張照片
         </div>`;
  } else if (t.mode === 'gratitude') {
    inputHtml = `
      <div class="gratitude-item"><div class="gratitude-num">1</div><input type="text" placeholder="今天感謝..."></div>
      <div class="gratitude-item"><div class="gratitude-num">2</div><input type="text" placeholder="今天感謝..."></div>
      <div class="gratitude-item" style="margin-bottom:14px;"><div class="gratitude-num">3</div><input type="text" placeholder="今天感謝..."></div>
    `;
  } else {
    const placeholder = t.mode === 'three' ? '今天學到了...' : '開始寫吧...';
    inputHtml = `<textarea class="task-input-area" placeholder="${placeholder}" rows="4"></textarea>`;
  }

  card.innerHTML = `
  <div class="task-type-badge"><span class="dot"></span>${t.type}</div>
  <h2>${t.title}</h2>
  <p class="task-desc">${t.desc}</p>
  ${inputHtml}
  <button id="task-complete-btn" class="task-btn-complete" onclick="completeTask()">
    完成任務，讓${state.petName}更快樂 🐾
  </button>
`;
}

function takePhoto() {
  state.photoTaken = true;
  renderTask();
}

function shuffleTask() {
  state.photoTaken = false;
  state.currentTask = (state.currentTask + 1) % tasks.length;
  const card = document.getElementById('task-card');
  card.style.opacity = '0';
  card.style.transform = 'translateY(10px)';
  setTimeout(() => {
    renderTask();
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 80);
}

function completeTask() {
  state.xp = Math.min(1000, state.xp + 40);
  const fill = document.getElementById('xp-fill');
  if (fill) fill.style.width = (state.xp / 10) + '%';
  showScreen('home');
}

// ========== SCREEN NAVIGATION ==========
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');

  const nav = document.getElementById('bottom-nav');
  nav.style.display = (name === 'task' || name === 'petselect') ? 'none' : 'flex';

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navMap = { home: 'nav-home', journal: 'nav-journal', map: 'nav-map' };
  if (navMap[name]) document.getElementById(navMap[name]).classList.add('active');

  if (name === 'home') updatePetUI();
}

// ========== MAP & REVIEWS ==========
function showReview(id) {
  const data = reviewData[id];
  if (data) {
    document.getElementById('review-title').textContent = data.name;
    document.getElementById('review-sub').textContent = data.sub;
  }
  document.getElementById('review-overlay').classList.add('show');
}

function closeOverlay(e) {
  if (e.target === document.getElementById('review-overlay')) {
    document.getElementById('review-overlay').classList.remove('show');
  }
}

function submitReview() {
  const ta = document.querySelector('#review-overlay textarea');
  if (ta && ta.value.trim()) {
    ta.value = '';
    document.getElementById('review-overlay').classList.remove('show');
  }
}

function activateTab(el) {
  document.querySelectorAll('.month-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function activateChip(el) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ========== STREAK DOTS ==========
function renderStreakDots() {
  const container = document.getElementById('streak-dots');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const d = document.createElement('div');
    d.className = 'streak-dot done';
    container.appendChild(d);
  }
}

// ========== INIT ==========
window.addEventListener('DOMContentLoaded', () => {
  redrawAllPreviews();
  document.querySelector('.pet-option[data-pet="cat"]').classList.add('selected');
  renderTask();
  renderStreakDots();

  const d = new Date();
  const dateStr = `今天 · ${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
  const dateEl = document.getElementById('task-date');
  if (dateEl) dateEl.textContent = dateStr;
});
