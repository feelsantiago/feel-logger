import Winston from 'winston';
import { basename } from 'path';

const { format } = Winston;
const { combine, timestamp, printf, colorize, label, metadata } = format;

type LoggerInfo = Winston.Logform.TransformableInfo & { stack?: string; timestamp?: string; label?: string };
type LoggerFormat = Winston.Logform.Format;

/* eslint-disable no-param-reassign */
const handleMetadata = (data: Record<string, unknown>): string => {
    const keys = Object.keys(metadata);
    return keys.length !== 0 ? JSON.stringify(data) : '';
};

const entryFormat = (): LoggerFormat =>
    printf((info: LoggerInfo) => {
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

export const getDefaultFormats = (): LoggerFormat => {
    return combine(
        errorHandle(),
        transformLevelToUpperCase(),
        label({ label: basename(require.main?.filename || 'unknown file') }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    );
};

export const getConsoleFormats = (): LoggerFormat => {
    return combine(colorize({ all: true }), entryFormat());
};

export const getFileFormats = (): LoggerFormat => {
    return combine(objectHandle(), entryFormat());
};
/* eslint-enable no-param-reassign */
