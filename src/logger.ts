import Winston from 'winston';
import { LoggerOptions } from './types';
import { getTransports } from './transports';
import { getDefaultFormats } from './formats';
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
            format: getDefaultFormats(),
            transports: getTransports(options),
        });
    }
};

const getWinstonInstance = (): Winston.Logger => {
    return logger;
};

if (dynamicOptions) {
    init(dynamicOptions);
}

export const Logger = { init, getWinstonInstance };
