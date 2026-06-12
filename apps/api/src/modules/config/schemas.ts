import { z } from 'zod';

const optionalDescription = z.string().trim().max(500).optional().nullable();

export const idParamsSchema = z.object({
  id: z.string().min(1),
});

export const sizeGridParamsSchema = z.object({
  gridId: z.string().min(1),
});

export const createNamedConfigSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: optionalDescription,
  isActive: z.boolean().optional(),
});

export const updateNamedConfigSchema = createNamedConfigSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'Informe ao menos um campo para atualizar.',
});

export const createColorSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120).optional().nullable(),
  isActive: z.boolean().optional(),
});

export const updateColorSchema = createColorSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'Informe ao menos um campo para atualizar.',
});

export const createSizeSchema = z.object({
  name: z.string().trim().min(1).max(40),
  sortOrder: z.number().int().min(0),
  isActive: z.boolean().optional(),
});

export const updateSizeSchema = createSizeSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: 'Informe ao menos um campo para atualizar.',
});
