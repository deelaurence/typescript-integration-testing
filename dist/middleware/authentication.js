"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const { Unauthenticated } = require("../errors/customErrors");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("auth start");
        let token = null;
        //if token is being sent through headers
        const { authorization } = req.headers;
        const cookie_token = req.cookies.token;
        if (authorization) {
            token = authorization.split(" ")[1];
        }
        //if token is being sent through cookies
        if (cookie_token) {
            token = cookie_token;
        }
        //if token is neither in the cookies nor the headers
        if (!token) {
            throw new Unauthenticated("supply token");
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.decoded = { name: payload.name, id: payload.id };
        // req.token = token || iosToken;
        console.log("auth end, next");
        next();
    }
    catch (error) {
        console.log("auth error:" + error);
        const { message, statusCode } = error;
        console.log(statusCode, message);
        if (statusCode) {
            res.status(statusCode).json({ message });
            console.log(statusCode, message);
            return;
        }
        res.status(StatusCodes.UNAUTHORIZED).json({ error: message });
        console.log(message);
    }
});
module.exports = auth;
