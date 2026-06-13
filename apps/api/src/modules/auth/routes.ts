import argon2 from 'argon2';
import type { FastifyPluginAsync } from 'fastify';
import { env } from '../../lib/env.js';
import { UnauthorizedError } from '../../lib/errors.js';
import { getCurrentUser, requireAuth } from './auth-context.js';
import { loginSchema } from './schemas.js';
import {
  createSessionExpiration,
  createSessionToken,
  hashSessionToken,
  sessionCookieName,
} from './session.js';

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/login', async (request, reply) => {
    const input = loginSchema.parse(request.body);
    const username = input.username.toLowerCase();

    const user = await app.prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError('Usuario ou senha invalidos.');
    }

    const passwordMatches = await argon2.verify(user.passwordHash, input.password);

    if (!passwordMatches) {
      throw new UnauthorizedError('Usuario ou senha invalidos.');
    }

    const token = createSessionToken();
    const tokenHash = hashSessionToken(token);
    const expiresAt = createSessionExpiration();

    await app.prisma.session.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    reply.setCookie(sessionCookieName, token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      expires: expiresAt,
      signed: true,
    });

    return {
      data: serializeUser(user),
    };
  });

  app.post('/logout', async (request, reply) => {
    const signedToken = request.cookies[sessionCookieName];
    const token = signedToken ? request.unsignCookie(signedToken) : null;

    if (token?.valid && token.value) {
      await app.prisma.session.deleteMany({
        where: { tokenHash: hashSessionToken(token.value) },
      });
    }

    reply.clearCookie(sessionCookieName, {
      path: '/',
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
    });

    return { data: { ok: true } };
  });

  app.get('/me', async (request) => {
    const user = await getCurrentUser(request);

    return {
      data: user ? serializeUser(user) : null,
    };
  });

  app.get('/required', async (request) => {
    const user = await requireAuth(request);

    return {
      data: serializeUser(user),
    };
  });
};

type UserWithProfile = Awaited<ReturnType<typeof getCurrentUser>> extends infer UserOrNull
  ? NonNullable<UserOrNull>
  : never;

function serializeUser(user: UserWithProfile) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    profile: {
      code: user.profile.code,
      name: user.profile.name,
    },
  };
}
