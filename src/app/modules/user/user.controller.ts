import { Request, Response } from "express";
import { Debugger } from "../../utils/debugger";
import httpStatus from "http-status-codes";
import { User } from "./user.model";

const createUser = async (req: Request, res: Response) => {
    try{
        const {name, email} = req.body;

        const user = await User.create({
            name,
            email
        });

        res.status(httpStatus.CREATED).json({
            message: "User Created Successfully",
            user
        })
    } catch(error) {
        Debugger.error(error);

        res.status(httpStatus.BAD_REQUEST).json({
            message: `Something went wrong!`,
            error: error
        });
    }
};

export const UserController = {
    createUser,
}