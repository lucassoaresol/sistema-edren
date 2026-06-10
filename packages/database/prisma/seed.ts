import 'dotenv/config';
import { ConfigStatus, PrismaClient, UserProfileCode } from '@prisma/client';

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
    description: 'Acesso operacional e gerencial aos cadastros e relatorios.',
  },
  {
    code: UserProfileCode.SELLER_OPERATOR,
    name: 'Vendedor/Operador',
    description: 'Acesso para consultas, vendas, clientes e pagamentos.',
  },
];

const categories = ['Vestido', 'Blusa', 'Calca', 'Saia', 'Short', 'Macacao', 'Conjunto', 'Outros'];

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
  { name: 'Casa EDREN', status: ConfigStatus.ACTIVE },
  { name: 'Fabrica', status: ConfigStatus.ACTIVE },
  { name: 'Nova Loja', status: ConfigStatus.FUTURE },
];

const salesChannels = [
  { name: 'Casa EDREN', status: ConfigStatus.ACTIVE },
  { name: 'WhatsApp', status: ConfigStatus.ACTIVE },
  { name: 'Instagram', status: ConfigStatus.ACTIVE },
  { name: 'Atacado', status: ConfigStatus.ACTIVE },
  { name: 'Sacoleira / Revendedora', status: ConfigStatus.ACTIVE },
  { name: 'Nova loja', status: ConfigStatus.FUTURE },
  { name: 'Evento EDREN', status: ConfigStatus.ACTIVE },
];

const paymentMethods = ['Pix', 'Dinheiro', 'Cartao de credito', 'Cartao de debito', 'Em aberto / contas a receber'];

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
  const grid = await prisma.sizeGrid.upsert({
    where: { name: 'Grade Feminina P ao GG' },
    update: {
      isActive: true,
    },
    create: {
      name: 'Grade Feminina P ao GG',
      description: 'Grade padrao inicial da EDREN.',
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
      update: { status: location.status },
      create: location,
    });
  }

  for (const channel of salesChannels) {
    await prisma.salesChannel.upsert({
      where: { name: channel.name },
      update: { status: channel.status },
      create: channel,
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

async function main() {
  await seedProfiles();
  await seedSizeGrid();
  await seedNamedRecords();
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
