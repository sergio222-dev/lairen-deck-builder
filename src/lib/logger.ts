import pino from "pino";

export const Logger = pino();

export function initializeLogger(level: 'info' | 'debug') {
  Logger.level = level;
  Logger.debug('******************* LOGGER INITIALIZED TO DEBUG LEVEL *******************')
}

