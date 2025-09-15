import AppError from "../../errorHelpers/AppError";
import { IUser, IUserDoc } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from 'bcryptjs';
import { generateAccessTokenWithRefreshToken, generateUserTokens } from "../../utils/userTokens";
import { hashedPassword } from "../../utils/hashedPassword";

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
    const tokens = await generateAccessTokenWithRefreshToken(accessToken);

    return {
        accessToken: tokens.accessToken,
    };
};

export const resetPassword = async (oldPassword: string, newPassword: string, userInfo: Partial<IUser>) => {
    const  user = await User.findById(userInfo._id) as IUserDoc;
    const isSamePassword = await bcryptjs.compare(oldPassword as string, user.password as string)
    
    if(!isSamePassword){
        throw new AppError(httpStatus.BAD_REQUEST, "Old password did not matched!")
    }

    user.password = await hashedPassword(newPassword);
    user.save();
};

export const AuthServices = {
    credentialsLogin,
    getAccessToken,
    resetPassword,
}