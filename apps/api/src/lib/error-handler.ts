import { ZodError } from 'zod';
import type { FastifyInstance } from 'fastify';
import { AppError } from './errors.js';

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'ValidationError',
        message: 'Dados invalidos.',
        issues: error.issues,
        requestId: request.id,
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.code,
        message: error.message,
        details: error.details,
        requestId: request.id,
      });
    }

    return reply.status(500).send({
      error: 'InternalServerError',
      message: 'Erro interno do servidor.',
      requestId: request.id,
    });
  });
}
