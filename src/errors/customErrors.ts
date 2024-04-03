import { StatusCodes } from 'http-status-codes';

class BadRequest extends Error {
  public statusCode: number;
  public status:string;
  public code: string;
  public reason: string;

  constructor(message: string = 'Bad Request', status='error', code = 'BAD_REQUEST', reason = 'Bad Request') {
    super(message);
    this.status=status
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.code = code;
    this.reason = message;

  }
}

class NotFound extends Error {
  public statusCode: number;
  public status:string;
  public code: string;
  public reason: string;

  constructor(message: string = 'Not Found', code = 'NOT_FOUND',status = 'error', reason = 'Not Found') {
    super(message);
    this.status=status
    this.statusCode = StatusCodes.NOT_FOUND;
    this.code = code;
    this.reason = message;

  }
}

class Unauthenticated extends Error {
  public statusCode: number;
  public status:string;
  public code: string;
  public reason: string;

  constructor(message: string = 'Unauthorized', code = 'UNAUTHORIZED',status = 'error', reason = 'Unauthorized') {
    super(message);
    this.status=status
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.code = code;
    this.reason = message;

  }
}

class InternalServerError extends Error {
  public statusCode: number;
  public status:string;
  public code: string;
  public reason: string;

  constructor(message: string = 'Internal Server Error',status = 'error', code = 'INTERNAL_SERVER_ERROR', reason = 'Internal Server Error') {
    super(message);
    this.status=status
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    this.code = code;
    this.reason = message;

  }
}

class Conflict extends Error {
  public statusCode: number;
  public status:string;
  public code: string;
  public reason: string;

  constructor(message: string = 'Conflict', code = 'CONFLICT',status = 'error', reason = 'Conflict') {
    super(message);
    this.status=status
    this.statusCode = StatusCodes.CONFLICT;
    this.code = code;
    this.reason = message;

  }
}

export { Unauthenticated, InternalServerError, Conflict };
// Other error classes...

export { BadRequest, NotFound };
