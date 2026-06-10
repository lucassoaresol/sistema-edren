const defaultPort = 3001;

function readPort(value: string | undefined) {
  if (!value) {
    return defaultPort;
  }

  const port = Number.parseInt(value, 10);

  if (Number.isNaN(port)) {
    return defaultPort;
  }

  return port;
}

export const serverConfig = {
  host: process.env.HOST ?? '127.0.0.1',
  port: readPort(process.env.PORT),
};
