import { createApp } from './app.js';
import { env } from './lib/env.js';

const app = await createApp();

function shutdown(signal: NodeJS.Signals) {
  app.log.info({ signal }, 'Shutting down API server');

  app.close().catch((error) => {
    app.log.error(error, 'Error during API server shutdown');
    process.exit(1);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

try {
  await app.listen({
    host: env.HOST,
    port: env.PORT,
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
