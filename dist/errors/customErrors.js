"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFound = exports.BadRequest = exports.Conflict = exports.InternalServerError = exports.Unauthenticated = void 0;
const http_status_codes_1 = require("http-status-codes");
class BadRequest extends Error {
    constructor(message = 'Bad Request', status = 'error', code = 'BAD_REQUEST', reason = 'Bad Request') {
        super(message);
        this.status = status;
        this.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
        this.code = code;
        this.reason = message;
    }
}
exports.BadRequest = BadRequest;
class NotFound extends Error {
    constructor(message = 'Not Found', code = 'NOT_FOUND', status = 'error', reason = 'Not Found') {
        super(message);
        this.status = status;
        this.statusCode = http_status_codes_1.StatusCodes.NOT_FOUND;
        this.code = code;
        this.reason = message;
    }
}
exports.NotFound = NotFound;
class Unauthenticated extends Error {
    constructor(message = 'Unauthorized', code = 'UNAUTHORIZED', status = 'error', reason = 'Unauthorized') {
        super(message);
        this.status = status;
        this.statusCode = http_status_codes_1.StatusCodes.UNAUTHORIZED;
        this.code = code;
        this.reason = message;
    }
}
exports.Unauthenticated = Unauthenticated;
class InternalServerError extends Error {
    constructor(message = 'Internal Server Error', status = 'error', code = 'INTERNAL_SERVER_ERROR', reason = 'Internal Server Error') {
        super(message);
        this.status = status;
        this.statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
        this.code = code;
        this.reason = message;
    }
}
exports.InternalServerError = InternalServerError;
class Conflict extends Error {
    constructor(message = 'Conflict', code = 'CONFLICT', status = 'error', reason = 'Conflict') {
        super(message);
        this.status = status;
        this.statusCode = http_status_codes_1.StatusCodes.CONFLICT;
        this.code = code;
        this.reason = message;
    }
}
exports.Conflict = Conflict;
