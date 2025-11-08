import pino, { Logger as PinoLogger } from "pino";

export const Logger = pino();

export function initializeLogger(level: 'info' | 'debug') {
  Logger.level = level;
  Logger.info('******************* LOGGER INITIALIZED TO DEBUG LEVEL *******************')
}

