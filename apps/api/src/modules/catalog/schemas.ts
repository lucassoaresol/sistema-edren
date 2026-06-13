import { z } from 'zod';

const collectionStatusSchema = z.enum(['ACTIVE', 'ARCHIVED']);
const optionalDescription = z.string().trim().max(1000).optional().nullable();
const dateSchema = z.coerce.date();
const moneySchema = z.union([z.string().trim().regex(/^\d+(\.\d{1,2})?$/), z.number().nonnegative()]);

export const idParamsSchema = z.object({
  id: z.string().min(1),
});

export const productParamsSchema = z.object({
  productId: z.string().min(1),
});

export const listProductsQuerySchema = z.object({
  categoryId: z.string().min(1).optional(),
  collectionId: z.string().min(1).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  search: z.string().trim().min(1).max(120).optional(),
});

const collectionSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: optionalDescription,
  endDate: dateSchema.optional().nullable(),
  startDate: dateSchema,
  status: collectionStatusSchema.optional(),
});

export const createCollectionSchema = collectionSchema.refine((value) => !value.endDate || value.endDate >= value.startDate, {
  message: 'A data de fim deve ser maior ou igual a data de início.',
  path: ['endDate'],
});

export const updateCollectionSchema = collectionSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Informe ao menos um campo para atualizar.',
  })
  .refine((value) => !value.startDate || !value.endDate || value.endDate >= value.startDate, {
    message: 'A data de fim deve ser maior ou igual a data de início.',
    path: ['endDate'],
  });

export const createProductSchema = z.object({
  categoryId: z.string().min(1),
  collectionId: z.string().min(1),
  cost: moneySchema.optional().nullable(),
  description: optionalDescription,
  isActive: z.boolean().optional(),
  name: z.string().trim().min(1).max(160),
  reference: z.string().trim().min(1).max(80),
  salePrice: moneySchema,
  sizeGridId: z.string().min(1),
});

export const updateProductSchema = createProductSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Informe ao menos um campo para atualizar.',
  });

export const createVariantSchema = z.object({
  colorId: z.string().min(1),
  isActive: z.boolean().optional(),
  sizeId: z.string().min(1),
});

export const updateVariantSchema = createVariantSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'Informe ao menos um campo para atualizar.',
});

export function toDecimalString(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return typeof value === 'number' ? value.toFixed(2) : value;
}

export function toRequiredDecimalString(value: string | number) {
  return typeof value === 'number' ? value.toFixed(2) : value;
}
