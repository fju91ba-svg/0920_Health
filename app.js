(() => {
  'use strict';

  /* ---------- 靜態資料 ---------- */

  // goal：每日建議份數（65 歲以上的粗略參考，每點一次約代表 1 份）
  const CATS = {
    grain:   { name: '全穀雜糧', emoji: '🍚', goal: 3, color: 'var(--c-grain)' },
    protein: { name: '豆魚蛋肉', emoji: '🐟', goal: 5, color: 'var(--c-protein)' },
    veg:     { name: '蔬菜',     emoji: '🥬', goal: 3, color: 'var(--c-veg)' },
    fruit:   { name: '水果',     emoji: '🍎', goal: 2, color: 'var(--c-fruit)' },
    dairy:   { name: '乳品',     emoji: '🥛', goal: 1, color: 'var(--c-dairy)' },
    fat:     { name: '油脂堅果', emoji: '🥜', goal: 1, color: 'var(--c-fat)' },
    other:   { name: '其他',     emoji: '🍵', goal: 0, color: 'var(--c-other)' },
  };
  const GOAL_KEYS = Object.keys(CATS).filter(k => CATS[k].goal > 0);

  const FOODS = {
    grain:   ['白飯', '糙米飯', '五穀飯', '稀飯', '燕麥粥', '麵條', '饅頭', '全麥吐司', '地瓜', '南瓜', '馬鈴薯', '玉米'],
    protein: ['雞蛋', '板豆腐', '無糖豆漿', '鮭魚', '鯖魚', '白肉魚', '雞肉', '瘦豬肉', '蝦子', '蛤蜊', '毛豆', '豆干'],
    veg:     ['青江菜', '地瓜葉', '高麗菜', '花椰菜', '菠菜', '胡蘿蔔', '絲瓜', '冬瓜', '番茄', '海帶／紫菜', '香菇', '木耳'],
    fruit:   ['香蕉', '木瓜', '芭樂', '蘋果', '橘子', '奇異果', '葡萄', '鳳梨', '火龍果', '蓮霧'],
    dairy:   ['低脂鮮奶', '無糖優酪乳', '起司片', '高鈣奶粉'],
    fat:     ['堅果（一小把）', '黑芝麻', '酪梨', '橄欖油', '花生醬'],
    other:   ['清湯', '無糖茶', '燉品', '餅乾', '含糖飲料'],
  };

  const MEALS = [
    { key: 'breakfast', name: '早餐', emoji: '🌅' },
    { key: 'lunch',     name: '午餐', emoji: '☀️' },
    { key: 'dinner',    name: '晚餐', emoji: '🌙' },
    { key: 'snack',     name: '點心／宵夜', emoji: '🍪', optional: true },
  ];
  const MAIN_MEALS = MEALS.filter(m => !m.optional);

  const AMOUNTS = ['吃得少', '剛剛好', '吃很飽'];
  const MOODS = [
    { v: 'good', emoji: '😊', label: '精神很好' },
    { v: 'ok',   emoji: '😐', label: '普通' },
    { v: 'bad',  emoji: '😣', label: '不太舒服' },
  ];
  const WATER_GOAL = 8;

  const TIPS = [
    { t: '🥣 吃得夠，才有力氣', l: [
      '三餐盡量定時定量，胃口不好可少量多餐。',
      '每餐都要有蛋白質（豆、魚、蛋、肉），幫助維持肌肉、預防跌倒。',
      '主食可換成糙米、燕麥、地瓜等全穀雜糧，比較不容易便祕。',
    ]},
    { t: '🧂 少鹽、少糖、少油', l: [
      '湯汁、醃漬品、加工肉品含鈉高，建議少吃；吃麵時湯不要喝完。',
      '用蔥、薑、蒜、檸檬、香菇提味，取代多放鹽或醬料。',
      '含糖飲料、糕點偏甜，偶爾吃就好；優先選無糖茶或白開水。',
    ]},
    { t: '🦷 好咬、好吞、好消化', l: [
      '牙口不好時，把食物煮軟、切小塊或剁碎，也可用蒸、燉、煮的方式。',
      '吃飯時坐正、細嚼慢嚥，吃完不要馬上躺下，降低嗆咳與火燒心。',
      '魚肉、豆腐、蒸蛋質地軟嫩，是很好的蛋白質來源。',
    ]},
    { t: '💧 記得補充水分', l: [
      '年紀越大越不容易口渴，不要等到口渴才喝，一天約 6～8 杯（每杯約 250 毫升）。',
      '分次少量、整天慢慢喝；睡前和半夜少喝一點，避免夜尿。',
      '若醫師有限制水分（例如心臟或腎臟疾病），請依醫囑調整。',
    ]},
    { t: '🥛 骨骼與腸道保健', l: [
      '每天 1～2 杯乳品，或搭配豆製品、小魚干、深綠色蔬菜補鈣。',
      '多曬曬太陽、適度走動，有助於維生素 D 與骨質。',
      '每天至少 3 份蔬菜、2 份水果，幫助排便順暢。',
    ]},
    { t: '💊 用藥安心', l: [
      '每天固定時間吃藥，可以搭配三餐或刷牙當作提醒，也可以用本網站的提醒功能。',
      '不要自己停藥、加藥或減藥；漏吃時該不該補吃，請先問醫師或藥師。',
      '看診時帶著藥袋與這本日記，讓醫師知道最近的飲食、血壓與精神狀況。',
      '有些藥需要飯前或飯後吃，也要避開特定食物（例如葡萄柚），請向藥師確認。',
    ]},
    { t: '🩺 有慢性病的長輩', l: [
      '糖尿病、腎臟病、高血壓、痛風等，飲食限制各不相同，請向醫師或營養師確認。',
      '若短時間內體重明顯下降、持續沒胃口，請盡早就醫檢查。',
      '本網站的「建議份數」只是一般健康長輩的粗略參考。',
    ]},
  ];

  /* ---------- 小工具 ---------- */

  const $ = (s, r = document) => r.querySelector(s);

  const h = (tag, attrs = {}, ...kids) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'style') e.setAttribute('style', v);
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      e.append(kid instanceof Node ? kid : document.createTextNode(kid));
    }
    return e;
  };

  const pad = n => String(n).padStart(2, '0');
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); };
  const WD = ['日', '一', '二', '三', '四', '五', '六'];
  const rocDate = s => { const d = parse(s); return `民國${d.getFullYear() - 1911}年${d.getMonth() + 1}月${d.getDate()}日`; };
  const shortDate = s => { const d = parse(s); return `${d.getMonth() + 1}/${d.getDate()}（${WD[d.getDay()]}）`; };
  const todayStr = () => ymd(new Date());

  let toastTimer;
  const toast = msg => {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
  };

  /* ---------- Supabase（專案 0920_Health）---------- */
  // 這裡的金鑰是「公開金鑰」，本來就會出現在網頁裡。資料表已鎖住（RLS），
  // 網頁只能呼叫三個資料庫函式：建立邀請、接受邀請、管理員查詢（需帳密）。

  const SUPABASE_URL = 'https://bcmmdygvypgodxqcfqnn.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_VhbU0b9WqgH1yv0kAIei3g_AgT255Zx';

  const rpc = async (fn, args) => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });
    if (!res.ok) throw new Error(`${fn} failed: ${res.status}`);
    return res.json();
  };

  /* ---------- 資料存取 ---------- */

  // 訪客（未登入）與每位會員各自使用一個本機儲存位置，共用同一台裝置也不會看到別人的資料
  const GUEST_KEY = 'silver-diet-v1';
  const userKey = id => `silver-diet-v1:${id}`;
  let storeKey = GUEST_KEY;

  // 每日健康數值（血壓、心跳、血糖、體重、睡眠）：只接受合理範圍內的數字
  const VITALS = {
    sys:     { label: '收縮壓（高壓）', unit: 'mmHg',  min: 50,  max: 300, step: 1 },
    dia:     { label: '舒張壓（低壓）', unit: 'mmHg',  min: 30,  max: 200, step: 1 },
    pulse:   { label: '心跳',           unit: '次/分', min: 30,  max: 220, step: 1 },
    glucose: { label: '血糖',           unit: 'mg/dL', min: 20,  max: 700, step: 1 },
    weight:  { label: '體重',           unit: '公斤',  min: 20,  max: 250, step: 0.1 },
    sleep:   { label: '昨晚睡眠',       unit: '小時',  min: 0,   max: 24,  step: 0.5 },
  };

  const emptyMeal = () => ({ time: '', amount: '', items: [] });
  const emptyDay = () => ({
    meals: Object.fromEntries(MEALS.map(m => [m.key, emptyMeal()])),
    water: 0, mood: '', note: '', vitals: {},
    ts: 0, // 最後修改時間（毫秒），雲端同步時用來判斷誰比較新
  });

  const normalizeDay = raw => {
    const d = emptyDay();
    if (!raw || typeof raw !== 'object') return d;
    for (const m of MEALS) {
      const src = raw.meals && raw.meals[m.key];
      if (!src) continue;
      d.meals[m.key] = {
        time: typeof src.time === 'string' ? src.time : '',
        amount: AMOUNTS.includes(src.amount) ? src.amount : '',
        items: Array.isArray(src.items)
          ? src.items.filter(i => i && typeof i.name === 'string' && CATS[i.cat])
                     .map(i => ({ name: i.name.slice(0, 40), cat: i.cat }))
          : [],
      };
    }
    d.water = Math.max(0, Math.min(20, Number(raw.water) || 0));
    d.mood = MOODS.some(m => m.v === raw.mood) ? raw.mood : '';
    d.note = typeof raw.note === 'string' ? raw.note.slice(0, 1000) : '';
    for (const [k, v] of Object.entries(VITALS)) {
      const raw_v = raw.vitals && raw.vitals[k];
      const n = Number(raw_v);
      if (raw_v !== '' && raw_v != null && Number.isFinite(n) && n >= v.min && n <= v.max) d.vitals[k] = n;
    }
    d.ts = Number(raw.ts) > 0 ? Number(raw.ts) : 0;
    return d;
  };

  // 服藥紀錄：{ '藥物id@時間': '08:12' }
  const cleanTaken = log => {
    const out = {};
    if (log && typeof log === 'object') for (const [k, v] of Object.entries(log)) if (typeof v === 'string') out[k.slice(0, 60)] = v.slice(0, 10);
    return out;
  };

  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const validDate = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
  const validTime = s => typeof s === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
  const str = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
  const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/;

  const normalizeInvite = i => {
    if (!i || !str(i.name, 40) || !EMAIL_RE.test(str(i.email, 80))) return null;
    return {
      id: str(i.id, 30) || uid(), name: str(i.name, 40), email: str(i.email, 80),
      note: str(i.note, 200), date: validDate(i.date) ? i.date : todayStr(),
    };
  };

  const normalizeMed = m => {
    if (!m || !str(m.name, 40)) return null;
    const times = [...new Set((Array.isArray(m.times) ? m.times : []).filter(validTime))].sort();
    return {
      id: str(m.id, 30) || uid(),
      name: str(m.name, 40), dose: str(m.dose, 40), note: str(m.note, 80),
      times: times.length ? times : ['08:00'],
      start: validDate(m.start) ? m.start : todayStr(),
    };
  };

  const normalizeAppt = a => {
    if (!a || !validDate(a.date)) return null;
    return {
      id: str(a.id, 30) || uid(), date: a.date, time: validTime(a.time) ? a.time : '',
      place: str(a.place, 40), dept: str(a.dept, 30), doctor: str(a.doctor, 30), note: str(a.note, 120),
      done: !!a.done,
    };
  };

  const normalizeDb = raw => {
    const days = {};
    for (const [k, v] of Object.entries(raw.days || {})) if (validDate(k)) days[k] = normalizeDay(v);
    const medLog = {};
    for (const [d, log] of Object.entries(raw.medLog || {})) {
      if (!validDate(d) || !log || typeof log !== 'object') continue;
      const clean = {};
      for (const [k, v] of Object.entries(log)) if (typeof v === 'string') clean[k.slice(0, 60)] = v.slice(0, 10);
      if (Object.keys(clean).length) medLog[d] = clean;
    }
    return {
      days, medLog,
      fontSize: Number(raw.fontSize) || 20,
      meds: (Array.isArray(raw.meds) ? raw.meds : []).map(normalizeMed).filter(Boolean),
      appts: (Array.isArray(raw.appts) ? raw.appts : []).map(normalizeAppt).filter(Boolean),
      notify: !!raw.notify,
      invites: (Array.isArray(raw.invites) ? raw.invites : []).map(normalizeInvite).filter(Boolean),
      siteUrl: typeof raw.siteUrl === 'string' && /^https?:\/\/\S+$/.test(raw.siteUrl.trim()) ? raw.siteUrl.trim().slice(0, 300) : '',
      settingsTs: Number(raw.settingsTs) > 0 ? Number(raw.settingsTs) : 0, // 用藥/看診設定的最後同步時間
      settingsSynced: typeof raw.settingsSynced === 'string' ? raw.settingsSynced.slice(0, 60000) : '', // 雲端最後確認收到的設定版本
    };
  };

  const readDb = key => {
    try {
      const raw = JSON.parse(localStorage.getItem(key) || 'null');
      if (raw && typeof raw.days === 'object') return normalizeDb(raw);
    } catch (_) { /* 讀取失敗就從空白開始 */ }
    return normalizeDb({});
  };
  const writeDb = (key, data) => {
    try { localStorage.setItem(key, JSON.stringify(data)); return true; } catch (_) { return false; }
  };

  let db = readDb(GUEST_KEY);
  const newAppt = () => ({ id: null, date: '', time: '', place: '', dept: '', doctor: '', note: '' });
  const newMed = () => ({ id: null, name: '', dose: '', note: '', times: [] });
  const state = {
    date: todayStr(), tab: 'today', pickerMeal: null, pickerCat: 'grain',
    apptDraft: newAppt(), medDraft: newMed(),
    welcome: null, // 受邀者從信件連結進來時顯示的歡迎訊息
  };

  const dirtyDays = new Set(); // 已修改、還沒上傳到雲端的日期

  const saveLocal = () => {
    if (!writeDb(storeKey, db)) toast('⚠️ 無法儲存，瀏覽器可能封鎖了儲存空間');
  };
  // 存到本機，並（已登入時）排程同步到雲端
  const save = () => { saveLocal(); syncSoon(); };

  const getDay = date => db.days[date] || emptyDay();

  // 修改當天資料並存檔；rerender=false 用於輸入框，避免打字時失去焦點
  const edit = (fn, rerender = true) => {
    const d = db.days[state.date] || (db.days[state.date] = emptyDay());
    fn(d);
    d.ts = Date.now();
    dirtyDays.add(state.date);
    save();
    if (rerender) render();
  };

  /* ---------- 統計 ---------- */

  const nowHM = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const minutesOf = hm => { const [a, b] = hm.split(':').map(Number); return a * 60 + b; };
  const daysUntil = date => Math.round((parse(date) - parse(todayStr())) / 864e5);
  const countdown = date => {
    const n = daysUntil(date);
    return n === 0 ? '今天' : n === 1 ? '明天' : n === 2 ? '後天' : n > 0 ? `${n} 天後` : `${-n} 天前`;
  };
  const cmpAppt = (a, b) => (a.date + (a.time || '99:99')).localeCompare(b.date + (b.time || '99:99'));
  const apptText = a => `${a.time ? a.time + ' ' : ''}${[a.place, a.dept, a.doctor].filter(Boolean).join(' ')}${a.note ? '｜' + a.note : ''}`;

  // 某天應吃的每一次藥（依時間排序）
  const dosesFor = date => db.meds
    .filter(m => m.start <= date)
    .flatMap(m => m.times.map(t => ({ med: m, time: t, key: `${m.id}@${t}` })))
    .sort((a, b) => a.time.localeCompare(b.time) || a.med.name.localeCompare(b.med.name));
  const takenAt = (date, key) => (db.medLog[date] || {})[key];
  const doseStats = date => {
    const doses = dosesFor(date);
    return { total: doses.length, taken: doses.filter(d => takenAt(date, d.key)).length };
  };

  const toggleDose = (date, key) => {
    const log = db.medLog[date] || (db.medLog[date] = {});
    if (log[key]) {
      delete log[key];
      if (!Object.keys(log).length) delete db.medLog[date];
    } else {
      log[key] = date === todayStr() ? nowHM() : '補記';
    }
    const d = db.days[date] || (db.days[date] = emptyDay());
    d.ts = Date.now();
    dirtyDays.add(date);
    save();
    render();
  };

  const countCats = day => {
    const c = Object.fromEntries(Object.keys(CATS).map(k => [k, 0]));
    for (const m of MEALS) for (const i of day.meals[m.key].items) c[i.cat]++;
    return c;
  };
  const mealsLogged = day => MAIN_MEALS.filter(m => day.meals[m.key].items.length > 0).length;
  const catsMet = day => { const c = countCats(day); return GOAL_KEYS.filter(k => c[k] >= CATS[k].goal).length; };

  /* ---------- 畫面：今天 ---------- */

  const dateBar = () => {
    const isToday = state.date === todayStr();
    const d = parse(state.date);
    return [
      h('div', { class: 'datebar' },
        h('button', { class: 'btn', type: 'button', 'aria-label': '前一天', onclick: () => go(addDays(state.date, -1)) }, '◀ 前一天'),
        h('div', { class: 'datetitle' },
          h('strong', {}, `${rocDate(state.date)}`),
          h('span', {}, `星期${WD[d.getDay()]} `),
          isToday && h('span', { class: 'badge' }, '今天')),
        h('button', { class: 'btn', type: 'button', 'aria-label': '後一天', onclick: () => go(addDays(state.date, 1)) }, '後一天 ▶')),
      h('div', { class: 'datebar-extra' },
        !isToday && h('button', { class: 'btn primary', type: 'button', onclick: () => go(todayStr()) }, '回到今天'),
        h('label', {}, '選日期：',
          h('input', { type: 'date', value: state.date, max: todayStr(), onchange: e => e.target.value && go(e.target.value) }))),
    ];
  };

  const go = date => { state.date = date; render(); window.scrollTo(0, 0); };

  const summaryCard = day => {
    const c = countCats(day);
    const logged = mealsLogged(day);
    const met = catsMet(day);
    const missing = GOAL_KEYS.filter(k => c[k] < CATS[k].goal).map(k => CATS[k].name);

    let msg, warn = false;
    if (!MEALS.some(m => day.meals[m.key].items.length)) {
      msg = '這天還沒有記錄，先點下面的「＋ 加食物」記下第一餐吧！'; warn = true;
    } else if (met === GOAL_KEYS.length) {
      msg = '🎉 太棒了！今天六大類食物都吃到建議份數，繼續保持！';
    } else {
      msg = `已記錄 ${logged} 餐，${met} 類達標。還可以補充：${missing.join('、')}。`; warn = logged < 3;
    }

    return h('section', { class: 'card', 'aria-labelledby': 'sum-h' },
      h('h2', { id: 'sum-h' }, '📊 今日吃得均衡嗎？'),
      h('p', { class: `summary-msg${warn ? ' warn' : ''}` }, msg),
      h('div', { class: 'bars' }, GOAL_KEYS.map(k => {
        const cat = CATS[k];
        const pct = Math.min(100, Math.round(c[k] / cat.goal * 100));
        const done = c[k] >= cat.goal;
        return h('div', { class: 'bar-row' },
          h('span', { class: 'bar-label' }, `${cat.emoji} ${cat.name}`),
          h('div', { class: 'bar-track', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': cat.goal, 'aria-valuenow': c[k], 'aria-label': cat.name },
            h('div', { class: 'bar-fill', style: `width:${pct}%;background:${cat.color}` })),
          h('span', { class: `bar-num${done ? ' done' : ''}` }, done ? `✓ ${c[k]}/${cat.goal}份` : `${c[k]}/${cat.goal}份`));
      })),
      h('p', { class: 'hint' }, '每點選一次食物約算 1 份（例如 1 碗飯、1 顆蛋、1 個拳頭大的水果）。建議份數為一般長輩的粗略參考。'));
  };

  const groupItems = items => {
    const map = new Map();
    items.forEach(i => {
      const key = `${i.cat}|${i.name}`;
      map.set(key, { ...i, n: (map.get(key)?.n || 0) + 1 });
    });
    return [...map.values()];
  };

  const mealCard = (m, day) => {
    const meal = day.meals[m.key];
    const groups = groupItems(meal.items);
    return h('section', { class: 'card', 'aria-label': m.name },
      h('div', { class: 'meal-head' },
        h('h3', {}, `${m.emoji} ${m.name}`),
        h('label', { class: 'meta' }, '用餐時間',
          h('input', { type: 'time', value: meal.time, onchange: e => edit(d => { d.meals[m.key].time = e.target.value; }) }))),
      h('div', { class: 'chips' },
        groups.length
          ? groups.map(g => h('button', {
              class: 'chip', type: 'button', style: `--cat:${CATS[g.cat].color}`,
              'aria-label': `${g.name}${g.n > 1 ? `，${g.n} 份` : ''}，點一下少一份`,
              onclick: () => edit(d => {
                const arr = d.meals[m.key].items;
                const idx = arr.findIndex(i => i.name === g.name && i.cat === g.cat);
                if (idx >= 0) arr.splice(idx, 1);
              }),
            }, g.name, g.n > 1 && h('span', { class: 'n' }, `×${g.n}`), h('span', { class: 'x', 'aria-hidden': 'true' }, '✕')))
          : h('span', { class: 'empty' }, m.optional ? '沒吃可以不用記' : '還沒有記錄')),
      h('button', { class: 'btn primary block', type: 'button', onclick: () => openPicker(m.key) }, '＋ 加食物'),
      meal.items.length > 0 && h('div', { class: 'amount' },
        h('span', {}, '這餐吃得如何？'),
        h('div', { class: 'seg' }, AMOUNTS.map(a => h('button', {
          type: 'button', 'aria-pressed': String(meal.amount === a),
          onclick: () => edit(d => { d.meals[m.key].amount = d.meals[m.key].amount === a ? '' : a; }),
        }, a)))));
  };

  const waterCard = day => h('section', { class: 'card', 'aria-labelledby': 'water-h' },
    h('h2', { id: 'water-h' }, '💧 今天喝了幾杯水？'),
    h('div', { class: 'cups' }, Array.from({ length: WATER_GOAL }, (_, i) => h('button', {
      class: 'cup', type: 'button', 'aria-label': `第 ${i + 1} 杯`, 'aria-pressed': String(day.water > i),
      onclick: () => edit(d => { d.water = d.water === i + 1 ? i : i + 1; }),
    }, '🥤'))),
    h('p', { class: 'water-total' },
      `已喝 ${day.water} 杯（約 ${day.water * 250} 毫升）`,
      day.water >= 6 ? ' 👍 水分足夠！' : ''),
    h('p', { class: 'hint' }, '每杯約 250 毫升；點第幾杯就代表喝到第幾杯，再點一次可取消。'));

  const vitalField = (k, day) => {
    const v = VITALS[k];
    const hint = h('small', { class: 'vhint', role: 'status' });
    return h('label', { class: 'vital' },
      h('span', {}, v.label, h('em', {}, ` ${v.unit}`)),
      h('input', {
        type: 'number', inputmode: 'decimal', min: v.min, max: v.max, step: v.step,
        value: day.vitals[k] != null ? day.vitals[k] : '', placeholder: '—',
        oninput: e => {
          const raw = e.target.value;
          if (raw === '') { hint.textContent = ''; edit(d => { delete d.vitals[k]; }, false); return; }
          const n = Number(raw);
          if (!Number.isFinite(n) || n < v.min || n > v.max) { hint.textContent = `請輸入 ${v.min}～${v.max}`; return; }
          hint.textContent = '';
          edit(d => { d.vitals[k] = n; }, false);
        },
      }),
      hint);
  };

  const feelCard = day => h('section', { class: 'card', 'aria-labelledby': 'feel-h' },
    h('h2', { id: 'feel-h' }, '🌿 今日健康狀態'),
    h('p', { class: 'hint', style: 'margin:0 0 8px' }, '精神狀況'),
    h('div', { class: 'seg' }, MOODS.map(m => h('button', {
      type: 'button', 'aria-pressed': String(day.mood === m.v),
      onclick: () => edit(d => { d.mood = d.mood === m.v ? '' : m.v; }),
    }, `${m.emoji} ${m.label}`))),
    h('p', { class: 'hint', style: 'margin:14px 0 8px' }, '今天量了什麼？有量再填就好（自動儲存）'),
    h('div', { class: 'vitals' }, Object.keys(VITALS).map(k => vitalField(k, day))),
    h('p', { class: 'hint' }, '數值只是記錄，看診時給醫師參考；覺得不舒服或數值異常，請洽醫師。'),
    h('textarea', {
      placeholder: '想記下什麼都可以，例如：胃口、排便、哪裡不舒服…',
      'aria-label': '今日備註', maxlength: 1000,
      oninput: e => edit(d => { d.note = e.target.value; }, false),
    }, day.note));

  const doseRow = (d, date) => {
    const at = takenAt(date, d.key);
    const overdue = !at && date === todayStr() && d.time <= nowHM();
    return h('div', { class: `dose${at ? ' done' : ''}${overdue ? ' overdue' : ''}` },
      h('span', { class: 'dose-time' }, d.time),
      h('span', { class: 'dose-info' },
        h('b', {}, d.med.name, d.med.dose ? ` ${d.med.dose}` : ''),
        d.med.note && h('small', {}, d.med.note),
        overdue && h('em', {}, '⏰ 該吃藥了')),
      h('button', {
        class: 'dose-btn', type: 'button', 'aria-pressed': String(!!at),
        'aria-label': `${d.med.name} ${d.time}，${at ? '已吃，點一下取消' : '點一下代表已吃'}`,
        onclick: () => toggleDose(date, d.key),
      }, at ? `✓ 已吃${/\d/.test(at) ? ' ' + at : ''}` : '吃了'));
  };

  const medCard = date => {
    const doses = dosesFor(date);
    const { taken, total } = doseStats(date);
    return h('section', { class: 'card', 'aria-labelledby': 'med-h' },
      h('h2', { id: 'med-h' }, '💊 今日用藥', total > 0 && ` （${taken}/${total}）`),
      doses.length
        ? doses.map(d => doseRow(d, date))
        : h('p', { class: 'empty' }, db.meds.length ? '這天沒有需要吃的藥。' : '還沒有設定每日用藥。'),
      !db.meds.length && h('button', { class: 'btn block', type: 'button', onclick: () => { state.tab = 'care'; render(); window.scrollTo(0, 0); } }, '＋ 前往設定用藥時間'));
  };

  const upcomingApptCard = () => {
    const today = todayStr();
    const list = db.appts.filter(a => !a.done && a.date >= today && daysUntil(a.date) <= 14).sort(cmpAppt).slice(0, 3);
    if (!list.length) return null;
    return h('section', { class: 'card', 'aria-labelledby': 'appt-h' },
      h('h2', { id: 'appt-h' }, '🏥 近期看診'),
      list.map(a => h('div', { class: 'mini-appt' },
        h('span', { class: `cd${daysUntil(a.date) <= 1 ? ' soon' : ''}` }, countdown(a.date)),
        h('b', {}, shortDate(a.date)),
        h('span', {}, apptText(a)))),
      h('button', { class: 'btn block', type: 'button', style: 'margin-top:8px', onclick: () => { state.tab = 'care'; render(); window.scrollTo(0, 0); } }, '查看全部看診'));
  };

  const hero = () => {
    const hr = new Date().getHours();
    const greet = hr < 5 ? '夜深了，早點休息' : hr < 11 ? '早安！' : hr < 14 ? '午安！' : hr < 18 ? '下午好！' : '晚安！';
    return h('section', { class: 'hero' },
      h('img', { src: 'images/seniors.jpg', alt: '五位開心站在一起的銀髮長輩插畫', width: 725, height: 423 }),
      h('p', {}, h('b', {}, greet), '　健康吃、快樂過，一起記錄每一餐 🍚'));
  };

  const todayView = () => {
    const day = getDay(state.date);
    return [
      hero(),
      ...dateBar(),
      upcomingApptCard(),
      medCard(state.date),
      summaryCard(day),
      ...MEALS.map(m => mealCard(m, day)),
      waterCard(day),
      feelCard(day),
      inviteCard(),
    ];
  };

  const inviteCard = () => h('section', { class: 'card', 'aria-labelledby': 'inv-h' },
    h('h2', { id: 'inv-h' }, '👨‍👩‍👧 邀請家人朋友一起用'),
    h('p', {}, '每個人都有自己的日記簿，資料只存在自己的手機或電腦裡，各自管理、互不干擾。'),
    h('button', { class: 'btn primary block', type: 'button', onclick: () => openInvite() }, '✉️ 邀請一位新朋友'));

  /* ---------- 畫面：近七天 ---------- */

  const weekView = () => {
    const today = todayStr();
    const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6)).reverse();
    const rows = days.map(date => ({ date, day: getDay(date), has: !!db.days[date] }));
    const recorded = rows.filter(r => r.has && MEALS.some(m => r.day.meals[m.key].items.length));
    const sumMeals = recorded.reduce((s, r) => s + mealsLogged(r.day), 0);
    const sumWater = recorded.reduce((s, r) => s + r.day.water, 0);
    const avg = (n, d) => d ? (Math.round(n / d * 10) / 10) : 0;

    return [
      h('section', { class: 'card' },
        h('h2', {}, '📅 最近七天'),
        h('div', { class: 'week-stats' },
          h('div', { class: 'stat' }, h('b', {}, `${recorded.length}/7`), h('span', {}, '有記錄的天數')),
          h('div', { class: 'stat' }, h('b', {}, avg(sumMeals, recorded.length)), h('span', {}, '平均每天記幾餐')),
          h('div', { class: 'stat' }, h('b', {}, avg(sumWater, recorded.length)), h('span', {}, '平均每天幾杯水'))),
        h('p', { class: 'hint' }, '點選任何一天可以查看或補記。')),
      h('div', { class: 'week-list' }, rows.map(({ date, day }) => {
        const dots = MAIN_MEALS.map(m => day.meals[m.key].items.length ? '●' : '○').join('');
        const mood = MOODS.find(m => m.v === day.mood);
        return h('button', {
          class: `week-row${date === today ? ' today' : ''}`, type: 'button',
          onclick: () => { state.tab = 'today'; go(date); },
        },
          h('span', { class: 'd' }, shortDate(date), date === today && h('small', {}, ' 今天')),
          h('span', { class: 'mood', 'aria-label': mood ? mood.label : '未記錄精神狀況' }, mood ? mood.emoji : ''),
          h('span', { class: 'detail' },
            h('span', {}, '三餐 ', h('span', { class: 'dots', 'aria-label': `${mealsLogged(day)} 餐有記錄` }, dots)),
            h('span', {}, `💧 ${day.water} 杯`),
            day.vitals.sys && day.vitals.dia && h('span', {}, `🩺 血壓 ${day.vitals.sys}/${day.vitals.dia}`),
            day.vitals.glucose && h('span', {}, `🩸 血糖 ${day.vitals.glucose}`),
            day.vitals.weight && h('span', {}, `⚖️ ${day.vitals.weight} 公斤`),
            (() => { const s = doseStats(date); return s.total > 0 && h('span', {}, `💊 ${s.taken}/${s.total} 次`); })(),
            h('span', {}, `✅ ${catsMet(day)}/${GOAL_KEYS.length} 類達標`)));
      })),
    ];
  };

  /* ---------- 畫面：小叮嚀 ---------- */

  const tipsView = () => [
    h('section', { class: 'card' },
      h('h2', {}, '💡 銀髮族養身飲食小叮嚀'),
      h('p', { class: 'hint' }, '簡單記住：吃得夠、吃得軟、少鹽少糖、多喝水、多動一動。')),
    ...TIPS.map(t => h('section', { class: 'card tip' }, h('h3', {}, t.t), h('ul', {}, t.l.map(x => h('li', {}, x))))),
  ];

  /* ---------- 選食物對話框 ---------- */

  const picker = $('#picker');

  const renderPicker = () => {
    const meal = MEALS.find(m => m.key === state.pickerMeal);
    const day = getDay(state.date);
    const items = day.meals[meal.key].items;
    const catKey = state.pickerCat;
    const countOf = name => items.filter(i => i.name === name && i.cat === catKey).length;

    let selectEl, inputEl;
    const addCustom = () => {
      const name = inputEl.value.trim();
      if (!name) { inputEl.focus(); return; }
      addFood(name, selectEl.value);
      inputEl.value = '';
      inputEl.focus();
    };

    picker.replaceChildren(h('div', { class: 'pk' },
      h('div', { class: 'pk-head' },
        h('h2', { id: 'pickerTitle' }, `${meal.emoji} ${meal.name}：吃了什麼？`),
        h('button', { class: 'btn', type: 'button', onclick: () => picker.close() }, '✔ 完成')),
      h('div', { class: 'pk-cats', role: 'group', 'aria-label': '食物分類' },
        Object.keys(CATS).map(k => h('button', {
          type: 'button', style: `--cat:${CATS[k].color}`, 'aria-pressed': String(catKey === k),
          onclick: () => { state.pickerCat = k; renderPicker(); },
        }, `${CATS[k].emoji} ${CATS[k].name}`))),
      h('div', { class: 'pk-body' },
        h('div', { class: 'pk-grid' }, FOODS[catKey].map(name => {
          const n = countOf(name);
          return h('button', { class: 'food', type: 'button', onclick: () => addFood(name, catKey) },
            name, n > 0 && h('span', { class: 'cnt', 'aria-label': `已加 ${n} 份` }, n));
        })),
        h('form', { class: 'custom', onsubmit: e => { e.preventDefault(); addCustom(); } },
          h('label', { for: 'customName' }, '找不到？自己輸入：'),
          inputEl = h('input', { id: 'customName', type: 'text', maxlength: 40, placeholder: '例如：蒸蛋、味噌湯…', autocomplete: 'off' }),
          selectEl = h('select', { 'aria-label': '食物分類' },
            Object.keys(CATS).map(k => h('option', { value: k, selected: k === catKey }, `${CATS[k].emoji} ${CATS[k].name}`))),
          h('button', { class: 'btn primary', type: 'submit' }, '加入')),
        h('p', { class: 'hint' }, '同一種食物可以連點多次，代表吃了多份。'))));

    const body = $('.pk-body', picker);
    if (renderPicker.keepScroll != null) { body.scrollTop = renderPicker.keepScroll; renderPicker.keepScroll = null; }
  };

  const addFood = (name, cat) => {
    const body = $('.pk-body', picker);
    renderPicker.keepScroll = body ? body.scrollTop : null;
    edit(d => { d.meals[state.pickerMeal].items.push({ name, cat }); }, false);
    renderPicker();
    render();
    toast(`已加入：${name}`);
  };

  const openPicker = mealKey => {
    state.pickerMeal = mealKey;
    renderPicker();
    picker.showModal();
  };

  picker.addEventListener('click', e => { if (e.target === picker) picker.close(); });

  /* ---------- 下載檔案 ---------- */

  const download = (filename, text, type) => {
    const blob = new Blob([text], { type: `${type};charset=utf-8` });
    const a = h('a', { href: URL.createObjectURL(blob), download: filename });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  /* ---------- 行事曆匯出（.ics）：網頁關閉時由手機系統提醒 ---------- */

  const icsEsc = s => String(s).replace(/[\\;,]/g, '\\$&').replace(/\n/g, '\\n');
  const icsStamp = () => new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const icsLocal = (date, time, addMin = 0) => {
    const d = parse(date);
    const [hh, mm] = time.split(':').map(Number);
    d.setHours(hh, mm + addMin);
    return `${ymd(d).replace(/-/g, '')}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  };
  const icsWrap = events => ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SilverDiet//ZH-TW//', 'CALSCALE:GREGORIAN',
    ...events.flat(), 'END:VCALENDAR'].join('\r\n');
  const icsAlarm = (title, trigger) => ['BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsEsc(title)}`, `TRIGGER:${trigger}`, 'END:VALARM'];

  const apptEvent = a => {
    const title = `🏥 看診：${[a.place, a.dept].filter(Boolean).join(' ') || '回診'}`;
    const ev = ['BEGIN:VEVENT', `UID:${a.id}@silverdiet`, `DTSTAMP:${icsStamp()}`];
    if (a.time) ev.push(`DTSTART:${icsLocal(a.date, a.time)}`, `DTEND:${icsLocal(a.date, a.time, 60)}`);
    else ev.push(`DTSTART;VALUE=DATE:${a.date.replace(/-/g, '')}`);
    ev.push(`SUMMARY:${icsEsc(title)}`,
      `DESCRIPTION:${icsEsc([a.doctor && `醫師：${a.doctor}`, a.note].filter(Boolean).join('\n'))}`);
    // 有時間：前一天、前兩小時各提醒一次；沒時間：前一天 09:00、當天 08:00
    (a.time ? ['-P1D', '-PT2H'] : ['-PT15H', 'PT8H']).forEach(t => ev.push(...icsAlarm(title, t)));
    ev.push('END:VEVENT');
    return ev;
  };

  const medEvents = m => m.times.map(t => {
    const title = `💊 吃藥：${m.name}${m.dose ? ' ' + m.dose : ''}`;
    return ['BEGIN:VEVENT', `UID:${m.id}-${t.replace(':', '')}@silverdiet`, `DTSTAMP:${icsStamp()}`,
      `DTSTART:${icsLocal(m.start, t)}`, `DTEND:${icsLocal(m.start, t, 15)}`, 'RRULE:FREQ=DAILY',
      `SUMMARY:${icsEsc(title)}`, `DESCRIPTION:${icsEsc(m.note)}`,
      ...icsAlarm(title, 'PT0S'), 'END:VEVENT'];
  });

  const exportAppt = a => { download(`看診提醒-${a.date}.ics`, icsWrap([apptEvent(a)]), 'text/calendar'); toast('已下載，打開檔案即可加入行事曆'); };
  const exportMeds = () => {
    if (!db.meds.length) { toast('還沒有設定用藥'); return; }
    download('每日用藥提醒.ics', icsWrap(db.meds.flatMap(medEvents)), 'text/calendar');
    toast('已下載，打開檔案即可加入行事曆');
  };

  /* ---------- 提醒：橫幅、鈴聲、瀏覽器通知 ---------- */

  let audioCtx;
  const beep = () => {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      [0, .35, .7].forEach(t => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.frequency.value = 880; g.gain.value = .2;
        o.connect(g); g.connect(audioCtx.destination);
        o.start(audioCtx.currentTime + t); o.stop(audioCtx.currentTime + t + .22);
      });
    } catch (_) { /* 瀏覽器不支援或被封鎖 */ }
  };

  const fired = (() => {
    try { return new Set(JSON.parse(sessionStorage.getItem('silver-fired') || '[]')); } catch (_) { return new Set(); }
  })();
  const fireOnce = key => {
    if (fired.has(key)) return false;
    fired.add(key);
    try { sessionStorage.setItem('silver-fired', JSON.stringify([...fired])); } catch (_) { /* ignore */ }
    return true;
  };

  const notify = (title, body) => {
    toast(`${title}：${body}`);
    if (!db.notify) return;
    beep();
    try { if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body }); } catch (_) { /* ignore */ }
  };

  const toggleNotify = async () => {
    if (db.notify) { db.notify = false; save(); render(); return; }
    db.notify = true; save();
    beep(); // 在點擊當下建立音效，瀏覽器才允許之後自動響鈴
    let perm = 'unsupported';
    if ('Notification' in window) {
      try { perm = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission; } catch (_) { /* ignore */ }
    }
    render();
    toast(perm === 'granted' ? '已開啟提醒鈴聲與通知' : '已開啟提醒鈴聲（瀏覽器通知未允許，仍會在網頁上顯示提醒）');
  };

  const dismissed = new Set();

  const renderAlerts = () => {
    const today = todayStr(), hm = nowHM();
    const items = [];
    if (state.welcome) {
      const w = state.welcome;
      const msg = w.kind === 'ok' ? `🎉 ${w.name}，歡迎加入「銀髮健康日記簿」！您已接受邀請。您的日記只存在這台裝置裡，別人看不到。`
        : w.kind === 'bad' ? '這個邀請連結無效或已過期，但您仍可以直接使用本網站。'
          : '目前無法確認邀請（網路連線問題），網站仍可正常使用。';
      items.push(h('div', { class: 'alert welcome', role: 'status' },
        h('span', {}, msg),
        h('span', { class: 'btns' },
          w.kind === 'ok' && sb && !cloud.user && h('button', { class: 'btn primary', type: 'button', onclick: () => { state.welcome = null; renderAlerts(); openAuth('register', w.name); } }, '註冊帳號'),
          h('button', { class: `btn${w.kind === 'ok' && sb && !cloud.user ? '' : ' primary'}`, type: 'button', onclick: () => { state.welcome = null; renderAlerts(); } }, '開始使用'))));
    }
    const due = dosesFor(today).filter(d => d.time <= hm && !takenAt(today, d.key));
    due.slice(0, 3).forEach(d => items.push(h('div', { class: 'alert med', role: 'alert' },
      h('span', {}, `💊 該吃藥了：${d.med.name}${d.med.dose ? ' ' + d.med.dose : ''}（${d.time}）`),
      h('button', { class: 'btn primary', type: 'button', onclick: () => toggleDose(today, d.key) }, '我吃了'))));
    if (due.length > 3) items.push(h('div', { class: 'alert more' }, `還有 ${due.length - 3} 項藥還沒吃，請到「今天」頁面確認`));

    db.appts
      .filter(a => !a.done && (a.date === today || a.date === addDays(today, 1)) && !dismissed.has(a.id + a.date))
      .sort(cmpAppt)
      .forEach(a => items.push(h('div', { class: 'alert appt', role: 'alert' },
        h('span', {}, `🏥 ${a.date === today ? '今天' : '明天'}要看診：${apptText(a)}`),
        h('button', { class: 'btn', type: 'button', onclick: () => { dismissed.add(a.id + a.date); renderAlerts(); } }, '知道了'))));

    $('#alerts').replaceChildren(...items);
  };

  const checkReminders = () => {
    const today = todayStr(), nowM = minutesOf(nowHM());
    for (const d of dosesFor(today)) {
      const late = nowM - minutesOf(d.time);
      if (late >= 0 && late <= 180 && !takenAt(today, d.key) && fireOnce(`d|${today}|${d.key}`)) {
        notify('💊 該吃藥了', `${d.med.name}${d.med.dose ? ' ' + d.med.dose : ''}（${d.time}）`);
      }
    }
    for (const a of db.appts) {
      if (a.done) continue;
      if (a.date === today) {
        const from = a.time ? minutesOf(a.time) - 60 : 8 * 60; // 看診前 1 小時提醒
        const until = a.time ? minutesOf(a.time) + 60 : 24 * 60;
        if (nowM >= from && nowM <= until && fireOnce(`a1|${a.id}|${a.date}`)) notify('🏥 今天要看診', apptText(a));
      } else if (a.date === addDays(today, 1) && nowM >= 9 * 60 && fireOnce(`a0|${a.id}|${a.date}`)) {
        notify('🏥 明天要看診', apptText(a));
      }
    }
    renderAlerts();
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement ? document.activeElement.tagName : '');
    if (state.tab === 'today' && state.date === todayStr() && !picker.open && !typing) render();
  };

  /* ---------- 畫面：看診與用藥 ---------- */

  const field = (label, input, cls = '') => h('label', { class: `field ${cls}` }, h('span', {}, label), input);
  const bindDraft = (draft, k) => e => { draft[k] = e.target.value; };
  const focusForm = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ block: 'center' }); };

  const saveAppt = () => {
    const d = state.apptDraft;
    if (!validDate(d.date)) { toast('請選擇看診日期'); return; }
    if (!d.place.trim() && !d.dept.trim()) { toast('請填寫醫院或科別'); return; }
    const old = db.appts.find(a => a.id === d.id);
    const rec = normalizeAppt({ ...d, id: d.id || uid(), done: old ? old.done : false });
    db.appts = old ? db.appts.map(a => (a.id === d.id ? rec : a)) : [...db.appts, rec];
    state.apptDraft = newAppt();
    save(); render();
    toast(old ? '已更新看診資料' : '已加入看診提醒');
  };

  const apptForm = () => {
    const d = state.apptDraft;
    return h('form', { class: 'form', id: 'apptForm', onsubmit: e => { e.preventDefault(); saveAppt(); } },
      h('h3', {}, d.id ? '✏️ 修改看診' : '＋ 新增看診'),
      h('div', { class: 'form-grid' },
        field('看診日期', h('input', { type: 'date', required: true, value: d.date, oninput: bindDraft(d, 'date') })),
        field('時間（選填）', h('input', { type: 'time', value: d.time, oninput: bindDraft(d, 'time') })),
        field('醫院／診所', h('input', { type: 'text', maxlength: 40, value: d.place, placeholder: '例如：市立醫院', oninput: bindDraft(d, 'place') })),
        field('科別', h('input', { type: 'text', maxlength: 30, value: d.dept, placeholder: '例如：心臟內科', oninput: bindDraft(d, 'dept') })),
        field('醫師（選填）', h('input', { type: 'text', maxlength: 30, value: d.doctor, oninput: bindDraft(d, 'doctor') })),
        field('備註（選填）', h('input', { type: 'text', maxlength: 120, value: d.note, placeholder: '例如：空腹抽血、帶健保卡', oninput: bindDraft(d, 'note') }))),
      h('div', { class: 'row' },
        h('button', { class: 'btn primary', type: 'submit' }, d.id ? '儲存修改' : '加入看診'),
        d.id && h('button', { class: 'btn', type: 'button', onclick: () => { state.apptDraft = newAppt(); render(); } }, '取消修改')));
  };

  const apptItem = (a, past = false) => h('article', { class: `item${past ? ' past' : ''}${!past && daysUntil(a.date) <= 1 ? ' soon' : ''}` },
    h('div', { class: 'item-top' },
      h('span', { class: `cd${daysUntil(a.date) <= 1 && !past ? ' soon' : ''}` }, a.done ? '已看診' : countdown(a.date)),
      h('b', {}, `${rocDate(a.date)}（${WD[parse(a.date).getDay()]}）${a.time ? ' ' + a.time : ''}`)),
    h('p', {}, [a.place, a.dept, a.doctor && `${a.doctor} 醫師`].filter(Boolean).join('　')),
    a.note && h('p', { class: 'hint' }, `📌 ${a.note}`),
    h('div', { class: 'row' },
      h('button', { class: 'btn', type: 'button', onclick: () => { a.done = !a.done; save(); render(); } }, a.done ? '↩ 取消已看診' : '✔ 已看診'),
      !past && h('button', { class: 'btn', type: 'button', onclick: () => exportAppt(a) }, '📅 加到行事曆'),
      h('button', { class: 'btn', type: 'button', onclick: () => { state.apptDraft = { ...a }; render(); focusForm('apptForm'); } }, '✏️ 修改'),
      h('button', { class: 'btn danger', type: 'button', onclick: () => {
        if (!confirm('確定要刪除這筆看診嗎？')) return;
        db.appts = db.appts.filter(x => x.id !== a.id); save(); render();
      } }, '🗑 刪除')));

  const MED_PRESETS = [
    { label: '早餐後', t: '08:00' }, { label: '午餐後', t: '12:30' },
    { label: '晚餐後', t: '18:30' }, { label: '睡前', t: '21:30' },
  ];

  const saveMed = () => {
    const d = state.medDraft;
    const times = [...new Set(d.times.filter(validTime))].sort();
    if (!d.name.trim()) { toast('請填寫藥名'); return; }
    if (!times.length) { toast('請選擇每天吃藥的時間'); return; }
    const old = db.meds.find(m => m.id === d.id);
    const rec = normalizeMed({ ...d, id: d.id || uid(), times, start: old ? old.start : todayStr() });
    db.meds = old ? db.meds.map(m => (m.id === d.id ? rec : m)) : [...db.meds, rec];
    state.medDraft = newMed();
    save(); render();
    toast(old ? '已更新藥物' : '已加入每日用藥');
  };

  const medForm = () => {
    const d = state.medDraft;
    return h('form', { class: 'form', id: 'medForm', onsubmit: e => { e.preventDefault(); saveMed(); } },
      h('h3', {}, d.id ? '✏️ 修改藥物' : '＋ 新增藥物'),
      h('div', { class: 'form-grid' },
        field('藥名', h('input', { type: 'text', maxlength: 40, required: true, value: d.name, placeholder: '例如：降血壓藥', oninput: bindDraft(d, 'name') })),
        field('每次劑量', h('input', { type: 'text', maxlength: 40, value: d.dose, placeholder: '例如：1 顆', oninput: bindDraft(d, 'dose') })),
        field('備註（選填）', h('input', { type: 'text', maxlength: 80, value: d.note, placeholder: '例如：飯後吃', oninput: bindDraft(d, 'note') }), 'wide'),
        h('div', { class: 'field wide' },
          h('span', {}, '每天幾點吃？（可選多個）'),
          h('div', { class: 'presets' }, MED_PRESETS.map(p => h('button', {
            class: 'chipbtn', type: 'button', 'aria-pressed': String(d.times.includes(p.t)),
            onclick: () => { d.times = d.times.includes(p.t) ? d.times.filter(t => t !== p.t) : [...d.times, p.t].sort(); render(); },
          }, `${p.label} ${p.t}`)),
          h('button', { class: 'chipbtn', type: 'button', onclick: () => { d.times.push('12:00'); render(); } }, '＋ 其他時間')),
          d.times.length > 0 && h('div', { class: 'times', style: 'margin-top:8px' }, d.times.map((t, i) => h('span', { class: 'time-item' },
            h('input', { type: 'time', required: true, value: t, 'aria-label': `第 ${i + 1} 個吃藥時間`, oninput: e => { d.times[i] = e.target.value; } }),
            h('button', { class: 'mini', type: 'button', 'aria-label': '刪除這個時間', onclick: () => { d.times.splice(i, 1); render(); } }, '✕')))))),
      h('div', { class: 'row' },
        h('button', { class: 'btn primary', type: 'submit' }, d.id ? '儲存修改' : '加入用藥'),
        d.id && h('button', { class: 'btn', type: 'button', onclick: () => { state.medDraft = newMed(); render(); } }, '取消修改')));
  };

  const medItem = m => h('article', { class: 'item' },
    h('div', { class: 'item-top' }, h('b', {}, m.name), m.dose && h('span', {}, m.dose)),
    h('div', { class: 'times-line' }, m.times.map(t => h('span', { class: 'tchip' }, `🕒 ${t}`))),
    m.note && h('p', { class: 'hint' }, `📌 ${m.note}`),
    h('div', { class: 'row' },
      h('button', { class: 'btn', type: 'button', onclick: () => { state.medDraft = { ...m, times: [...m.times] }; render(); focusForm('medForm'); } }, '✏️ 修改'),
      h('button', { class: 'btn danger', type: 'button', onclick: () => {
        if (!confirm(`確定要刪除「${m.name}」嗎？`)) return;
        db.meds = db.meds.filter(x => x.id !== m.id); save(); render();
      } }, '🗑 刪除')));

  const reminderCard = () => {
    const denied = 'Notification' in window && Notification.permission === 'denied';
    return h('section', { class: 'card', 'aria-labelledby': 'rem-h' },
      h('h2', { id: 'rem-h' }, '🔔 提醒設定'),
      h('div', { class: 'row', style: 'margin-top:0' },
        h('button', { class: `btn${db.notify ? ' primary' : ''}`, type: 'button', 'aria-pressed': String(db.notify), onclick: toggleNotify },
          db.notify ? '🔔 提醒鈴聲與通知：已開啟' : '🔕 開啟提醒鈴聲與通知'),
        h('button', { class: 'btn', type: 'button', onclick: () => { beep(); toast('🔔 這就是提醒的聲音'); } }, '▶ 試聽鈴聲')),
      denied && h('p', { class: 'hint' }, '瀏覽器已封鎖通知，請在網址列旁的鎖頭圖示中允許通知；不允許也仍會在網頁上顯示提醒橫幅。'),
      h('p', { class: 'hint' }, '⚠️ 網頁必須保持開啟（不必停在這一頁），到時間才會跳出提醒、響鈴。'),
      h('p', { class: 'hint' }, '📱 想在網頁關閉、手機鎖屏時也準時提醒：請在下方按「加到行事曆」，讓手機的行事曆 App 來提醒。'));
  };

  const careView = () => {
    const today = todayStr();
    const upcoming = db.appts.filter(a => !a.done && a.date >= today).sort(cmpAppt);
    const past = db.appts.filter(a => a.done || a.date < today).sort((a, b) => cmpAppt(b, a)).slice(0, 5);
    return [
      reminderCard(),
      h('section', { class: 'card', 'aria-labelledby': 'ap-h' },
        h('h2', { id: 'ap-h' }, '🏥 看診時間'),
        upcoming.length
          ? h('div', { class: 'list' }, upcoming.map(a => apptItem(a)))
          : h('p', { class: 'empty' }, '目前沒有預約的看診，請在下方新增。'),
        apptForm(),
        past.length > 0 && h('details', { style: 'margin-top:12px' },
          h('summary', {}, `已過去／已看診（最近 ${past.length} 筆）`),
          h('div', { class: 'list' }, past.map(a => apptItem(a, true))))),
      h('section', { class: 'card', 'aria-labelledby': 'md-h' },
        h('h2', { id: 'md-h' }, '💊 每日用藥'),
        db.meds.length
          ? h('div', { class: 'list' }, db.meds.map(medItem))
          : h('p', { class: 'empty' }, '還沒有設定藥物，請在下方新增。'),
        db.meds.length > 0 && h('button', { class: 'btn block', type: 'button', onclick: exportMeds }, '📅 全部用藥時間加到行事曆'),
        medForm()),
    ];
  };

  /* ---------- 會員登入與雲端同步（Supabase Auth + daily_logs）---------- */
  // 本機優先：所有修改先存在本機，已登入時在背景上傳。
  // 雲端資料表都有 RLS，每個人只能讀寫自己的資料。

  const sb = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
  const cloud = { user: null, status: 'off' }; // status: off | syncing | ok | error
  let flushing = false, flushTimer;

  const EMPTY_SETTINGS = JSON.stringify({ meds: [], appts: [] });
  const settingsJson = () => JSON.stringify({ meds: db.meds, appts: db.appts });
  // 「用藥＋看診」有尚未上傳的修改嗎？（db.settingsSynced＝雲端最後確認收到的版本）
  const settingsPending = () => {
    const j = settingsJson(), s = db.settingsSynced || '';
    return j !== s && !(s === '' && j === EMPTY_SETTINGS);
  };
  const isTyping = () => /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement ? document.activeElement.tagName : '');
  const memberName = () => {
    const u = cloud.user;
    return u ? ((u.user_metadata && u.user_metadata.name) || u.email || '會員') : '';
  };

  const setStatus = s => { cloud.status = s; renderAcct(); };

  const syncSoon = (delay = 1200) => {
    if (!sb || !cloud.user) return;
    clearTimeout(flushTimer);
    flushTimer = setTimeout(flush, delay);
  };

  const dayPayload = date => {
    const { ts, ...rest } = db.days[date]; // eslint-disable-line no-unused-vars
    return { ...rest, taken: db.medLog[date] || {} };
  };

  const flush = async () => {
    if (!sb || !cloud.user) return;
    if (flushing) { syncSoon(500); return; }
    flushing = true;
    setStatus('syncing');
    const uidNow = cloud.user.id;
    try {
      for (const date of [...dirtyDays]) {
        const day = db.days[date];
        if (!day) { dirtyDays.delete(date); continue; }
        if (!day.ts) day.ts = Date.now();
        const sentTs = day.ts;
        const { error } = await sb.from('daily_logs').upsert(
          { user_id: uidNow, log_date: date, data: dayPayload(date), updated_at: new Date(sentTs).toISOString() },
          { onConflict: 'user_id,log_date' });
        if (error) throw error;
        if (db.days[date] && db.days[date].ts === sentTs) dirtyDays.delete(date); // 上傳途中又改過就保留
      }
      if (settingsPending()) {
        const json = settingsJson();
        const ts = Date.now();
        const { error } = await sb.from('user_settings').upsert(
          { user_id: uidNow, data: { meds: db.meds, appts: db.appts }, updated_at: new Date(ts).toISOString() },
          { onConflict: 'user_id' });
        if (error) throw error;
        db.settingsTs = ts;
        db.settingsSynced = json;
        saveLocal();
      }
      flushing = false;
      setStatus('ok');
      if (dirtyDays.size || settingsPending()) syncSoon();
    } catch (_) {
      flushing = false;
      setStatus('error');
      syncSoon(30000); // 網路不通時 30 秒後再試
    }
  };

  // 從雲端取回資料，與本機合併（以「最後修改時間」較新的為準）
  const pullAll = async () => {
    if (!sb || !cloud.user) return;
    setStatus('syncing');
    let changed = false;
    try {
      const { data: rows, error } = await sb.from('daily_logs')
        .select('log_date,data,updated_at').order('log_date', { ascending: false }).limit(1000);
      if (error) throw error;
      const seen = new Set();
      for (const r of rows) {
        seen.add(r.log_date);
        const cloudTs = Date.parse(r.updated_at);
        const local = db.days[r.log_date];
        if (!local || cloudTs > (local.ts || 0)) {
          const day = normalizeDay(r.data);
          day.ts = cloudTs;
          db.days[r.log_date] = day;
          const taken = cleanTaken(r.data && r.data.taken);
          if (Object.keys(taken).length) db.medLog[r.log_date] = taken; else delete db.medLog[r.log_date];
          changed = true;
        } else if ((local.ts || 0) > cloudTs) {
          dirtyDays.add(r.log_date);
        }
      }
      for (const date of Object.keys(db.days)) if (!seen.has(date)) dirtyDays.add(date); // 雲端還沒有的日子

      const { data: s, error: e2 } = await sb.from('user_settings').select('data,updated_at').maybeSingle();
      if (e2) throw e2;
      // 本機沒有未上傳的修改時，才用雲端版本覆蓋；有的話以本機為準，稍後上傳
      if (s && !settingsPending()) {
        const before = settingsJson();
        db.meds = (Array.isArray(s.data && s.data.meds) ? s.data.meds : []).map(normalizeMed).filter(Boolean);
        db.appts = (Array.isArray(s.data && s.data.appts) ? s.data.appts : []).map(normalizeAppt).filter(Boolean);
        db.settingsTs = Date.parse(s.updated_at);
        db.settingsSynced = settingsJson();
        if (before !== db.settingsSynced) changed = true;
      }
      saveLocal();
      setStatus('ok');
      if (changed && !isTyping()) render();
      syncSoon(300);
    } catch (_) {
      setStatus('error');
      syncSoon(30000);
    }
  };

  const hasData = x => Object.keys(x.days).length > 0 || x.meds.length > 0 || x.appts.length > 0;
  const mergeInto = (target, src) => {
    for (const [date, day] of Object.entries(src.days)) {
      const t = target.days[date];
      if (!t || (day.ts || 0) > (t.ts || 0)) {
        target.days[date] = day;
        if (src.medLog[date]) target.medLog[date] = src.medLog[date];
      }
    }
    for (const m of src.meds) if (!target.meds.some(x => x.id === m.id)) target.meds.push(m);
    for (const a of src.appts) if (!target.appts.some(x => x.id === a.id)) target.appts.push(a);
    for (const i of src.invites) if (!target.invites.some(x => x.email === i.email)) target.invites.push(i);
  };

  // 登入／登出時切換資料：登入用該會員自己的本機資料，登出回到訪客資料
  let adoptedUid = null;
  const adoptSession = async session => {
    const user = session ? session.user : null;
    const id = user ? user.id : null;
    if (id === adoptedUid) { cloud.user = user; renderAcct(); return; }
    adoptedUid = id;
    cloud.user = user;
    clearTimeout(flushTimer);
    dirtyDays.clear();
    const fontSize = db.fontSize;

    if (user) {
      const guest = readDb(GUEST_KEY);
      storeKey = userKey(id);
      db = readDb(storeKey);
      db.fontSize = fontSize;
      if (hasData(guest)) {
        const n = Object.keys(guest.days).length;
        if (confirm(`這台裝置上已有訪客記錄（${n} 天）。\n要合併到「${memberName()}」的帳號嗎？\n\n按「取消」則不合併，這些記錄會繼續留在訪客資料裡。`)) {
          mergeInto(db, guest);
          writeDb(GUEST_KEY, { ...normalizeDb({}), fontSize });
        }
      }
      saveLocal();
    } else {
      storeKey = GUEST_KEY;
      db = readDb(GUEST_KEY);
      db.fontSize = fontSize;
    }
    state.date = todayStr();
    render();
    renderAcct();
    if (user) await pullAll();
  };

  const flushNow = async () => {
    clearTimeout(flushTimer);
    for (let i = 0; i < 40 && flushing; i++) await new Promise(r => setTimeout(r, 250));
    await flush();
  };

  const logout = async () => {
    if (!sb) return;
    await flushNow();
    const synced = cloud.status === 'ok' && !dirtyDays.size && !settingsPending();
    const key = storeKey;
    if (!synced && !confirm('還有記錄尚未同步到雲端（可能是網路不通）。現在登出，這些記錄會留在這台裝置，下次登入時會再同步。\n\n確定要登出嗎？')) return;
    await sb.auth.signOut();
    // 已完全同步就清掉這台裝置上的個人副本，共用電腦更安心
    if (synced) { try { localStorage.removeItem(key); } catch (_) { /* ignore */ } }
    toast('已登出');
  };

  if (sb) {
    // 注意：回呼裡不能直接呼叫其他 supabase 方法，所以用 setTimeout 跳出去
    sb.auth.onAuthStateChange((_evt, session) => { setTimeout(() => adoptSession(session), 0); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden && cloud.user) pullAll(); });
    window.addEventListener('online', () => { if (cloud.user) syncSoon(300); });
  }

  /* ---- 帳號列（頁首下方）---- */

  const renderAcct = () => {
    const bar = $('#acctbar');
    if (!bar) return;
    if (!sb) {
      bar.replaceChildren(h('span', { class: 'acct-msg' }, '☁️ 雲端功能暫時無法使用（需要連上網路）。記錄仍會存在這台裝置。'));
      return;
    }
    if (!cloud.user) {
      bar.replaceChildren(
        h('span', { class: 'acct-msg' }, '☁️ 尚未登入：記錄只存在這台裝置。登入後會存到雲端，換手機也能看。'),
        h('button', { class: 'acct-btn', type: 'button', onclick: () => openAuth('login') }, '登入／註冊'));
      return;
    }
    const st = { syncing: '🔄 同步中…', ok: '✅ 已同步到雲端', error: '⚠️ 同步失敗，稍後會自動重試', off: '' }[cloud.status];
    bar.replaceChildren(
      h('span', { class: 'acct-msg' }, h('b', {}, `👤 ${memberName()}`), h('span', { class: `sync ${cloud.status}` }, `　${st}`)),
      h('button', { class: 'acct-btn', type: 'button', onclick: logout }, '登出'));
  };

  /* ---- 登入／註冊視窗 ---- */

  const authDlg = $('#auth');
  const au = { mode: 'login', busy: false, err: '', info: '', draft: { name: '', email: '', pw: '' } };

  const authErrText = e => {
    const m = String((e && e.message) || e || '');
    if (/invalid login credentials/i.test(m)) return '電子郵件或密碼錯誤';
    if (/email not confirmed/i.test(m)) return '這個 Email 還沒完成確認，請先到信箱點確認信裡的連結';
    if (/already (been )?registered/i.test(m)) return '這個 Email 已經註冊過了，請直接登入';
    if (/rate limit|too many|over_email_send/i.test(m)) return '嘗試或寄信次數太多，請過一段時間再試';
    if (/password should be at least/i.test(m)) return '密碼至少要 6 個字元';
    if (/email.*invalid|invalid.*email/i.test(m)) return 'Email 格式不正確，或這個 Email 網域不被接受';
    if (/failed to fetch|network/i.test(m)) return '連不上網路，請檢查網路後再試';
    return '發生問題，請稍後再試';
  };

  const submitAuth = async () => {
    if (au.busy || !sb) return;
    const d = au.draft;
    const email = d.email.trim().toLowerCase();
    const name = d.name.trim();
    au.err = ''; au.info = '';
    if (au.mode === 'register' && !name) { au.err = '請填寫姓名'; renderAuth(); return; }
    if (!EMAIL_RE.test(email)) { au.err = 'Email 格式不正確'; renderAuth(); return; }
    if (d.pw.length < 6) { au.err = '密碼至少要 6 個字元'; renderAuth(); return; }

    au.busy = true; renderAuth();
    try {
      if (au.mode === 'register') {
        const { data, error } = await sb.auth.signUp({ email, password: d.pw, options: { data: { name } } });
        if (error) throw error;
        if (!data.session) {
          // 專案要求 Email 確認：要先到信箱點連結
          au.info = data.user && data.user.identities && data.user.identities.length === 0
            ? '這個 Email 已經註冊過了，請直接登入。'
            : `已寄出確認信到 ${email}。請到信箱點確認連結，完成後回來登入。（沒收到請看垃圾郵件匣）`;
          au.mode = 'login'; d.pw = ''; au.busy = false; renderAuth();
          return;
        }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password: d.pw });
        if (error) throw error;
      }
      // 記錄這次登入（失敗也不影響使用）
      try { await sb.rpc('record_login', { p_ua: navigator.userAgent }); } catch (_) { /* ignore */ }
      au.draft = { name: '', email: '', pw: '' };
      au.busy = false;
      authDlg.close();
    } catch (e) {
      au.err = authErrText(e); d.pw = ''; au.busy = false; renderAuth();
    }
  };

  const renderAuth = () => {
    const d = au.draft;
    const reg = au.mode === 'register';
    authDlg.replaceChildren(h('div', { class: 'pk' },
      h('div', { class: 'pk-head' },
        h('h2', { id: 'authTitle' }, reg ? '👤 註冊帳號' : '👤 會員登入'),
        h('button', { class: 'btn', type: 'button', onclick: () => authDlg.close() }, '✔ 關閉')),
      h('div', { class: 'pk-body' },
        h('div', { class: 'seg', role: 'group', 'aria-label': '登入或註冊', style: 'margin-bottom:10px' },
          h('button', { type: 'button', 'aria-pressed': String(!reg), onclick: () => { au.mode = 'login'; au.err = ''; au.info = ''; renderAuth(); } }, '我已有帳號'),
          h('button', { type: 'button', 'aria-pressed': String(reg), onclick: () => { au.mode = 'register'; au.err = ''; au.info = ''; renderAuth(); } }, '第一次使用')),
        h('p', { class: 'hint', style: 'margin-top:0' }, '登入後，三餐、健康數值、用藥與看診都會存到雲端；每個人只看得到自己的資料。'),
        au.info && h('p', { class: 'okmsg', role: 'status' }, au.info),
        h('form', { class: 'form', onsubmit: e => { e.preventDefault(); submitAuth(); } },
          h('div', { class: 'form-grid' },
            reg && field('姓名', h('input', { type: 'text', name: 'name', required: true, maxlength: 40, autocomplete: 'name', value: d.name, oninput: bindDraft(d, 'name') }), 'wide'),
            field('Email', h('input', { type: 'email', name: 'email', required: true, maxlength: 80, autocomplete: 'email', value: d.email, placeholder: 'name@example.com', oninput: bindDraft(d, 'email') }), 'wide'),
            field(reg ? '設定密碼（至少 6 個字元）' : '密碼', h('input', { type: 'password', name: 'pw', required: true, minlength: 6, autocomplete: reg ? 'new-password' : 'current-password', value: d.pw, oninput: bindDraft(d, 'pw') }), 'wide')),
          au.err && h('p', { class: 'err', role: 'alert' }, `⚠️ ${au.err}`),
          h('div', { class: 'row' }, h('button', { class: 'btn primary block', type: 'submit', disabled: au.busy },
            au.busy ? '處理中…' : (reg ? '建立帳號' : '登入')))))));
  };

  const openAuth = (mode = 'login', name = '') => {
    if (!sb) { toast('雲端功能暫時無法使用'); return; }
    au.mode = mode; au.err = ''; au.info = '';
    if (name) au.draft.name = name;
    renderAuth();
    authDlg.showModal();
  };
  authDlg.addEventListener('click', e => { if (e.target === authDlg) authDlg.close(); });

  /* ---------- 邀請家人朋友 ---------- */

  const inviteDlg = $('#invite');
  const inv = { draft: { name: '', email: '', note: '' }, sent: null, msg: '', err: '', busy: false };

  const isLocalHost = () => location.protocol === 'file:'
    || /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1)/.test(location.hostname);
  const siteUrl = () => db.siteUrl || (location.protocol === 'file:' ? location.href : location.origin + location.pathname);

  // 每位受邀者有自己的接受連結：網站網址 + ?invite=專屬代碼
  const acceptUrl = token => {
    try { const u = new URL(siteUrl()); u.searchParams.set('invite', token); return u.toString(); }
    catch (_) { return `${siteUrl()}?invite=${encodeURIComponent(token)}`; }
  };

  const buildInvite = (i, token) => {
    const text = [
      `${i.name} 您好：`, '',
      '邀請您一起使用「銀髮健康日記簿」，可以記錄每天的三餐、喝水、用藥時間與看診提醒。', '',
      '✅ 請點下面這個連結「接受邀請」，就會開啟網站：',
      `👉 ${acceptUrl(token)}`,
      ...(i.note ? ['', `💬 留言：${i.note}`] : []),
      '',
      '使用方式：用手機或電腦打開上面的連結就能開始。每個人的日記都只存在自己的裝置裡，只有自己看得到，不會互相影響。',
    ].join('\n');
    const subject = `${i.name}，邀請您一起使用「銀髮健康日記簿」`;
    const mailto = `mailto:${encodeURIComponent(i.email).replace(/%40/g, '@')}`
      + `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text.replace(/\n/g, '\r\n'))}`;
    const line = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    return { text, subject, mailto, line };
  };

  const openMail = href => { const a = h('a', { href }); document.body.append(a); a.click(); a.remove(); };

  const copyText = async text => {
    try { await navigator.clipboard.writeText(text); return true; } catch (_) { /* 改用備援方式 */ }
    try {
      const ta = h('textarea', { style: 'position:fixed;opacity:0' }, text);
      document.body.append(ta); ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (_) { return false; }
  };

  // 對話框蓋在最上層，一般的吐司訊息會被擋住，所以訊息顯示在對話框內
  let invMsgTimer;
  const flash = msg => {
    inv.msg = msg; renderInvite();
    clearTimeout(invMsgTimer);
    invMsgTimer = setTimeout(() => { inv.msg = ''; if (inviteDlg.open) renderInvite(); }, 2500);
  };

  const submitInvite = () => {
    const d = inv.draft;
    const name = d.name.trim(), email = d.email.trim(), note = d.note.trim();
    if (!name) { inv.err = '請填寫姓名'; renderInvite(); return; }
    if (!EMAIL_RE.test(email)) { inv.err = 'Email 格式不正確，請再確認'; renderInvite(); return; }
    requestInvite({ name, email, note });
  };

  // 先把邀請記錄到資料庫（取得專屬接受代碼），成功後才產生邀請信
  const requestInvite = async ({ name, email, note }) => {
    if (inv.busy) return;
    inv.busy = true; inv.err = ''; renderInvite();
    let token;
    try {
      token = await rpc('create_invitation', { p_name: name, p_email: email, p_note: note });
    } catch (_) {
      inv.busy = false;
      inv.err = '無法連線到資料庫，這次邀請沒有送出。請檢查網路後再試一次。';
      renderInvite();
      return;
    }
    inv.busy = false;

    const rec = normalizeInvite({ id: uid(), name, email, note, date: todayStr() });
    const i = db.invites.findIndex(x => x.email.toLowerCase() === email.toLowerCase());
    if (i >= 0) db.invites[i] = { ...rec, id: db.invites[i].id }; else db.invites.unshift(rec);
    save();
    inv.draft = { name: '', email: '', note: '' };

    const built = buildInvite(rec, token);
    inv.sent = { ...rec, ...built };
    renderInvite();
    openMail(built.mailto);
  };

  const renderInvite = () => {
    const d = inv.draft;
    const url = siteUrl();
    const local = !db.siteUrl && isLocalHost();
    const s = inv.sent;
    let urlInput;

    inviteDlg.replaceChildren(h('div', { class: 'pk' },
      h('div', { class: 'pk-head' },
        h('h2', { id: 'inviteTitle' }, '✉️ 邀請家人朋友'),
        h('button', { class: 'btn', type: 'button', onclick: () => inviteDlg.close() }, '✔ 關閉')),
      h('div', { class: 'pk-body' },
        h('p', { class: 'hint', style: 'margin-top:0' }, '邀請對方一起使用。每個人的日記簿都存在自己的手機或電腦裡，各自管理、互相看不到。'),
        inv.msg && h('p', { class: 'okmsg', role: 'status' }, inv.msg),

        h('div', { class: 'linkbox' },
          h('b', {}, '🔗 網站連結'),
          h('a', { class: 'url', href: url, target: '_blank', rel: 'noopener' }, url),
          h('div', { class: 'row', style: 'margin-top:6px' },
            h('button', { class: 'btn', type: 'button', onclick: async () => flash(await copyText(url) ? '✓ 已複製網站連結' : '複製失敗，請長按連結自行複製') }, '📋 複製連結')),
          local && h('p', { class: 'warn' }, '⚠️ 目前是在這台電腦上開啟，對方點這個連結會打不開。等網站放上網路後，請在下方改成正式網址。'),
          h('details', { open: local },
            h('summary', {}, '更改網站連結'),
            h('div', { class: 'urledit' },
              urlInput = h('input', { type: 'url', placeholder: 'https://你的網站網址', value: db.siteUrl, 'aria-label': '網站正式網址' }),
              h('button', { class: 'btn primary', type: 'button', onclick: () => {
                const v = urlInput.value.trim();
                if (v && !/^https?:\/\/\S+$/.test(v)) { inv.err = '網址請以 http:// 或 https:// 開頭'; renderInvite(); return; }
                inv.err = ''; db.siteUrl = v; save();
                flash(v ? '✓ 已儲存網站連結' : '已恢復為目前網址');
              } }, '儲存')))),

        inv.err && h('p', { class: 'err', role: 'alert' }, `⚠️ ${inv.err}`),

        s
          ? h('div', { class: 'sent' },
            h('h3', {}, `✅ 已為 ${s.name} 準備好邀請信`),
            h('p', { class: 'hint' }, `收件人：${s.email}。邀請已記錄。本網站無法自動代寄，請在跳出的郵件程式按「傳送」；沒有跳出的話，可用下面的方式。對方點信中的「接受邀請」連結，就會開啟網站並完成接受。`),
            h('textarea', { readonly: true, 'aria-label': '邀請內容', rows: 8 }, s.text),
            h('div', { class: 'row' },
              h('a', { class: 'btn primary', href: s.mailto }, '✉️ 開啟郵件程式'),
              h('button', { class: 'btn', type: 'button', onclick: async () => flash(await copyText(s.text) ? '✓ 已複製邀請內容，可貼到 LINE 或簡訊' : '複製失敗，請長按文字自行複製') }, '📋 複製邀請內容'),
              h('a', { class: 'btn', href: s.line, target: '_blank', rel: 'noopener' }, '💬 用 LINE 傳送'),
              h('button', { class: 'btn', type: 'button', onclick: () => { inv.sent = null; renderInvite(); } }, '＋ 再邀請一位')))
          : h('form', { class: 'form', onsubmit: e => { e.preventDefault(); submitInvite(); } },
            h('div', { class: 'form-grid' },
              field('姓名', h('input', { type: 'text', name: 'name', required: true, maxlength: 40, autocomplete: 'off', value: d.name, placeholder: '例如：王小明', oninput: bindDraft(d, 'name') }), 'wide'),
              field('Email', h('input', { type: 'email', name: 'email', required: true, maxlength: 80, autocomplete: 'off', value: d.email, placeholder: 'name@example.com', oninput: bindDraft(d, 'email') }), 'wide'),
              field('備註（會附在邀請信中）', h('textarea', { name: 'note', maxlength: 200, rows: 3, placeholder: '例如：媽媽，這是幫你記三餐和吃藥的網站', oninput: bindDraft(d, 'note') }, d.note), 'wide')),
            h('div', { class: 'row' }, h('button', { class: 'btn primary block', type: 'submit', disabled: inv.busy }, inv.busy ? '送出中…' : '送出邀請'))),

        db.invites.length > 0 && h('div', { class: 'invite-list' },
          h('h3', {}, `📒 邀請紀錄（${db.invites.length}）`),
          db.invites.map(i => h('div', { class: 'invite-row' },
            h('span', { class: 'who' }, h('b', {}, i.name), h('small', {}, `${i.email}　${i.date}`)),
            h('button', { class: 'btn', type: 'button', disabled: inv.busy, onclick: () => requestInvite(i) }, '再寄一次'),
            h('button', { class: 'btn danger', type: 'button', 'aria-label': `刪除 ${i.name} 的邀請紀錄`, onclick: () => {
              if (!confirm(`確定要刪除「${i.name}」的邀請紀錄嗎？`)) return;
              db.invites = db.invites.filter(x => x.id !== i.id); save(); renderInvite();
            } }, '刪除')))))));
  };

  const openInvite = () => {
    inv.sent = null; inv.msg = ''; inv.err = '';
    renderInvite();
    inviteDlg.showModal();
  };

  inviteDlg.addEventListener('click', e => { if (e.target === inviteDlg) inviteDlg.close(); });
  $('#btnInvite').addEventListener('click', openInvite);

  /* ---------- 管理員：登入與查看受邀名單 ---------- */
  // 帳密不放在網頁裡：由資料庫函式驗證（密碼只存雜湊），連續失敗 5 次會鎖定 10 分鐘。

  const adminDlg = $('#admin');
  const adm = { draft: { u: '', p: '' }, creds: null, items: null, members: null, tab: 'invites', err: '', busy: false };
  const fmtTime = iso => {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const adminLogin = async (u, p) => {
    adm.busy = true; adm.err = ''; renderAdmin();
    try {
      const r = await rpc('admin_list_invitations', { p_username: u, p_password: p });
      if (r.ok) {
        const m = await rpc('admin_list_members', { p_username: u, p_password: p });
        adm.creds = { u, p }; adm.items = r.items; adm.members = m.ok ? m : { members: [], logins: [] };
        adm.draft = { u: '', p: '' };
      } else {
        adm.draft.p = '';
        adm.err = r.error === 'locked' ? '登入錯誤次數過多，請 10 分鐘後再試' : '帳號或密碼錯誤';
      }
    } catch (_) {
      adm.err = '無法連線到資料庫，請檢查網路後再試';
    }
    adm.busy = false;
    renderAdmin();
  };

  const renderAdmin = () => {
    const d = adm.draft;
    const items = adm.items;
    let body;

    if (!items) {
      body = h('form', { class: 'form', onsubmit: e => { e.preventDefault(); adminLogin(d.u.trim(), d.p); } },
        h('div', { class: 'form-grid' },
          field('管理員帳號', h('input', { type: 'text', name: 'u', required: true, autocomplete: 'username', autocapitalize: 'off', value: d.u, oninput: bindDraft(d, 'u') }), 'wide'),
          field('密碼', h('input', { type: 'password', name: 'p', required: true, autocomplete: 'current-password', value: d.p, oninput: bindDraft(d, 'p') }), 'wide')),
        adm.err && h('p', { class: 'err', role: 'alert' }, `⚠️ ${adm.err}`),
        h('div', { class: 'row' }, h('button', { class: 'btn primary block', type: 'submit', disabled: adm.busy }, adm.busy ? '登入中…' : '登入')));
    } else {
      const accepted = items.filter(x => x.accepted_at).length;
      const mem = adm.members;
      const invitesView = () => [
        h('div', { class: 'week-stats' },
          h('div', { class: 'stat' }, h('b', {}, items.length), h('span', {}, '受邀人數')),
          h('div', { class: 'stat' }, h('b', {}, accepted), h('span', {}, '已接受')),
          h('div', { class: 'stat' }, h('b', {}, items.length - accepted), h('span', {}, '尚未接受'))),
        items.length
          ? h('div', { class: 'list', style: 'margin-top:12px' }, items.map(x => h('article', { class: 'item' },
            h('div', { class: 'item-top' },
              h('b', {}, x.name),
              h('span', { class: `state ${x.accepted_at ? 'ok' : 'wait'}` }, x.accepted_at ? `✅ 已接受 ${fmtTime(x.accepted_at)}` : '⏳ 尚未接受')),
            h('p', { class: 'em' }, x.email),
            x.note && h('p', { class: 'hint' }, `📌 ${x.note}`),
            h('p', { class: 'hint' }, `邀請時間：${fmtTime(x.invited_at)}`))))
          : h('p', { class: 'empty', style: 'margin-top:12px' }, '目前還沒有人被邀請。'),
      ];
      const membersView = () => [
        h('div', { class: 'week-stats' },
          h('div', { class: 'stat' }, h('b', {}, mem.members.length), h('span', {}, '註冊會員')),
          h('div', { class: 'stat' }, h('b', {}, mem.members.filter(x => x.login_count > 0).length), h('span', {}, '登入過')),
          h('div', { class: 'stat' }, h('b', {}, mem.members.filter(x => x.days_logged > 0).length), h('span', {}, '有記錄健康')),),
        h('p', { class: 'hint' }, '為保護隱私，這裡只顯示登入與記錄的「次數」，看不到會員的健康內容。'),
        mem.members.length
          ? h('div', { class: 'list' }, mem.members.map(x => h('article', { class: 'item' },
            h('div', { class: 'item-top' }, h('b', {}, x.name || '（未填姓名）'), h('span', { class: 'state ok' }, `登入 ${x.login_count} 次`)),
            h('p', { class: 'em' }, x.email),
            h('p', { class: 'hint' }, `註冊：${fmtTime(x.created_at)}　最後登入：${x.last_login ? fmtTime(x.last_login) : '尚未登入'}`),
            h('p', { class: 'hint' }, `已記錄健康 ${x.days_logged} 天${x.last_log_date ? `（最近：${x.last_log_date}）` : ''}`))))
          : h('p', { class: 'empty' }, '目前還沒有人註冊。'),
        mem.logins.length > 0 && h('div', { class: 'invite-list' },
          h('h3', {}, `🕒 最近登入紀錄（${mem.logins.length}）`),
          mem.logins.map(l => h('div', { class: 'login-row' },
            h('span', {}, h('b', {}, l.name || l.email), h('small', {}, `　${l.email}`)),
            h('span', { class: 'when' }, fmtTime(l.at))))),
      ];
      body = h('div', {},
        h('div', { class: 'seg', role: 'group', 'aria-label': '管理員頁面', style: 'margin-bottom:12px' },
          h('button', { type: 'button', 'aria-pressed': String(adm.tab === 'invites'), onclick: () => { adm.tab = 'invites'; renderAdmin(); } }, '✉️ 受邀名單'),
          h('button', { type: 'button', 'aria-pressed': String(adm.tab === 'members'), onclick: () => { adm.tab = 'members'; renderAdmin(); } }, '👥 會員與登入')),
        adm.tab === 'invites' ? invitesView() : membersView(),
        adm.err && h('p', { class: 'err', role: 'alert' }, `⚠️ ${adm.err}`),
        h('div', { class: 'row' },
          h('button', { class: 'btn', type: 'button', disabled: adm.busy, onclick: () => adminLogin(adm.creds.u, adm.creds.p) }, adm.busy ? '更新中…' : '🔄 重新整理'),
          h('button', { class: 'btn', type: 'button', onclick: () => { adm.creds = null; adm.items = null; adm.members = null; renderAdmin(); } }, '登出')));
    }

    adminDlg.replaceChildren(h('div', { class: 'pk' },
      h('div', { class: 'pk-head' },
        h('h2', { id: 'adminTitle' }, items ? '👤 管理員：受邀名單' : '👤 管理員登入'),
        h('button', { class: 'btn', type: 'button', onclick: () => adminDlg.close() }, '✔ 關閉')),
      h('div', { class: 'pk-body' }, body)));
  };

  $('#btnAdmin').addEventListener('click', () => { adm.err = ''; renderAdmin(); adminDlg.showModal(); });
  adminDlg.addEventListener('click', e => { if (e.target === adminDlg) adminDlg.close(); });
  // 關閉視窗就登出，並清掉記憶體中的帳密
  adminDlg.addEventListener('close', () => { adm.creds = null; adm.items = null; adm.members = null; adm.tab = 'invites'; adm.draft = { u: '', p: '' }; adm.err = ''; });

  /* ---------- 受邀者從信件連結進來 ---------- */

  const handleInviteLink = async () => {
    let token;
    try {
      const url = new URL(location.href);
      token = url.searchParams.get('invite');
      if (!token) return;
      url.searchParams.delete('invite');
      history.replaceState(null, '', url.pathname + url.search + url.hash); // 網址列不留代碼
    } catch (_) { /* file:// 等環境可能無法改網址，忽略 */ }
    if (!token) return;
    try {
      const name = await rpc('accept_invitation', { p_token: token });
      state.welcome = name ? { kind: 'ok', name } : { kind: 'bad' };
    } catch (_) {
      state.welcome = { kind: 'offline' };
    }
    renderAlerts();
  };

  /* ---------- 主畫面 ---------- */

  const app = $('#app');

  const render = () => {
    const y = window.scrollY;
    document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === state.tab)));
    const views = { today: todayView, week: weekView, care: careView, tips: tipsView };
    app.replaceChildren(...views[state.tab]().filter(Boolean));
    renderAlerts();
    window.scrollTo(0, y);
  };

  document.querySelectorAll('.tabs button').forEach(b =>
    b.addEventListener('click', () => { state.tab = b.dataset.tab; render(); window.scrollTo(0, 0); }));

  /* ---------- 字體大小 ---------- */

  const SIZES = [17, 20, 24, 28];
  const applySize = () => { document.documentElement.style.fontSize = `${db.fontSize}px`; };
  const stepSize = dir => {
    const i = SIZES.reduce((best, s, idx) => Math.abs(s - db.fontSize) < Math.abs(SIZES[best] - db.fontSize) ? idx : best, 0);
    const j = Math.max(0, Math.min(SIZES.length - 1, i + dir));
    db.fontSize = SIZES[j]; save(); applySize();
    toast(j === i ? `已是最${dir < 0 ? '小' : '大'}字體` : `字體大小：${j + 1} / ${SIZES.length}`);
  };
  $('#fontDown').addEventListener('click', () => stepSize(-1));
  $('#fontUp').addEventListener('click', () => stepSize(1));

  /* ---------- 列印、備份、還原 ---------- */

  $('#btnPrint').addEventListener('click', () => window.print());

  $('#btnExport').addEventListener('click', () => {
    download(`飲食日記備份-${todayStr()}.json`, JSON.stringify(db, null, 2), 'application/json');
    toast('已下載備份檔');
  });

  $('#btnImport').addEventListener('click', () => $('#fileImport').click());
  $('#fileImport').addEventListener('change', async e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text());
      if (!raw || typeof raw.days !== 'object') throw new Error('bad');
      if (!confirm('還原備份會取代目前這台裝置上的所有記錄，確定要繼續嗎？')) return;
      const keepSize = db.fontSize;
      db = normalizeDb(raw);
      if (!raw.fontSize) db.fontSize = keepSize;
      save(); applySize(); render();
      toast('還原完成');
    } catch (_) {
      alert('這個檔案不是正確的備份檔，請確認後再試一次。');
    }
  });

  /* ---------- 啟動 ---------- */

  applySize();
  render();
  renderAcct();
  checkReminders();
  setInterval(checkReminders, 30000);
  handleInviteLink();
})();
