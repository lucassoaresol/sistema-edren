import { hashSessionToken, sessionCookieName } from './session.js';
import { UnauthorizedError } from '../../lib/errors.js';
import type { FastifyRequest } from 'fastify';

export async function getCurrentUser(request: FastifyRequest) {
  const signedToken = request.cookies[sessionCookieName];

  if (!signedToken) {
    return null;
  }

  const token = request.unsignCookie(signedToken);

  if (!token.valid || !token.value) {
    return null;
  }

  const tokenHash = hashSessionToken(token.value);

  const session = await request.server.prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!session || session.expiresAt <= new Date() || !session.user.isActive) {
    return null;
  }

  return session.user;
}

export async function requireAuth(request: FastifyRequest) {
  const user = await getCurrentUser(request);

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}
