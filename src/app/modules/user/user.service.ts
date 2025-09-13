import { Debugger } from "../../utils/debugger";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
    try {
        const {name, email} = payload;

        const user = await User.create({
            name, 
            email
        });

        return user;
    } catch(error){
        Debugger.error(error);
    }
};

const getAllUsers = async () => {
    const user = await User.find({});

    return user;
}

export const UserServices = {
    createUser,
    getAllUsers,
}