import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from 'bcryptjs';
import { Debugger } from "../../utils/debugger";

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

    return {
        email: isUserExist.email
    }

};

export const AuthServices = {
    credentialsLogin
}