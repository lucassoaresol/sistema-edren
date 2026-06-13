import type { Prisma, PrismaClient } from '@edren/database';
import type { FastifyPluginAsync } from 'fastify';
import { removeProductImage, uploadProductImage } from '../../lib/cloudinary.js';
import { BadRequestError, BusinessRuleError, ConflictError, NotFoundError } from '../../lib/errors.js';
import { requireAdmin, requireAuth } from '../auth/auth-context.js';
import { ensureCollectionDateRange, ensureCollectionExists, ensureUniqueCollectionName } from './collections.js';
import { ensureProductReferenceIsUnique, ensureProductRelations, ensureProductSizeGridCanChange } from './products.js';
import { serializeProduct } from './serializers.js';
import {
  createCollectionSchema,
  createProductSchema,
  createVariantSchema,
  idParamsSchema,
  listProductsQuerySchema,
  productParamsSchema,
  toDecimalString,
  toRequiredDecimalString,
  updateCollectionSchema,
  updateProductSchema,
  updateVariantSchema,
} from './schemas.js';

const catalogAdminMessage = 'Apenas administradores podem alterar o catalogo.';

const productInclude = {
  category: true,
  collection: true,
  images: { orderBy: [{ isMain: 'desc' as const }, { sortOrder: 'asc' as const }, { createdAt: 'asc' as const }] },
  sizeGrid: { include: { sizes: { orderBy: [{ sortOrder: 'asc' as const }, { name: 'asc' as const }] } } },
  variants: {
    include: { color: true, size: true },
    orderBy: [{ color: { name: 'asc' as const } }, { size: { sortOrder: 'asc' as const } }],
  },
} as const satisfies Prisma.ProductInclude;

export const catalogRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (request) => {
    await requireAuth(request);
  });

  app.get('/collections', async () => {
    const collections = await app.prisma.collection.findMany({ orderBy: [{ name: 'asc' }] });
    return { data: collections };
  });

  app.post('/collections', async (request) => {
    await requireAdmin(request, catalogAdminMessage);
    const input = createCollectionSchema.parse(request.body);

    await ensureUniqueCollectionName(app.prisma, input.name);

    const collection = await app.prisma.collection.create({
      data: {
        description: input.description ?? null,
        endDate: input.endDate ?? null,
        name: input.name,
        startDate: input.startDate,
        status: input.status ?? 'ACTIVE',
      },
    });

    return { data: collection };
  });

  app.patch('/collections/:id', async (request) => {
    await requireAdmin(request, catalogAdminMessage);
    const params = idParamsSchema.parse(request.params);
    const input = updateCollectionSchema.parse(request.body);

    const currentCollection = await ensureCollectionExists(app.prisma, params.id);

    if (input.name) {
      await ensureUniqueCollectionName(app.prisma, input.name, params.id);
    }

    const nextStartDate = input.startDate ?? currentCollection.startDate;
    const nextEndDate = input.endDate === undefined ? currentCollection.endDate : input.endDate;

    ensureCollectionDateRange({ startDate: nextStartDate, endDate: nextEndDate });

    const collection = await app.prisma.collection.update({
      where: { id: params.id },
      data: {
        ...input,
        description: input.description === undefined ? undefined : input.description,
      },
    });

    return { data: collection };
  });

  app.get('/products', async (request) => {
    const user = await requireAuth(request);
    const query = listProductsQuerySchema.parse(request.query);
    const where: Prisma.ProductWhereInput = {
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.collectionId ? { collectionId: query.collectionId } : {}),
      ...(query.isActive ? { isActive: query.isActive === 'true' } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { reference: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const products = await app.prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: [{ reference: 'asc' }],
    });

    return { data: products.map((product) => serializeProduct(product, user)) };
  });

  app.post('/products', async (request) => {
    await requireAdmin(request, catalogAdminMessage);
    const input = createProductSchema.parse(request.body);

    await ensureProductReferenceIsUnique(app.prisma, input.reference);
    await ensureProductRelations(app.prisma, input.collectionId, input.categoryId, input.sizeGridId);

    const product = await app.prisma.product.create({
      data: {
        categoryId: input.categoryId,
        collectionId: input.collectionId,
        cost: toDecimalString(input.cost),
        description: input.description ?? null,
        isActive: input.isActive ?? true,
        name: input.name,
        reference: input.reference,
        salePrice: toRequiredDecimalString(input.salePrice),
        sizeGridId: input.sizeGridId,
      },
      include: productInclude,
    });

    return { data: serializeProduct(product, await requireAuth(request)) };
  });

  app.get('/products/:id', async (request) => {
    const user = await requireAuth(request);
    const params = idParamsSchema.parse(request.params);
    const product = await findProductOrThrow(app.prisma, params.id);
    return { data: serializeProduct(product, user) };
  });

  app.patch('/products/:id', async (request) => {
    const user = await requireAdmin(request, catalogAdminMessage);
    const params = idParamsSchema.parse(request.params);
    const input = updateProductSchema.parse(request.body);
    const current = await app.prisma.product.findUnique({ where: { id: params.id }, include: { variants: true } });

    if (!current) {
      throw new NotFoundError('Produto nao encontrado.');
    }

    if (input.reference && input.reference !== current.reference) {
      await ensureProductReferenceIsUnique(app.prisma, input.reference, current.id);
    }

    if (input.collectionId || input.categoryId || input.sizeGridId) {
      await ensureProductRelations(
        app.prisma,
        input.collectionId ?? current.collectionId,
        input.categoryId ?? current.categoryId,
        input.sizeGridId ?? current.sizeGridId,
        Boolean(input.collectionId),
      );
    }

    ensureProductSizeGridCanChange(
      input.sizeGridId !== undefined && input.sizeGridId !== current.sizeGridId,
      current.variants.length > 0,
    );

    const { cost, description, salePrice, ...productInput } = input;
    const product = await app.prisma.product.update({
      where: { id: current.id },
      data: {
        ...productInput,
        cost: cost === undefined ? undefined : toDecimalString(cost),
        description: description === undefined ? undefined : description,
        salePrice: salePrice === undefined ? undefined : toRequiredDecimalString(salePrice),
      },
      include: productInclude,
    });

    return { data: serializeProduct(product, user) };
  });

  app.get('/products/:productId/variants', async (request) => {
    const params = productParamsSchema.parse(request.params);
    await ensureProductExists(app.prisma, params.productId);

    const variants = await app.prisma.productVariant.findMany({
      where: { productId: params.productId },
      include: { color: true, size: true },
      orderBy: [{ color: { name: 'asc' } }, { size: { sortOrder: 'asc' } }],
    });

    return { data: variants };
  });

  app.post('/products/:productId/variants', async (request) => {
    await requireAdmin(request, catalogAdminMessage);
    const params = productParamsSchema.parse(request.params);
    const input = createVariantSchema.parse(request.body);
    const product = await ensureProductExists(app.prisma, params.productId);

    await ensureVariantRelations(app.prisma, product.sizeGridId, input.colorId, input.sizeId);
    await ensureUniqueVariant(app.prisma, product.id, input.colorId, input.sizeId);

    const variant = await app.prisma.productVariant.create({
      data: {
        colorId: input.colorId,
        isActive: input.isActive ?? true,
        productId: product.id,
        sizeId: input.sizeId,
      },
      include: { color: true, size: true },
    });

    return { data: variant };
  });

  app.patch('/product-variants/:id', async (request) => {
    await requireAdmin(request, catalogAdminMessage);
    const params = idParamsSchema.parse(request.params);
    const input = updateVariantSchema.parse(request.body);
    const current = await app.prisma.productVariant.findUnique({ where: { id: params.id }, include: { product: true } });

    if (!current) {
      throw new NotFoundError('SKU nao encontrado.');
    }

    const nextColorId = input.colorId ?? current.colorId;
    const nextSizeId = input.sizeId ?? current.sizeId;

    if (input.colorId || input.sizeId) {
      await ensureVariantRelations(app.prisma, current.product.sizeGridId, nextColorId, nextSizeId);
      await ensureUniqueVariant(app.prisma, current.productId, nextColorId, nextSizeId, current.id);
    }

    const variant = await app.prisma.productVariant.update({
      where: { id: current.id },
      data: input,
      include: { color: true, size: true },
    });

    return { data: variant };
  });

  app.post('/products/:productId/images/main', async (request) => {
    await requireAdmin(request, catalogAdminMessage);
    const params = productParamsSchema.parse(request.params);

    await ensureProductExists(app.prisma, params.productId);

    const file = await request.file();

    if (!file) {
      throw new BadRequestError('Envie uma imagem para o produto.');
    }

    if (!isAllowedImageType(file.mimetype)) {
      throw new BadRequestError('Formato de imagem nao suportado. Envie JPG, PNG, WebP ou GIF.');
    }

    let buffer: Buffer;

    try {
      buffer = await file.toBuffer();
    } catch (error) {
      if (isFileTooLargeError(error)) {
        throw new BusinessRuleError('A imagem deve ter no maximo 5 MB.');
      }

      throw error;
    }

    const uploaded = await uploadProductImage({ buffer, filename: file.filename });

    const currentImage = await app.prisma.productImage.findFirst({
      where: { productId: params.productId, isMain: true },
      select: { publicId: true },
    });

    const image = await app.prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { productId: params.productId, isMain: true } });
      return tx.productImage.create({
        data: {
          isMain: true,
          productId: params.productId,
          publicId: uploaded.publicId,
          sortOrder: 0,
          url: uploaded.url,
        },
      });
    });

    if (currentImage?.publicId && currentImage.publicId !== uploaded.publicId) {
      try {
        await removeProductImage(currentImage.publicId);
      } catch (error) {
        request.log.error({ err: error, publicId: currentImage.publicId }, 'failed to remove previous product image from Cloudinary');
      }
    }

    return { data: image };
  });

  app.delete('/products/:productId/images/main', async (request) => {
    await requireAdmin(request, catalogAdminMessage);
    const params = productParamsSchema.parse(request.params);
    await ensureProductExists(app.prisma, params.productId);
    const currentImage = await app.prisma.productImage.findFirst({
      where: { productId: params.productId, isMain: true },
      select: { publicId: true },
    });

    if (currentImage?.publicId) {
      await removeProductImage(currentImage.publicId);
    }

    await app.prisma.productImage.deleteMany({ where: { productId: params.productId, isMain: true } });
    return { data: { ok: true } };
  });
};

function isAllowedImageType(mimetype: string) {
  return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mimetype);
}

function isFileTooLargeError(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'FST_REQ_FILE_TOO_LARGE';
}

async function ensureProductExists(prisma: PrismaClient, id: string) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new NotFoundError('Produto nao encontrado.');
  }

  return product;
}

async function findProductOrThrow(prisma: PrismaClient, id: string) {
  const product = await prisma.product.findUnique({ where: { id }, include: productInclude });

  if (!product) {
    throw new NotFoundError('Produto nao encontrado.');
  }

  return product;
}

async function ensureVariantRelations(prisma: PrismaClient, productSizeGridId: string, colorId: string, sizeId: string) {
  const [color, size] = await Promise.all([
    prisma.color.findUnique({ where: { id: colorId } }),
    prisma.size.findUnique({ where: { id: sizeId } }),
  ]);

  if (!color) {
    throw new NotFoundError('Cor nao encontrada.');
  }

  if (!size) {
    throw new NotFoundError('Tamanho nao encontrado.');
  }

  if (size.gridId !== productSizeGridId) {
    throw new BusinessRuleError('O tamanho selecionado nao pertence a grade do produto.');
  }
}

async function ensureUniqueVariant(prisma: PrismaClient, productId: string, colorId: string, sizeId: string, ignoreId?: string) {
  const existing = await prisma.productVariant.findFirst({
    where: {
      colorId,
      productId,
      sizeId,
      ...(ignoreId ? { id: { not: ignoreId } } : {}),
    },
  });

  if (existing) {
    throw new ConflictError('Ja existe um SKU para esta cor e tamanho.');
  }
}
