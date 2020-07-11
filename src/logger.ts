import Winston from 'winston';
import { LoggerOptions, TypeInfo, LoggerOperations } from './types';
import { defaultTransports } from './transports';
import { defaultFormats } from './formats';
import { loadDynamicOptionsModule } from './initializer';
import { LoggerInstance } from './logger-instance';

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

const log = (level: string, message: string): void => {
    logger.log({ level, message });
};

const info = (message: string, ...meta: unknown[]): void => {
    logger.info(message, meta);
};

const warning = (message: string, ...meta: unknown[]): void => {
    logger.warning(message, meta);
};

const error = (message: string, ...meta: unknown[]): void => {
    logger.error(message, meta);
};

const debug = (message: string, ...meta: unknown[]): void => {
    logger.debug(message, meta);
};

const loggerOperations: LoggerOperations = { log, info, warning, error, debug };

const createLoggerInstance = <T>(context?: string | TypeInfo<T>): LoggerInstance<T> => {
    if (typeof context === 'string') {
        return new LoggerInstance<string>(loggerOperations, context);
    }

    return new LoggerInstance(loggerOperations, context?.name);
};

export const Logger = { init, getWinstonInstance, createLoggerInstance, ...loggerOperations };
