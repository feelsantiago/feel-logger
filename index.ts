import { Logger } from './src/logger';

Logger.init({
    file: true,
});

Logger.getWinstonInstance().info('teste');

export * from './src/logger';
export * from './src/formats';
