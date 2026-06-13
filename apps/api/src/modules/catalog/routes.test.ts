import argon2 from 'argon2';
import { UserProfileCode } from '@edren/database';
import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { forceMissingCloudinaryConfigForTest, setProductImageRemoverForTest, setProductImageUploaderForTest } from '../../lib/cloudinary.js';
import { createTestApp } from '../../test/create-test-app.js';

const password = 'Teste@123456';
const adminUsername = 'catalog.test.admin';
const sellerUsername = 'catalog.test.seller';

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
  forceMissingCloudinaryConfigForTest(false);
  setProductImageRemoverForTest(null);
  setProductImageUploaderForTest(null);
  await cleanup();
  await app.close();
});

describe('catalog routes', () => {
  it('requires authentication to list catalog records', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/products' });

    expect(response.statusCode).toBe(401);
  });

  it('allows authenticated users to list catalog records', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/collections',
      cookies: { edren_session: sellerCookie },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ data: expect.any(Array) });
  });

  it('blocks non-admin users from writing catalog records', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/collections',
      cookies: { edren_session: sellerCookie },
      payload: { name: 'Colecao Teste Bloqueada', startDate: '2024-01-01' },
    });

    expect(response.statusCode).toBe(403);
  });

  it('creates, updates and rejects duplicate collections', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/collections',
      cookies: { edren_session: adminCookie },
      payload: { name: 'Colecao Teste Catalogo', description: 'Criada no teste', startDate: '2024-01-01' },
    });

    expect(createResponse.statusCode).toBe(200);
    expect(createResponse.json()).toMatchObject({
      data: {
        name: 'Colecao Teste Catalogo',
        description: 'Criada no teste',
        startDate: expect.any(String),
        status: 'ACTIVE',
      },
    });

    const duplicateResponse = await app.inject({
      method: 'POST',
      url: '/api/collections',
      cookies: { edren_session: adminCookie },
      payload: { name: 'Colecao Teste Catalogo', startDate: '2024-01-01' },
    });

    expect(duplicateResponse.statusCode).toBe(409);

    const id = createResponse.json().data.id as string;
    const updateResponse = await app.inject({
      method: 'PATCH',
      url: `/api/collections/${id}`,
      cookies: { edren_session: adminCookie },
      payload: { endDate: '2024-12-31', status: 'ARCHIVED' },
    });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.json()).toMatchObject({ data: { endDate: expect.any(String), status: 'ARCHIVED' } });

    const invalidPeriodResponse = await app.inject({
      method: 'PATCH',
      url: `/api/collections/${id}`,
      cookies: { edren_session: adminCookie },
      payload: { endDate: '2023-12-31' },
    });

    expect(invalidPeriodResponse.statusCode).toBe(422);
  });

  it('rejects FUTURE collection status in the MVP API contract', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/collections',
      cookies: { edren_session: adminCookie },
      payload: { name: 'Colecao Teste Future', startDate: '2024-01-01', status: 'FUTURE' },
    });

    expect(response.statusCode).toBe(400);
  });

  it('creates products with relations and unique reference', async () => {
    const fixtures = await createCatalogFixtures();
    const response = await app.inject({
      method: 'POST',
      url: '/api/products',
      cookies: { edren_session: adminCookie },
      payload: {
        categoryId: fixtures.category.id,
        collectionId: fixtures.collection.id,
        cost: '55.50',
        name: 'Vestido Teste Catalogo',
        reference: 'CAT-001',
        salePrice: '129.90',
        sizeGridId: fixtures.grid.id,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      data: {
        cost: '55.50',
        mainImage: null,
        name: 'Vestido Teste Catalogo',
        reference: 'CAT-001',
        salePrice: '129.90',
      },
    });

    const duplicateResponse = await app.inject({
      method: 'POST',
      url: '/api/products',
      cookies: { edren_session: adminCookie },
      payload: {
        categoryId: fixtures.category.id,
        collectionId: fixtures.collection.id,
        name: 'Produto Duplicado',
        reference: 'CAT-001',
        salePrice: '100.00',
        sizeGridId: fixtures.grid.id,
      },
    });

    expect(duplicateResponse.statusCode).toBe(409);
  });

  it('rejects products linked to collections that are not current', async () => {
    const fixtures = await createCatalogFixtures({ collection: { endDate: new Date('2024-01-01T00:00:00.000Z') } });
    const response = await app.inject({
      method: 'POST',
      url: '/api/products',
      cookies: { edren_session: adminCookie },
      payload: {
        categoryId: fixtures.category.id,
        collectionId: fixtures.collection.id,
        name: 'Produto Colecao Encerrada',
        reference: 'CAT-009',
        salePrice: '100.00',
        sizeGridId: fixtures.grid.id,
      },
    });

    expect(response.statusCode).toBe(422);
  });

  it('creates products without image and hides cost from non-admin users', async () => {
    const fixtures = await createCatalogFixtures();
    const product = await createProduct(fixtures, { reference: 'CAT-002', cost: '20.00' });

    const response = await app.inject({
      method: 'GET',
      url: `/api/products/${product.id}`,
      cookies: { edren_session: sellerCookie },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data.cost).toBeUndefined();
    expect(response.json().data.mainImage).toBeNull();
  });

  it('validates product relations', async () => {
    const fixtures = await createCatalogFixtures();
    const response = await app.inject({
      method: 'POST',
      url: '/api/products',
      cookies: { edren_session: adminCookie },
      payload: {
        categoryId: fixtures.category.id,
        collectionId: 'missing-collection',
        name: 'Produto Relacao Invalida',
        reference: 'CAT-003',
        salePrice: '100.00',
        sizeGridId: fixtures.grid.id,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('creates variants and rejects duplicate or wrong-grid sizes', async () => {
    const fixtures = await createCatalogFixtures();
    const product = await createProduct(fixtures, { reference: 'CAT-004' });

    const response = await app.inject({
      method: 'POST',
      url: `/api/products/${product.id}/variants`,
      cookies: { edren_session: adminCookie },
      payload: { colorId: fixtures.color.id, sizeId: fixtures.size.id },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ data: { isActive: true } });

    const duplicateResponse = await app.inject({
      method: 'POST',
      url: `/api/products/${product.id}/variants`,
      cookies: { edren_session: adminCookie },
      payload: { colorId: fixtures.color.id, sizeId: fixtures.size.id },
    });

    expect(duplicateResponse.statusCode).toBe(409);

    const wrongGridResponse = await app.inject({
      method: 'POST',
      url: `/api/products/${product.id}/variants`,
      cookies: { edren_session: adminCookie },
      payload: { colorId: fixtures.color.id, sizeId: fixtures.otherSize.id },
    });

    expect(wrongGridResponse.statusCode).toBe(422);
  });

  it('updates variants and uploads/removes main image', async () => {
    const fixtures = await createCatalogFixtures();
    const product = await createProduct(fixtures, { reference: 'CAT-005' });
    const removedPublicIds: string[] = [];
    setProductImageUploaderForTest(async (input) => {
      expect(input.filename).toBe('main.jpg');
      expect(input.buffer.length).toBeGreaterThan(0);

      return { publicId: 'edren/products/catalog-main-image', url: 'https://res.cloudinary.com/test/main.jpg' };
    });
    setProductImageRemoverForTest(async (publicId) => {
      removedPublicIds.push(publicId);
    });
    const variantResponse = await app.inject({
      method: 'POST',
      url: `/api/products/${product.id}/variants`,
      cookies: { edren_session: adminCookie },
      payload: { colorId: fixtures.color.id, sizeId: fixtures.size.id },
    });
    const variantId = variantResponse.json().data.id as string;

    const updateVariantResponse = await app.inject({
      method: 'PATCH',
      url: `/api/product-variants/${variantId}`,
      cookies: { edren_session: adminCookie },
      payload: { isActive: false },
    });

    expect(updateVariantResponse.statusCode).toBe(200);
    expect(updateVariantResponse.json()).toMatchObject({ data: { isActive: false } });

    const imageResponse = await app.inject({
      method: 'POST',
      url: `/api/products/${product.id}/images/main`,
      cookies: { edren_session: adminCookie },
      payload: buildMultipartImagePayload(),
      headers: { 'content-type': `multipart/form-data; boundary=${multipartBoundary}` },
    });

    expect(imageResponse.statusCode).toBe(200);
    expect(imageResponse.json()).toMatchObject({ data: { publicId: 'edren/products/catalog-main-image' } });

    setProductImageUploaderForTest(async () => ({
      publicId: 'edren/products/catalog-main-image-updated',
      url: 'https://res.cloudinary.com/test/main-updated.jpg',
    }));

    const replaceImageResponse = await app.inject({
      method: 'POST',
      url: `/api/products/${product.id}/images/main`,
      cookies: { edren_session: adminCookie },
      payload: buildMultipartImagePayload({ filename: 'main-updated.jpg' }),
      headers: { 'content-type': `multipart/form-data; boundary=${multipartBoundary}` },
    });

    expect(replaceImageResponse.statusCode).toBe(200);
    expect(replaceImageResponse.json()).toMatchObject({ data: { publicId: 'edren/products/catalog-main-image-updated' } });
    expect(removedPublicIds).toEqual(['edren/products/catalog-main-image']);

    const deleteImageResponse = await app.inject({
      method: 'DELETE',
      url: `/api/products/${product.id}/images/main`,
      cookies: { edren_session: adminCookie },
    });

    expect(deleteImageResponse.statusCode).toBe(200);
    expect(deleteImageResponse.json()).toMatchObject({ data: { ok: true } });
    expect(removedPublicIds).toEqual(['edren/products/catalog-main-image', 'edren/products/catalog-main-image-updated']);
  });

  it('blocks main image upload for non-admin users', async () => {
    const fixtures = await createCatalogFixtures();
    const product = await createProduct(fixtures, { reference: 'CAT-006' });

    const response = await app.inject({
      method: 'POST',
      url: `/api/products/${product.id}/images/main`,
      cookies: { edren_session: sellerCookie },
      payload: buildMultipartImagePayload(),
      headers: { 'content-type': `multipart/form-data; boundary=${multipartBoundary}` },
    });

    expect(response.statusCode).toBe(403);
  });

  it('rejects invalid main image upload payloads', async () => {
    const fixtures = await createCatalogFixtures();
    const product = await createProduct(fixtures, { reference: 'CAT-007' });
    setProductImageUploaderForTest(async () => ({ publicId: 'unused', url: 'https://example.com/unused.jpg' }));

    const missingFileResponse = await app.inject({
      method: 'POST',
      url: `/api/products/${product.id}/images/main`,
      cookies: { edren_session: adminCookie },
      payload: '',
      headers: { 'content-type': `multipart/form-data; boundary=${multipartBoundary}` },
    });

    expect(missingFileResponse.statusCode).toBe(400);

    const invalidTypeResponse = await app.inject({
      method: 'POST',
      url: `/api/products/${product.id}/images/main`,
      cookies: { edren_session: adminCookie },
      payload: buildMultipartImagePayload({ contentType: 'text/plain', filename: 'main.txt' }),
      headers: { 'content-type': `multipart/form-data; boundary=${multipartBoundary}` },
    });

    expect(invalidTypeResponse.statusCode).toBe(400);
  });

  it('returns a clear error when Cloudinary is not configured', async () => {
    const fixtures = await createCatalogFixtures();
    const product = await createProduct(fixtures, { reference: 'CAT-008' });
    forceMissingCloudinaryConfigForTest(true);

    const response = await app.inject({
      method: 'POST',
      url: `/api/products/${product.id}/images/main`,
      cookies: { edren_session: adminCookie },
      payload: buildMultipartImagePayload(),
      headers: { 'content-type': `multipart/form-data; boundary=${multipartBoundary}` },
    });

    expect(response.statusCode).toBe(422);
    expect(response.json()).toMatchObject({ message: 'Upload de imagem indisponivel: Cloudinary nao configurado.' });
  });
});

const multipartBoundary = '----edren-test-boundary';

function buildMultipartImagePayload(options: { contentType?: string; filename?: string } = {}) {
  const contentType = options.contentType ?? 'image/jpeg';
  const filename = options.filename ?? 'main.jpg';

  return Buffer.from(
    [
      `--${multipartBoundary}`,
      `Content-Disposition: form-data; name="image"; filename="${filename}"`,
      `Content-Type: ${contentType}`,
      '',
      'fake-image-content',
      `--${multipartBoundary}--`,
      '',
    ].join('\r\n'),
  );
}

async function createUserAndLogin(username: string, profileCode: UserProfileCode) {
  const profile = await app.prisma.userProfile.findUniqueOrThrow({ where: { code: profileCode } });

  await app.prisma.user.create({
    data: {
      name: username,
      passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
      profileId: profile.id,
      username,
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

async function createCatalogFixtures(options: { collection?: { endDate?: Date | null; startDate?: Date } } = {}) {
  const collection = await app.prisma.collection.create({
    data: {
      endDate: options.collection?.endDate,
      name: `Colecao Teste Catalogo ${randomUUID()}`,
      startDate: options.collection?.startDate ?? new Date('2024-01-01T00:00:00.000Z'),
    },
  });
  const category = await app.prisma.category.create({ data: { name: 'Categoria Teste Catalogo' } });
  const color = await app.prisma.color.create({ data: { name: 'Cor Teste Catalogo', slug: 'cor-teste-catalogo' } });
  const grid = await app.prisma.sizeGrid.create({ data: { name: 'Grade Teste Catalogo' } });
  const size = await app.prisma.size.create({ data: { gridId: grid.id, name: 'P', sortOrder: 1 } });
  const otherGrid = await app.prisma.sizeGrid.create({ data: { name: 'Grade Teste Catalogo Outra' } });
  const otherSize = await app.prisma.size.create({ data: { gridId: otherGrid.id, name: 'GG', sortOrder: 1 } });

  return { category, collection, color, grid, otherGrid, otherSize, size };
}

async function createProduct(
  fixtures: Awaited<ReturnType<typeof createCatalogFixtures>>,
  overrides: { cost?: string; reference: string },
) {
  return app.prisma.product.create({
    data: {
      categoryId: fixtures.category.id,
      collectionId: fixtures.collection.id,
      cost: overrides.cost ?? null,
      name: `Produto ${overrides.reference}`,
      reference: overrides.reference,
      salePrice: '100.00',
      sizeGridId: fixtures.grid.id,
    },
  });
}

async function cleanup() {
  await app.prisma.session.deleteMany({
    where: { user: { username: { in: [adminUsername, sellerUsername] } } },
  });
  await app.prisma.productImage.deleteMany({ where: { product: { reference: { startsWith: 'CAT-' } } } });
  await app.prisma.productVariant.deleteMany({ where: { product: { reference: { startsWith: 'CAT-' } } } });
  await app.prisma.product.deleteMany({ where: { reference: { startsWith: 'CAT-' } } });
  await app.prisma.size.deleteMany({ where: { grid: { name: { startsWith: 'Grade Teste Catalogo' } } } });
  await app.prisma.sizeGrid.deleteMany({ where: { name: { startsWith: 'Grade Teste Catalogo' } } });
  await app.prisma.color.deleteMany({ where: { name: { startsWith: 'Cor Teste Catalogo' } } });
  await app.prisma.category.deleteMany({ where: { name: { startsWith: 'Categoria Teste Catalogo' } } });
  await app.prisma.collection.deleteMany({ where: { name: { startsWith: 'Colecao Teste' } } });
  await app.prisma.user.deleteMany({ where: { username: { in: [adminUsername, sellerUsername] } } });
}
