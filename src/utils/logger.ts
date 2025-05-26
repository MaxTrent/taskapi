import { createLogger as createWinstonLogger, transports, format } from 'winston';

const { combine, timestamp, json, errors } = format;

export const createLogger = (name: string) => {
  return createWinstonLogger({
    level: 'info',
    format: combine(
      errors({ stack: true }),
      timestamp(),
      json()
    ),
    defaultMeta: { service: name },
    transports: [
      new transports.File({ filename: `logs/${name}.log` }),
      new transports.Console(),
    ],
  });
};