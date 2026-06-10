export type AppErrorCode =
  | 'BadRequestError'
  | 'UnauthorizedError'
  | 'ForbiddenError'
  | 'NotFoundError'
  | 'ConflictError'
  | 'BusinessRuleError';

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(code: AppErrorCode, message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = code;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Requisicao invalida.', details?: unknown) {
    super('BadRequestError', message, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Autenticacao obrigatoria.') {
    super('UnauthorizedError', message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acesso negado.') {
    super('ForbiddenError', message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Registro nao encontrado.') {
    super('NotFoundError', message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflito com dados existentes.', details?: unknown) {
    super('ConflictError', message, 409, details);
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string, details?: unknown) {
    super('BusinessRuleError', message, 422, details);
  }
}
