import Winston from 'winston';
import { LoggerOptions } from './types';
import { defaultTransports } from './transports';
import { defaultFormats } from './formats';
import { loadDynamicOptionsModule } from './initializer';

let logger: Winston.Logger;
let isInitialized = false;

const dynamicOptions = loadDynamicOptionsModule();

const init = (options?: LoggerOptions): void => {
    if (!isInitialized) {
        isInitialized = true;

        const level = options?.level || 'info';
        const exitOnError = options?.exitOnError || false;
        const handleExceptions = options?.handleExceptions || false;

        logger = Winston.createLogger({
            level,
            exitOnError,
            handleExceptions,
            format: defaultFormats(options?.name || 'Application'),
            transports: defaultTransports(options),
        });
    }
};

const getWinstonInstance = (): Winston.Logger => {
    return logger;
};

if (dynamicOptions) {
    init(dynamicOptions);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const log = (level: string, message: string): void => {
    logger.log({ level, message });
};

const info = (message: string, ...meta: any[]): void => {
    logger.info(message, meta);
};

const warning = (message: string, ...meta: any[]): void => {
    logger.warning(message, meta);
};

const error = (message: string, ...meta: any[]): void => {
    logger.error(message, meta);
};

const debug = (message: string, ...meta: any[]): void => {
    logger.debug(message, meta);
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export const Logger = { init, getWinstonInstance, log, info, warning, error, debug };
