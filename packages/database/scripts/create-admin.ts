import path from 'node:path';
import process from 'node:process';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import { PrismaClient, UserProfileCode } from '@prisma/client';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const prisma = new PrismaClient();

function validatePassword(password: string) {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push('ter pelo menos 12 caracteres');
  }

  if (!/[A-Za-z]/.test(password)) {
    errors.push('ter pelo menos uma letra');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('ter pelo menos um numero');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('ter pelo menos um simbolo');
  }

  return errors;
}

async function questionHidden(prompt: string) {
  const stdin = process.stdin;
  const stdout = process.stdout;

  return new Promise<string>((resolve) => {
    const onData = (char: Buffer) => {
      const value = char.toString('utf8');

      if (value === '\n' || value === '\r' || value === '\r\n') {
        stdin.off('data', onData);
        stdin.setRawMode(false);
        stdout.write('\n');
        resolve(buffer);
        return;
      }

      if (value === '\u0003') {
        stdout.write('\n');
        process.exit(1);
      }

      if (value === '\u007f') {
        buffer = buffer.slice(0, -1);
        return;
      }

      buffer += value;
    };

    let buffer = '';

    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on('data', onData);
  });
}

async function main() {
  if (!process.stdin.isTTY) {
    throw new Error('Este script precisa ser executado em um terminal interativo.');
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL nao encontrada. Verifique o .env da raiz do projeto.');
  }

  const adminProfile = await prisma.userProfile.findUnique({
    where: { code: UserProfileCode.ADMIN },
  });

  if (!adminProfile) {
    throw new Error('Perfil Administrador nao encontrado. Rode npm run db:seed antes.');
  }

  const activeAdminCount = await prisma.user.count({
    where: {
      isActive: true,
      profileId: adminProfile.id,
    },
  });

  if (activeAdminCount > 0) {
    console.error('Ja existe administrador ativo. Este script cria apenas o primeiro administrador.');
    console.error('Para trocar senha futuramente, crie um script especifico de reset com confirmacao explicita.');
    process.exit(1);
  }

  const rl = createInterface({ input, output });

  const name = (await rl.question('Nome do administrador: ')).trim();
  const username = (await rl.question('Usuario de login: ')).trim().toLowerCase();
  rl.close();

  if (!name) {
    throw new Error('Nome e obrigatorio.');
  }

  if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
    throw new Error('Usuario deve ter 3 a 32 caracteres e usar apenas letras minusculas, numeros, ponto, hifen ou underline.');
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new Error('Ja existe usuario com esse login.');
  }

  console.log('Nao existe senha padrao. Defina uma senha forte para este administrador.');
  console.log('A senha precisa ter pelo menos 12 caracteres, uma letra, um numero e um simbolo.');

  const password = await questionHidden('Senha: ');
  const passwordConfirmation = await questionHidden('Confirmar senha: ');

  if (password !== passwordConfirmation) {
    throw new Error('As senhas nao conferem.');
  }

  const passwordErrors = validatePassword(password);

  if (passwordErrors.length > 0) {
    throw new Error(`Senha invalida. A senha precisa ${passwordErrors.join(', ')}.`);
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  await prisma.user.create({
    data: {
      name,
      username,
      passwordHash,
      profileId: adminProfile.id,
    },
  });

  console.log('Administrador criado com sucesso.');
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
