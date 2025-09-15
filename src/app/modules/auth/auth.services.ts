import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from 'bcryptjs';
import { generateUserTokens } from "../../utils/tokens";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

export const credentialsLogin = async (payload: Partial<IUser>) => {
    const {email, password, ...rest} = payload;

    const isUserExist = await User.findOne({email});

    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
    };

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string);

    if(!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password/Email");
    }

    const tokens = await generateUserTokens(isUserExist);

    const {password: pass, ...others} = isUserExist.toObject();

    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {...others}
    }

};

export const getAccessToken = async (accessToken: string) => {
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

    return {
        accessToken: tokens.accessToken,
    };
};

export const AuthServices = {
    credentialsLogin,
    getAccessToken,
}