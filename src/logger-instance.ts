import { LoggerOperations } from './types';

export class LoggerInstance<T> {
    private readonly context: string;

    constructor(private readonly logger: LoggerOperations, context?: string) {
        this.context = context || 'LoggerInstance';
    }

    public log(level: string, message: string): void {
        this.logger.log(level, message);
    }

    public info(message: string, ...meta: unknown[]): void {
        this.logger.info(message, { context: this.context }, meta);
    }

    public warning(message: string, ...meta: unknown[]): void {
        this.logger.warning(message, { context: this.context }, meta);
    }

    public error(message: string, ...meta: unknown[]): void {
        this.logger.error(message, { context: this.context }, meta);
    }

    public debug(message: string, ...meta: unknown[]): void {
        this.logger.debug(message, { context: this.context }, meta);
    }
}
