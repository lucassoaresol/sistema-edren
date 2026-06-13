import type { PrismaClient } from '@edren/database';
import type { FastifyPluginAsync } from 'fastify';
import { ConflictError, NotFoundError } from '../../lib/errors.js';
import { requireAdmin, requireAuth } from '../auth/auth-context.js';
import {
  createColorSchema,
  createNamedConfigSchema,
  createSizeSchema,
  idParamsSchema,
  sizeGridParamsSchema,
  updateColorSchema,
  updateNamedConfigSchema,
  updateSizeSchema,
} from './schemas.js';

type ConfigModel = 'category' | 'paymentMethod' | 'salesChannel' | 'sizeGrid' | 'stockLocation';

const configAdminMessage = 'Apenas administradores podem alterar configuracoes.';

const modelLabels: Record<ConfigModel, string> = {
  category: 'cadastro',
  paymentMethod: 'cadastro',
  salesChannel: 'cadastro',
  sizeGrid: 'cadastro',
  stockLocation: 'cadastro',
};

export const configRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (request) => {
    await requireAuth(request);
  });

  registerNamedRoutes(app, {
    path: '/size-grids',
    model: 'sizeGrid',
    orderBy: [{ name: 'asc' }],
    include: { sizes: { orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] } },
  });

  app.get('/size-grids/:gridId/sizes', async (request) => {
    const params = sizeGridParamsSchema.parse(request.params);

    await ensureExists(app.prisma, 'sizeGrid', params.gridId);

    const sizes = await app.prisma.size.findMany({
      where: { gridId: params.gridId },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    return { data: sizes };
  });

  app.post('/size-grids/:gridId/sizes', async (request) => {
    await requireAdmin(request, configAdminMessage);
    const params = sizeGridParamsSchema.parse(request.params);
    const input = createSizeSchema.parse(request.body);

    await ensureExists(app.prisma, 'sizeGrid', params.gridId);

    await ensureUniqueSizeName(app.prisma, params.gridId, input.name);

    const size = await app.prisma.size.create({
      data: {
        gridId: params.gridId,
        name: input.name,
        sortOrder: input.sortOrder,
        isActive: input.isActive ?? true,
      },
    });

    return { data: size };
  });

  app.patch('/sizes/:id', async (request) => {
    await requireAdmin(request, configAdminMessage);
    const params = idParamsSchema.parse(request.params);
    const input = updateSizeSchema.parse(request.body);
    const current = await app.prisma.size.findUnique({ where: { id: params.id } });

    if (!current) {
      throw new NotFoundError('Tamanho nao encontrado.');
    }

    if (input.name && input.name !== current.name) {
      await ensureUniqueSizeName(app.prisma, current.gridId, input.name, current.id);
    }

    const size = await app.prisma.size.update({
      where: { id: current.id },
      data: input,
    });

    return { data: size };
  });

  registerNamedRoutes(app, { path: '/categories', model: 'category', orderBy: [{ name: 'asc' }] });

  app.get('/colors', async () => {
    const colors = await app.prisma.color.findMany({ orderBy: [{ name: 'asc' }] });
    return { data: colors };
  });

  app.post('/colors', async (request) => {
    await requireAdmin(request, configAdminMessage);
    const input = createColorSchema.parse(request.body);
    const slug = input.slug ?? slugify(input.name);

    await ensureUniqueColor(app.prisma, input.name, slug);

    const color = await app.prisma.color.create({
      data: {
        name: input.name,
        slug,
        isActive: input.isActive ?? true,
      },
    });

    return { data: color };
  });

  app.patch('/colors/:id', async (request) => {
    await requireAdmin(request, configAdminMessage);
    const params = idParamsSchema.parse(request.params);
    const input = updateColorSchema.parse(request.body);
    const current = await app.prisma.color.findUnique({ where: { id: params.id } });

    if (!current) {
      throw new NotFoundError('Cor nao encontrada.');
    }

    const nextName = input.name ?? current.name;
    const nextSlug = input.slug === null ? null : (input.slug ?? (input.name ? slugify(input.name) : current.slug));

    await ensureUniqueColor(app.prisma, nextName, nextSlug, current.id);

    const color = await app.prisma.color.update({
      where: { id: current.id },
      data: {
        ...input,
        slug: nextSlug,
      },
    });

    return { data: color };
  });

  registerNamedRoutes(app, { path: '/stock-locations', model: 'stockLocation', orderBy: [{ name: 'asc' }] });
  registerNamedRoutes(app, { path: '/sales-channels', model: 'salesChannel', orderBy: [{ name: 'asc' }] });
  registerNamedRoutes(app, { path: '/payment-methods', model: 'paymentMethod', orderBy: [{ name: 'asc' }] });
};

function registerNamedRoutes(
  app: Parameters<FastifyPluginAsync>[0],
  options: {
    path: string;
    model: ConfigModel;
    orderBy: unknown;
    include?: unknown;
  },
) {
  app.get(options.path, async () => {
    const records = await getModel(app.prisma, options.model).findMany({
      orderBy: options.orderBy,
      ...(options.include ? { include: options.include } : {}),
    });

    return { data: records };
  });

  app.post(options.path, async (request) => {
    await requireAdmin(request, configAdminMessage);
    const input = createNamedConfigSchema.parse(request.body);

    await ensureUniqueName(app.prisma, options.model, input.name);

    const record = await getModel(app.prisma, options.model).create({
      data: {
        name: input.name,
        description: input.description ?? null,
        isActive: input.isActive ?? true,
      },
    });

    return { data: record };
  });

  app.patch(`${options.path}/:id`, async (request) => {
    await requireAdmin(request, configAdminMessage);
    const params = idParamsSchema.parse(request.params);
    const input = updateNamedConfigSchema.parse(request.body);

    await ensureExists(app.prisma, options.model, params.id);

    if (input.name) {
      await ensureUniqueName(app.prisma, options.model, input.name, params.id);
    }

    const record = await getModel(app.prisma, options.model).update({
      where: { id: params.id },
      data: {
        ...input,
        description: input.description === undefined ? undefined : input.description,
      },
    });

    return { data: record };
  });
}

function getModel(prisma: PrismaClient, model: ConfigModel) {
  return prisma[model] as unknown as {
    create: (args: unknown) => Promise<unknown>;
    findFirst: (args: unknown) => Promise<{ id: string } | null>;
    findMany: (args: unknown) => Promise<unknown[]>;
    findUnique: (args: unknown) => Promise<{ id: string } | null>;
    update: (args: unknown) => Promise<unknown>;
  };
}

async function ensureExists(prisma: PrismaClient, model: ConfigModel, id: string) {
  const record = await getModel(prisma, model).findUnique({ where: { id } });

  if (!record) {
    throw new NotFoundError(`${modelLabels[model]} nao encontrado.`);
  }
}

async function ensureUniqueName(prisma: PrismaClient, model: ConfigModel, name: string, ignoreId?: string) {
  const existing = await getModel(prisma, model).findFirst({
    where: {
      name,
      ...(ignoreId ? { id: { not: ignoreId } } : {}),
    },
  });

  if (existing) {
    throw new ConflictError('Ja existe um registro com este nome.');
  }
}

async function ensureUniqueSizeName(prisma: PrismaClient, gridId: string, name: string, ignoreId?: string) {
  const existing = await prisma.size.findFirst({
    where: {
      gridId,
      name,
      ...(ignoreId ? { id: { not: ignoreId } } : {}),
    },
  });

  if (existing) {
    throw new ConflictError('Ja existe um tamanho com este nome nesta grade.');
  }
}

async function ensureUniqueColor(prisma: PrismaClient, name: string, slug: string | null, ignoreId?: string) {
  const existing = await prisma.color.findFirst({
    where: {
      OR: [{ name }, ...(slug ? [{ slug }] : [])],
      ...(ignoreId ? { id: { not: ignoreId } } : {}),
    },
  });

  if (existing) {
    throw new ConflictError('Ja existe uma cor com este nome ou identificador.');
  }
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
