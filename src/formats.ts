import Winston from 'winston';
import { basename } from 'path';

const { format } = Winston;
const { combine, timestamp, printf, colorize, label, metadata } = format;

type LoggerInfo = Winston.Logform.TransformableInfo & { stack?: string; timestamp?: string; label?: string };
type LoggerFormat = Winston.Logform.Format;

/* eslint-disable no-param-reassign */
const handleMetadata = (data: Record<string, unknown>): string => {
    const keys = Object.keys(data);
    return keys.length !== 0 ? JSON.stringify(data) : '';
};

const entryFormat = (): LoggerFormat =>
    printf((info: LoggerInfo) => {
        console.log(info);
        return `${info.timestamp || new Date().toDateString()} [${info.label || 'LoggerInfoLabel'}] ${info.level}: ${
            info.message
        } ${handleMetadata(info.metadata)}`;
    });

const transformLevelToUpperCase = (): LoggerFormat =>
    format((info: LoggerInfo) => {
        info.level = info.level.toUpperCase();
        return info;
    })();

const errorHandle = (): LoggerFormat =>
    format((info: LoggerInfo) => {
        if ('stack' in info) {
            info.message = info.stack || 'No stack tracer';
        }

        return info;
    })();

const objectHandle = (): LoggerFormat =>
    format((info: LoggerInfo) => {
        if (typeof info.message === 'object') {
            info.message = JSON.stringify(info.message);
        }

        return info;
    })();

export const defaultFormats = (name?: string): LoggerFormat => {
    return combine(
        errorHandle(),
        transformLevelToUpperCase(),
        label({ label: name || 'Application' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    );
};

export const consoleFormats = (): LoggerFormat => {
    return combine(colorize({ all: true }), entryFormat());
};

export const fileFormats = (): LoggerFormat => {
    return combine(objectHandle(), entryFormat());
};
/* eslint-enable no-param-reassign */
