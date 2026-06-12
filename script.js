let FOODS = [];
let currentAge = 'semua';

const AGE_GROUPS = {
  semua: {
    label: 'Semua Umur', icon: '👤',
    rda: { energy_kcal: 2000, protein_g: 60, carbohydrate_g: 300, fat_g: 67, sugar_g: 50, sodium_mg: 1500, fiber_g: 30 },
    rules: {}
  },
  bayi: {
    label: 'Bayi (0–1 tahun)', icon: '🍼',
    rda: { energy_kcal: 650, protein_g: 12, carbohydrate_g: 70, fat_g: 36, sugar_g: 20, sodium_mg: 200, fiber_g: 0 },
    rules: {
      forbidden: ['kopi', 'teh', 'alkohol', 'madu', 'garam', 'gula', 'mie instan', 'keripik', 'coklat', 'keju', 'soda', 'minuman bersoda', 'susu sapi segar'],
      sodiumMax: 200, sugarMax: 5, maxKalori: 200,
      warningMsg: '⛔ Bayi di bawah 1 tahun sangat rentan. Hindari makanan yang mengandung garam, gula berlebih, madu, dan kafein.',
      goodFoods: ['bubur', 'susu', 'asi', 'pisang', 'wortel', 'ubi'],
      forbiddenMsg: 'Tidak direkomendasikan untuk bayi (0–1 tahun).',
      hatiMsg: 'Perlu perhatian khusus untuk bayi — konsultasikan dengan dokter anak sebelum memberikan.',
      amanMsg: 'Relatif aman untuk bayi — tetap sesuaikan tekstur dan porsi dengan usia.'
    }
  },
  balita: {
    label: 'Balita (1–5 tahun)', icon: '🧒',
    rda: { energy_kcal: 1350, protein_g: 20, carbohydrate_g: 215, fat_g: 45, sugar_g: 25, sodium_mg: 800, fiber_g: 16 },
    rules: {
      sodiumMax: 800, sugarMax: 15, maxKalori: 400,
      warningMsg: '👶 Balita membutuhkan nutrisi padat namun dengan batasan garam, gula, dan kafein.',
      goodFoods: ['sayur', 'buah', 'telur', 'ikan', 'susu', 'tempe', 'tahu'],
      forbiddenMsg: 'Tidak direkomendasikan untuk balita (1–5 tahun) — kadar gula/garam/kafein terlalu tinggi.',
      hatiMsg: 'Boleh diberikan pada balita dalam porsi sangat kecil — perhatikan kandungan garam dan gula.',
      amanMsg: 'Cocok untuk balita — bergizi dan aman dalam porsi yang sesuai usia.'
    }
  },
  anak: {
    label: 'Anak (6–12 tahun)', icon: '🧒',
    rda: { energy_kcal: 1850, protein_g: 40, carbohydrate_g: 290, fat_g: 60, sugar_g: 35, sodium_mg: 1200, fiber_g: 22 },
    rules: {
      sodiumMax: 1200, sugarMax: 25, maxKalori: 600,
      warningMsg: '📚 Anak usia sekolah membutuhkan energi cukup untuk tumbuh dan belajar.',
      goodFoods: ['nasi', 'sayur', 'ikan', 'ayam', 'telur', 'buah', 'susu', 'tempe', 'tahu'],
      forbiddenMsg: 'Tidak ideal untuk anak-anak — kandungan gula, garam, atau kafeinnya terlalu tinggi.',
      hatiMsg: 'Boleh untuk anak-anak tapi dalam porsi kecil dan tidak terlalu sering.',
      amanMsg: 'Baik untuk anak-anak — mendukung pertumbuhan dan aktivitas belajar.'
    }
  },
  remaja: {
    label: 'Remaja (13–17 tahun)', icon: '👦',
    rda: { energy_kcal: 2125, protein_g: 65, carbohydrate_g: 320, fat_g: 70, sugar_g: 45, sodium_mg: 1500, fiber_g: 28 },
    rules: {
      sodiumMax: 1500, sugarMax: 35, maxKalori: 700,
      warningMsg: '🏃 Remaja membutuhkan nutrisi tinggi untuk pertumbuhan.',
      goodFoods: ['nasi', 'ayam', 'ikan', 'telur', 'sayur', 'buah', 'susu', 'tempe'],
      forbiddenMsg: 'Kurang ideal untuk remaja yang sedang tumbuh — batasi konsumsinya.',
      hatiMsg: 'Boleh dikonsumsi remaja sesekali — jangan jadikan makanan utama sehari-hari.',
      amanMsg: 'Baik untuk remaja — mendukung pertumbuhan dan aktivitas fisik.'
    }
  },
  dewasa: {
    label: 'Dewasa (18–59 tahun)', icon: '🧑',
    rda: { energy_kcal: 2000, protein_g: 60, carbohydrate_g: 300, fat_g: 67, sugar_g: 50, sodium_mg: 1500, fiber_g: 30 },
    rules: {
      sodiumMax: 1500, sugarMax: 50, maxKalori: 800,
      warningMsg: '💼 Dewasa perlu menjaga keseimbangan nutrisi untuk produktivitas dan mencegah penyakit degeneratif.',
      goodFoods: ['sayur', 'buah', 'ikan', 'tempe', 'tahu', 'kacang'],
      forbiddenMsg: 'Sebaiknya dihindari orang dewasa — konsumsi berlebihan meningkatkan risiko penyakit.',
      hatiMsg: 'Aman untuk dewasa dalam porsi wajar — jangan konsumsi berlebihan.',
      amanMsg: 'Baik untuk orang dewasa — sesuai kebutuhan gizi harian.'
    }
  },
  lansia: {
    label: 'Lansia (60+ tahun)', icon: '👴',
    rda: { energy_kcal: 1750, protein_g: 65, carbohydrate_g: 280, fat_g: 55, sugar_g: 35, sodium_mg: 1200, fiber_g: 28 },
    rules: {
      sodiumMax: 1200, sugarMax: 30, maxKalori: 600,
      warningMsg: '👴 Lansia membutuhkan protein tinggi namun kalori lebih rendah. Batasi natrium untuk menjaga tekanan darah.',
      goodFoods: ['ikan', 'sayur', 'tahu', 'tempe', 'susu', 'kacang', 'buah'],
      forbiddenMsg: 'Tidak direkomendasikan untuk lansia — terlalu tinggi garam, gula, atau sulit dicerna.',
      hatiMsg: 'Boleh untuk lansia dalam porsi sangat kecil — perhatikan natrium dan tekstur makanan.',
      amanMsg: 'Cocok untuk lansia — bergizi dan mudah dicerna.'
    }
  }
};

function setAge(age) {
  currentAge = age;
  document.querySelectorAll('.age-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('ageBtn-' + age);
  if (activeBtn) activeBtn.classList.add('active');
}

function getAgeAnalysis(food) {
  if (currentAge === 'semua') return null;
  
  const group = AGE_GROUPS[currentAge];
  const rules = group.rules;
  const foodName = (food.name || '').toLowerCase();
  
  const e  = food.energy_kcal ?? 0;
  const na = food.sodium_mg ?? 0;
  const s  = food.sugar_g ?? 0;
  const p  = food.protein_g ?? 0;
  
  const isForbiddenName = (rules.forbidden || []).some(kw => foodName.includes(kw));
  const sodiumTooHigh = na > (rules.sodiumMax || 9999);
  const sugarTooHigh = s > (rules.sugarMax || 9999);
  const caloriesTooHigh = e > (rules.maxKalori || 9999) && currentAge === 'bayi';
  
  let ageVerdict, ageMsg, ageExtra = [];
  
  if (isForbiddenName || sodiumTooHigh || (sugarTooHigh && s > 25) || caloriesTooHigh) {
    ageVerdict = 'hindari';
    ageMsg = rules.forbiddenMsg;
    if (sodiumTooHigh) ageExtra.push(`⚠️ Natrium ${na}mg melebihi batas aman untuk ${group.label} (maks. ${rules.sodiumMax}mg)`);
    if (sugarTooHigh && s > 25) ageExtra.push(`⚠️ Gula ${s}g terlalu tinggi untuk ${group.label} (maks. ${rules.sugarMax}g)`);
  } else if (sugarTooHigh || (na > (rules.sodiumMax || 9999) * 0.6)) {
    ageVerdict = 'hati';
    ageMsg = rules.hatiMsg;
    if (sugarTooHigh) ageExtra.push(`ℹ️ Gula ${s}g mendekati batas untuk ${group.label} (maks. ${rules.sugarMax}g)`);
    if (na > (rules.sodiumMax || 9999) * 0.6) ageExtra.push(`ℹ️ Natrium ${na}mg cukup tinggi untuk ${group.label}`);
  } else {
    ageVerdict = 'aman';
    ageMsg = rules.amanMsg;
    if (p > 10) ageExtra.push(`✅ Protein ${p}g baik untuk ${group.label}`);
  }
  
  return { group: group, verdict: ageVerdict, msg: ageMsg, extra: ageExtra, warningGeneral: rules.warningMsg };
}

const RDA = { energy_kcal: 2000, protein_g: 60, carbohydrate_g: 300, fat_g: 67, sugar_g: 50, sodium_mg: 1500, fiber_g: 30 };

const INTENT_DIET       = ['diet','kurus','turun berat','langsing','lemak','kalori rendah','gemuk','obesitas'];
const INTENT_DIABETES   = ['diabetes','gula darah','gula tinggi','diabetesi','kencing manis'];
const INTENT_JANTUNG    = ['jantung','kolesterol','hipertensi','darah tinggi','tensi'];
const INTENT_GIZI       = ['gizi','nutrisi','kandungan','nilai gizi','protein','karbohidrat','kalori','serat','vitamin','mineral','lemak'];
const INTENT_COMPARE    = ['lebih sehat','dibanding','vs','bandingkan','antara','atau'];
const INTENT_REKOMENDASI= ['rekomendasikan','sarankan','makanan apa','apa yang bagus','apa yang baik','cocok untuk'];

function detectIntent(teks) {
  const t = teks.toLowerCase();
  if (INTENT_DIABETES.some(k => t.includes(k))) return 'diabetes';
  if (INTENT_JANTUNG.some(k => t.includes(k))) return 'jantung';
  if (INTENT_DIET.some(k => t.includes(k))) return 'diet';
  if (INTENT_COMPARE.some(k => t.includes(k))) return 'compare';
  if (INTENT_REKOMENDASI.some(k => t.includes(k))) return 'rekomendasi';
  if (INTENT_GIZI.some(k => t.includes(k))) return 'gizi';
  return 'gizi';
}

function cariFoods(query) {
  const q = query.toLowerCase().replace(/apakah|bagaimana|berapa|kalori|gizi|kandungan|nutrisi|untuk|cocok|bagus|diet|diabetes|jantung|sehat|aman|hindari|orang|yang|lagi|sedang|penderita|ini|itu|nya/g, ' ').trim();
  const tokens = q.split(/\s+/).filter(t => t.length > 2);
  
  let results = [];
  for (const token of tokens) {
    const exact = FOODS.filter(f => f.name && f.name.toLowerCase().includes(token));
    results.push(...exact);
  }
 
  const seen = new Set();
  results = results.filter(f => {
    if (seen.has(f.name)) return false;
    seen.add(f.name); return true;
  });
  
  results.sort((a, b) => {
    const scoreA = tokens.filter(t => a.name.toLowerCase().includes(t)).length;
    const scoreB = tokens.filter(t => b.name.toLowerCase().includes(t)).length;
    return scoreB - scoreA;
  });
  
  return results.slice(0, 5);
}

function analisaGizi(food, intent) {
  const e = food.energy_kcal; const p = food.protein_g; const c = food.carbohydrate_g; 
  const f = food.fat_g; const s = food.sugar_g; const na = food.sodium_mg; const fi = food.fiber_g;
  
  let verdict = 'hati'; let icon = '⚠️'; let alasan = []; let saran = [];

  if (intent === 'diet') {
    if (e !== null && e < 150 && f !== null && f < 10) {
      verdict = 'aman'; icon = '✅';
      alasan.push(`Kalori rendah (${e} kcal per sajian)`);
      alasan.push(f < 5 ? 'Kandungan lemak sangat rendah' : 'Kandungan lemak cukup rendah');
      if (p && p > 10) alasan.push(`Protein cukup tinggi (${p}g) — membantu kenyang lebih lama`);
      if (fi && fi > 3) alasan.push(`Serat tinggi (${fi}g) — baik untuk pencernaan dan diet`);
    } else if (e !== null && e > 400) {
      verdict = 'hindari'; icon = '🚫';
      alasan.push(`Kalori tinggi (${e} kcal) — ${((e/RDA.energy_kcal)*100).toFixed(0)}% dari kebutuhan harian`);
      if (f && f > 20) alasan.push(`Lemak tinggi (${f}g)`);
      saran.push('Batasi porsinya jika sedang diet');
      saran.push('Ganti dengan versi rebus/kukus jika memungkinkan');
    } else {
      alasan.push(e ? `Kalori sedang (${e} kcal)` : 'Data kalori tidak tersedia');
      if (f && f > 15) { alasan.push(`Lemak cukup tinggi (${f}g) — perlu diperhatikan`); verdict = 'hati'; } else { verdict = 'hati'; }
      saran.push('Boleh dikonsumsi dalam porsi wajar'); saran.push('Imbangi dengan sayur dan buah');
    }
  } else if (intent === 'diabetes') {
    if (s !== null && s > 20) {
      verdict = 'hindari'; icon = '🚫';
      alasan.push(`Kandungan gula tinggi (${s}g) — berbahaya bagi penderita diabetes`);
      saran.push('Hindari atau konsumsi sangat terbatas');
    } else if (c !== null && c > 50) {
      verdict = 'hati'; icon = '⚠️';
      alasan.push(`Karbohidrat cukup tinggi (${c}g) — dapat meningkatkan gula darah`);
      saran.push('Batasi porsi dan imbangi dengan protein & serat');
      if (fi && fi > 5) alasan.push(`Serat cukup tinggi (${fi}g) — membantu mengontrol gula darah`);
    } else {
      verdict = 'aman'; icon = '✅';
      alasan.push(c ? `Karbohidrat rendah-sedang (${c}g)` : 'Karbohidrat terkontrol');
      if (s !== null && s < 5) alasan.push(`Gula rendah (${s}g) — aman untuk diabetes`);
      if (fi && fi > 3) alasan.push(`Serat baik (${fi}g) — membantu stabilkan gula darah`);
    }
  } else if (intent === 'jantung') {
    if (na !== null && na > 500) {
      verdict = 'hindari'; icon = '🚫';
      alasan.push(`Natrium sangat tinggi (${na}mg) — berbahaya untuk tekanan darah`);
      saran.push('Hindari jika memiliki hipertensi atau masalah jantung');
    } else if (f !== null && f > 15) {
      verdict = 'hati'; icon = '⚠️';
      alasan.push(`Lemak cukup tinggi (${f}g) — perhatikan konsumsi untuk kesehatan jantung`);
      saran.push('Batasi frekuensi konsumsi');
    } else {
      verdict = 'aman'; icon = '✅';
      alasan.push(na ? `Natrium terkontrol (${na}mg)` : 'Natrium rendah');
      if (f && f < 8) alasan.push(`Lemak rendah (${f}g) — baik untuk jantung`);
      if (fi && fi > 3) alasan.push(`Serat baik (${fi}g) — mendukung kesehatan jantung`);
    }
  } else {
    verdict = 'hati'; icon = 'ℹ️';
    if (e) alasan.push(`Energi: ${e} kcal`); if (p) alasan.push(`Protein: ${p}g`);
    if (c) alasan.push(`Karbohidrat: ${c}g`); if (f) alasan.push(`Lemak: ${f}g`);
    if (fi) alasan.push(`Serat: ${fi}g`);
  }
  return { verdict, icon, alasan, saran };
}

function buildResponse(query) {
  const intent = detectIntent(query);
  const foods  = cariFoods(query);
  
  if (!foods.length) {
    return `
      <p>Maaf, saya tidak menemukan makanan yang sesuai di database. 😕</p>
      <p style="margin-top:8px; font-size:13px; color:var(--text-muted)">Coba gunakan nama makanan yang lebih spesifik, contoh: <em>"nasi goreng"</em>, <em>"tempe"</em>, <em>"ayam bakar"</em>.</p>
      <div class="suggestion-chips">
        <button class="chip-btn" onclick="kirimPesan('gizi tempe')">tempe</button>
        <button class="chip-btn" onclick="kirimPesan('kalori nasi putih')">nasi putih</button>
        <button class="chip-btn" onclick="kirimPesan('apakah tahu bagus untuk diet')">tahu</button>
      </div>`;
  }
  
  const food = foods[0];
  const { verdict, icon, alasan, saran } = analisaGizi(food, intent);
  
  const intentLabel = { diet: 'untuk program diet', diabetes: 'untuk penderita diabetes', jantung: 'untuk kesehatan jantung', gizi: '— informasi gizi', compare: '— perbandingan gizi', rekomendasi: '— rekomendasi gizi' }[intent] || '';
  const verdictLabel = { aman: 'AMAN / DIREKOMENDASIKAN', hati: 'BOLEH — PORSI WAJAR', hindari: 'PERLU DIHINDARI' }[verdict];

  const barItems = [
    { label: 'Kalori', val: food.energy_kcal, rda: RDA.energy_kcal, unit: 'kcal' },
    { label: 'Protein', val: food.protein_g, rda: RDA.protein_g, unit: 'g' },
    { label: 'Karbo', val: food.carbohydrate_g, rda: RDA.carbohydrate_g, unit: 'g' },
    { label: 'Lemak', val: food.fat_g, rda: RDA.fat_g, unit: 'g' },
    { label: 'Gula', val: food.sugar_g, rda: RDA.sugar_g, unit: 'g' },
    { label: 'Serat', val: food.fiber_g, rda: RDA.fiber_g, unit: 'g' },
  ].filter(b => b.val !== null && b.val > 0);

  const barsHTML = barItems.map(b => {
    const pct = Math.min((b.val / b.rda) * 100, 100);
    const cls = pct > 80 ? 'bad' : pct > 50 ? 'warn' : 'ok';
    return `
      <div class="bar-mini-item">
        <div class="bar-mini-label"><span>${b.label}</span><span>${b.val}${b.unit} / ${b.rda}${b.unit} (${pct.toFixed(0)}% AKG)</span></div>
        <div class="bar-mini-track"><div class="bar-mini-fill ${cls}" style="width:${pct}%"></div></div>
      </div>`;
  }).join('');

  const altChips = foods.slice(1).map(f => `<button class="chip-btn" onclick="kirimPesan('gizi ${f.name}')">${f.name}</button>`).join('');
  const ageAnalysis = getAgeAnalysis(food);
  let ageInfoHTML = '';
  
  if (ageAnalysis) {
    const agVerdictCls = ageAnalysis.verdict;
    const agIcon = ageAnalysis.verdict === 'aman' ? '✅' : ageAnalysis.verdict === 'hati' ? '⚠️' : '🚫';
    const agExtras = ageAnalysis.extra.length ? `<ul style="margin:6px 0 0 0;padding-left:16px;font-size:12px;line-height:1.9;">${ageAnalysis.extra.map(e=>`<li>${e}</li>`).join('')}</ul>` : '';
    ageInfoHTML = `
    <div class="age-info-box ${agVerdictCls}">
      <div style="font-weight:700;margin-bottom:3px;">${ageAnalysis.group.icon} ${agIcon} Untuk ${ageAnalysis.group.label}</div>
      <div>${ageAnalysis.msg}</div>
      ${agExtras}
      <div style="margin-top:6px;font-size:11px;opacity:0.75;">${ageAnalysis.warningGeneral}</div>
    </div>`;
  }

  return `
    <p>Berikut informasi gizi <strong>${food.name}</strong> ${intentLabel}:</p>
    <div class="food-card">
      <div class="food-card-name">🍽️ ${food.name}</div>
      ${food.serving_size && food.serving_size !== 'null' ? `<div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">Ukuran sajian: ${food.serving_size}</div>` : ''}
      <div class="bar-mini">${barsHTML || '<p style="font-size:12px;color:var(--text-muted)">Data nutrisi terbatas</p>'}</div>
    </div>
    <div class="verdict ${verdict}">${icon} ${verdictLabel}</div>
    ${ageInfoHTML}
    ${alasan.length ? `<ul style="margin-top:10px;padding-left:16px;font-size:13px;line-height:2;">${alasan.map(a=>`<li>${a}</li>`).join('')}</ul>` : ''}
    ${saran.length ? `<div style="margin-top:8px;font-size:13px;"><strong>💡 Saran:</strong><ul style="padding-left:16px;margin-top:4px;line-height:2;">${saran.map(s=>`<li>${s}</li>`).join('')}</ul></div>` : ''}
    ${altChips ? `<div style="margin-top:10px;font-size:12px;color:var(--text-muted);">Makanan terkait yang ditemukan:</div><div class="suggestion-chips">${altChips}</div>` : ''}`;
}

const chatArea = document.getElementById('chatArea');
const inputMsg = document.getElementById('inputMsg');

function tambahBubble(html, role) {
  const row = document.createElement('div');
  row.className = `msg-row ${role}`;
  const avatarEmoji = role === 'bot' ? '🤖' : '👤';
  row.innerHTML = `<div class="avatar ${role}">${avatarEmoji}</div><div class="bubble ${role}">${html}</div>`;
  chatArea.appendChild(row);
  chatArea.scrollTop = chatArea.scrollHeight;
  return row;
}

function tampilkanTyping() {
  return tambahBubble('<div class="typing"><span></span><span></span><span></span></div>', 'bot');
}

async function kirimPesan(teks) {
  const msg = teks || inputMsg.value.trim();
  if (!msg) return;
  inputMsg.value = '';
  document.getElementById('quickSuggestions').style.display = 'none';

  const msgLower = msg.toLowerCase();
  if (msgLower.includes('bayi') || msgLower.includes('baby') || msgLower.includes('0 tahun') || msgLower.includes('0-1')) setAge('bayi');
  else if (msgLower.includes('balita') || msgLower.includes('toddler') || msgLower.includes('1 tahun') || msgLower.includes('2 tahun') || msgLower.includes('3 tahun') || msgLower.includes('4 tahun') || msgLower.includes('5 tahun')) setAge('balita');
  else if (msgLower.includes('anak kecil') || msgLower.includes('anak-anak') || msgLower.includes('anak sekolah') || msgLower.includes('sd') || msgLower.includes('6 tahun') || msgLower.includes('7 tahun') || msgLower.includes('8 tahun') || msgLower.includes('9 tahun') || msgLower.includes('10 tahun') || msgLower.includes('11 tahun') || msgLower.includes('12 tahun')) setAge('anak');
  else if (msgLower.includes('remaja') || msgLower.includes('smp') || msgLower.includes('sma') || msgLower.includes('13 tahun') || msgLower.includes('14 tahun') || msgLower.includes('15 tahun') || msgLower.includes('16 tahun') || msgLower.includes('17 tahun') || msgLower.includes('teenager')) setAge('remaja');
  else if (msgLower.includes('lansia') || msgLower.includes('orang tua') || msgLower.includes('manula') || msgLower.includes('60 tahun') || msgLower.includes('70 tahun') || msgLower.includes('pensiunan')) setAge('lansia');

  tambahBubble(msg, 'user');
  const typingRow = tampilkanTyping();

  await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

  chatArea.removeChild(typingRow);
  tambahBubble(buildResponse(msg), 'bot');
}

inputMsg.addEventListener('keydown', e => { if (e.key === 'Enter') kirimPesan(); });

async function initApp() {
  try {
    const response = await fetch('nutrisi_data.json');
    if (!response.ok) throw new Error("Gagal mengambil data");
    FOODS = await response.json();

    setTimeout(() => {
      tambahBubble(`
        <p>👋 Halo! Saya <strong>NutriCheck AI</strong> — asisten gizi berbasis data makanan Indonesia.</p>
        <p style="margin-top:8px;">Tanya apa saja tentang gizi makanan, misalnya:</p>
        <ul style="margin:8px 0 0 16px;font-size:13px;line-height:2.2;">
          <li>🍜 <em>"Apakah mie ayam bagus untuk diet?"</em></li>
          <li>🍗 <em>"Berapa kalori ayam goreng?"</em></li>
          <li>🩺 <em>"Nasi putih cocok untuk penderita diabetes?"</em></li>
          <li>❤️ <em>"Apakah tempe baik untuk kesehatan jantung?"</em></li>
          <li>🧒 <em>"Apakah daging sapi boleh untuk anak kecil?"</em></li>
          <li>🍼 <em>"Makanan apa yang cocok untuk bayi?"</em></li>
        </ul>
        <p style="margin-top:8px;font-size:12px;color:var(--green-mid);font-weight:600;">👆 Pilih kelompok usia di atas untuk rekomendasi yang lebih personal!</p>
        <p style="margin-top:4px;font-size:12px;color:var(--text-muted);">📊 Saya menggunakan database <strong>${FOODS.length.toLocaleString('id-ID')} makanan Indonesia</strong>!</p>
      `, 'bot');
    }, 300);

  } catch (error) {
    console.error("Error loading JSON:", error);
    tambahBubble(`Maaf, terjadi kesalahan saat memuat database <code>nutrisi_data.json</code>. Pastikan kamu menjalankan file ini menggunakan server (misal: <code>python jalankan.py</code>).`, "bot");
  }
}

initApp();