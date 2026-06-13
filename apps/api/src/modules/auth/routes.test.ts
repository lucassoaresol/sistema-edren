import argon2 from 'argon2';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { UserProfileCode } from '@edren/database';
import type { FastifyInstance } from 'fastify';
import { createTestApp } from '../../test/create-test-app.js';

const username = 'auth.test.admin';
const password = 'Teste@123456';

let app: FastifyInstance;

beforeEach(async () => {
  app = await createTestApp();

  const profile = await app.prisma.userProfile.findUniqueOrThrow({
    where: { code: UserProfileCode.ADMIN },
  });

  await app.prisma.session.deleteMany({
    where: {
      user: { username },
    },
  });
  await app.prisma.user.deleteMany({ where: { username } });

  await app.prisma.user.create({
    data: {
      name: 'Admin Teste Auth',
      username,
      passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
      profileId: profile.id,
    },
  });
});

afterEach(async () => {
  await app.prisma.session.deleteMany({
    where: {
      user: { username },
    },
  });
  await app.prisma.user.deleteMany({ where: { username } });
  await app.close();
});

describe('auth routes', () => {
  it('returns null user when unauthenticated', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ data: null });
  });

  it('rejects invalid login', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        username,
        password: 'senha-errada',
      },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      error: 'UnauthorizedError',
    });
  });

  it('creates a session cookie and returns current user', async () => {
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username, password },
    });

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.cookies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'edren_session',
          httpOnly: true,
        }),
      ]),
    );

    const cookie = loginResponse.cookies.find((item) => item.name === 'edren_session');

    const meResponse = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      cookies: {
        edren_session: cookie?.value ?? '',
      },
    });

    expect(meResponse.statusCode).toBe(200);
    expect(meResponse.json()).toMatchObject({
      data: {
        username,
        profile: {
          code: UserProfileCode.ADMIN,
        },
      },
    });
  });

  it('removes session on logout', async () => {
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username, password },
    });

    const cookie = loginResponse.cookies.find((item) => item.name === 'edren_session');

    const logoutResponse = await app.inject({
      method: 'POST',
      url: '/api/auth/logout',
      cookies: {
        edren_session: cookie?.value ?? '',
      },
    });

    expect(logoutResponse.statusCode).toBe(200);

    const meResponse = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      cookies: {
        edren_session: cookie?.value ?? '',
      },
    });

    expect(meResponse.json()).toEqual({ data: null });
  });
});
