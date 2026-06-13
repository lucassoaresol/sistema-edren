import type { PrismaClient } from '@edren/database';
import { BusinessRuleError, ConflictError, NotFoundError } from '../../lib/errors.js';

export async function ensureVariantRelations(prisma: PrismaClient, productSizeGridId: string, colorId: string, sizeId: string) {
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

export async function ensureUniqueVariant(
  prisma: PrismaClient,
  productId: string,
  colorId: string,
  sizeId: string,
  ignoreId?: string,
) {
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
