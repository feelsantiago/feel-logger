import { Logger } from './logger';

interface Type<T> extends Function {
    new (...args: unknown[]): T;
}

export class LoggerInstance<T> {
    private readonly context: string;

    constructor(context?: Type<T> | string) {
        this.context = this.getContext(context);
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    public log(level: string, message: string): void {
        Logger.log(level, message);
    }

    public info(message: string, ...meta: any[]): void {
        Logger.info(message, { context: this.context }, meta);
    }

    public warning(message: string, ...meta: any[]): void {
        Logger.warning(message, { context: this.context }, meta);
    }

    public error(message: string, ...meta: any[]): void {
        Logger.error(message, { context: this.context }, meta);
    }

    public debug(message: string, ...meta: any[]): void {
        Logger.debug(message, { context: this.context }, meta);
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    private getContext(context: Type<T> | string | undefined): string {
        if (typeof context === 'string') {
            return context;
        }

        if (context && 'prototype' in context) {
            return context.name;
        }

        return 'LoggerInstance';
    }
}
