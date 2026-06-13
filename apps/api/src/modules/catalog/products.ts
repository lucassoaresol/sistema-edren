import type { PrismaClient } from '@edren/database';
import { BusinessRuleError, ConflictError, NotFoundError } from '../../lib/errors.js';
import { isCurrentCollection } from './collections.js';

export async function ensureProductReferenceIsUnique(prisma: PrismaClient, reference: string, ignoreId?: string) {
  const existing = await prisma.product.findFirst({
    where: { reference, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
  });

  if (existing) {
    throw new ConflictError('Ja existe um produto com esta referencia.');
  }
}

export async function ensureProductRelations(
  prisma: PrismaClient,
  collectionId: string,
  categoryId: string,
  sizeGridId: string,
  requireCurrentCollection = true,
) {
  const [collection, category, sizeGrid] = await Promise.all([
    prisma.collection.findUnique({ where: { id: collectionId } }),
    prisma.category.findUnique({ where: { id: categoryId } }),
    prisma.sizeGrid.findUnique({ where: { id: sizeGridId } }),
  ]);

  if (!collection) {
    throw new NotFoundError('Colecao nao encontrada.');
  }

  if (requireCurrentCollection && !isCurrentCollection(collection)) {
    throw new BusinessRuleError('A colecao selecionada nao esta vigente.');
  }

  if (!category) {
    throw new NotFoundError('Categoria nao encontrada.');
  }

  if (!sizeGrid) {
    throw new NotFoundError('Grade de tamanho nao encontrada.');
  }
}

export function ensureProductSizeGridCanChange(sizeGridChanged: boolean, hasVariants: boolean) {
  if (sizeGridChanged && hasVariants) {
    throw new BusinessRuleError('Nao e possivel trocar a grade de um produto que ja possui SKUs.');
  }
}
