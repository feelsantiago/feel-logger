import { Logger } from './src/logger';

Logger.init();
Logger.getWinstonInstance().info('as');

export * from './src/logger';
export * from './src/formats';
