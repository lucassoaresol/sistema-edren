import type { FastifyPluginAsync } from 'fastify';

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => ({
    ok: true,
    service: 'edren-api',
  }));

  app.get('/db', async () => {
    const [profileCount, collectionCount] = await Promise.all([
      app.prisma.userProfile.count(),
      app.prisma.collection.count(),
    ]);

    return {
      ok: true,
      database: 'reachable',
      seed: {
        profiles: profileCount,
        collections: collectionCount,
      },
    };
  });
};
