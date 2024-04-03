const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();
const { Unauthenticated } = require("../errors/customErrors");

import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

declare module 'express'{
  interface Request{
    decoded?:JwtPayload
  }
}


const auth = async (req:Request, res:Response, next:NextFunction) => {
  try {
    console.log("auth start");
    let token = null;
    //if token is being sent through headers
    const { authorization } = req.headers;
    const cookie_token = req.cookies.token
    if (authorization) {
      token = authorization.split(" ")[1];
    }
    //if token is being sent through cookies
    if (cookie_token) {
      token = cookie_token
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
  } catch (error:any) {
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
};

module.exports = auth;
