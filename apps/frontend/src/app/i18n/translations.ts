export type Locale = 'es' | 'en';

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
  | 'action.reset'
  | 'action.changeLevel'
  | 'action.start'
  | 'loading'
  | 'timer.day'
  | 'timer.days'
  | 'box.flagged'
  | 'box.mine'
  | 'box.minesNear'
  | 'box.empty'
  | 'box.hidden'
  | 'lang.label'
  | 'lang.es'
  | 'lang.en';

type Dictionary = Record<TranslationKey, string>;

const es: Dictionary = {
  'app.title': 'Buscaminas',
  'app.subtitle': 'Carta de campo minado',
  'app.tagline': 'Marca, descubre, sobrevive.',
  'nav.skip': 'Saltar al contenido',
  'levels.heading': 'Elige tu mapa',
  'levels.subtitle': 'Cuadrícula y densidad de minas por nivel',
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
  'action.reset': 'Reiniciar',
  'action.changeLevel': 'Cambiar nivel',
  'action.start': 'Empezar',
  'loading': 'Cargando',
  'timer.day': 'día',
  'timer.days': 'días',
  'box.flagged': 'bandera',
  'box.mine': 'mina',
  'box.minesNear': 'minas cerca',
  'box.empty': 'vacía',
  'box.hidden': 'sin descubrir',
  'lang.label': 'Idioma',
  'lang.es': 'Español',
  'lang.en': 'English',
};

const en: Dictionary = {
  'app.title': 'Minesweeper',
  'app.subtitle': 'Minefield survey chart',
  'app.tagline': 'Flag, reveal, survive.',
  'nav.skip': 'Skip to content',
  'levels.heading': 'Choose your map',
  'levels.subtitle': 'Grid size and mine density per level',
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
  'action.reset': 'Reset',
  'action.changeLevel': 'Change level',
  'action.start': 'Start',
  'loading': 'Loading',
  'timer.day': 'day',
  'timer.days': 'days',
  'box.flagged': 'flag',
  'box.mine': 'mine',
  'box.minesNear': 'mines near',
  'box.empty': 'empty',
  'box.hidden': 'hidden',
  'lang.label': 'Language',
  'lang.es': 'Español',
  'lang.en': 'English',
};

export const translations: Record<Locale, Dictionary> = { es, en };
