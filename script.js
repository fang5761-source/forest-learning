
const VERSION = 'v0.8.1';
const SPIRIT_NAMES = ['希望', '勇光', '星語', '小智', '暖暖', '亮亮'];
const PLAYER_TITLES = ['小探險家', '森林朋友', '小勇士', '小旅人', '小學者', '小光點'];

const INTRO_STORY = `很久以前，森林裡的樹會發光。
每一棵樹，都藏著一種能力。
可是有一天，森林的光被封印了。
小精靈找了很久，終於找到你。
你願意陪我一起，把森林慢慢點亮嗎？`;

const START_LINES = [
  '慢慢來，我們一起試試看。',
  '先聽一聽，再選你覺得最像的答案。',
  '不用急，我會陪你一起找。',
  '今天的森林，正等著你點亮。',
  '先看一看，我們一起開始。',
  '不確定也沒關係，我們一步一步來。'
];
const CORRECT_LINES = [
  '太好了，小探險家！',
  '很好，我們找到答案了。',
  '太好了，森林亮了一點。',
  '你剛剛解開了一個小封印。'
];
const HOME_LINES = [
  '歡迎回來，小探險家。',
  '今天想先從哪裡開始探索呢？',
  '森林裡有新的光等你找到。',
  '我們慢慢走，也會慢慢變強。'
];

const SYMBOL_SET = ['ㄅ','ㄆ','ㄇ','ㄈ','ㄉ','ㄊ','ㄋ','ㄌ','ㄍ','ㄎ','ㄏ','ㄐ','ㄑ','ㄒ','ㄓ','ㄔ','ㄕ','ㄖ','ㄗ','ㄘ','ㄙ','ㄚ','ㄛ','ㄜ','ㄧ','ㄨ','ㄩ'];
const SYMBOL_CONFUSION = [
  ['ㄅ','ㄆ','ㄇ','ㄈ'],
  ['ㄉ','ㄊ','ㄋ','ㄌ'],
  ['ㄍ','ㄎ','ㄏ'],
  ['ㄐ','ㄑ','ㄒ'],
  ['ㄓ','ㄔ','ㄕ','ㄖ'],
  ['ㄗ','ㄘ','ㄙ'],
  ['ㄚ','ㄛ','ㄜ'],
  ['ㄧ','ㄨ','ㄩ']
];
const COMBO_SET = ['ㄅㄚ','ㄅㄛ','ㄅㄧ','ㄆㄚ','ㄆㄛ','ㄇㄚ','ㄇㄛ','ㄇㄧ','ㄈㄚ','ㄉㄚ','ㄉㄧ','ㄊㄚ','ㄋㄚ','ㄋㄧ','ㄌㄚ','ㄌㄧ','ㄍㄚ','ㄎㄚ','ㄏㄚ'];
const COMBO_SOUND = {
  'ㄅㄚ':'巴','ㄅㄛ':'波','ㄅㄧ':'逼','ㄆㄚ':'趴','ㄆㄛ':'坡','ㄇㄚ':'媽','ㄇㄛ':'摸','ㄇㄧ':'咪','ㄈㄚ':'發',
  'ㄉㄚ':'搭','ㄉㄧ':'低','ㄊㄚ':'他','ㄋㄚ':'拿','ㄋㄧ':'泥','ㄌㄚ':'拉','ㄌㄧ':'梨','ㄍㄚ':'嘎','ㄎㄚ':'咖','ㄏㄚ':'哈'
};

const state = {
  spiritName: localStorage.getItem('mm_strength_name') || '',
  playerTitle: localStorage.getItem('mm_player_title') || '',
  brightness: Number(localStorage.getItem('mm_strength_brightness') || 12),
  shards: Number(localStorage.getItem('mm_strength_shards') || 0),
  normalSeeds: Number(localStorage.getItem('mm_strength_seed_normal') || 0),
  rareSeeds: Number(localStorage.getItem('mm_strength_seed_rare') || 0),
  starSeeds: Number(localStorage.getItem('mm_strength_seed_star') || 0),
  plantedSeeds: Number(localStorage.getItem('mm_strength_planted_seeds') || 0),
  gardenStage: Number(localStorage.getItem('mm_strength_garden_stage') || 0),
  streak: Number(localStorage.getItem('mm_strength_streak') || 1),
  dailyKey: localStorage.getItem('mm_strength_daily_key') || '',
  missionDailyDone: localStorage.getItem('mm_strength_mission_daily') === '1',
  missionLanguageDone: localStorage.getItem('mm_strength_mission_language') === '1',
  missionMathDone: localStorage.getItem('mm_strength_mission_math') === '1',
  mode: 'today',
  questionList: [],
  qIndex: 0,
  excluded: 0,
  wrongCount: 0,
  correctCombo: 0,
  currentQuestion: null,
  currentSpeechText: INTRO_STORY,
  selectedName: localStorage.getItem('mm_strength_name') || '',
  selectedTitle: localStorage.getItem('mm_player_title') || '',
  settingsSelectedName: localStorage.getItem('mm_strength_name') || '',
  settingsSelectedTitle: localStorage.getItem('mm_player_title') || '',
  awaitingNext: false,
  lastCorrectLine: '',
};

const screens = {
  intro: document.getElementById('introScreen'),
  name: document.getElementById('nameScreen'),
  title: document.getElementById('titleScreen'),
  bond: document.getElementById('bondScreen'),
  home: document.getElementById('homeScreen'),
  garden: document.getElementById('gardenScreen'),
  village: document.getElementById('villageScreen'),
  quiz: document.getElementById('quizScreen'),
  settings: document.getElementById('settingsScreen'),
  result: document.getElementById('resultScreen'),
};

const introAcceptBtn = document.getElementById('introAcceptBtn');
const introReplayBtn = document.getElementById('introReplayBtn');
const globalSpeakBtn = document.getElementById('globalSpeakBtn');
const nameGrid = document.getElementById('nameGrid');
const confirmNameBtn = document.getElementById('confirmNameBtn');
const nameReplayBtn = document.getElementById('nameReplayBtn');
const titleGrid = document.getElementById('titleGrid');
const confirmTitleBtn = document.getElementById('confirmTitleBtn');
const titleReplayBtn = document.getElementById('titleReplayBtn');
const bondTitle = document.getElementById('bondTitle');
const bondStoryText = document.getElementById('bondStoryText');
const bondContinueBtn = document.getElementById('bondContinueBtn');
const bondReplayBtn = document.getElementById('bondReplayBtn');
const homeSpiritTitle = document.getElementById('homeSpiritTitle');
const welcomeLine = document.getElementById('welcomeLine');
const brightnessText = document.getElementById('brightnessText');
const shardText = document.getElementById('shardText');
const streakText = document.getElementById('streakText');
const seedNormalText = document.getElementById('seedNormalText');
const seedRareText = document.getElementById('seedRareText');
const seedStarText = document.getElementById('seedStarText');
const plantedText = document.getElementById('plantedText');
const gardenText = document.getElementById('gardenText');
const gardenVisual = document.getElementById('gardenVisual');
const worldTimeBadge = document.getElementById('worldTimeBadge');
const missionDailyState = document.getElementById('missionDailyState');
const missionLanguageState = document.getElementById('missionLanguageState');
const missionMathState = document.getElementById('missionMathState');
const villageBtn = document.getElementById('villageBtn');
const deerBtn = document.getElementById('deerBtn');
const villageHint = document.getElementById('villageHint');
const deerHint = document.getElementById('deerHint');
const homeReplayBtn = document.getElementById('homeReplayBtn');
const homeSettingBtn = document.getElementById('homeSettingBtn');
const gardenVisitBtn = document.getElementById('gardenVisitBtn');
const gardenBackBtn = document.getElementById('gardenBackBtn');
const gardenBigVisual = document.getElementById('gardenBigVisual');
const gardenStageTitle = document.getElementById('gardenStageTitle');
const gardenLifeText = document.getElementById('gardenLifeText');
const gardenBonusList = document.getElementById('gardenBonusList');
const plantNormalBtn = document.getElementById('plantNormalBtn');
const plantRareBtn = document.getElementById('plantRareBtn');
const plantStarBtn = document.getElementById('plantStarBtn');
const villageBackBtn = document.getElementById('villageBackBtn');
const villageStory = document.getElementById('villageStory');
const treeHoles = document.getElementById('treeHoles');
const modeChip = document.getElementById('modeChip');
const roundText = document.getElementById('roundText');
const questionTypeLabel = document.getElementById('questionTypeLabel');
const questionPrompt = document.getElementById('questionPrompt');
const visualArea = document.getElementById('visualArea');
const optionsWrap = document.getElementById('optionsWrap');
const feedbackLine = document.getElementById('feedbackLine');
const excludedText = document.getElementById('excludedText');
const questionSpeakBtn = document.getElementById('questionSpeakBtn');
const toggleVisualBtn = document.getElementById('toggleVisualBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const backHomeBtn = document.getElementById('backHomeBtn');
const settingsNameGrid = document.getElementById('settingsNameGrid');
const settingsTitleGrid = document.getElementById('settingsTitleGrid');
const settingsSaveBtn = document.getElementById('settingsSaveBtn');
const settingsResetBtn = document.getElementById('settingsResetBtn');
const settingsCancelBtn = document.getElementById('settingsCancelBtn');
const resultTitle = document.getElementById('resultTitle');
const resultText = document.getElementById('resultText');
const resultBrightness = document.getElementById('resultBrightness');
const resultShards = document.getElementById('resultShards');
const resultHomeBtn = document.getElementById('resultHomeBtn');
const exploreMoreBtn = document.getElementById('exploreMoreBtn');
const questionCard = document.querySelector('.question-card');

function randomItem(list) { return list[Math.floor(Math.random() * list.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function pickNonRepeat(list, lastValue) {
  if (!list || !list.length) return '';
  if (list.length === 1) return list[0];
  let choice = randomItem(list);
  let tries = 0;
  while (choice === lastValue && tries < 8) {
    choice = randomItem(list);
    tries += 1;
  }
  return choice;
}
function stopSpeech() { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }

function saveState() {
  localStorage.setItem('mm_strength_name', state.spiritName);
  localStorage.setItem('mm_player_title', state.playerTitle);
  localStorage.setItem('mm_strength_brightness', String(state.brightness));
  localStorage.setItem('mm_strength_shards', String(state.shards));
  localStorage.setItem('mm_strength_seed_normal', String(state.normalSeeds));
  localStorage.setItem('mm_strength_seed_rare', String(state.rareSeeds));
  localStorage.setItem('mm_strength_seed_star', String(state.starSeeds));
  localStorage.setItem('mm_strength_planted_seeds', String(state.plantedSeeds));
  localStorage.setItem('mm_strength_garden_stage', String(state.gardenStage));
  localStorage.setItem('mm_strength_streak', String(state.streak));
  localStorage.setItem('mm_strength_daily_key', state.dailyKey);
  localStorage.setItem('mm_strength_mission_daily', state.missionDailyDone ? '1' : '0');
  localStorage.setItem('mm_strength_mission_language', state.missionLanguageDone ? '1' : '0');
  localStorage.setItem('mm_strength_mission_math', state.missionMathDone ? '1' : '0');
}
function showScreen(name) {
  Object.values(screens).forEach(el => el.classList.remove('active'));
  screens[name].classList.add('active');
}
function buildBondStory() {
  return `${state.playerTitle}，你好呀。
我是${state.spiritName}。
我會陪你一起走進螢光森林。
每完成一次學習，森林就會亮一點。
每找到一顆種子，花圃就會長大一點。
我們慢慢來，也會慢慢變強。`;
}
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
}
function ensureDailyMissions() {
  const key = getTodayKey();
  if (state.dailyKey !== key) {
    state.dailyKey = key;
    state.missionDailyDone = false;
    state.missionLanguageDone = false;
    state.missionMathDone = false;
    saveState();
  }
}
function applyTimeTheme() {
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 18;
  document.body.classList.toggle('day-mode', isDay);
  document.body.classList.toggle('night-mode', !isDay);
  if (worldTimeBadge) worldTimeBadge.textContent = isDay ? '晨光森林' : '星夜森林';
}
function getMissionLabel(done) {
  return done ? '已完成' : '未完成';
}
function getGardenStageLabel(stage) {
  const labels = ['空地', '發芽', '長葉', '開花', '小樹', '花園'];
  return labels[Math.max(0, Math.min(stage, labels.length - 1))];
}
function getGardenVisual(stage) {
  const visuals = ['🟫', '🌱', '🌿', '🌸', '🌳', '🌺'];
  return visuals[Math.max(0, Math.min(stage, visuals.length - 1))];
}
function updateGardenPanel() {
  if (gardenBigVisual) gardenBigVisual.textContent = getGardenVisual(state.gardenStage);
  if (gardenStageTitle) gardenStageTitle.textContent = getGardenStageLabel(state.gardenStage);
  const lifeTexts = [
    '還沒有長出花，先把第一顆種子種下去吧。',
    '第一顆芽冒出來了。',
    '葉子慢慢長大了。',
    '花開始開了，森林亮了一點。',
    '小樹出現了，森林更有生命感了。',
    '花園變得熱鬧了，蝴蝶和小鳥會來看看。'
  ];
  if (gardenLifeText) gardenLifeText.textContent = lifeTexts[Math.min(state.gardenStage, lifeTexts.length-1)];
  if (gardenBonusList) {
    gardenBonusList.innerHTML = '';
    const items = [];
    if (state.gardenStage >= 3) items.push('🦋 蝴蝶會飛來');
    if (state.gardenStage >= 4) items.push('🐦 小鳥會停在花上');
    if (state.gardenStage >= 5) items.push('✨ 發光花會出現');
    if (items.length === 0) items.push('還沒有新的訪客');
    items.forEach(text => {
      const div = document.createElement('div');
      div.className = 'bonus-tag';
      div.textContent = text;
      gardenBonusList.appendChild(div);
    });
  }
  if (plantNormalBtn) plantNormalBtn.disabled = state.normalSeeds <= 0;
  if (plantRareBtn) plantRareBtn.disabled = state.rareSeeds <= 0;
  if (plantStarBtn) plantStarBtn.disabled = state.starSeeds <= 0;
}
function updateVillagePanel() {
  if (!treeHoles) return;
  const holes = [...treeHoles.children];
  holes.forEach((hole, idx) => {
    if (idx === 0) {
      hole.textContent = '✨';
      hole.classList.add('active');
    } else if (idx === 1 && state.plantedSeeds >= 6) {
      hole.textContent = '🌱';
      hole.classList.add('active');
    } else if (idx === 2 && state.plantedSeeds >= 10) {
      hole.textContent = '📚';
      hole.classList.add('active');
    } else if (idx === 3 && state.plantedSeeds >= 14) {
      hole.textContent = '✖️';
      hole.classList.add('active');
    } else {
      hole.textContent = '○';
      hole.classList.remove('active');
    }
  });
  if (villageStory) {
    if (state.plantedSeeds >= 14) villageStory.textContent = '種子精靈、書卷精靈和算術精靈都搬進來了。';
    else if (state.plantedSeeds >= 10) villageStory.textContent = '書卷精靈搬來了，拼音和文字會更有幫助。';
    else if (state.plantedSeeds >= 6) villageStory.textContent = '種子精靈搬來了，花圃會更快長大。';
    else villageStory.textContent = '先多種幾顆種子，讓朋友慢慢搬進來。';
  }
}
function updateHome() {
  ensureDailyMissions();
  applyTimeTheme();
  homeSpiritTitle.textContent = `小精靈：${state.spiritName || '希望'}`;
  welcomeLine.textContent = randomItem(HOME_LINES).replace('小探險家', state.playerTitle || '小探險家');
  brightnessText.textContent = `${state.brightness}%`;
  shardText.textContent = String(state.shards);
  streakText.textContent = String(state.streak);
  if (seedNormalText) seedNormalText.textContent = `${state.normalSeeds} 顆`;
  if (seedRareText) seedRareText.textContent = `${state.rareSeeds} 顆`;
  if (seedStarText) seedStarText.textContent = `${state.starSeeds} 顆`;
  if (plantedText) plantedText.textContent = `${state.plantedSeeds} 顆`;
  if (gardenText) gardenText.textContent = getGardenStageLabel(state.gardenStage);
  if (gardenVisual) gardenVisual.textContent = getGardenVisual(state.gardenStage);
  if (missionDailyState) missionDailyState.textContent = getMissionLabel(state.missionDailyDone);
  if (missionLanguageState) missionLanguageState.textContent = getMissionLabel(state.missionLanguageDone);
  if (missionMathState) missionMathState.textContent = getMissionLabel(state.missionMathDone);
  const villageUnlocked = state.plantedSeeds >= 5;
  const deerUnlocked = state.plantedSeeds >= 8;
  if (villageBtn) villageBtn.classList.toggle('locked', !villageUnlocked);
  if (deerBtn) deerBtn.classList.toggle('locked', !deerUnlocked);
  if (villageHint) villageHint.textContent = villageUnlocked ? '大樹樹洞亮起來了' : '種下 5 顆種子後出現';
  if (deerHint) deerHint.textContent = deerUnlocked ? '小鹿會帶來驚喜' : '種下 8 顆種子後出現';
  updateGardenPanel();
  updateVillagePanel();
}

let availableVoices = [];
let speakingNow = false;
function loadVoices() {
  availableVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
}
function pickVoice() {
  if (!availableVoices.length) loadVoices();
  return availableVoices.find(v => /zh-TW/i.test(v.lang))
    || availableVoices.find(v => /Hsinchu|Hanhan|Mei-Jia|Yating/i.test(v.name))
    || availableVoices.find(v => /zh/i.test(v.lang))
    || null;
}
function speak(text) {
  state.currentSpeechText = text;
  if (!('speechSynthesis' in window)) return;

  // 再按一次同一顆喇叭時，直接停止
  if (speakingNow) {
    window.speechSynthesis.cancel();
    speakingNow = false;
    return;
  }

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(String(text).replace(/\n/g, ' '));
  utter.lang = 'zh-TW';
  utter.rate = 0.9;
  utter.pitch = 1.0;

  const voice = pickVoice();
  if (voice) utter.voice = voice;

  utter.onend = () => { speakingNow = false; };
  utter.onerror = () => { speakingNow = false; };

  speakingNow = true;
  window.speechSynthesis.speak(utter);
}

function createFireflies() {
  const wrap = document.getElementById('fireflies');
  wrap.innerHTML = '';
  for (let i = 0; i < 28; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'firefly-dot';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.animationDelay = `${Math.random() * 4}s`;
    dot.style.animationDuration = `${3.5 + Math.random() * 3.5}s`;
    wrap.appendChild(dot);
  }
}

function renderNameGrid(target, selectedName, options, onSelect) {
  target.innerHTML = '';
  options.forEach(name => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `name-btn${selectedName === name ? ' selected' : ''}`;
    btn.textContent = name;
    btn.onclick = () => onSelect(name, btn);
    target.appendChild(btn);
  });
}
function setupNames() {
  let selected = state.selectedName || '';
  renderNameGrid(nameGrid, selected, SPIRIT_NAMES, (name, btn) => {
    selected = name;
    state.selectedName = name;
    [...nameGrid.children].forEach(node => node.classList.remove('selected'));
    btn.classList.add('selected');
    confirmNameBtn.disabled = false;
  });
  confirmNameBtn.disabled = !selected;
}
function setupTitles() {
  let selected = state.selectedTitle || '';
  renderNameGrid(titleGrid, selected, PLAYER_TITLES, (name, btn) => {
    selected = name;
    state.selectedTitle = name;
    [...titleGrid.children].forEach(node => node.classList.remove('selected'));
    btn.classList.add('selected');
    confirmTitleBtn.disabled = false;
  });
  confirmTitleBtn.disabled = !selected;
}
function setupSettings() {
  let selectedName = state.settingsSelectedName || state.spiritName || '希望';
  renderNameGrid(settingsNameGrid, selectedName, SPIRIT_NAMES, (name, btn) => {
    selectedName = name;
    state.settingsSelectedName = name;
    [...settingsNameGrid.children].forEach(node => node.classList.remove('selected'));
    btn.classList.add('selected');
  });
  let selectedTitle = state.settingsSelectedTitle || state.playerTitle || '小探險家';
  renderNameGrid(settingsTitleGrid, selectedTitle, PLAYER_TITLES, (name, btn) => {
    selectedTitle = name;
    state.settingsSelectedTitle = name;
    [...settingsTitleGrid.children].forEach(node => node.classList.remove('selected'));
    btn.classList.add('selected');
  });
}

function numberToZh(n) {
  const zh = ['零','一','二','三','四','五','六','七','八','九'];
  if (n < 10) return zh[n];
  if (n === 10) return '十';
  if (n < 20) return `十${zh[n % 10] || ''}`;
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return `${zh[tens]}十${ones ? zh[ones] : ''}`;
}
function comboSound(text) {
  return COMBO_SOUND[text] || text;
}
function symbolChoices(answer) {
  const set = SYMBOL_CONFUSION.find(group => group.includes(answer));
  let pool = set ? [...set] : [...SYMBOL_SET];
  pool = shuffle(pool.filter(x => x !== answer)).slice(0, 3);
  return shuffle([{ text: answer, speak: answer }, ...pool.map(x => ({ text: x, speak: x }))]);
}
function comboChoices(answer) {
  const pool = shuffle(COMBO_SET.filter(x => x !== answer)).slice(0, 3);
  return shuffle([{ text: answer, speak: comboSound(answer) }, ...pool.map(x => ({ text: x, speak: comboSound(x) }))]);
}
function generateSymbolHear() {
  const answer = randomItem(SYMBOL_SET);
  return { area: '注音符號房', kind: 'symbol-hear', promptText: `請找出 ${answer}`, speakText: `請找出 ${answer}`, answer, options: symbolChoices(answer) };
}
function generateSymbolSee() {
  const answer = randomItem(SYMBOL_SET);
  return { area: '注音符號房', kind: 'symbol-see', promptText: '這個符號怎麼念？', speakText: '這個符號怎麼念？', answer, symbol: answer, options: symbolChoices(answer) };
}
function generateComboBuild() {
  const answer = randomItem(COMBO_SET);
  const left = answer.slice(0, 1);
  const right = answer.slice(1);
  return { area: '拼音練功房', kind: 'combo-build', promptText: `把 ${left} 和 ${right} 拼起來，會是哪一個？`, speakText: `把 ${left} 和 ${right} 拼起來，會是哪一個？`, answer, left, right, options: comboChoices(answer) };
}
function generateComboHear() {
  const answer = randomItem(COMBO_SET);
  return { area: '拼音練功房', kind: 'combo-hear', promptText: `請找出讀音像「${comboSound(answer)}」的拼音`, speakText: `請找出讀音像 ${comboSound(answer)} 的拼音`, answer, options: comboChoices(answer) };
}
function buildMathOptions(answer) {
  const set = new Set([answer]);
  const extras = [answer - 1, answer + 1, answer - 2, answer + 2, answer - 3, answer + 3];
  extras.forEach(n => { if (n > 0 && n <= 81) set.add(n); });
  while (set.size < 6) set.add(randomInt(2, 81));
  const distractors = shuffle([...set].filter(n => n !== answer)).slice(0, 3);
  return shuffle([{ text: String(answer), speak: numberToZh(answer) }, ...distractors.map(n => ({ text: String(n), speak: numberToZh(n) }))]);
}
function createMathQuestion(kind) {
  const a = randomInt(2, 9);
  const b = randomInt(1, 9);
  const answer = a * b;
  return {
    area: '九九口訣房',
    kind,
    promptText: `${a} × ${b} = __`,
    speakText: `${numberToZh(a)}${numberToZh(b)}，是多少？`,
    answer: String(answer),
    tableBase: a,
    tableTarget: b,
    options: buildMathOptions(answer)
  };
}
function generateMathChant() { return createMathQuestion('math-chant'); }
function generateMathFill() { return createMathQuestion('math-fill'); }
function generateForestQuestion() {
  return randomItem([generateSymbolHear, generateSymbolSee, generateComboBuild, generateComboHear, generateMathChant, generateMathFill])();
}
function buildTodayMission() {
  return shuffle([generateSymbolHear(), generateSymbolSee(), generateComboBuild(), generateMathChant(), generateMathFill()]);
}

function startMode(mode) {
  state.mode = mode;
  state.qIndex = 0;
  state.excluded = 0;
  state.wrongCount = 0;
  state.correctCombo = 0;
  state.awaitingNext = false;
  state.lastCorrectLine = '';
  stopSpeech();

  if (mode === 'today') {
    state.questionList = buildTodayMission();
    modeChip.textContent = '今日任務';
  } else if (mode === 'symbol') {
    state.questionList = Array.from({ length: 5 }, () => randomItem([generateSymbolHear, generateSymbolSee])());
    modeChip.textContent = '注音符號房';
  } else if (mode === 'combo') {
    state.questionList = Array.from({ length: 5 }, () => randomItem([generateComboBuild, generateComboHear])());
    modeChip.textContent = '拼音練功房';
  } else if (mode === 'math') {
    state.questionList = Array.from({ length: 5 }, () => randomItem([generateMathChant, generateMathFill])());
    modeChip.textContent = '九九口訣房';
  } else {
    state.questionList = Array.from({ length: 5 }, () => generateForestQuestion());
    modeChip.textContent = '森林冒險';
  }
  showScreen('quiz');
  renderQuestion();
  scrollToQuestionTop();
  setTimeout(scrollToQuestionTop, 120);
  setTimeout(scrollToQuestionTop, 260);
}
function renderMathStrip(q) {
  const wrap = document.createElement('div');
  wrap.className = 'math-strip';
  for (let i = 1; i <= 9; i += 1) {
    const item = document.createElement('div');
    item.className = `math-strip-item${i === q.tableTarget ? ' active' : ''}`;
    item.textContent = `${q.tableBase} × ${i} = ${q.tableBase * i}`;
    wrap.appendChild(item);
  }
  visualArea.appendChild(wrap);
}
function renderQuestion() {
  const q = state.questionList[state.qIndex];
  state.currentQuestion = q;
  state.excluded = 0;
  state.wrongCount = 0;
  state.awaitingNext = false;
  roundText.textContent = `${state.qIndex + 1} / ${state.questionList.length}`;
  excludedText.textContent = '0 個';
  questionPrompt.textContent = q.promptText;
  feedbackLine.textContent = randomItem(START_LINES);
  questionTypeLabel.textContent = q.area;
  visualArea.innerHTML = '';
  visualArea.classList.remove('collapsed');
  optionsWrap.innerHTML = '';
  nextQuestionBtn.classList.add('hidden-btn');
  nextQuestionBtn.textContent = state.qIndex === state.questionList.length - 1 ? '看結果' : '下一題';
  toggleVisualBtn.classList.add('hidden-btn');
  toggleVisualBtn.textContent = '展開乘法表';

  if (q.kind === 'symbol-see') {
    const pill = document.createElement('div');
    pill.className = 'visual-pill';
    pill.textContent = q.symbol;
    visualArea.appendChild(pill);
  }
  if (q.kind === 'combo-build') {
    [q.left, q.right].forEach(text => {
      const pill = document.createElement('div');
      pill.className = 'visual-pill';
      pill.textContent = text;
      visualArea.appendChild(pill);
    });
  }
  if (q.kind.startsWith('math')) {
    renderMathStrip(q);
    visualArea.classList.add('collapsed');
    toggleVisualBtn.classList.remove('hidden-btn');
    toggleVisualBtn.textContent = '展開乘法表';
  } else {
    visualArea.classList.remove('collapsed');
    toggleVisualBtn.classList.add('hidden-btn');
  }

  q.options.forEach(optionObj => {
    const row = document.createElement('div');
    row.className = 'option-row';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-btn';
    btn.textContent = optionObj.text;
    btn.onclick = () => handleAnswer(btn, optionObj);

    const speakBtn = document.createElement('button');
    speakBtn.type = 'button';
    speakBtn.className = 'option-speak-btn';
    speakBtn.textContent = '🔊';
    speakBtn.onclick = (e) => {
      e.stopPropagation();
      speak(optionObj.speak);
    };

    row.appendChild(btn);
    row.appendChild(speakBtn);
    optionsWrap.appendChild(row);
  });

  state.currentSpeechText = q.speakText;
}
function disableQuestionInputs() {
  optionsWrap.querySelectorAll('button').forEach(btn => btn.disabled = true);
}
function handleAnswer(btn, optionObj) {
  const q = state.currentQuestion;
  if (!q || state.awaitingNext || btn.classList.contains('excluded') || btn.classList.contains('correct')) return;

  if (optionObj.text === q.answer) {
    btn.classList.add('correct');
    state.correctCombo += 1;
    state.awaitingNext = true;
    disableQuestionInputs();
    let line;
    if (state.correctCombo >= 5) {
      line = pickNonRepeat(['森林好像在為你鼓掌。','小精靈開心得飛了一圈。','太棒了，森林又亮了一點。'], state.lastCorrectLine);
    } else if (state.correctCombo >= 2) {
      line = pickNonRepeat(['你今天越來越穩了。','太好了，這題也找到了。','小精靈說，你越來越熟練了。'], state.lastCorrectLine);
    } else {
      line = pickNonRepeat(CORRECT_LINES, state.lastCorrectLine);
    }
    state.lastCorrectLine = line;
    feedbackLine.textContent = line;
    nextQuestionBtn.classList.remove('hidden-btn');
    if (questionCard) {
      questionCard.classList.remove('sparkle-flash');
      void questionCard.offsetWidth;
      questionCard.classList.add('sparkle-flash');
    }
    const answerSpeak = q.kind.startsWith('math') ? `${q.speakText.replace('，是多少？','')}，${optionObj.speak}` : optionObj.speak;
    speak(`${line}。${answerSpeak}`);
  } else {
    btn.classList.add('excluded');
    btn.disabled = true;
    state.excluded += 1;
    state.wrongCount += 1;
    state.correctCombo = 0;
    excludedText.textContent = `${state.excluded} 個`;

    let line = '沒關係，我們再試一次。';
    if (state.wrongCount === 2) line = '再想想看。';
    if (state.wrongCount >= 3) line = '差一點點。';
    feedbackLine.textContent = line;
    speak(line);
  }
}
function nextQuestion() {
  stopSpeech();
  state.qIndex += 1;
  if (state.qIndex >= state.questionList.length) {
    finishRound();
  } else {
    renderQuestion();
    scrollToQuestionTop();
    setTimeout(scrollToQuestionTop, 120);
    setTimeout(scrollToQuestionTop, 260);
  }
}
function rewardSeed() {
  const roll = Math.random();
  if (roll < 0.08) {
    state.starSeeds += 1;
    return '星光種子';
  }
  if (roll < 0.28) {
    state.rareSeeds += 1;
    return '稀有種子';
  }
  state.normalSeeds += 1;
  return '普通種子';
}
function finishRound() {
  const reward = state.mode === 'today' ? 5 : 3;
  const seedType = rewardSeed();
  state.shards += reward;
  if (state.mode === 'today') state.missionDailyDone = true;
  if (state.mode === 'symbol' || state.mode === 'combo') state.missionLanguageDone = true;
  if (state.mode === 'math') state.missionMathDone = true;
  state.brightness = Math.min(100, state.brightness + (state.mode === 'today' ? 3 : 2));
  saveState();
  updateHome();
  resultTitle.textContent = '今天森林亮了一點。';
  resultText.textContent = `你得到 ${reward} 片光之碎片和 1 顆${seedType}。`;
  resultBrightness.textContent = `${state.brightness}%`;
  resultShards.textContent = String(state.shards);
  state.currentSpeechText = `${resultTitle.textContent}${resultText.textContent}`;
  showScreen('result');
  speak(state.currentSpeechText);
}
function plantSeed(type) {
  if (type === 'normal' && state.normalSeeds <= 0) return speak('現在還沒有普通種子喔。');
  if (type === 'rare' && state.rareSeeds <= 0) return speak('現在還沒有稀有種子喔。');
  if (type === 'star' && state.starSeeds <= 0) return speak('現在還沒有星光種子喔。');

  if (type === 'normal') state.normalSeeds -= 1;
  if (type === 'rare') state.rareSeeds -= 1;
  if (type === 'star') state.starSeeds -= 1;

  state.plantedSeeds += 1;
  const bonus = type === 'normal' ? 1 : (type === 'rare' ? 2 : 3);
  state.gardenStage = Math.min(5, Math.floor((state.plantedSeeds + bonus) / 2));
  state.brightness = Math.min(100, state.brightness + 1);
  saveState();
  updateHome();
  let line = `你種下了一顆${type === 'normal' ? '普通' : type === 'rare' ? '稀有' : '星光'}種子。`;
  if (type === 'star') line += ' 花圃裡好像有一點星光。';
  speak(`${line} 現在花圃是${getGardenStageLabel(state.gardenStage)}。`);
}

function bindEvents() {
  introAcceptBtn.onclick = () => {
    showScreen('name');
    setupNames();
    speak('請選一位小精靈朋友。');
  };
  introReplayBtn.onclick = () => speak(INTRO_STORY);
  globalSpeakBtn.onclick = () => speak(state.currentSpeechText || INTRO_STORY);

  nameReplayBtn.onclick = () => speak('請選一位小精靈朋友。名字就是個性，也可以之後到設定裡重新選。');
  confirmNameBtn.onclick = () => {
    state.spiritName = state.selectedName || '希望';
    showScreen('title');
    setupTitles();
    speak('請選你的探險稱號。');
  };

  titleReplayBtn.onclick = () => speak('請選你的探險稱號。小精靈會這樣叫你，也可以之後到設定裡重新選。');
  confirmTitleBtn.onclick = () => {
    state.playerTitle = state.selectedTitle || '小探險家';
    const story = buildBondStory();
    bondTitle.textContent = `${state.playerTitle}，你好呀。`;
    bondStoryText.innerHTML = story.replace(/\n/g, '<br>');
    saveState();
    showScreen('bond');
    speak(story);
  };

  bondReplayBtn.onclick = () => speak(buildBondStory());
  bondContinueBtn.onclick = () => {
    showScreen('home');
    updateHome();
    speak(`歡迎回來，${state.playerTitle || '小探險家'}。`);
  };

  document.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => startMode(btn.dataset.mode));
  });

  homeReplayBtn.onclick = () => speak(`${state.playerTitle || '小探險家'}，歡迎回來。森林亮度現在是 ${state.brightness}%。`);
  homeSettingBtn.onclick = () => {
    state.settingsSelectedName = state.spiritName || '希望';
    state.settingsSelectedTitle = state.playerTitle || '小探險家';
    setupSettings();
    showScreen('settings');
    speak('這裡是設定，你可以重新選擇小精靈和探險稱號。');
  };
  settingsSaveBtn.onclick = () => {
    state.spiritName = state.settingsSelectedName || state.spiritName || '希望';
    state.playerTitle = state.settingsSelectedTitle || state.playerTitle || '小探險家';
    saveState();
    updateHome();
    showScreen('home');
    speak(`好，現在我是${state.spiritName}，你是${state.playerTitle}。`);
  };
  settingsResetBtn.onclick = () => {
    const ok = confirm('重新設定會清掉目前的小精靈、稱號、種子、花圃進度與任務紀錄。確定要重新設定嗎？');
    if (!ok) return;
    resetAllProgress();
    window.location.reload();
  };
  settingsCancelBtn.onclick = () => {
    showScreen('home');
    updateHome();
  };

  if (gardenVisitBtn) {
    gardenVisitBtn.onclick = () => {
      updateHome();
      showScreen('garden');
      speak(`這裡是森林花圃，現在是${getGardenStageLabel(state.gardenStage)}。`);
    };
  }
  gardenBackBtn.onclick = () => {
    showScreen('home');
    updateHome();
  };
  plantNormalBtn.onclick = () => plantSeed('normal');
  plantRareBtn.onclick = () => plantSeed('rare');
  plantStarBtn.onclick = () => plantSeed('star');

  if (villageBtn) {
    villageBtn.onclick = () => {
      if (state.plantedSeeds < 5) {
        speak('小精靈村還沒亮起來，先多種幾顆種子吧。');
        return;
      }
      showScreen('village');
      updateHome();
      speak('這裡是小精靈村，大樹的樹洞會慢慢亮起來。');
    };
  }
  villageBackBtn.onclick = () => {
    showScreen('home');
    updateHome();
  };
  if (deerBtn) {
    deerBtn.onclick = () => {
      if (state.plantedSeeds < 8) {
        speak('小鹿森林還在遠方，等森林再長大一點就會出現。');
        return;
      }
      speak('小鹿森林已經出現了。之後這裡會有驚喜事件。');
    };
  }

  questionSpeakBtn.onclick = () => {
    const q = state.currentQuestion;
    if (!q) return;
    const optionsText = q.options.map(item => item.speak).join('，');
    speak(`${q.speakText}。選項有：${optionsText}`);
  };
  toggleVisualBtn.onclick = () => {
    if (toggleVisualBtn.classList.contains('hidden-btn')) return;
    const collapsed = visualArea.classList.toggle('collapsed');
    toggleVisualBtn.textContent = collapsed ? '展開乘法表' : '收起乘法表';
  };
  nextQuestionBtn.onclick = () => nextQuestion();
  backHomeBtn.onclick = () => {
    stopSpeech();
    showScreen('home');
    updateHome();
  };
  resultHomeBtn.onclick = () => {
    stopSpeech();
    showScreen('home');
    updateHome();
  };
  exploreMoreBtn.onclick = () => startMode('forest');
}
function init() {
  createFireflies();
  loadVoices();
  ensureDailyMissions();
  applyTimeTheme();
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;
  updateHome();
  setupNames();
  setupSettings();
  bindEvents();
  state.currentSpeechText = INTRO_STORY;
  if (state.spiritName && state.playerTitle) {
    showScreen('home');
  }
}
init();
