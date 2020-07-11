import { Logger } from './src/logger';
import { LoggerInstance } from './src/logger-instance';

Logger.init();
const logger = new LoggerInstance('IndexContext');
logger.info('test', { name: 'filipe' }, 'test', { test: 'a' });

Logger.info('test', 'metadata');
Logger.info('test', { context: 'TestContext' });
Logger.info('sem nada');

export * from './src/logger';
export * from './src/formats';
