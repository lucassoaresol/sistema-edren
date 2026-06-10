import Fastify from 'fastify';
import { registerErrorHandler } from './lib/error-handler.js';
import { prismaPlugin } from './plugins/prisma.js';
import { healthRoutes } from './routes/health.js';

export async function createApp() {
  const app = Fastify({
    logger: true,
  });

  registerErrorHandler(app);

  await app.register(prismaPlugin);
  await app.register(healthRoutes, { prefix: '/api/health' });

  return app;
}
