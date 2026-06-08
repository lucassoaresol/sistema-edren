import Fastify from 'fastify';

export function createApp() {
  const app = Fastify({
    logger: true,
  });

  app.get('/api/health', async () => ({
    ok: true,
    service: 'edren-api',
  }));

  return app;
}
