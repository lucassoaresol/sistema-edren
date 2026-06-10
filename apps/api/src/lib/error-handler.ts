import { ZodError } from 'zod';
import type { FastifyInstance } from 'fastify';

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'ValidationError',
        message: 'Dados invalidos.',
        issues: error.issues,
      });
    }

    return reply.status(500).send({
      error: 'InternalServerError',
      message: 'Erro interno do servidor.',
    });
  });
}
