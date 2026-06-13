import type { PrismaClient } from '@edren/database';
import { removeProductImage, uploadProductImage } from '../../lib/cloudinary.js';
import { BadRequestError, BusinessRuleError } from '../../lib/errors.js';

type ProductImageFile = {
  filename: string;
  mimetype: string;
  toBuffer: () => Promise<Buffer>;
};

type ProductImageRemovalLogger = (input: { error: unknown; publicId: string }) => void;

export async function replaceMainProductImage(
  prisma: PrismaClient,
  productId: string,
  file: ProductImageFile | undefined,
  logPreviousRemovalError: ProductImageRemovalLogger,
) {
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

  const currentImage = await prisma.productImage.findFirst({
    where: { productId, isMain: true },
    select: { publicId: true },
  });

  const image = await prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId, isMain: true } });
    return tx.productImage.create({
      data: {
        isMain: true,
        productId,
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
      logPreviousRemovalError({ error, publicId: currentImage.publicId });
    }
  }

  return image;
}

export async function removeMainProductImage(prisma: PrismaClient, productId: string) {
  const currentImage = await prisma.productImage.findFirst({
    where: { productId, isMain: true },
    select: { publicId: true },
  });

  if (currentImage?.publicId) {
    await removeProductImage(currentImage.publicId);
  }

  await prisma.productImage.deleteMany({ where: { productId, isMain: true } });
}

function isAllowedImageType(mimetype: string) {
  return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mimetype);
}

function isFileTooLargeError(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'FST_REQ_FILE_TOO_LARGE';
}
