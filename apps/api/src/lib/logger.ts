import type { FastifyServerOptions } from 'fastify';
import { env } from './env.js';

const redact = ['req.headers.authorization', 'req.headers.cookie', 'password', 'passwordHash'];

export function createLoggerOptions(): FastifyServerOptions['logger'] {
  if (env.NODE_ENV === 'development') {
    return {
      level: env.LOG_LEVEL,
      redact,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'SYS:standard',
        },
      },
    };
  }

  return {
    level: env.LOG_LEVEL,
    redact,
  };
}
