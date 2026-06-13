import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { BusinessRuleError } from './errors.js';

type CloudinaryUploadResult = {
  publicId: string;
  url: string;
};

type ProductImageUploader = (input: { buffer: Buffer; filename: string }) => Promise<CloudinaryUploadResult>;
type ProductImageRemover = (publicId: string) => Promise<void>;

let testUploader: ProductImageUploader | null = null;
let testRemover: ProductImageRemover | null = null;
let forceMissingConfigForTest = false;

export async function uploadProductImage(input: { buffer: Buffer; filename: string }) {
  if (testUploader) {
    return testUploader(input);
  }

  ensureCloudinaryConfigured();

  cloudinary.config({
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
  });

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'edren/products',
        resource_type: 'image',
        use_filename: true,
        unique_filename: true,
        filename_override: input.filename,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url || !result.public_id) {
          reject(new Error('Cloudinary retornou uma resposta invalida.'));
          return;
        }

        resolve({ publicId: result.public_id, url: result.secure_url });
      },
    );

    stream.end(input.buffer);
  });
}

export function setProductImageUploaderForTest(uploader: ProductImageUploader | null) {
  if (env.NODE_ENV !== 'test') {
    throw new Error('Uploader de teste so pode ser configurado em ambiente de teste.');
  }

  testUploader = uploader;
}

export async function removeProductImage(publicId: string) {
  if (testRemover) {
    await testRemover(publicId);
    return;
  }

  ensureCloudinaryConfigured();

  cloudinary.config({
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
  });

  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}

export function setProductImageRemoverForTest(remover: ProductImageRemover | null) {
  if (env.NODE_ENV !== 'test') {
    throw new Error('Remover de teste so pode ser configurado em ambiente de teste.');
  }

  testRemover = remover;
}

export function forceMissingCloudinaryConfigForTest(value: boolean) {
  if (env.NODE_ENV !== 'test') {
    throw new Error('Config de teste so pode ser alterada em ambiente de teste.');
  }

  forceMissingConfigForTest = value;
}

function ensureCloudinaryConfigured() {
  if (forceMissingConfigForTest) {
    throw new BusinessRuleError('Upload de imagem indisponivel: Cloudinary nao configurado.');
  }

  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new BusinessRuleError('Upload de imagem indisponivel: Cloudinary nao configurado.');
  }
}
