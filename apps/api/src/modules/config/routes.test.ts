import argon2 from 'argon2';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { UserProfileCode } from '@edren/database';
import type { FastifyInstance } from 'fastify';
import { createTestApp } from '../../test/create-test-app.js';

const password = 'Teste@123456';
const adminUsername = 'config.test.admin';
const sellerUsername = 'config.test.seller';

let app: FastifyInstance;
let adminCookie: string;
let sellerCookie: string;

beforeEach(async () => {
  app = await createTestApp();

  await cleanup();

  adminCookie = await createUserAndLogin(adminUsername, UserProfileCode.ADMIN);
  sellerCookie = await createUserAndLogin(sellerUsername, UserProfileCode.SELLER_OPERATOR);
});

afterEach(async () => {
  await cleanup();
  await app.close();
});

describe('config routes', () => {
  it('requires authentication to list configuration records', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/config/categories',
    });

    expect(response.statusCode).toBe(401);
  });

  it('allows authenticated users to list configuration records', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/config/categories',
      cookies: { edren_session: sellerCookie },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ data: expect.any(Array) });
  });

  it('blocks non-admin users from writing configuration records', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/config/categories',
      cookies: { edren_session: sellerCookie },
      payload: { name: 'Categoria Teste Bloqueada' },
    });

    expect(response.statusCode).toBe(403);
  });

  it('creates, updates and rejects duplicate categories', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/config/categories',
      cookies: { edren_session: adminCookie },
      payload: { name: 'Categoria Teste Config', description: 'Criada no teste' },
    });

    expect(createResponse.statusCode).toBe(200);
    expect(createResponse.json()).toMatchObject({
      data: {
        name: 'Categoria Teste Config',
        description: 'Criada no teste',
        isActive: true,
      },
    });

    const duplicateResponse = await app.inject({
      method: 'POST',
      url: '/api/config/categories',
      cookies: { edren_session: adminCookie },
      payload: { name: 'Categoria Teste Config' },
    });

    expect(duplicateResponse.statusCode).toBe(409);

    const id = createResponse.json().data.id as string;
    const updateResponse = await app.inject({
      method: 'PATCH',
      url: `/api/config/categories/${id}`,
      cookies: { edren_session: adminCookie },
      payload: { isActive: false },
    });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.json()).toMatchObject({ data: { isActive: false } });
  });

  it('manages sizes inside a size grid', async () => {
    const gridResponse = await app.inject({
      method: 'POST',
      url: '/api/config/size-grids',
      cookies: { edren_session: adminCookie },
      payload: { name: 'Grade Teste Config' },
    });

    expect(gridResponse.statusCode).toBe(200);

    const gridId = gridResponse.json().data.id as string;
    const sizeResponse = await app.inject({
      method: 'POST',
      url: `/api/config/size-grids/${gridId}/sizes`,
      cookies: { edren_session: adminCookie },
      payload: { name: 'PP', sortOrder: 0 },
    });

    expect(sizeResponse.statusCode).toBe(200);

    const duplicateResponse = await app.inject({
      method: 'POST',
      url: `/api/config/size-grids/${gridId}/sizes`,
      cookies: { edren_session: adminCookie },
      payload: { name: 'PP', sortOrder: 1 },
    });

    expect(duplicateResponse.statusCode).toBe(409);
  });

  it('creates colors with generated slugs', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/config/colors',
      cookies: { edren_session: adminCookie },
      payload: { name: 'Azul Teste Config' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      data: {
        name: 'Azul Teste Config',
        slug: 'azul-teste-config',
      },
    });
  });
});

async function createUserAndLogin(username: string, profileCode: UserProfileCode) {
  const profile = await app.prisma.userProfile.findUniqueOrThrow({ where: { code: profileCode } });

  await app.prisma.user.create({
    data: {
      name: username,
      username,
      passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
      profileId: profile.id,
    },
  });

  const loginResponse = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { username, password },
  });

  const cookie = loginResponse.cookies.find((item) => item.name === 'edren_session');
  return cookie?.value ?? '';
}

async function cleanup() {
  await app.prisma.session.deleteMany({
    where: { user: { username: { in: [adminUsername, sellerUsername] } } },
  });
  await app.prisma.user.deleteMany({ where: { username: { in: [adminUsername, sellerUsername] } } });
  await app.prisma.size.deleteMany({ where: { grid: { name: 'Grade Teste Config' } } });
  await app.prisma.sizeGrid.deleteMany({ where: { name: 'Grade Teste Config' } });
  await app.prisma.category.deleteMany({ where: { name: { startsWith: 'Categoria Teste' } } });
  await app.prisma.color.deleteMany({ where: { name: 'Azul Teste Config' } });
}
