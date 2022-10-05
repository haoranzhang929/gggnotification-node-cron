import {
  createLogger as createWinstonLogger,
  format,
  transports,
} from 'winston';
const { combine, timestamp, colorize, printf, json } = format;

const myFormat = printf(({ level, message, timestamp, ...rest }) => {
  return `${timestamp} ${level}: ${message}${
    rest.data ? JSON.stringify(rest) : ''
  }`;
});

export const createLogger = () =>
  createWinstonLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), colorize(), json(), myFormat),
    transports: [new transports.Console()],
  });
