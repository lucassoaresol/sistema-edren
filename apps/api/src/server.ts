import { serverConfig } from '@edren/config';
import { createApp } from './app.js';

const app = createApp();

try {
  await app.listen({
    host: serverConfig.host,
    port: serverConfig.port,
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
