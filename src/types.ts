import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import { LoggerOptions as WinstonLoggerOptions, transport } from 'winston';

interface LoggerFileOptions {
    file: boolean;
    fileOptions?: DailyRotateFileTransportOptions;
}

interface LoggerConsoleOptions {
    console?: {
        colorize?: boolean;
    } & WinstonLoggerOptions;
}

interface BaseOptions {
    name?: string;
    level?: string;
    exitOnError?: boolean;
    handleExceptions?: boolean;
    transports?: transport[];
}

export type LoggerOptions = BaseOptions & LoggerFileOptions & LoggerConsoleOptions;
