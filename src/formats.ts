import Winston from 'winston';

const { format } = Winston;
const { combine, timestamp, printf, colorize, label, metadata } = format;
const matchBracketsRegex = /\[|]/g;

type LoggerInfo = Winston.Logform.TransformableInfo & { stack?: string; timestamp?: string; label?: string };
type LoggerFormat = Winston.Logform.Format;
type ContextMetaData = { context: string };

/* eslint-disable no-param-reassign */
const handleMetadata = (data: Record<string, unknown>): [string | undefined, string] => {
    const keys = Object.keys(data);
    let context: string | undefined;
    let meta = '';

    if (keys.length > 0) {
        keys.forEach((key) => {
            const element = data[key];

            if (typeof element === 'string') {
                meta = meta.concat(' ', element);
            } else if (typeof element === 'object') {
                if (Array.isArray(element)) {
                    meta = meta.concat(' ', JSON.stringify(element).replace(matchBracketsRegex, ''));
                } else if (element && 'context' in element) {
                    context = (element as ContextMetaData).context;
                } else {
                    meta = meta.concat(' ', JSON.stringify(element));
                }
            }
        });

        meta = 'Metadata:'.concat(meta);
    }

    return [context, meta];
};

const entryFormat = (): LoggerFormat =>
    printf((info: LoggerInfo) => {
        const [context, meta] = handleMetadata(info.metadata);

        return `${info.timestamp || new Date().toDateString()} [${info.label || 'LoggerInfoLabel'}${
            context ? ` - ${context}]` : `]`
        } ${info.level}: ${info.message} ${meta}`;
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
        metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'], fillWith: ['context'] }),
    );
};

export const consoleFormats = (): LoggerFormat => {
    return combine(colorize({ all: true }), entryFormat());
};

export const fileFormats = (): LoggerFormat => {
    return combine(objectHandle(), entryFormat());
};
/* eslint-enable no-param-reassign */
