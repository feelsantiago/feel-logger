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

export interface TypeInfo<T> extends Function {
    new (...args: unknown[]): T;
}

export interface LoggerOperations {
    log: (level: string, message: string) => void;
    info: (message: string, ...meta: unknown[]) => void;
    warning: (message: string, ...meta: unknown[]) => void;
    error: (message: string, ...meta: unknown[]) => void;
    debug: (message: string, ...meta: unknown[]) => void;
}

export type LoggerOptions = BaseOptions & LoggerFileOptions & LoggerConsoleOptions;
