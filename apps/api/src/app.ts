import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import { registerErrorHandler } from './lib/error-handler.js';
import { createLoggerOptions } from './lib/logger.js';
import { authRoutes } from './modules/auth/routes.js';
import { catalogRoutes } from './modules/catalog/routes.js';
import { configRoutes } from './modules/config/routes.js';
import { cookiePlugin } from './plugins/cookie.js';
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
  await app.register(cookiePlugin);
  await app.register(multipart, { limits: { fileSize: 5 * 1024 * 1024, files: 1 } });
  await app.register(healthRoutes, { prefix: '/api/health' });
  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(catalogRoutes, { prefix: '/api' });
  await app.register(configRoutes, { prefix: '/api/config' });

  return app;
}
