import LoadModule from 'import-from';
import { LoggerOptions } from './types';

type TsDefaultModule = { default: LoggerOptions };
type JsDefaultModule = LoggerOptions;

export const loadDynamicOptionsModule = (): LoggerOptions | undefined => {
    const module = LoadModule.silent('src', './logger.options');
    let options: LoggerOptions | undefined;

    if (module && typeof module === 'object') {
        if (module && 'default' in module) {
            options = (module as TsDefaultModule).default;
        } else {
            options = module as JsDefaultModule;
        }
    }

    return options;
};
