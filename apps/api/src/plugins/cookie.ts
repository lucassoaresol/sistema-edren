import cookie from '@fastify/cookie';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { env } from '../lib/env.js';

const registerCookie: FastifyPluginAsync = async (app) => {
  await app.register(cookie, {
    secret: env.SESSION_SECRET,
  });
};

export const cookiePlugin = fp(registerCookie, {
  name: 'cookie',
});
