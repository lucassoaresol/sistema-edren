import Fastify from 'fastify';
import { registerErrorHandler } from './lib/error-handler.js';
import { createLoggerOptions } from './lib/logger.js';
import { prismaPlugin } from './plugins/prisma.js';
import { healthRoutes } from './routes/health.js';

export async function createApp() {
  const app = Fastify({
    genReqId: (request) => {
      const requestId = request.headers['x-request-id'];

      if (typeof requestId === 'string' && requestId.length > 0) {
        return requestId;
      }

      return crypto.randomUUID();
    },
    logger: createLoggerOptions(),
  });

  registerErrorHandler(app);

  await app.register(prismaPlugin);
  await app.register(healthRoutes, { prefix: '/api/health' });

  return app;
}
