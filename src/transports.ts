import Winston from 'winston';
import DailyRotateFileTransport, { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import { join } from 'path';

import { mkdirSync, existsSync } from 'fs';
import { LoggerOptions } from './types';
import { getConsoleFormats, getFileFormats } from './formats';

const createLoggerFolder = (): void => {
    const logsFolderPath = join(process.cwd(), 'logs');
    if (!existsSync(logsFolderPath)) mkdirSync(logsFolderPath);
};

const dailyRotateFileOptions: DailyRotateFileTransportOptions = {
    filename: '%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    dirname: join(process.cwd(), 'logs'),
    format: getFileFormats(),
};

const consoleOptions: Winston.transports.ConsoleTransportOptions = {
    format: getConsoleFormats(),
};

export const getTransports = (options?: LoggerOptions): Winston.transport[] => {
    const transports: Winston.transport[] = [];

    if (options && 'file' in options) {
        const transport = new DailyRotateFileTransport(
            options.fileOptions ? options.fileOptions : dailyRotateFileOptions,
        );

        createLoggerFolder();
        transports.push(transport);
    }

    const transport = new Winston.transports.Console(options && options.console ? options.console : consoleOptions);
    transports.push(transport);

    if (options && options.transports) {
        for (const element of options.transports) {
            element.format = getFileFormats();
        }

        transports.push(...options.transports);
    }

    return transports;
};
