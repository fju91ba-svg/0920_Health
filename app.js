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

  /* ---------- 資料存取 ---------- */

  const STORE = 'silver-diet-v1';

  const emptyMeal = () => ({ time: '', amount: '', items: [] });
  const emptyDay = () => ({
    meals: Object.fromEntries(MEALS.map(m => [m.key, emptyMeal()])),
    water: 0, mood: '', note: '',
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
    return d;
  };

  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const validDate = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
  const validTime = s => typeof s === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
  const str = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

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
    };
  };

  const load = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (raw && typeof raw.days === 'object') return normalizeDb(raw);
    } catch (_) { /* 讀取失敗就從空白開始 */ }
    return normalizeDb({});
  };

  let db = load();
  const newAppt = () => ({ id: null, date: '', time: '', place: '', dept: '', doctor: '', note: '' });
  const newMed = () => ({ id: null, name: '', dose: '', note: '', times: [] });
  const state = {
    date: todayStr(), tab: 'today', pickerMeal: null, pickerCat: 'grain',
    apptDraft: newAppt(), medDraft: newMed(),
  };

  const save = () => {
    try { localStorage.setItem(STORE, JSON.stringify(db)); }
    catch (_) { toast('⚠️ 無法儲存，瀏覽器可能封鎖了儲存空間'); }
  };

  const getDay = date => db.days[date] || emptyDay();

  // 修改當天資料並存檔；rerender=false 用於輸入框，避免打字時失去焦點
  const edit = (fn, rerender = true) => {
    const d = db.days[state.date] || (db.days[state.date] = emptyDay());
    fn(d);
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

  const feelCard = day => h('section', { class: 'card', 'aria-labelledby': 'feel-h' },
    h('h2', { id: 'feel-h' }, '🌿 今天的身體感覺'),
    h('div', { class: 'seg' }, MOODS.map(m => h('button', {
      type: 'button', 'aria-pressed': String(day.mood === m.v),
      onclick: () => edit(d => { d.mood = d.mood === m.v ? '' : m.v; }),
    }, `${m.emoji} ${m.label}`))),
    h('textarea', {
      placeholder: '想記下什麼都可以，例如：血糖、血壓、胃口、排便、看診提醒…',
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
    ];
  };

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
  checkReminders();
  setInterval(checkReminders, 30000);
})();
