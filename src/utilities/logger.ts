import winston from 'winston';
import { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { loggingConfig } from '../config/app-config';
import path from "path"

const logFormat = format.combine(
  format.timestamp({
    format: loggingConfig.dateFormat,
  }),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

const logTransport = new DailyRotateFile({
  filename: `${loggingConfig.filePath}/${loggingConfig.fileName}`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: loggingConfig.zippedArchive,
  maxSize: loggingConfig.maxSize,
  maxFiles: loggingConfig.maxFiles,
  level: loggingConfig.level, // Set the minimum level for this transport
});

const consoleTransport = new winston.transports.Console({
  level: loggingConfig.level, // Set the minimum level for console logs
  format: format.combine(
    format.colorize(),
    logFormat
  ),
});

const appLogger = winston.createLogger({
  format: logFormat,
  transports: [logTransport, consoleTransport],
  exitOnError: false,
});

export default appLogger;
