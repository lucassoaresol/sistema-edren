import { afterEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createTestApp } from '../test/create-test-app.js';

let app: FastifyInstance | null = null;

afterEach(async () => {
  await app?.close();
  app = null;
});

describe('health routes', () => {
  it('returns API health', async () => {
    app = await createTestApp();

    const response = await app.inject({
      method: 'GET',
      url: '/api/health',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      ok: true,
      service: 'edren-api',
    });
  });

  it('returns database health with seed counts', async () => {
    app = await createTestApp();

    const response = await app.inject({
      method: 'GET',
      url: '/api/health/db',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      ok: true,
      database: 'reachable',
      seed: {
        profiles: expect.any(Number),
        collections: expect.any(Number),
      },
    });
  });
});
