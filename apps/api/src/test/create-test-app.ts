import { createApp } from '../app.js';

export async function createTestApp() {
  const app = await createApp();
  await app.ready();
  return app;
}
