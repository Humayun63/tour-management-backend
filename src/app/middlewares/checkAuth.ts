import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../errorHelpers/AppError";
import httpStatus from 'http-status-codes';
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";

export const checkAuth = (...authRoles: string[]) => catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    if(!accessToken){
        throw new AppError(httpStatus.UNAUTHORIZED, "No Access Token Received");
    }

    const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

    const isUserExist = await User.findOne({email: verifiedToken.email});
    
    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
    };

    if(isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE){
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
    };

    if(isUserExist.isDeleted){
        throw new AppError(httpStatus.BAD_REQUEST, `User is deleted`);
    };
    
    if(!authRoles.includes(verifiedToken.role)){
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not permitted to view this route!");
    };

    req.token = verifiedToken;
    req.user = isUserExist;
    next();
});