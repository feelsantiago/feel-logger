import Winston from 'winston';
import DailyRotateFileTransport, { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

import { LoggerOptions } from './types';
import { getConsoleFormats, getFileFormats } from './formats';

const dailyRotateFileOptions: DailyRotateFileTransportOptions = {
    filename: 'application-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
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
        transports.push(transport);

        if (options.transports) {
            for (const element of options.transports) {
                element.format = getFileFormats();
            }

            transports.push(...options.transports);
        }
    }

    const transport = new Winston.transports.Console(options && options.console ? options.console : consoleOptions);
    transports.push(transport);

    return transports;
};
