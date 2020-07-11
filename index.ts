import { Logger } from './src/logger';

// Read from file
Logger.init({ file: true });
const logger = Logger.getWinstonInstance();
