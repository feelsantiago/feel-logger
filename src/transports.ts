import Winston from 'winston';
import DailyRotateFileTransport, { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import { join } from 'path';

import { mkdirSync, existsSync } from 'fs';
import { LoggerOptions } from './types';
import { consoleFormats, fileFormats } from './formats';

const createLoggerFolder = (): void => {
    const logsFolderPath = join(process.cwd(), 'logs');
    if (!existsSync(logsFolderPath)) mkdirSync(logsFolderPath);
};

const dailyRotateFileOptions: DailyRotateFileTransportOptions = {
    filename: '%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    dirname: join(process.cwd(), 'logs'),
    format: fileFormats(),
};

const consoleOptions: Winston.transports.ConsoleTransportOptions = {
    format: consoleFormats(),
};

export const defaultTransports = (options?: LoggerOptions): Winston.transport[] => {
    const transports: Winston.transport[] = [];

    if (options && options.file) {
        const fileCustomOptions = options.fileOptions || {};
        const fileOptions = { ...dailyRotateFileOptions, ...fileCustomOptions } as DailyRotateFileTransportOptions;
        const transport = new DailyRotateFileTransport(fileOptions);

        createLoggerFolder();
        transports.push(transport);
    }

    const transport = new Winston.transports.Console(options && options.console ? options.console : consoleOptions);
    transports.push(transport);

    if (options && options.transports) {
        transports.push(...options.transports);
    }

    return transports;
};
