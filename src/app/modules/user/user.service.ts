import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser, Providers, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import { hashedPassword } from "../../utils/hashedPassword";
import { JwtPayload } from "jsonwebtoken";

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

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const isUserExist = await User.findById(userId);
    
    if(!isUserExist){
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found!")
    }

    const permittedRoles = [Role.ADMIN, Role.SUPER_ADMIN];
    
    if(payload.role){
        if(!permittedRoles.includes(decodedToken.role)){
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!")
        }

        if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!")
        }
    }

    if(payload.isActive || payload.isDeleted || payload.isVerified){
        if(!permittedRoles.includes(decodedToken.role)){
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!")
        }
    }

    if(payload.password){
        payload.password = await hashedPassword(payload.password);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, payload, {new: true, runValidation: true});

    return updatedUser;
}

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
    updateUser,
    getAllUsers,
}