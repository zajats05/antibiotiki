'use strict';

/* ================= Настройки преподавателя ================= */

const CONFIG = {
  // URL веб-приложения Apps Script для записи результатов в Google-таблицу
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbywFSOszW47AHgZ6ZLDBLh_iy7FMAHfGIYcmbHaP2SIUMfNeIyJVz6PJbrEDlfrJBJrgg/exec',
  // Ключ-пароль, должен совпадать со значением TOKEN в Code.gs
  TOKEN: 'verdania-2026'
};

/* ================= Данные квеста ================= */

const LETTERS = ['А', 'Б', 'В', 'Г'];

const ICONS = {
  leaf: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#4a6b2a" d="M24 6C14 12 10 20 10 28c0 8 6 14 14 14s14-6 14-14c0-8-4-16-14-22z"/><path fill="#33501b" d="M24 10v30M24 20l-6-4M24 20l6-4M24 28l-8-5M24 28l8-5" stroke="#33501b" stroke-width="2"/></svg>',
  scroll: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#e9c977" d="M10 8h24a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H10z"/><path fill="#c9941e" d="M10 8a4 4 0 0 0-4 4v2h8v-2a4 4 0 0 0-4-4zm28 28a4 4 0 0 1-4 4H14v2h20a4 4 0 0 0 4-4z"/><path stroke="#7a5a10" stroke-width="2" d="M16 16h16M16 22h16M16 28h12" fill="none"/></svg>',
  flask: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#4a6b2a" d="M19 6h10v4H19zM20 10h8l6 24a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z"/><ellipse fill="#7a1f1f" cx="24" cy="30" rx="8" ry="5"/></svg>',
  shield: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#c9941e" d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z"/><path fill="#7a1f1f" d="M24 4l16 6v12c0 10-7 18-16 22V4z"/><path fill="#e9c977" d="M24 10l10 4v8c0 7-4.5 12.5-10 15-5.5-2.5-10-8-10-15v-8z"/></svg>',
  crown: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#c9941e" d="M8 34h32v6H8zM8 14l8 10 8-14 8 14 8-10v16H8z"/><circle fill="#7a1f1f" cx="24" cy="10" r="3"/><circle fill="#7a1f1f" cx="8" cy="14" r="3"/><circle fill="#7a1f1f" cx="40" cy="14" r="3"/></svg>'
};

/* ================= Разминка (10 вопросов, 1 балл) ================= */

const WARMUP = [
  {
    text: 'Против каких возбудителей эффективны антибиотики?',
    options: ['Вирусы', 'Бактерии', 'Грибы рода Кандида', 'Прионовые инфекции'],
    correct: 1,
    explain: 'Антибиотики действуют на <strong>бактерии</strong>. Против вирусов (ОРВИ, грипп) и грибков они бессильны — для них существуют противовирусные и противогрибковые средства.'
  },
  {
    text: 'Кто открыл первый антибиотик — пенициллин?',
    options: ['Луи Пастер', 'Роберт Кох', 'Александр Флеминг', 'Илья Мечников'],
    correct: 2,
    explain: '<strong>Александр Флеминг</strong> в 1928 году заметил, что плесень Penicillium подавляет рост стафилококков.'
  },
  {
    text: 'Больному стало легче на второй день приёма антибиотика. Что делать с курсом?',
    options: ['Прекратить приём — здоровье уже вернулось', 'Продолжать в назначенной дозе до конца курса', 'Уменьшить дозу вдвое', 'Сразу перейти на другой препарат'],
    correct: 1,
    explain: 'Раннее прекращение курса — прямой путь к <strong>резистентности</strong> и возврату болезни: препарат нужно принимать столько, сколько назначил врач.'
  },
  {
    text: 'Помогают ли антибиотики вылечить грипп?',
    options: ['Да, особенно в первые сутки', 'Нет: грипп вызывает вирус, на который антибиотик не действует', 'Да, если принять двойную дозу', 'Только у детей'],
    correct: 1,
    explain: 'Грипп — <strong>вирусная</strong> инфекция. Антибиотик не влияет на вирусы; при гриппе нужны противовирусные препараты и симптоматическое лечение.'
  },
  {
    text: 'Что такое антибиотикорезистентность?',
    options: ['Аллергия на антибиотик', 'Отравление препаратом', 'Устойчивость бактерий к действию препарата', 'Привыкание человека к лекарству'],
    correct: 2,
    explain: 'Резистентность — это <strong>устойчивость бактерий</strong>: препарат перестаёт на них действовать. Её взращивают самовольный приём, прерванные курсы и остатки таблеток «с прошлого раза».'
  },
  {
    text: 'Можно ли отдать оставшиеся антибиотики заболевшему другу?',
    options: ['Да, если симптомы похожи', 'Да, если таблетки из той же пачки', 'Только родственникам', 'Нельзя: препарат и дозу подбирает врач индивидуально'],
    correct: 3,
    explain: 'Антибиотик, доза и длительность — <strong>индивидуальное назначение врача</strong>. «Чужие» таблетки опасны: не та инфекция, неверная доза, пропущенная аллергия.'
  },
  {
    text: 'Можно ли сочетать антибиотики с алкоголем?',
    options: ['Да, в небольших количествах', 'Нельзя: усиливаются побочные эффекты и снижается эффективность лечения', 'Можно, только не крепкие напитки', 'Зависит от цвета таблетки'],
    correct: 1,
    explain: 'Алкоголь усиливает <strong>побочные эффекты</strong> (тошнота, поражение печени) и снижает эффективность лечения. На время курса — никакого алкоголя.'
  },
  {
    text: 'Больной забыл принять очередную дозу антибиотика. Как поступить?',
    options: ['Пропустить и принять следующую в двойном размере', 'Принять пропущенную дозу как можно скорее и продолжить по графику, не удваивая', 'Прекратить курс', 'Принять сразу три дозы'],
    correct: 1,
    explain: 'Пропущенную дозу принимают <strong>как можно скорее</strong>, не удваивая следующую — иначе концентрация препарата станет опасно высокой.'
  },
  {
    text: 'Действуют ли антибиотики только на «вредные» бактерии?',
    options: ['Да, они различают «своих» и «чужих»', 'Да, если препарат дорогой', 'Нет: страдает и нормальная микрофлора кишечника — возможен дисбиоз', 'Нет, они действуют только на вирусы'],
    correct: 2,
    explain: 'Антибиотик не выбирает: вместе с возбудителями страдает <strong>нормальная микрофлора</strong> — отсюда дисбиоз и молочница после курсов.'
  },
  {
    text: 'Кто определяет выбор антибиотика и длительность курса?',
    options: ['Сам больной по совету аптекаря', 'Провизор в аптеке', 'Сосед, который «уже так лечился»', 'Врач — по осмотру и результатам анализов'],
    correct: 3,
    explain: 'Выбор препарата, дозы и длительности — <strong>компетенция врача</strong> по результатам осмотра и анализов, включая чувствительность возбудителя.'
  }
];

/* ================= Локации квеста (2 балла / 1 балл) ================= */

const LOCATIONS = [
  {
    id: 'forest',
    name: 'Лес',
    hint: 'Больной крестьянин',
    x: 14, y: 78,
    portrait: 'images/peasant.png',
    portraitAlt: 'Больной крестьянин сидит у дерева в лесу',
    story: 'У лесной тропы вы находите крестьянина: третий день лихорадка до 38,6 °C, кашель с зеленоватой мокротой, боль в груди при дыхании. А в соседней деревне, как вы уже слышали, кто-то «на всякий случай» пьёт антибиотики от насморка.',
    questions: [
      {
        text: 'Кому из двух больных антибиотик действительно показан?',
        options: [
          'Обоим: лихорадка — всегда повод для антибиотика',
          'Крестьянину: есть признаки бактериальной инфекции дыхательных путей',
          'Второму: пусть не заболеет бронхитом',
          'Никому: антибиотики не работают, а болезнь «сама пройдёт»'
        ],
        correct: 1,
        explain: 'Гнойная мокрота, лихорадка дольше трёх дней и боль в груди — типичные признаки <strong>бактериальной</strong> инфекции, при которой врач назначает антибиотик. При вирусном насморке антибиотик бесполезен: он не действует на вирусы и лишь повышает риск побочных эффектов и резистентности.'
      },
      {
        text: 'Какой признак заставляет заподозрить присоединение бактериальной, а не вирусной инфекции?',
        options: [
          'Обильный прозрачный насморк',
          'Слезотечение и чихание',
          'Стало легче на третий день, а затем снова хуже — с гнойным отделяемым',
          'Осиплость голоса к вечеру'
        ],
        correct: 2,
        explain: '«Двухфазное» течение — сначала улучшение, затем новое ухудшение с гнойным отделяемым — классический маркер того, что к вирусной инфекции <strong>присоединилась бактериальная</strong>. Именно в этот момент нужно повторно обратиться к врачу, а не менять препараты наугад.'
      }
    ],
    relic: { name: 'Лист мандрагоры', icon: 'leaf', desc: 'Крестьянин поправляется: вы верно отличили бактериальную инфекцию от вирусной.' }
  },
  {
    id: 'castle-ruins',
    name: 'Заброшенный замок',
    hint: 'Библиотека древних манускриптов',
    x: 20, y: 22,
    portrait: 'images/librarian.png',
    portraitAlt: 'Монах-библиотекарь в заброшенном замке держит старинный манускрипт',
    story: 'Среди пыльных стеллажей заброшенного замка хранятся летописи первых побед над заразой. Монах-хранитель открывает перед вами древние свитки — и требует доказать, что вы читали историю медицины.',
    questions: [
      {
        text: 'В каком году Александр Флеминг открыл пенициллин?',
        options: [
          'В 1885 году, во время опытов с бешенством',
          'В 1905 году, при изучении туберкулёза',
          'В 1928 году, заметив гибель стафилококков вокруг плесени',
          'В 1943 году, в полевом госпитале'
        ],
        correct: 2,
        explain: 'В <strong>1928 году</strong> Флеминг заметил, что колонии стафилококков гибнут вокруг плесени Penicillium notatum. В клиническую практику пенициллин внедрили позже — Флори и Чейн, в 1940-х годах, за что все трое получили Нобелевскую премию 1945 года.'
      },
      {
        text: 'Какой класс антибиотиков разрушает клеточную стенку бактерии?',
        options: [
          'Тетрациклины',
          'Бета-лактамы (пенициллины, цефалоспорины)',
          'Макролиды',
          'Аминогликозиды'
        ],
        correct: 1,
        explain: '<strong>Бета-лактамы</strong> блокируют синтез пептидогликана — каркаса клеточной стенки, и бактерия разрушается. Тетрациклины и макролиды подавляют синтез белка на рибосомах, аминогликозиды действуют на белок и мембрану, фторхинолоны — на бактериальную ДНК.'
      }
    ],
    relic: { name: 'Манускрипт Флеминга', icon: 'scroll', desc: 'Хранитель библиотеки признал вас знатоком истории антибиотиков.' }
  },
  {
    id: 'village',
    name: 'Деревня',
    hint: 'Слухи и зелья',
    x: 48, y: 50,
    portrait: 'images/healer-woman.png',
    portraitAlt: 'Деревенская знахарка с корзиной целебных трав у дома',
    story: 'В деревне шумно: половина жителей делится друг с другом таблетками «от прошлогодней простуды», а бабушка Марты учит всех бросать лечение, «как только полегчало». Знахарка смотрит на вас с надеждой: образумьте деревню!',
    questions: [
      {
        text: 'В чём главная ошибка совета «как полегчало — таблетки бросай»?',
        options: [
          'Ни в чём: короткий курс экономит деньги и силы',
          'Курс нужно прекращать только в полнолуние',
          'Прерванный курс убивает слабые бактерии, а устойчивые выживают — и болезнь возвращается',
          'Ошибки нет, если запивать таблетки молоком'
        ],
        correct: 2,
        explain: 'Неполный курс и остаточные низкие концентрации препарата — идеальные условия <strong>отбора устойчивых бактерий</strong>. Это и есть путь к антибиотикорезистентности: в следующий раз препарат может не помочь. Курс и дозу определяет врач.'
      },
      {
        text: 'Житель просит у вас «антибиотик покрепче от простуды». У него ОРВИ. Что ответит грамотный медик?',
        options: [
          'Дать антибиотик — на всякий случай не помешает',
          'Объяснить: при вирусной инфекции антибиотик неэффективен, нужно симптоматическое лечение и наблюдение',
          'Предложить двойную дозу для надёжности',
          'Посоветовать пропить антибиотик всей семьёй для профилактики'
        ],
        correct: 1,
        explain: 'При ОРВИ антибиотик <strong>не работает</strong>: он не действует на вирусы. Правильно — симптоматическое лечение, обильное питьё и наблюдение за признаками ухудшения (новая волна лихорадки, гнойное отделяемое), о которых врач узнает при повторном обращении.'
      }
    ],
    relic: { name: 'Зелёное знамя рациональности', icon: 'flask', desc: 'Деревня отказалась от самовольных антибиотиков и «курсов на полдороге».' }
  },
  {
    id: 'temple',
    name: 'Храм',
    hint: 'Хранилище древних рецептов',
    x: 80, y: 72,
    portrait: 'images/priest.png',
    portraitAlt: 'Жрица храма со свечой у полок с древними рецептами',
    story: 'В белокаменном храме хранятся рецепты безопасности: как помогать, не причиняя вреда. Жрица открывает древнюю книгу происшествий и указывает на одну из записей.',
    questions: [
      {
        text: 'В хронике: после приёма пенициллина у больного появились крапивница, отёк лица и свистящее дыхание. Что делать при следующей инфекции?',
        options: [
          'Назначить тот же пенициллин, но в меньшей дозе',
          'Считать аллергию малозначимой — «само пройдёт»',
          'Добавить антигистаминное и продолжить пенициллин',
          'Сообщить врачу о вероятной аллергии — нужен антибиотик другого класса'
        ],
        correct: 3,
        explain: 'Крапивница, отёк лица, свистящее дыхание — признаки <strong>аллергии на пенициллин</strong> с риском анафилаксии. Такой препарат повторно не назначают; врач подберёт антибиотик другого класса. Информация об аллергии должна быть в медицинской документации.'
      },
      {
        text: 'Какая пара «антибиотик — правило приёма» верна?',
        options: [
          'Тетрациклины — не сочетать с молоком и молочными продуктами',
          'Все антибиотики — принимать только натощак',
          'Макролиды — нельзя запивать водой',
          'Амоксициллин — таблетки обязательно разжёвывать'
        ],
        correct: 0,
        explain: '<strong>Тетрациклины</strong> связываются кальцием из молочных продуктов и хуже всасываются. Правила приёма у всех препаратов разные — их определяет инструкция и врач. Универсально одно: выдерживать <strong>равные интервалы</strong> между приёмами (например, каждые 8 часов), чтобы концентрация препарата не падала ниже нужной.'
      }
    ],
    relic: { name: 'Амулет безопасности', icon: 'shield', desc: 'Вы усвоили главные правила безопасного применения антибиотиков.' }
  },
  {
    id: 'royal-castle',
    name: 'Королевский замок',
    hint: 'Раненый рыцарь',
    x: 74, y: 29,
    portrait: 'images/knight.png',
    portraitAlt: 'Раненый рыцарь у ворот замка, лекарь перевязывает его руку',
    story: 'У ворот королевского замка вас встречает последний герой: рыцарь наступил на ржавый гвоздь в конюшне — глубокая колотая рана, загрязнённая землёй. Последняя прививка от столбняка была пятнадцать лет назад. Сумеете спасти его?',
    questions: [
      {
        text: 'Что обязательно входит в помощь раненому рыцарю?',
        options: [
          'Промыть, забинтовать — и ждать, что заживёт само',
          'Хирургическая обработка раны и экстренная профилактика столбняка (анатоксин, по показаниям — иммуноглобулин)',
          'Только антибиотик внутрь, без обработки раны',
          'Ничего: колотые раны самые безобидные'
        ],
        correct: 1,
        explain: 'Глубокая загрязнённая колотая рана + давняя прививка — показание к <strong>экстренной профилактике столбняка</strong> (анатоксин, а при необходимости — иммуноглобулин) и хирургической обработке. Антибиотик не заменяет обработку раны и вакцинопрофилактику.'
      },
      {
        text: 'Что верно в отношении профилактического назначения антибиотика при ранах?',
        options: [
          '«На всякий случай» антибиотик можно пить неделями',
          'Профилактика нужна при любой царапине',
          'Короткий курс по строгим показаниям (глубокая загрязнённая рана, укус) — и он не заменяет обработку раны',
          'Если рана уже загноилась, достаточно половинной профилактической дозы'
        ],
        correct: 2,
        explain: 'Рациональная профилактика — <strong>короткий курс по конкретным показаниям</strong>: глубокая загрязнённая рана, укус животного, операция. При уже развившейся инфекции нужен полноценный <strong>лечебный</strong> курс, а не профилактическая доза.'
      }
    ],
    relic: { name: 'Королевский указ', icon: 'crown', desc: 'Король вручает вам указ о назначении — вы спасли его лучшего рыцаря.' }
  }
];

const MAX_SCORE = WARMUP.length + LOCATIONS.reduce((sum, loc) => sum + loc.questions.length * 2, 0); // 30

const RANKS = [
  { min: 29, title: 'Верховный магистр лекарских наук' },
  { min: 25, title: 'Придворный аптекарь короны' },
  { min: 19, title: 'Ученик целителя' },
  { min: 0, title: 'Странник-подмастерье' }
];

/* ================= Состояние ================= */

const state = {
  stage: 'intro',        // intro | reg | warmup | map | finished
  player: { name: '', group: '' },
  current: 0,            // индекс следующей открытой локации
  completedCount: 0,
  warmupIndex: 0,
  warmupPoints: 0,
  warmupAnswered: false,
  questPoints: 0,
  firstTry: 0,
  sceneQ: 0,
  wrongAttempts: 0,
  answered: false,
  submitted: false,
  timerStart: null,
  timerInterval: null,
  elapsedSeconds: 0
};

/* ================= Элементы ================= */

const el = {
  map: document.getElementById('map'),
  hint: document.getElementById('mapHint'),
  hudCount: document.getElementById('hudCount'),
  hudBar: document.getElementById('hudBar'),
  hudBarFill: document.getElementById('hudBarFill'),
  hudScore: document.getElementById('hudScore'),
  hudTimer: document.getElementById('hudTimer'),
  intro: document.getElementById('introOverlay'),
  reg: document.getElementById('regOverlay'),
  regName: document.getElementById('regName'),
  regGroup: document.getElementById('regGroup'),
  regError: document.getElementById('regError'),
  warmup: document.getElementById('warmupOverlay'),
  warmupCounter: document.getElementById('warmupCounter'),
  warmupQuestionText: document.getElementById('warmupQuestionText'),
  warmupQuestionOptions: document.getElementById('warmupQuestionOptions'),
  warmupQuestionFeedback: document.getElementById('warmupQuestionFeedback'),
  scene: document.getElementById('sceneOverlay'),
  final: document.getElementById('finalOverlay'),
  guide: document.getElementById('guideOverlay'),
  scenePortrait: document.getElementById('scenePortrait'),
  sceneEyebrow: document.getElementById('sceneEyebrow'),
  sceneTitle: document.getElementById('sceneTitle'),
  sceneStory: document.getElementById('sceneStory'),
  questionBlock: document.getElementById('questionBlock'),
  questionText: document.getElementById('questionText'),
  questionOptions: document.getElementById('questionOptions'),
  questionFeedback: document.getElementById('questionFeedback'),
  rewardBlock: document.getElementById('rewardBlock'),
  rewardIcon: document.getElementById('rewardIcon'),
  rewardName: document.getElementById('rewardName'),
  rewardDesc: document.getElementById('rewardDesc'),
  finalRank: document.getElementById('finalRank'),
  finalStats: document.getElementById('finalStats'),
  finalDecree: document.getElementById('finalDecree'),
  submitStatus: document.getElementById('submitStatus'),
  btnSubmit: document.getElementById('btnSubmit')
};

const markers = [];

/* ================= Секундомер ================= */

function totalScore() {
  return state.warmupPoints + state.questPoints;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function startTimer() {
  state.timerStart = Date.now();
  state.timerInterval = setInterval(() => {
    state.elapsedSeconds = Math.floor((Date.now() - state.timerStart) / 1000);
    el.hudTimer.textContent = formatTime(state.elapsedSeconds);
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = null;
}

/* ================= Карта и маркеры ================= */

function buildMarkers() {
  LOCATIONS.forEach((loc, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'marker marker--locked';
    btn.style.left = loc.x + '%';
    btn.style.top = loc.y + '%';
    btn.setAttribute('aria-label', `Локация «${loc.name}»: ${loc.hint}`);
    btn.innerHTML = `<span class="marker__num">${i + 1}</span><span class="marker__tooltip">${loc.name}</span>`;
    btn.addEventListener('click', () => openScene(i));
    el.map.appendChild(btn);
    markers.push(btn);
  });
}

function refreshMarkers() {
  markers.forEach((btn, i) => {
    btn.classList.remove('marker--locked', 'marker--current', 'marker--done');
    btn.disabled = false;
    if (i < state.completedCount) {
      btn.classList.add('marker--done');
      btn.innerHTML = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5.2 5.2L20 7"/></svg><span class="marker__tooltip">${LOCATIONS[i].name}</span>`;
      btn.setAttribute('aria-label', `Локация «${LOCATIONS[i].name}» пройдена`);
    } else if (i === state.current && state.stage === 'map') {
      btn.classList.add('marker--current');
    } else {
      btn.classList.add('marker--locked');
      btn.disabled = true;
      btn.innerHTML = `<span class="marker__num">${i + 1}</span><span class="marker__tooltip">${LOCATIONS[i].name}</span>`;
    }
  });
}

function refreshHud() {
  el.hudCount.textContent = `${state.completedCount} / 5`;
  el.hudBar.setAttribute('aria-valuenow', String(state.completedCount));
  el.hudBarFill.style.width = (state.completedCount / LOCATIONS.length) * 100 + '%';
  el.hudScore.textContent = String(totalScore());
  renderRelics();
}

function renderRelics() {
  let bar = document.querySelector('.relics');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'relics';
    bar.setAttribute('aria-label', 'Собранные реликвии');
    document.querySelector('.page').after(bar);
  }
  bar.innerHTML = LOCATIONS.map((loc, i) => {
    const earned = i < state.completedCount;
    return `<span class="relics__item${earned ? ' relics__item--earned' : ''}">${ICONS[loc.relic.icon]} ${loc.relic.name}</span>`;
  }).join('');
}

/* ================= Регистрация ================= */

function openRegistration() {
  state.stage = 'reg';
  el.regName.value = '';
  el.regGroup.value = '';
  el.regError.hidden = true;
  hide(el.intro);
  show(el.reg);
  el.regName.focus();
}

function submitRegistration() {
  const name = el.regName.value.trim();
  const group = el.regGroup.value.trim();
  if (!name || !group) {
    el.regError.hidden = false;
    if (!name) el.regName.focus();
    else el.regGroup.focus();
    return;
  }
  state.player = { name, group };
  startTimer();
  state.stage = 'warmup';
  state.warmupIndex = 0;
  state.warmupPoints = 0;
  hide(el.reg);
  renderWarmup();
  show(el.warmup);
}

/* ================= Разминка ================= */

function renderWarmup() {
  const q = WARMUP[state.warmupIndex];
  state.warmupAnswered = false;
  el.warmupCounter.textContent = `Разминка · вопрос ${state.warmupIndex + 1} из ${WARMUP.length}`;
  el.warmupQuestionFeedback.hidden = true;
  el.warmupQuestionFeedback.innerHTML = '';
  el.warmupQuestionText.textContent = q.text;
  el.warmupQuestionOptions.innerHTML = '';

  q.options.forEach((opt, oi) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option';
    btn.innerHTML = `<span class="option__letter">${LETTERS[oi]}</span><span>${opt}</span>`;
    btn.addEventListener('click', () => answerWarmup(oi, btn));
    el.warmupQuestionOptions.appendChild(btn);
  });
}

function answerWarmup(optIndex, btn) {
  if (state.warmupAnswered) return;
  const q = WARMUP[state.warmupIndex];
  state.warmupAnswered = true;
  const buttons = Array.from(el.warmupQuestionOptions.children);
  buttons.forEach(b => { b.disabled = true; });

  const isCorrect = optIndex === q.correct;
  buttons[q.correct].classList.add('option--correct');
  if (!isCorrect) btn.classList.add('option--wrong');
  else state.warmupPoints++;

  const verdict = isCorrect
    ? '<p class="feedback__title feedback__title--ok">Верно! +1 балл</p>'
    : `<p class="feedback__title feedback__title--retry">Неверно. Правильный ответ — ${LETTERS[q.correct]}</p>`;
  const last = state.warmupIndex === WARMUP.length - 1;
  el.warmupQuestionFeedback.innerHTML = `
    ${verdict}
    <p class="feedback__explain">${q.explain}</p>
    <button class="btn btn--primary" id="btnWarmupNext" type="button">${last ? 'Начать путь по королевству' : 'Следующий вопрос'}</button>`;
  el.warmupQuestionFeedback.hidden = false;
  document.getElementById('btnWarmupNext').focus();
  document.getElementById('btnWarmupNext').addEventListener('click', nextWarmup);
}

function nextWarmup() {
  if (state.warmupIndex < WARMUP.length - 1) {
    state.warmupIndex++;
    renderWarmup();
  } else {
    hide(el.warmup);
    state.stage = 'map';
    refreshHud();
    refreshMarkers();
    el.hint.textContent = 'Начните с локации, отмеченной золотым маркером';
  }
}

/* ================= Сцена ================= */

function openScene(i) {
  if (i !== state.current || state.stage !== 'map') return;
  state.sceneQ = 0;
  state.wrongAttempts = 0;
  state.answered = false;
  renderScene(i);
  show(el.scene);
}

function renderScene(i) {
  const loc = LOCATIONS[i];
  el.scenePortrait.src = loc.portrait;
  el.scenePortrait.alt = loc.portraitAlt;
  el.sceneEyebrow.textContent = `Локация ${i + 1} из 5 — ${loc.hint}`;
  el.sceneTitle.textContent = loc.name;
  el.sceneStory.textContent = loc.story;

  el.rewardBlock.classList.add('reward--hidden');
  el.questionBlock.hidden = false;
  renderQuestion(i);
}

function renderQuestion(i) {
  const q = LOCATIONS[i].questions[state.sceneQ];
  state.answered = false;
  state.wrongAttempts = 0;
  el.questionFeedback.hidden = true;
  el.questionFeedback.innerHTML = '';
  el.questionText.textContent = `Испытание ${state.sceneQ + 1} из ${LOCATIONS[i].questions.length}. ${q.text}`;
  el.questionOptions.innerHTML = '';

  q.options.forEach((opt, oi) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option';
    btn.innerHTML = `<span class="option__letter">${LETTERS[oi]}</span><span>${opt}</span>`;
    btn.addEventListener('click', () => answer(i, oi, btn));
    el.questionOptions.appendChild(btn);
  });
}

function answer(locIndex, optIndex, btn) {
  if (state.answered) return;
  const q = LOCATIONS[locIndex].questions[state.sceneQ];

  if (optIndex === q.correct) {
    state.answered = true;
    btn.classList.add('option--correct');
    btn.setAttribute('aria-pressed', 'true');
    const points = state.wrongAttempts === 0 ? 2 : 1;
    if (state.wrongAttempts === 0) state.firstTry++;
    state.questPoints += points;
    refreshHud();
    el.questionFeedback.innerHTML = `
      <p class="feedback__title feedback__title--ok">Верно! +${points} ${points === 2 ? 'балла' : 'балл'}</p>
      <p class="feedback__explain">${q.explain}</p>
      <button class="btn btn--primary" id="btnNext" type="button">${nextLabel(locIndex)}</button>`;
    el.questionFeedback.hidden = false;
    document.getElementById('btnNext').focus();
    document.getElementById('btnNext').addEventListener('click', () => nextQuestion(locIndex));
  } else {
    state.wrongAttempts++;
    btn.classList.add('option--wrong');
    btn.disabled = true;
    el.questionFeedback.innerHTML = `<p class="feedback__title feedback__title--retry">Мимо! Задумайтесь ещё раз, отроки…</p>`;
    el.questionFeedback.hidden = false;
  }
}

function nextLabel(locIndex) {
  const total = LOCATIONS[locIndex].questions.length;
  return state.sceneQ + 1 < total ? 'К следующему испытанию' : 'Забрать реликвию';
}

function nextQuestion(locIndex) {
  const total = LOCATIONS[locIndex].questions.length;
  if (state.sceneQ + 1 < total) {
    state.sceneQ++;
    renderQuestion(locIndex);
  } else {
    completeLocation(locIndex);
  }
}

function completeLocation(locIndex) {
  const loc = LOCATIONS[locIndex];
  state.completedCount = locIndex + 1;
  state.current = locIndex + 1;
  refreshHud();
  refreshMarkers();

  el.questionBlock.hidden = true;
  el.rewardBlock.classList.remove('reward--hidden');
  el.rewardIcon.innerHTML = ICONS[loc.relic.icon];
  el.rewardName.textContent = loc.relic.name;
  el.rewardDesc.textContent = loc.relic.desc;
  el.rewardBlock.querySelector('#btnBackToMap').focus();
}

/* ================= Финал ================= */

function showFinal() {
  state.stage = 'finished';
  stopTimer();
  refreshMarkers();
  const rank = RANKS.find(r => totalScore() >= r.min).title;
  el.finalRank.textContent = rank;
  el.finalStats.textContent = `Баллы: ${totalScore()} из ${MAX_SCORE} · Время: ${formatTime(state.elapsedSeconds)}`;
  el.finalDecree.textContent = `«Сим указом повелеваем: занести в летопись королевства имя — ${state.player.name}, группа ${state.player.group}, — со званием «${rank}», результатом ${totalScore()} из ${MAX_SCORE} баллов и временем пути ${formatTime(state.elapsedSeconds)}».`;
  state.submitted = false;
  setSubmitStatus('', '');
  el.btnSubmit.disabled = false;
  el.btnSubmit.textContent = 'Отправить результаты в таблицу';
  show(el.final);
}

function setSubmitStatus(text, cls) {
  el.submitStatus.textContent = text;
  el.submitStatus.className = 'final__submit-status' + (cls ? ' ' + cls : '');
}

async function submitResults() {
  if (state.submitted) return;

  if (!CONFIG.SCRIPT_URL) {
    setSubmitStatus('Таблица результатов ещё не подключена — преподаватель настроит её по инструкции к квесту.', 'final__submit-status--err');
    return;
  }

  el.btnSubmit.disabled = true;
  el.btnSubmit.textContent = 'Отправка…';
  setSubmitStatus('', '');

  const payload = {
    token: CONFIG.TOKEN,
    name: state.player.name,
    group: state.player.group,
    score: totalScore(),
    maxScore: MAX_SCORE,
    time: formatTime(state.elapsedSeconds),
    seconds: state.elapsedSeconds
  };

  console.log('[submitResults] Отправка на', CONFIG.SCRIPT_URL, payload);

  try {
    const resp = await fetch(CONFIG.SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
    }

    const text = await resp.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      // Скорее всего, пришла HTML-страница (вход в Google или ошибка).
      console.error('[submitResults] Ответ не JSON. Первые 300 символов:', text.slice(0, 300));
      throw new Error('Сервер вернул не JSON. Проверьте настройки развёртывания Apps Script: Execute as = Me, Who has access = Anyone.');
    }

    if (data && data.ok) {
      state.submitted = true;
      setSubmitStatus('Результаты записаны в королевскую книгу — таблицу преподавателя.', 'final__submit-status--ok');
      el.btnSubmit.textContent = 'Результаты отправлены';
    } else {
      throw new Error(data && data.error ? data.error : 'Сервер вернул ok:false без описания');
    }
  } catch (err) {
    console.error('[submitResults] Ошибка:', err);
    const msg = err && err.message ? err.message : String(err);
    setSubmitStatus('Ошибка отправки: ' + msg, 'final__submit-status--err');
    el.btnSubmit.disabled = false;
    el.btnSubmit.textContent = 'Отправить результаты в таблицу';
  }
}

/* ================= Вспомогательные ================= */

function show(overlay) {
  overlay.classList.remove('overlay--hidden');
}

function hide(overlay) {
  overlay.classList.add('overlay--hidden');
}

function resetQuest() {
  stopTimer();
  state.stage = 'intro';
  state.player = { name: '', group: '' };
  state.current = 0;
  state.completedCount = 0;
  state.warmupIndex = 0;
  state.warmupPoints = 0;
  state.warmupAnswered = false;
  state.questPoints = 0;
  state.firstTry = 0;
  state.sceneQ = 0;
  state.wrongAttempts = 0;
  state.answered = false;
  state.submitted = false;
  state.timerStart = null;
  state.elapsedSeconds = 0;
  el.hudTimer.textContent = '00:00';
  refreshHud();
  refreshMarkers();
  el.hint.textContent = 'Начните с локации, отмеченной золотым маркером';
}

/* ================= Привязка событий ================= */

document.getElementById('btnStart').addEventListener('click', openRegistration);
document.getElementById('btnReg').addEventListener('click', submitRegistration);
el.regName.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitRegistration(); });
el.regGroup.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitRegistration(); });

document.getElementById('btnBackToMap').addEventListener('click', () => {
  hide(el.scene);
  if (state.completedCount >= LOCATIONS.length) {
    showFinal();
  } else {
    el.hint.textContent = `Следующая остановка: ${LOCATIONS[state.current].name} — ${LOCATIONS[state.current].hint}`;
  }
});

document.getElementById('btnSubmit').addEventListener('click', submitResults);

document.getElementById('btnRestart').addEventListener('click', () => {
  hide(el.final);
  resetQuest();
  show(el.intro);
});

document.getElementById('btnGuide').addEventListener('click', () => show(el.guide));
document.getElementById('btnCloseGuide').addEventListener('click', () => hide(el.guide));
el.guide.addEventListener('click', (e) => { if (e.target === el.guide) hide(el.guide); });

/* ================= Старт ================= */

buildMarkers();
renderRelics();