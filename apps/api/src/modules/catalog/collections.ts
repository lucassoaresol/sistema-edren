import type { PrismaClient } from '@edren/database';
import { BusinessRuleError, ConflictError, NotFoundError } from '../../lib/errors.js';

type CollectionDateRange = {
  endDate: Date | null;
  startDate: Date;
};

type CollectionStatus = CollectionDateRange & {
  status: string;
};

export async function ensureCollectionExists(prisma: PrismaClient, id: string) {
  const collection = await prisma.collection.findUnique({ where: { id } });

  if (!collection) {
    throw new NotFoundError('Colecao nao encontrada.');
  }

  return collection;
}

export async function ensureUniqueCollectionName(prisma: PrismaClient, name: string, ignoreId?: string) {
  const existing = await prisma.collection.findFirst({
    where: { name, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
  });

  if (existing) {
    throw new ConflictError('Ja existe uma colecao com este nome.');
  }
}

export function ensureCollectionDateRange(collection: CollectionDateRange) {
  if (collection.endDate && collection.endDate < collection.startDate) {
    throw new BusinessRuleError('A data de fim deve ser maior ou igual a data de inicio.');
  }
}

export function isCurrentCollection(collection: CollectionStatus) {
  const now = new Date();
  const endDate = collection.endDate ? endOfDay(collection.endDate) : null;
  return collection.status === 'ACTIVE' && collection.startDate <= now && (!endDate || endDate >= now);
}

function endOfDay(date: Date) {
  const value = new Date(date);
  value.setUTCHours(23, 59, 59, 999);
  return value;
}
