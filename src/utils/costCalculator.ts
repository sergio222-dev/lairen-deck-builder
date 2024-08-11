import type { DeckCard }        from "~/models/Deck";
import type { NormalizedModel } from "~/utils/normalize";

const COST_LEVELS = {
  BASIC:        'Basico',
  AFFORDABLE:   'Accesible',
  ECONOMICAL:   'Ecnómico',
  INTERMEDIATE: 'Intermedio',
  ADVANCED:     'Avanzado',
  COMPETITIVE:  'Competitivo',
  PREMIUM:      'Premium',
  EXCLUSIVE:    'Exclusivo',
}

const COST_LEVEL_BREAKPOINTS = 158;

function getCostPoints(rarity: string): number {
  switch (rarity) {
    case 'BRONCE':
      return 1;
    case 'PLATA':
      return 4;
    case 'ORO':
      return 16;
    case 'DIAMANTE':
      return 64;
    case 'ESMERALDA':
      return 128;
    default:
      return 0;
  }
}

// pass as parameter one value from the COST_LEVELS object
export function getColorLever(level: typeof COST_LEVELS[keyof typeof COST_LEVELS]) {
  // get the index of the level
  const index = Object.values(COST_LEVELS).indexOf(level);
  // get the color from the index
  // Asegúrate de que el nivel esté dentro del rango 1-8

  // Calcula la proporción de nivel (0 para verde y 1 para rojo)
  const ratio = (index) / 7;

  // Calcula los componentes RGB
  const r = Math.round(255 * ratio);
  const g = Math.round(255 * (1 - ratio));
  const b = 0; // Mantén el azul en 0 para la transición entre verde y rojo

  // Devuelve el color en formato hexadecimal
  return `rgb(${r},${g},${b})`;
}


export function costCalculator(cards: NormalizedModel<DeckCard>): typeof COST_LEVELS[keyof typeof COST_LEVELS] {
  const costPoints = Object.values(cards).reduce((acc, c) => acc + getCostPoints(c.rarity) * c.quantity, 0);

  if (costPoints < COST_LEVEL_BREAKPOINTS) {
    return COST_LEVELS.BASIC;
  }

  if (costPoints < COST_LEVEL_BREAKPOINTS * 2) {
    return COST_LEVELS.AFFORDABLE;
  }

  if (costPoints < COST_LEVEL_BREAKPOINTS * 3) {
    return COST_LEVELS.ECONOMICAL;
  }

  if (costPoints < COST_LEVEL_BREAKPOINTS * 4) {
    return COST_LEVELS.INTERMEDIATE;
  }

  if (costPoints < COST_LEVEL_BREAKPOINTS * 5) {
    return COST_LEVELS.ADVANCED;
  }

  if (costPoints < COST_LEVEL_BREAKPOINTS * 6) {
    return COST_LEVELS.COMPETITIVE;
  }

  if (costPoints < COST_LEVEL_BREAKPOINTS * 7) {
    return COST_LEVELS.PREMIUM;
  }

  if (costPoints < COST_LEVEL_BREAKPOINTS * 8) {
    return COST_LEVELS.EXCLUSIVE;
  }

  return COST_LEVELS.PREMIUM;
}
