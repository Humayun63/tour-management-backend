import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes"

export const generateUserTokens = async (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }

    const accessToken = await generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
    const refreshToken = await generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

    return {
        accessToken,
        refreshToken,
    }
};

export const generateAccessTokenWithRefreshToken = async (accessToken: string) => {
    const verifiedToken = verifyToken(accessToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

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

    const tokens = await generateUserTokens(isUserExist);

    return tokens;
}