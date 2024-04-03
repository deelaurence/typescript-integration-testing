"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = void 0;
const successResponse = (payload, statusCode, code) => {
    return {
        status: "success",
        statusCode,
        code,
        payload
    };
};
exports.successResponse = successResponse;
