export type Locale = 'es' | 'en' | 'zh';

export type TranslationKey =
  | 'app.title'
  | 'app.subtitle'
  | 'app.tagline'
  | 'nav.skip'
  | 'levels.heading'
  | 'levels.subtitle'
  | 'levels.mines'
  | 'levels.cells'
  | 'levels.and'
  | 'hud.mines'
  | 'hud.remaining'
  | 'hud.time'
  | 'result.win'
  | 'result.lose'
  | 'result.winHint'
  | 'result.loseHint'
  | 'result.time'
  | 'result.viewBoard'
  | 'action.reset'
  | 'action.changeLevel'
  | 'action.start'
  | 'loading'
  | 'timer.day'
  | 'timer.days'
  | 'box.flagged'
  | 'box.mine'
  | 'box.mineHidden'
  | 'box.wrongFlag'
  | 'box.minesNear'
  | 'box.empty'
  | 'box.hidden'
  | 'lang.label'
  | 'lang.es'
  | 'lang.en'
  | 'lang.zh';

type Dictionary = Record<TranslationKey, string>;

const es: Dictionary = {
  'app.title': 'Buscaminas',
  'app.subtitle': 'Carta de campo minado',
  'app.tagline': 'Marca, descubre, sobrevive.',
  'nav.skip': 'Saltar al contenido',
  'levels.heading': 'Elige tu mapa',
  'levels.subtitle': 'Cuadrícula y número de minas por nivel',
  'levels.mines': 'minas',
  'levels.cells': 'casillas',
  'levels.and': 'y',
  'hud.mines': 'Minas',
  'hud.remaining': 'restantes',
  'hud.time': 'Tiempo',
  'result.win': '¡Ganaste!',
  'result.lose': '¡Pierdes!',
  'result.winHint': 'Todas las casillas seguras descubiertas',
  'result.loseHint': 'Detonaste una mina',
  'result.time': 'Tu tiempo',
  'result.viewBoard': 'Ver tablero',
  'action.reset': 'Reiniciar',
  'action.changeLevel': 'Cambiar nivel',
  'action.start': 'Empezar',
  'loading': 'Cargando',
  'timer.day': 'día',
  'timer.days': 'días',
  'box.flagged': 'bandera',
  'box.mine': 'mina',
  'box.mineHidden': 'mina sin detonar',
  'box.wrongFlag': 'bandera incorrecta',
  'box.minesNear': '{n} minas cerca',
  'box.empty': 'vacía',
  'box.hidden': 'sin descubrir',
  'lang.label': 'Idioma',
  'lang.es': 'Español',
  'lang.en': 'English',
  'lang.zh': '简体中文',
};

const en: Dictionary = {
  'app.title': 'Minesweeper',
  'app.subtitle': 'Minefield survey chart',
  'app.tagline': 'Flag, reveal, survive.',
  'nav.skip': 'Skip to content',
  'levels.heading': 'Choose your map',
  'levels.subtitle': 'Grid size and mine count per level',
  'levels.mines': 'mines',
  'levels.cells': 'cells',
  'levels.and': 'and',
  'hud.mines': 'Mines',
  'hud.remaining': 'left',
  'hud.time': 'Time',
  'result.win': 'You won!',
  'result.lose': 'Game over',
  'result.winHint': 'Every safe cell uncovered',
  'result.loseHint': 'You triggered a mine',
  'result.time': 'Your time',
  'result.viewBoard': 'View board',
  'action.reset': 'Reset',
  'action.changeLevel': 'Change level',
  'action.start': 'Start',
  'loading': 'Loading',
  'timer.day': 'day',
  'timer.days': 'days',
  'box.flagged': 'flag',
  'box.mine': 'mine',
  'box.mineHidden': 'undetonated mine',
  'box.wrongFlag': 'wrong flag',
  'box.minesNear': '{n} mines near',
  'box.empty': 'empty',
  'box.hidden': 'hidden',
  'lang.label': 'Language',
  'lang.es': 'Español',
  'lang.en': 'English',
  'lang.zh': '简体中文',
};

const zh: Dictionary = {
  'app.title': '扫雷',
  'app.subtitle': '雷区勘测图',
  'app.tagline': '标记，翻开，求生。',
  'nav.skip': '跳至内容',
  'levels.heading': '选择关卡',
  'levels.subtitle': '各关卡的网格大小与地雷数量',
  'levels.mines': '颗雷',
  'levels.cells': '格',
  'levels.and': '与',
  'hud.mines': '地雷',
  'hud.remaining': '剩余雷数',
  'hud.time': '用时',
  'result.win': '胜利！',
  'result.lose': '失败！',
  'result.winHint': '所有安全格已翻开',
  'result.loseHint': '你踩中了一颗地雷',
  'result.time': '用时',
  'result.viewBoard': '查看棋盘',
  'action.reset': '重新开始',
  'action.changeLevel': '更换关卡',
  'action.start': '开始',
  'loading': '加载中…',
  'timer.day': '天',
  'timer.days': '天',
  'box.flagged': '已标记',
  'box.mine': '地雷',
  'box.mineHidden': '未引爆的地雷',
  'box.wrongFlag': '错误标记',
  'box.minesNear': '附近有 {n} 颗雷',
  'box.empty': '空格',
  'box.hidden': '未翻开',
  'lang.label': '语言',
  'lang.es': 'Español',
  'lang.en': 'English',
  'lang.zh': '简体中文',
};

export const translations: Record<Locale, Dictionary> = { es, en, zh };
