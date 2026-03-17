
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
  lastWrongLine: '',
  mastery: JSON.parse(localStorage.getItem('mm_mastery') || '{}'),
  lastRank: localStorage.getItem('mm_forest_rank') || '新手探險家',
  subMode: '',
  selectedTable: 2,
};

const screens = {
  intro: document.getElementById('introScreen'),
  name: document.getElementById('nameScreen'),
  title: document.getElementById('titleScreen'),
  bond: document.getElementById('bondScreen'),
  home: document.getElementById('homeScreen'),
  garden: document.getElementById('gardenScreen'),
  village: document.getElementById('villageScreen'),
  roomSelect: document.getElementById('roomSelectScreen'),
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
const forestRankText = document.getElementById('forestRankText');
const totalStarsText = document.getElementById('totalStarsText');
const rankHintText = document.getElementById('rankHintText');
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
const gardenSeedNormalText = document.getElementById('gardenSeedNormalText');
const gardenSeedRareText = document.getElementById('gardenSeedRareText');
const gardenSeedStarText = document.getElementById('gardenSeedStarText');
const gardenPlantedText = document.getElementById('gardenPlantedText');
const villageBackBtn = document.getElementById('villageBackBtn');
const roomSelectBackBtn = document.getElementById('roomSelectBackBtn');
const roomSelectTitle = document.getElementById('roomSelectTitle');
const roomSelectDesc = document.getElementById('roomSelectDesc');
const roomSelectGrid = document.getElementById('roomSelectGrid');
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
const resultRankText = document.getElementById('resultRankText');
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


function getSpiritReplyPools() {
  const pools = {
    '希望': {
      correct: ['太好了，我們找到答案了。','很好，森林又亮了一點。','做得真穩，我陪你一起前進。'],
      wrong: ['沒關係，我們再試一次。','再想想看，我陪你。','差一點點，我們快找到了。']
    },
    '勇光': {
      correct: ['答對了，繼續前進。','很好，我們又闖過一關。','太棒了，這題被你拿下了。'],
      wrong: ['沒關係，再衝一次。','差一點點，繼續前進。','別停，我們再想一次。']
    },
    '星語': {
      correct: ['答對了，森林在發光。','很好，星光亮起來了。','太棒了，這題有光了。'],
      wrong: ['沒關係，再聽一聽。','差一點點，答案快出現了。','先靜一下，我們再選。']
    },
    '小智': {
      correct: ['答對了，判斷很穩。','很好，你抓到關鍵了。','太棒了，這題思路正確。'],
      wrong: ['沒關係，再觀察一下。','差一點點，換個想法看看。','先比一比，我們再選。']
    },
    '暖暖': {
      correct: ['太好了，我替你開心。','很好，我們一起做到了。','答對了，真棒。'],
      wrong: ['沒關係，我陪你再試一次。','差一點點，不要急。','我們慢慢想就好。']
    },
    '亮亮': {
      correct: ['太棒了，亮起來了。','答對了，這題發光了。','很好，森林更亮了一點。'],
      wrong: ['沒關係，再照亮一次。','差一點點，再試試。','先不要急，馬上就找到了。']
    }
  };
  return pools[state.spiritName] || pools['希望'];
}

function getKnowledgeLine(q, optionObj) {
  if (q.kind.startsWith('math')) {
    if (q.tableBase && q.tableTarget) {
      return `${numberToZh(q.tableBase)}${numberToZh(q.tableTarget)}${optionObj.speak}`;
    }
    return `答案是${optionObj.speak}`;
  }
  if (q.kind === 'symbol-hear' || q.kind === 'symbol-see') {
    return `就是 ${optionObj.speak}`;
  }
  if (q.kind === 'combo-build' || q.kind === 'combo-hear') {
    const finalSpeak = optionObj.speak || optionObj.text || q.answer;
    if (q.left && q.right) {
      return `${q.left} ${q.right} ${finalSpeak}`;
    }
    return `${q.answer} ${finalSpeak}`;
  }
  return `答案是 ${optionObj.speak}`;
}

function buildAnswerReply(isCorrect, q, optionObj) {
  const pools = getSpiritReplyPools();
  const chosen = `你選擇的答案是：${optionObj.speak}。`;
  if (isCorrect) {
    const knowledge = `${getKnowledgeLine(q, optionObj)}。`;
    const spirit = pickNonRepeat(pools.correct, state.lastCorrectLine);
    state.lastCorrectLine = spirit;
    return `${chosen}${knowledge}${spirit}`;
  }
  const spirit = pickNonRepeat(pools.wrong, state.lastWrongLine);
  state.lastWrongLine = spirit;
  return `${chosen}${spirit}`;
}

function scrollToQuestionTop() {
  const target = document.querySelector('.quiz-topbar') || questionCard;
  if (!target) return;
  const jump = () => {
    const absoluteTop = Math.max(0, window.pageYOffset + target.getBoundingClientRect().top - 6);
    if (document.scrollingElement) document.scrollingElement.scrollTop = absoluteTop;
    document.documentElement.scrollTop = absoluteTop;
    document.body.scrollTop = absoluteTop;
    window.scrollTo(0, absoluteTop);
  };
  jump();
  requestAnimationFrame(jump);
  setTimeout(jump, 60);
  setTimeout(jump, 180);
  setTimeout(jump, 320);
}


function getMasteryKey(q) {
  if (!q) return '';
  if (q.kind === 'symbol-hear' || q.kind === 'symbol-see') return `symbol:${q.answer}`;
  if (q.kind === 'combo-build' || q.kind === 'combo-hear') return `combo:${q.answer}`;
  if (q.kind.startsWith('math')) {
    if (q.tableBase && q.tableTarget) return `math:${q.tableBase}x${q.tableTarget}`;
    return `math:${q.answer}`;
  }
  return q.answer || '';
}

function recordMastery(q) {
  const key = getMasteryKey(q);
  if (!key) return;
  if (!state.mastery[key]) state.mastery[key] = 0;
  state.mastery[key] += 1;
  localStorage.setItem('mm_mastery', JSON.stringify(state.mastery));
}

function getStars(count) {
  if (count >= 6) return 3;
  if (count >= 3) return 2;
  if (count >= 1) return 1;
  return 0;
}

function getTotalStars() {
  let total = 0;
  Object.keys(state.mastery).forEach(key => {
    total += getStars(state.mastery[key]);
  });
  return total;
}

function getForestRank() {
  const stars = getTotalStars();
  if (stars >= 50) return '星光小隊長';
  if (stars >= 30) return '森林引路人';
  if (stars >= 15) return '發光守護者';
  if (stars >= 5) return '森林學徒';
  return '新手探險家';
}

function getRankHint(rank) {
  const hints = {
    '新手探險家': '先從基本功開始，森林就會慢慢亮起來。',
    '森林學徒': '你已經不是剛進森林的孩子了。',
    '發光守護者': '你練出來的光，已經能照亮一小塊森林了。',
    '森林引路人': '你不只是會了，你開始穩了。',
    '星光小隊長': '你已經能帶著自己的光，穩穩往前走。'
  };
  return hints[rank] || '我們慢慢來，也會慢慢變強。';
}

function checkRankUp() {
  const newRank = getForestRank();
  const oldRank = state.lastRank || '新手探險家';
  state.lastRank = newRank;
  localStorage.setItem('mm_forest_rank', newRank);
  return newRank !== oldRank ? newRank : '';
}

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
  localStorage.setItem('mm_forest_rank', state.lastRank || '新手探險家');
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
  const totalStars = getTotalStars();
  const currentRank = getForestRank();
  if (forestRankText) forestRankText.textContent = currentRank;
  if (totalStarsText) totalStarsText.textContent = `${totalStars} ⭐`;
  if (rankHintText) rankHintText.textContent = getRankHint(currentRank);
  if (seedNormalText) seedNormalText.textContent = `${state.normalSeeds} 顆`;
  if (seedRareText) seedRareText.textContent = `${state.rareSeeds} 顆`;
  if (seedStarText) seedStarText.textContent = `${state.starSeeds} 顆`;
  if (plantedText) plantedText.textContent = `${state.plantedSeeds} 顆`;
  if (gardenSeedNormalText) gardenSeedNormalText.textContent = `${state.normalSeeds} 顆`;
  if (gardenSeedRareText) gardenSeedRareText.textContent = `${state.rareSeeds} 顆`;
  if (gardenSeedStarText) gardenSeedStarText.textContent = `${state.starSeeds} 顆`;
  if (gardenPlantedText) gardenPlantedText.textContent = `${state.plantedSeeds} 顆`;
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

  try { window.speechSynthesis.cancel(); } catch (e) {}

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

function buildRoomSelect(mode) {
  state.mode = mode;
  state.subMode = '';
  roomSelectGrid.innerHTML = '';
  refreshBackButtons();

  if (mode === 'symbol') {
    roomSelectTitle.textContent = '注音符號房';
    roomSelectDesc.textContent = '先選今天想怎麼練：暖身遊戲或正式練習。';
    const items = [
      { key:'symbol-catch', emoji:'🫧', title:'抓符號', desc:'聽聲音後，快速找出指定符號。' },
      { key:'symbol-diff', emoji:'👀', title:'找不同', desc:'找出跟大家不一樣的符號。' },
      { key:'symbol-hear', emoji:'🎧', title:'聽聲抓符號', desc:'先聽，再找出正確符號。' },
      { key:'symbol-practice', emoji:'📘', title:'正式練習', desc:'回到原本的注音符號題型。' }
    ];
    items.forEach(item => {
      const btn = document.createElement('button');
      btn.type='button';
      btn.className='room-card-btn';
      btn.innerHTML = `<span class="room-emoji">${item.emoji}</span><strong>${item.title}</strong><small>${item.desc}</small>`;
      btn.onclick = () => startSubMode(item.key);
      roomSelectGrid.appendChild(btn);
    });
  } else if (mode === 'math') {
    roomSelectTitle.textContent = '九九口訣房';
    roomSelectDesc.textContent = '先選今天想練哪一張乘法表，再開始練習。';

    const tableWrap = document.createElement('div');
    tableWrap.className = 'table-pick-grid';
    for (let t = 2; t <= 9; t += 1) {
      const btn = document.createElement('button');
      btn.type='button';
      btn.className = `table-pick-btn${state.selectedTable === t ? ' selected' : ''}`;
      btn.textContent = `${t} 的表`;
      btn.onclick = () => {
        state.selectedTable = t;
        [...tableWrap.children].forEach(node => node.classList.remove('selected'));
        btn.classList.add('selected');
      };
      tableWrap.appendChild(btn);
    }
    roomSelectGrid.appendChild(tableWrap);

    const startBtn = document.createElement('button');
    startBtn.type='button';
    startBtn.className='primary-btn';
    startBtn.textContent='開始今天的口訣練習';
    startBtn.onclick = () => startSubMode('math-table');
    roomSelectGrid.appendChild(startBtn);

    const note = document.createElement('div');
    note.className='subtle';
    note.style.lineHeight='1.7';
    note.textContent='小精靈會先帶念一遍，再依照順序練，熟了之後才會變快。';
    roomSelectGrid.appendChild(note);
  }
  showScreen('roomSelect');
}

function startSubMode(subMode) {
  state.subMode = subMode;
  state.qIndex = 0;
  state.excluded = 0;
  state.wrongCount = 0;
  state.correctCombo = 0;
  state.awaitingNext = false;
  state.lastCorrectLine = '';
  stopSpeech();

  if (subMode === 'symbol-practice') {
    state.questionList = Array.from({ length: 5 }, () => randomItem([generateSymbolHear, generateSymbolSee])());
    modeChip.textContent = '注音符號房';
  } else if (subMode === 'symbol-catch') {
    state.questionList = Array.from({ length: 8 }, () => generateSymbolHear());
    modeChip.textContent = '抓符號';
  } else if (subMode === 'symbol-hear') {
    state.questionList = Array.from({ length: 8 }, () => generateSymbolHear());
    modeChip.textContent = '聽聲抓符號';
  } else if (subMode === 'symbol-diff') {
    state.questionList = Array.from({ length: 8 }, () => generateSymbolDiff());
    modeChip.textContent = '找不同';
  } else if (subMode === 'math-table') {
    state.questionList = buildTablePractice(state.selectedTable);
    modeChip.textContent = `${state.selectedTable} 的乘法表`;
  }
  showScreen('quiz');
  refreshBackButtons();
  renderQuestion();
  scrollToQuestionTop();
}

function generateSymbolDiff() {
  const group = randomItem(SYMBOL_CONFUSION);
  const odd = randomItem(group);
  const base = randomItem(group.filter(x => x !== odd));
  const options = shuffle([
    { text: base, speak: base },
    { text: base, speak: base },
    { text: odd, speak: odd },
    { text: base, speak: base }
  ]);
  return {
    area: '注音暖身',
    kind: 'symbol-diff',
    promptText: '找出不一樣的符號',
    speakText: '找出不一樣的符號',
    answer: odd,
    options
  };
}

function buildTablePractice(table) {
  const list = [];
  for (let step = 1; step <= 9; step += 1) {
    const answer = table * step;
    const candidates = [];
    [answer - table, answer + table, answer - 2, answer + 2].forEach(n => {
      if (n > 0 && n <= 81 && n !== answer && !candidates.includes(n)) candidates.push(n);
    });
    while (candidates.length < 2) {
      const candidate = answer + (Math.random() > 0.5 ? 1 : -1) * (table + candidates.length + 1);
      if (candidate > 0 && candidate <= 81 && candidate !== answer && !candidates.includes(candidate)) candidates.push(candidate);
    }
    const options = shuffle([
      { text: String(answer), speak: numberToZh(answer) },
      { text: String(candidates[0]), speak: numberToZh(candidates[0]) },
      { text: String(candidates[1]), speak: numberToZh(candidates[1]) }
    ]);
    list.push({
      area: '九九口訣房',
      kind: 'math-basic',
      promptText: `${numberToZh(table)}${numberToZh(step)}`,
      speakText: `${numberToZh(table)}${numberToZh(step)}`,
      answer: String(answer),
      tableBase: table,
      tableTarget: step,
      options
    });
  }
  return list;
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
  if (mode === 'symbol' || mode === 'math') {
    buildRoomSelect(mode);
    return;
  }

  state.mode = mode;
  state.subMode = '';
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
  refreshBackButtons();
  renderQuestion();
  scrollToQuestionTop();
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


function setBasketPreview(optionsWrap, answerText, stateName = 'holding') {
  const basket = optionsWrap.querySelector('.fruit-basket');
  if (!basket) return;
  const content = basket.querySelector('.basket-content');
  if (!content) return;
  basket.classList.remove('holding','dropped');
  if (!answerText) {
    content.innerHTML = '<span class="basket-placeholder">籃子準備好了</span>';
    return;
  }
  basket.classList.add(stateName);
  content.innerHTML = `<span class="basket-fruit-preview">🍎 ${answerText}</span>`;
}

function dropFruitIntoBasket(optionsWrap, answerText) {
  setBasketPreview(optionsWrap, answerText, 'dropped');
}

function renderFruitDragQuestion(q) {
  optionsWrap.innerHTML = '';
  optionsWrap.className = 'options-wrap drag-fruit-wrap';
  optionsWrap.dataset.layout = 'drag-fruit';

  const board = document.createElement('div');
  board.className = 'fruit-board';

  const basket = document.createElement('button');
  basket.type = 'button';
  basket.className = 'fruit-basket';
  basket.innerHTML = `
    <div class="basket-title">把果子放進籃子</div>
    <div class="basket-art" aria-hidden="true">
      <div class="basket-handle"></div>
      <div class="basket-body">
        <div class="basket-content"><span class="basket-placeholder">籃子準備好了</span></div>
      </div>
    </div>
    <small>手機：先點果子，再點籃子。電腦：也可以直接拖曳。</small>`;
  basket.addEventListener('dragover', (e) => {
    if (state.awaitingNext) return;
    e.preventDefault();
    basket.classList.add('ready');
  });
  basket.addEventListener('dragleave', () => basket.classList.remove('ready'));
  basket.addEventListener('drop', (e) => {
    if (state.awaitingNext) return;
    e.preventDefault();
    basket.classList.remove('ready');
    const idx = e.dataTransfer.getData('text/plain');
    if (idx === '') return;
    const fruit = optionsWrap.querySelector(`[data-fruit-index="${idx}"]`);
    if (fruit) {
      const optionObj = q.options[Number(idx)];
      dropFruitIntoBasket(optionsWrap, optionObj.text);
      evaluateAnswer(fruit, optionObj);
    }
  });
  basket.addEventListener('click', () => {
    if (state.awaitingNext) return;
    const selected = optionsWrap.querySelector('.fruit-chip.selected');
    if (!selected) {
      const line = '先選一顆果子，再放進籃子。';
      feedbackLine.textContent = line;
      speak(line);
      return;
    }
    const idx = Number(selected.dataset.fruitIndex);
    dropFruitIntoBasket(optionsWrap, q.options[idx].text);
    evaluateAnswer(selected, q.options[idx]);
  });

  const orchard = document.createElement('div');
  orchard.className = 'fruit-orchard';

  q.options.forEach((optionObj, index) => {
    const fruit = document.createElement('button');
    fruit.type = 'button';
    fruit.className = 'fruit-chip';
    fruit.draggable = true;
    fruit.dataset.fruitIndex = String(index);
    fruit.innerHTML = `<span class="fruit-emoji">🍎</span><span class="fruit-answer">${optionObj.text}</span>`;
    fruit.addEventListener('dragstart', (e) => {
      if (fruit.disabled || state.awaitingNext) {
        e.preventDefault();
        return;
      }
      fruit.classList.add('dragging');
      e.dataTransfer.setData('text/plain', String(index));
    });
    fruit.addEventListener('dragend', () => fruit.classList.remove('dragging'));
    fruit.addEventListener('click', () => {
      if (fruit.disabled || state.awaitingNext) return;
      const already = fruit.classList.contains('selected');
      optionsWrap.querySelectorAll('.fruit-chip').forEach(node => node.classList.remove('selected'));
      if (!already) {
        fruit.classList.add('selected');
        setBasketPreview(optionsWrap, optionObj.text, 'holding');
        feedbackLine.textContent = `已拿起果子 ${optionObj.text}，再點一下籃子。`;
      } else {
        setBasketPreview(optionsWrap, '', 'holding');
      }
    });
    orchard.appendChild(fruit);
  });

  board.appendChild(basket);
  board.appendChild(orchard);
  optionsWrap.appendChild(board);
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
  nextQuestionBtn.disabled = true;
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
  if (state.subMode === 'math-table' && state.qIndex === 0) {
    feedbackLine.textContent = `${numberToZh(state.selectedTable)} 的表，我們先從頭慢慢練。`;
  }
}
function disableQuestionInputs() {
  optionsWrap.querySelectorAll('button').forEach(btn => btn.disabled = true);
  optionsWrap.querySelectorAll('.fruit-chip').forEach(node => node.setAttribute('draggable', 'false'));
  const basket = optionsWrap.querySelector('.fruit-basket');
  if (basket) basket.disabled = true;
}

function evaluateAnswer(btn, optionObj) {
  const q = state.currentQuestion;
  if (!q || state.awaitingNext || btn.classList.contains('excluded') || btn.classList.contains('correct')) return;

  if (optionObj.text === q.answer) {
    btn.classList.add('correct');
    state.correctCombo += 1;
    state.awaitingNext = true;
    disableQuestionInputs();
    nextQuestionBtn.classList.remove('hidden-btn');
    nextQuestionBtn.disabled = false;

    if (questionCard) {
      questionCard.classList.remove('sparkle-flash');
      void questionCard.offsetWidth;
      questionCard.classList.add('sparkle-flash');
    }

    recordMastery(q);
    const rankUp = checkRankUp();
    updateHome();
    const baseReply = buildAnswerReply(true, q, optionObj);
    const reply = rankUp ? `${baseReply} 森林升級了，你現在是${rankUp}。` : baseReply;
    feedbackLine.textContent = reply;
    speak(reply);
  } else {
    btn.classList.add('excluded');
    btn.disabled = true;
    btn.classList.remove('selected');
    if (q.uiType === 'drag-fruit') {
      setTimeout(() => setBasketPreview(optionsWrap, '', 'holding'), 520);
    }
    state.excluded += 1;
    state.wrongCount += 1;
    state.correctCombo = 0;
    excludedText.textContent = `${state.excluded} 個`;

    const reply = buildAnswerReply(false, q, optionObj);
    feedbackLine.textContent = reply;
    speak(reply);
  }
}

function handleAnswer(btn, optionObj) {
  evaluateAnswer(btn, optionObj);
}

function nextQuestion() {
  stopSpeech();
  state.qIndex += 1;
  if (state.qIndex >= state.questionList.length) {
    finishRound();
  } else {
    renderQuestion();
    scrollToQuestionTop();
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
  const currentRank = getForestRank();
  if (resultRankText) resultRankText.textContent = currentRank;
  state.currentSpeechText = `${resultTitle.textContent}${resultText.textContent} 你現在是${currentRank}。`;
  refreshBackButtons();
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


function goBackToPreviousLayer() {
  stopSpeech();
  if (state.mode === 'symbol' || state.mode === 'math') {
    buildRoomSelect(state.mode);
    return;
  }
  showScreen('home');
  updateHome();
}

function refreshBackButtons() {
  const isRoomMode = state.mode === 'symbol' || state.mode === 'math';
  if (backHomeBtn) backHomeBtn.textContent = isRoomMode ? '← 回上一層' : '← 回森林';
  if (resultHomeBtn) resultHomeBtn.textContent = isRoomMode ? '回到上一層' : '回到森林地圖';
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
  roomSelectBackBtn.onclick = () => {
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
    goBackToPreviousLayer();
  };
  resultHomeBtn.onclick = () => {
    goBackToPreviousLayer();
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
  refreshBackButtons();
  state.currentSpeechText = INTRO_STORY;
  if (state.spiritName && state.playerTitle) {
    showScreen('home');
  }
}
init();


/* ===== v0.9.0 30玩法擴充版 ===== */
const ROOM_GAME_LIBRARY = {
  symbol: [
    { key:'symbol-catch', emoji:'🫧', title:'抓符號', desc:'聽聲音後，抓到正確符號。' },
    { key:'symbol-diff', emoji:'👀', title:'找不同', desc:'找出跟大家不一樣的符號。' },
    { key:'symbol-hear', emoji:'🎧', title:'聽聲抓符號', desc:'先聽，再找出正確符號。' },
    { key:'symbol-practice', emoji:'📘', title:'正式練習', desc:'看與聽交替，穩穩練基本功。' },
    { key:'symbol-butterfly', emoji:'🦋', title:'蝴蝶花園', desc:'點到飛過去的正確符號。' },
    { key:'symbol-river', emoji:'🪨', title:'小鹿過河', desc:'選對石頭，幫小鹿過河。' },
    { key:'symbol-bubble', emoji:'🫧', title:'泡泡森林', desc:'戳破藏著目標的泡泡。' },
    { key:'symbol-shadow', emoji:'🌘', title:'影子尋符', desc:'看符號影子，找出本尊。' }
  ],
  combo: [
    { key:'combo-build', emoji:'🧩', title:'拼音組合', desc:'把前後符號拼成完整拼音。' },
    { key:'combo-hear', emoji:'🎵', title:'聽音找拼音', desc:'聽讀音後選出正確拼音。' },
    { key:'combo-bridge', emoji:'🌉', title:'拼音過橋', desc:'選對橋板，幫小精靈過橋。' },
    { key:'combo-garden', emoji:'🌼', title:'花園找拼音', desc:'在花叢中找出對的拼音。' },
    { key:'combo-memory', emoji:'🍃', title:'記憶葉片', desc:'看提示後，找出正確拼音。' },
    { key:'combo-path', emoji:'🛤️', title:'森林路徑', desc:'選出會通往正確讀音的路。' }
  ],
  math: [
    { key:'math-table', emoji:'📘', title:'順序口訣', desc:'從 1 到 9，依序把這一張表練熟。' },
    { key:'math-catch', emoji:'✨', title:'抓精靈', desc:'抓到飛過去的正確答案。' },
    { key:'math-river', emoji:'🪨', title:'過河跳石', desc:'選對石頭，小鹿才跳得過去。' },
    { key:'math-drum', emoji:'🥁', title:'節奏鼓', desc:'跟著口訣節奏找出答案。' },
    { key:'math-pair', emoji:'🃏', title:'答案配對', desc:'幫算式找到對的答案。' },
    { key:'math-run', emoji:'🦌', title:'森林跑跑', desc:'在分岔路前快速選答案。' },
    { key:'math-fish', emoji:'🎣', title:'釣魚池', desc:'釣起身上寫著正確答案的魚。' },
    { key:'math-bridge', emoji:'🌉', title:'搭橋前進', desc:'把正確橋板接上去。' },
    { key:'math-feed', emoji:'🍎', title:'精靈餵食', desc:'餵小精靈吃對的果子。' },
    { key:'math-maze', emoji:'🌲', title:'森林迷宮', desc:'走進寫著正確答案的路。' },
    { key:'math-echo', emoji:'🔔', title:'回聲谷', desc:'聽完口訣，找出答案。' },
    { key:'math-stones', emoji:'🧱', title:'口訣石階', desc:'踩對石階，一步步往前。' }
  ],
  forest: [
    { key:'forest-mix', emoji:'🌟', title:'綜合冒險', desc:'注音、拼音、九九混合挑戰。' },
    { key:'forest-treasure', emoji:'🧭', title:'尋寶挑戰', desc:'一路答對，帶小精靈找到寶箱。' },
    { key:'forest-relay', emoji:'🏃', title:'森林接力', desc:'每一題都是不同型態的關卡。' },
    { key:'forest-festival', emoji:'🎉', title:'螢光慶典', desc:'最熱鬧的混合練習場。' }
  ]
};

function roomUsesSelection(mode) {
  return ['symbol','combo','math','forest'].includes(mode);
}

function randomStep() {
  return randomInt(1, 9);
}

function createSymbolGame(config = {}) {
  const answer = config.answer || randomItem(SYMBOL_SET);
  return {
    area: config.area || '注音符號房',
    kind: config.kind || 'symbol-hear',
    promptText: config.promptText || `請找出 ${answer}`,
    speakText: config.speakText || `請找出 ${answer}`,
    answer,
    symbol: config.symbol || answer,
    uiType: config.uiType || 'tiles',
    scene: config.scene || '',
    options: config.options || symbolChoices(answer)
  };
}

function createComboGame(config = {}) {
  const answer = config.answer || randomItem(COMBO_SET);
  const left = answer.slice(0, 1);
  const right = answer.slice(1);
  return {
    area: config.area || '拼音練功房',
    kind: config.kind || 'combo-build',
    promptText: config.promptText || `把 ${left} 和 ${right} 拼起來，會是哪一個？`,
    speakText: config.speakText || `把 ${left} 和 ${right} 拼起來，會是哪一個？`,
    answer,
    left,
    right,
    uiType: config.uiType || 'cards',
    scene: config.scene || '',
    options: config.options || comboChoices(answer)
  };
}

function createTableMathQuestion(table, step, config = {}) {
  const answer = table * step;
  const options = config.options || buildMathOptions(answer);
  return {
    area: config.area || '九九口訣房',
    kind: config.kind || 'math-basic',
    promptText: config.promptText || `${table} × ${step} = ?`,
    speakText: config.speakText || `${numberToZh(table)}${numberToZh(step)}？`,
    answer: String(answer),
    tableBase: table,
    tableTarget: step,
    uiType: config.uiType || 'tiles',
    scene: config.scene || '',
    options
  };
}

function buildTablePractice(table) {
  const list = [];
  for (let step = 1; step <= 9; step += 1) {
    list.push(createTableMathQuestion(table, step, {
      kind: 'math-basic',
      uiType: 'table-strip',
      scene: '🌟 依照順序，把這一張表穩穩練熟。'
    }));
  }
  return list;
}


function buildMathGameSet(table, kind, uiType, scene, count = 8, ordered = false) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    const step = ordered ? ((i % 9) + 1) : randomStep();
    list.push(createTableMathQuestion(table, step, { kind, uiType, scene }));
  }
  return list;
}

function generateSymbolButterfly() {
  const answer = randomItem(SYMBOL_SET);
  return createSymbolGame({
    kind: 'symbol-butterfly',
    promptText: `請抓到蝴蝶上的 ${answer}`,
    speakText: `請抓到 ${answer}`,
    answer,
    uiType: 'butterfly',
    scene: '🦋 蝴蝶飛進花園了，快找對那一隻。'
  });
}
function generateSymbolRiver() {
  const answer = randomItem(SYMBOL_SET);
  return createSymbolGame({
    kind: 'symbol-river',
    promptText: `選對石頭，讓小鹿跳到 ${answer}`,
    speakText: `請找出 ${answer}`,
    answer,
    uiType: 'river',
    scene: '🦌 小鹿在河邊等你幫忙。'
  });
}
function generateSymbolBubble() {
  const answer = randomItem(SYMBOL_SET);
  return createSymbolGame({
    kind: 'symbol-bubble',
    promptText: `戳破寫著 ${answer} 的泡泡`,
    speakText: `請找出 ${answer}`,
    answer,
    uiType: 'bubble',
    scene: '🫧 泡泡飄上來了，找到目標吧。'
  });
}
function generateSymbolShadow() {
  const answer = randomItem(SYMBOL_SET);
  return createSymbolGame({
    kind: 'symbol-shadow',
    promptText: '哪一個符號和影子一樣？',
    speakText: '哪一個符號和影子一樣？',
    answer,
    symbol: answer,
    uiType: 'shadow',
    scene: `🌘 影子露出來了：${answer}`
  });
}

function generateComboBridge() {
  return createComboGame({
    kind: 'combo-bridge',
    promptText: '選對橋板，讓拼音橋接起來。',
    speakText: '選對拼音，讓橋接起來。',
    uiType: 'bridge',
    scene: '🌉 小精靈想過橋，先把拼音橋接好。'
  });
}
function generateComboGarden() {
  const answer = randomItem(COMBO_SET);
  return createComboGame({
    kind: 'combo-garden',
    answer,
    promptText: `花叢裡哪一朵是「${comboSound(answer)}」？`,
    speakText: `請找出讀音像 ${comboSound(answer)} 的拼音`,
    uiType: 'garden',
    scene: '🌼 花園裡藏著正確拼音。'
  });
}
function generateComboMemory() {
  const answer = randomItem(COMBO_SET);
  return createComboGame({
    kind: 'combo-memory',
    answer,
    promptText: `記住剛剛的聲音，找出「${comboSound(answer)}」`,
    speakText: `請找出讀音像 ${comboSound(answer)} 的拼音`,
    uiType: 'memory',
    scene: '🍃 葉片翻動一下後，答案就藏起來了。'
  });
}
function generateComboPath() {
  return createComboGame({
    kind: 'combo-path',
    promptText: '選出會通往正確拼音的路。',
    speakText: '選出正確拼音。',
    uiType: 'path',
    scene: '🛤️ 森林小路分岔了，幫忙選方向。'
  });
}

function buildQuestionListForSubMode(subMode) {
  switch (subMode) {
    case 'symbol-practice':
      return Array.from({ length: 8 }, () => randomItem([generateSymbolHear, generateSymbolSee])());
    case 'symbol-catch':
      return Array.from({ length: 8 }, () => createSymbolGame({ kind:'symbol-catch', uiType:'floating-catch', scene:'✨ 小精靈飛得好快，快抓到對的符號。' }));
    case 'symbol-hear':
      return Array.from({ length: 8 }, () => generateSymbolHear());
    case 'symbol-diff':
      return Array.from({ length: 8 }, () => generateSymbolDiff());
    case 'symbol-butterfly':
      return Array.from({ length: 8 }, () => generateSymbolButterfly());
    case 'symbol-river':
      return Array.from({ length: 8 }, () => generateSymbolRiver());
    case 'symbol-bubble':
      return Array.from({ length: 8 }, () => generateSymbolBubble());
    case 'symbol-shadow':
      return Array.from({ length: 8 }, () => generateSymbolShadow());

    case 'combo-build':
      return Array.from({ length: 8 }, () => generateComboBuild());
    case 'combo-hear':
      return Array.from({ length: 8 }, () => generateComboHear());
    case 'combo-bridge':
      return Array.from({ length: 8 }, () => generateComboBridge());
    case 'combo-garden':
      return Array.from({ length: 8 }, () => generateComboGarden());
    case 'combo-memory':
      return Array.from({ length: 8 }, () => generateComboMemory());
    case 'combo-path':
      return Array.from({ length: 8 }, () => generateComboPath());

    case 'math-table':
      return buildTablePractice(state.selectedTable);
    case 'math-catch':
      return buildMathGameSet(state.selectedTable, 'math-catch', 'floating-catch', '✨ 抓到飛過去的正確答案。');
    case 'math-river':
      return buildMathGameSet(state.selectedTable, 'math-river', 'river', '🪨 選對石頭，小鹿就能跳過去。');
    case 'math-drum':
      return buildMathGameSet(state.selectedTable, 'math-drum', 'drum', '🥁 跟著節奏，把口訣打進腦袋裡。');
    case 'math-pair':
      return buildMathGameSet(state.selectedTable, 'math-pair', 'cards', '🃏 幫算式和答案牽起來。');
    case 'math-run':
      return buildMathGameSet(state.selectedTable, 'math-run', 'path', '🦌 小鹿跑起來了，快選對方向。');
    case 'math-fish':
      return buildMathGameSet(state.selectedTable, 'math-fish', 'pond', '🎣 湖裡有很多魚，釣起正確那一條。');
    case 'math-bridge':
      return buildMathGameSet(state.selectedTable, 'math-bridge', 'bridge', '🌉 把橋板接好，才能繼續前進。');
    case 'math-feed':
      return buildMathGameSet(state.selectedTable, 'math-feed', 'drag-fruit', '🍎 把正確果子送進籃子裡，小精靈就會發光。');
    case 'math-maze':
      return buildMathGameSet(state.selectedTable, 'math-maze', 'maze', '🌲 森林迷宮有好多路，走對那一條。');
    case 'math-echo':
      return buildMathGameSet(state.selectedTable, 'math-echo', 'echo', '🔔 回聲谷在重複口訣，找出答案。');
    case 'math-stones':
      return buildMathGameSet(state.selectedTable, 'math-stones', 'stepping', '🧱 一格一格踩穩口訣石階。');

    case 'forest-mix':
      return Array.from({ length: 10 }, () => randomItem([
        generateSymbolHear,
        generateSymbolButterfly,
        generateComboBuild,
        generateComboGarden,
        () => randomItem(buildMathGameSet(state.selectedTable || 4, 'math-catch', 'floating-catch', '✨ 綜合冒險中的九九精靈。', 1)),
        () => randomItem(buildMathGameSet(state.selectedTable || 4, 'math-river', 'river', '🪨 綜合冒險中的過河關卡。', 1))
      ])());
    case 'forest-treasure':
      return Array.from({ length: 10 }, (_, i) => randomItem([
        generateSymbolRiver,
        generateComboBridge,
        () => randomItem(buildMathGameSet(state.selectedTable || 5, 'math-fish', 'pond', '🎣 寶箱地圖藏在魚池裡。', 1)),
        () => randomItem(buildMathGameSet(state.selectedTable || 5, 'math-bridge', 'bridge', '🌉 先把橋搭好，寶箱才看得見。', 1))
      ])());
    case 'forest-relay':
      return [
        generateSymbolHear(),
        generateComboBuild(),
        ...buildMathGameSet(state.selectedTable || 6, 'math-run', 'path', '🏃 接力到九九口訣房。', 2),
        generateSymbolBubble(),
        generateComboPath(),
        ...buildMathGameSet(state.selectedTable || 6, 'math-drum', 'drum', '🥁 最後再打一次節奏。', 2)
      ];
    case 'forest-festival':
      return Array.from({ length: 10 }, () => randomItem([
        generateSymbolBubble,
        generateComboGarden,
        () => randomItem(buildMathGameSet(state.selectedTable || 7, 'math-catch', 'floating-catch', '🎉 螢光慶典的答案在空中。', 1)),
        () => randomItem(buildMathGameSet(state.selectedTable || 7, 'math-echo', 'echo', '🎉 跟著回聲一起玩。', 1))
      ])());
  }
  return Array.from({ length: 5 }, () => randomItem([generateSymbolHear, generateComboBuild, generateMathChant])());
}

function getGameTitle(mode, subMode) {
  const group = ROOM_GAME_LIBRARY[mode] || [];
  const found = group.find(item => item.key === subMode);
  if (!found) return modeChip ? modeChip.textContent : '森林練習';
  if (mode === 'math' && state.selectedTable) return `${found.title}｜${state.selectedTable} 的表`;
  return found.title;
}

function buildRoomSelect(mode) {
  state.mode = mode;
  state.subMode = '';
  roomSelectGrid.innerHTML = '';
  refreshBackButtons();

  const roomTitleMap = {
    symbol: ['注音符號房', '今天想怎麼練？選一種玩法就出發。'],
    combo: ['拼音練功房', '把拼音拆開練、組起來練、在遊戲裡練。'],
    math: ['九九口訣房', '先選一張乘法表，再選一個玩法。'],
    forest: ['森林冒險', '這裡是混合挑戰區，每次都不太一樣。']
  };
  const [title, desc] = roomTitleMap[mode] || ['森林房間', '選一種玩法開始。'];
  roomSelectTitle.textContent = title;
  roomSelectDesc.textContent = desc;

  if (mode === 'math' || mode === 'forest') {
    const tableWrap = document.createElement('div');
    tableWrap.className = 'table-pick-grid';
    for (let t = 2; t <= 9; t += 1) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `table-pick-btn${state.selectedTable === t ? ' selected' : ''}`;
      btn.textContent = `${t} 的表`;
      btn.onclick = () => {
        state.selectedTable = t;
        [...tableWrap.children].forEach(node => node.classList.remove('selected'));
        btn.classList.add('selected');
      };
      tableWrap.appendChild(btn);
    }
    roomSelectGrid.appendChild(tableWrap);
  }

  const list = ROOM_GAME_LIBRARY[mode] || [];
  list.forEach(item => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'room-card-btn';
    btn.innerHTML = `<span class="room-emoji">${item.emoji}</span><strong>${item.title}</strong><small>${item.desc}</small>`;
    btn.onclick = () => startSubMode(item.key);
    roomSelectGrid.appendChild(btn);
  });
  showScreen('roomSelect');
}

function startSubMode(subMode) {
  state.subMode = subMode;
  state.qIndex = 0;
  state.excluded = 0;
  state.wrongCount = 0;
  state.correctCombo = 0;
  state.awaitingNext = false;
  state.lastCorrectLine = '';
  state.lastWrongLine = '';
  stopSpeech();
  state.questionList = buildQuestionListForSubMode(subMode);
  modeChip.textContent = getGameTitle(state.mode, subMode);
  showScreen('quiz');
  refreshBackButtons();
  renderQuestion();
  scrollToQuestionTop();
}

function createSceneBadge(text) {
  const badge = document.createElement('div');
  badge.className = 'scene-badge';
  badge.textContent = text;
  return badge;
}


function renderFruitDragQuestion(q) {
  optionsWrap.innerHTML = '';
  optionsWrap.className = 'options-wrap drag-fruit-wrap';
  optionsWrap.dataset.layout = 'drag-fruit';

  const board = document.createElement('div');
  board.className = 'fruit-board';

  const basket = document.createElement('button');
  basket.type = 'button';
  basket.className = 'fruit-basket';
  basket.innerHTML = `
    <div class="basket-title">把果子放進籃子</div>
    <div class="basket-art" aria-hidden="true">
      <div class="basket-handle"></div>
      <div class="basket-body">
        <div class="basket-content"><span class="basket-placeholder">籃子準備好了</span></div>
      </div>
    </div>
    <small>手機：先點果子，再點籃子。電腦：也可以直接拖曳。</small>`;
  basket.addEventListener('dragover', (e) => {
    if (state.awaitingNext) return;
    e.preventDefault();
    basket.classList.add('ready');
  });
  basket.addEventListener('dragleave', () => basket.classList.remove('ready'));
  basket.addEventListener('drop', (e) => {
    if (state.awaitingNext) return;
    e.preventDefault();
    basket.classList.remove('ready');
    const idx = e.dataTransfer.getData('text/plain');
    if (idx === '') return;
    const fruit = optionsWrap.querySelector(`[data-fruit-index="${idx}"]`);
    if (fruit) {
      const optionObj = q.options[Number(idx)];
      dropFruitIntoBasket(optionsWrap, optionObj.text);
      evaluateAnswer(fruit, optionObj);
    }
  });
  basket.addEventListener('click', () => {
    if (state.awaitingNext) return;
    const selected = optionsWrap.querySelector('.fruit-chip.selected');
    if (!selected) {
      const line = '先選一顆果子，再放進籃子。';
      feedbackLine.textContent = line;
      speak(line);
      return;
    }
    const idx = Number(selected.dataset.fruitIndex);
    dropFruitIntoBasket(optionsWrap, q.options[idx].text);
    evaluateAnswer(selected, q.options[idx]);
  });

  const orchard = document.createElement('div');
  orchard.className = 'fruit-orchard';

  q.options.forEach((optionObj, index) => {
    const fruit = document.createElement('button');
    fruit.type = 'button';
    fruit.className = 'fruit-chip';
    fruit.draggable = true;
    fruit.dataset.fruitIndex = String(index);
    fruit.innerHTML = `<span class="fruit-emoji">🍎</span><span class="fruit-answer">${optionObj.text}</span>`;
    fruit.addEventListener('dragstart', (e) => {
      if (fruit.disabled || state.awaitingNext) {
        e.preventDefault();
        return;
      }
      fruit.classList.add('dragging');
      e.dataTransfer.setData('text/plain', String(index));
    });
    fruit.addEventListener('dragend', () => fruit.classList.remove('dragging'));
    fruit.addEventListener('click', () => {
      if (fruit.disabled || state.awaitingNext) return;
      const already = fruit.classList.contains('selected');
      optionsWrap.querySelectorAll('.fruit-chip').forEach(node => node.classList.remove('selected'));
      if (!already) {
        fruit.classList.add('selected');
        setBasketPreview(optionsWrap, optionObj.text, 'holding');
        feedbackLine.textContent = `已拿起果子 ${optionObj.text}，再點一下籃子。`;
      } else {
        setBasketPreview(optionsWrap, '', 'holding');
      }
    });
    orchard.appendChild(fruit);
  });

  board.appendChild(basket);
  board.appendChild(orchard);
  optionsWrap.appendChild(board);
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
  feedbackLine.textContent = q.kind.startsWith('math') && state.subMode === 'math-table' && state.qIndex === 0
    ? `${numberToZh(state.selectedTable)} 的表，我們先慢慢來。`
    : (q.startLine || randomItem(START_LINES));
  questionTypeLabel.textContent = q.area;
  visualArea.innerHTML = '';
  optionsWrap.innerHTML = '';
  optionsWrap.className = 'options-wrap';
  optionsWrap.dataset.layout = q.uiType || 'default';
  nextQuestionBtn.classList.add('hidden-btn');
  nextQuestionBtn.textContent = state.qIndex === state.questionList.length - 1 ? '看結果' : '下一題';
  nextQuestionBtn.disabled = true;
  toggleVisualBtn.classList.add('hidden-btn');
  toggleVisualBtn.textContent = '展開乘法表';
  visualArea.classList.remove('collapsed');
  visualArea.className = `visual-area ${(q.uiType || 'default')}`;

  if (q.scene) visualArea.appendChild(createSceneBadge(q.scene));

  if (q.kind === 'symbol-see' || q.kind === 'symbol-shadow') {
    const pill = document.createElement('div');
    pill.className = `visual-pill${q.kind === 'symbol-shadow' ? ' shadow-pill' : ''}`;
    pill.textContent = q.symbol;
    visualArea.appendChild(pill);
  }
  if (q.kind === 'combo-build' || q.kind === 'combo-bridge' || q.kind === 'combo-path') {
    [q.left, q.right].forEach(text => {
      const pill = document.createElement('div');
      pill.className = 'visual-pill';
      pill.textContent = text;
      visualArea.appendChild(pill);
    });
  }
  if (q.kind.startsWith('math') && q.uiType === 'table-strip') {
    renderMathStrip(q);
    visualArea.classList.add('collapsed');
    toggleVisualBtn.classList.remove('hidden-btn');
  } else if (q.kind.startsWith('math')) {
    const strip = document.createElement('div');
    strip.className = 'visual-mini-equation';
    strip.textContent = `${q.tableBase} × ${q.tableTarget}`;
    visualArea.appendChild(strip);
  }
  if (q.kind === 'symbol-diff') {
    q.options.forEach(item => {
      const pill = document.createElement('div');
      pill.className = 'visual-pill diff-pill';
      pill.textContent = item.text;
      visualArea.appendChild(pill);
    });
  }

  if (q.uiType === 'drag-fruit') {
    renderFruitDragQuestion(q);
    state.currentSpeechText = q.speakText;
    return;
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

function getKnowledgeLine(q, optionObj) {
  if (q.kind.startsWith('math')) {
    return `${numberToZh(q.tableBase)}${numberToZh(q.tableTarget)}${optionObj.speak}`;
  }
  if (q.kind === 'symbol-hear' || q.kind === 'symbol-see' || q.kind.startsWith('symbol-')) {
    return `就是 ${optionObj.speak}`;
  }
  if (q.kind.startsWith('combo')) {
    return `${q.answer} ${optionObj.speak || optionObj.text}`;
  }
  return optionObj.speak || optionObj.text || q.answer;
}

function buildAnswerReply(isCorrect, q, optionObj) {
  const pools = getSpiritReplyPools();
  if (isCorrect) {
    const knowledge = `${getKnowledgeLine(q, optionObj)}。`;
    const spirit = pickNonRepeat(pools.correct, state.lastCorrectLine);
    state.lastCorrectLine = spirit;
    return `${knowledge}${spirit}`;
  }
  const spirit = pickNonRepeat([
    '再想想看。',
    '快接近了。',
    '換個想法試試。',
    '我們再看看。'
  ], state.lastWrongLine);
  state.lastWrongLine = spirit;
  return spirit;
}

function startMode(mode) {
  if (roomUsesSelection(mode)) {
    buildRoomSelect(mode);
    return;
  }

  state.mode = mode;
  state.subMode = '';
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
  } else {
    state.questionList = Array.from({ length: 5 }, () => generateForestQuestion());
    modeChip.textContent = '森林冒險';
  }
  showScreen('quiz');
  refreshBackButtons();
  renderQuestion();
  scrollToQuestionTop();
}

function createMathQuestion(kind) {
  const a = randomInt(2, 9);
  const b = randomInt(1, 9);
  return createTableMathQuestion(a, b, { kind, uiType: 'tiles' });
}
function generateMathChant() { return createMathQuestion('math-chant'); }
function generateMathFill() { return createMathQuestion('math-fill'); }
function generateForestQuestion() {
  return randomItem([
    generateSymbolHear,
    generateSymbolButterfly,
    generateComboBuild,
    generateComboGarden,
    generateMathChant,
    generateMathFill
  ])();
}
function buildTodayMission() {
  return shuffle([
    generateSymbolHear(),
    generateSymbolButterfly(),
    generateComboBuild(),
    generateMathChant(),
    generateMathFill()
  ]);
}

function goBackToPreviousLayer() {
  stopSpeech();
  if (roomUsesSelection(state.mode)) {
    buildRoomSelect(state.mode);
    return;
  }
  showScreen('home');
  updateHome();
}

function refreshBackButtons() {
  const isRoomMode = roomUsesSelection(state.mode);
  if (backHomeBtn) backHomeBtn.textContent = isRoomMode ? '← 回上一層' : '← 回森林';
  if (resultHomeBtn) resultHomeBtn.textContent = isRoomMode ? '回到上一層' : '回到森林地圖';
}
