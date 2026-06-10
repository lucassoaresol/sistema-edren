import { prisma, type PrismaClient } from '@edren/database';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

const registerPrisma: FastifyPluginAsync = async (app) => {
  app.decorate('prisma', prisma);

  app.addHook('onClose', async () => {
    await app.prisma.$disconnect();
  });
};

export const prismaPlugin = fp(registerPrisma, {
  name: 'prisma',
});
