import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Providers } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import { hashedPassword } from "../../utils/hashedPassword";

const createUser = async (payload: Partial<IUser>) => {
    const {email, password, ...rest} = payload;

    const isUserExist = await User.findOne({email});

    if(isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
    };

    const authProvider: IAuthProvider = {
        provider: Providers.CREDENTIALS,
        providerId: email as string
    }

    const encryptedPassword = await hashedPassword(password as string);
    
    const user = await User.create({
        email,
        auths: [authProvider],
        password: encryptedPassword,
        ...rest
    });

    return user;
};

const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
}

export const UserServices = {
    createUser,
    getAllUsers,
}