import 'dotenv/config';
import {
  CollectionStatus,
  CustomerTypeCode,
  PrismaClient,
  UserProfileCode,
} from '@prisma/client';

const prisma = new PrismaClient();

const profiles = [
  {
    code: UserProfileCode.ADMIN,
    name: 'Administrador',
    description: 'Acesso total ao sistema.',
  },
  {
    code: UserProfileCode.MANAGER,
    name: 'Gerente',
    description: 'Acesso operacional e gerencial aos cadastros e relatórios.',
  },
  {
    code: UserProfileCode.SELLER_OPERATOR,
    name: 'Vendedor/Operador',
    description: 'Acesso para consultas, vendas, clientes e pagamentos.',
  },
];

const categories = ['Vestido', 'Blusa', 'Calça', 'Saia', 'Short', 'Macacão', 'Conjunto', 'Outros'];

const colors = [
  'Preto',
  'Branco',
  'Off White',
  'Azul',
  'Verde',
  'Vermelho',
  'Rosa',
  'Amarelo',
  'Bege',
  'Marrom',
  'Estampado',
  'Xadrez',
  'Outros',
];

const stockLocations = [
  { name: 'Casa EDREN' },
  { name: 'Fábrica' },
];

const salesChannels = [
  { name: 'Casa EDREN' },
  { name: 'WhatsApp' },
  { name: 'Instagram' },
  { name: 'Atacado' },
  { name: 'Sacoleira / Revendedora' },
  { name: 'Evento EDREN' },
];

const paymentMethods = ['Pix', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'Em aberto / contas a receber'];

const collections = [
  { name: 'Solar', status: CollectionStatus.ACTIVE },
  { name: 'Signature', status: CollectionStatus.ACTIVE },
  { name: 'Luar', status: CollectionStatus.ACTIVE },
  { name: 'Apaixonadas pelo Brasil', status: CollectionStatus.ACTIVE },
  { name: 'Avulsas / Sem coleção definida', status: CollectionStatus.ACTIVE },
];

const customerTypes = [
  {
    code: CustomerTypeCode.FINAL_CUSTOMER,
    name: 'Cliente final',
    description: 'Cliente de varejo da EDREN.',
  },
  {
    code: CustomerTypeCode.RESELLER,
    name: 'Sacoleira / Revendedora',
    description: 'Cliente que retira peças para revenda ou acerto posterior.',
  },
];

const stockMovementReasons = [
  'Estoque inicial',
  'Entrada de estoque',
  'Transferência entre locais',
  'Ajuste manual',
  'Envio para condicional',
  'Retorno de condicional',
  'Envio para sacoleira',
  'Retorno de sacoleira',
  'Cancelamento de venda',
];

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function seedProfiles() {
  for (const profile of profiles) {
    await prisma.userProfile.upsert({
      where: { code: profile.code },
      update: {
        name: profile.name,
        description: profile.description,
        isActive: true,
      },
      create: profile,
    });
  }
}

async function seedSizeGrid() {
  await prisma.sizeGrid.updateMany({
    where: { name: 'Grade Feminina P ao GG' },
    data: { name: 'Grade P ao GG' },
  });

  const grid = await prisma.sizeGrid.upsert({
    where: { name: 'Grade P ao GG' },
    update: {
      isActive: true,
    },
    create: {
      name: 'Grade P ao GG',
      description: 'Grade padrão inicial da EDREN.',
    },
  });

  for (const [index, size] of ['P', 'M', 'G', 'GG'].entries()) {
    await prisma.size.upsert({
      where: {
        gridId_name: {
          gridId: grid.id,
          name: size,
        },
      },
      update: {
        sortOrder: index + 1,
        isActive: true,
      },
      create: {
        gridId: grid.id,
        name: size,
        sortOrder: index + 1,
      },
    });
  }
}

async function seedNamedRecords() {
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: { isActive: true },
      create: { name },
    });
  }

  for (const name of colors) {
    await prisma.color.upsert({
      where: { name },
      update: { slug: slugify(name), isActive: true },
      create: { name, slug: slugify(name) },
    });
  }

  for (const location of stockLocations) {
    await prisma.stockLocation.upsert({
      where: { name: location.name },
      update: { isActive: true },
      create: { ...location, isActive: true },
    });
  }

  for (const channel of salesChannels) {
    await prisma.salesChannel.upsert({
      where: { name: channel.name },
      update: { isActive: true },
      create: { ...channel, isActive: true },
    });
  }

  for (const name of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { name },
      update: { isActive: true },
      create: { name },
    });
  }
}

async function seedCollections() {
  for (const collection of collections) {
    await prisma.collection.upsert({
      where: { name: collection.name },
      update: { status: collection.status },
      create: collection,
    });
  }
}

async function seedCustomerTypes() {
  for (const type of customerTypes) {
    await prisma.customerType.upsert({
      where: { code: type.code },
      update: {
        name: type.name,
        description: type.description,
        isActive: true,
      },
      create: type,
    });
  }

  const finalCustomer = await prisma.customerType.findUniqueOrThrow({
    where: { code: CustomerTypeCode.FINAL_CUSTOMER },
  });

  await prisma.customer.upsert({
    where: { whatsapp: 'cliente-balcao' },
    update: {
      name: 'Cliente Balcão',
      isCounter: true,
      isActive: true,
      typeId: finalCustomer.id,
    },
    create: {
      name: 'Cliente Balcão',
      whatsapp: 'cliente-balcao',
      isCounter: true,
      typeId: finalCustomer.id,
    },
  });
}

async function seedStockMovementReasons() {
  for (const name of stockMovementReasons) {
    await prisma.stockMovementReason.upsert({
      where: { name },
      update: { isActive: true },
      create: { name },
    });
  }
}

async function main() {
  await seedProfiles();
  await seedSizeGrid();
  await seedNamedRecords();
  await seedCollections();
  await seedCustomerTypes();
  await seedStockMovementReasons();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
