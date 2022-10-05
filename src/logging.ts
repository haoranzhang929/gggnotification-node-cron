import { createLogger, format, transports } from 'winston';
const { combine, timestamp, colorize, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
  format: combine(timestamp(), colorize(), myFormat),
  transports: [new transports.Console()],
});
