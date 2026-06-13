import { UserProfileCode, type Prisma } from '@edren/database';

type CurrentUser = {
  profile: {
    code: UserProfileCode;
  };
};

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: { orderBy: [{ isMain: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }] };
    variants: true;
  };
}>;

export function serializeProduct(product: ProductWithRelations, user: CurrentUser) {
  const mainImage = product.images.find((image) => image.isMain) ?? null;
  const serialized = {
    ...product,
    cost: user.profile.code === UserProfileCode.ADMIN ? product.cost?.toFixed(2) ?? null : undefined,
    images: product.images,
    mainImage,
    salePrice: product.salePrice.toFixed(2),
    variantsCount: product.variants.length,
  };

  if (user.profile.code !== UserProfileCode.ADMIN) {
    delete serialized.cost;
  }

  return serialized;
}
