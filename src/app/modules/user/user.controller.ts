import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)

    res.status(httpStatus.CREATED).json({
        success: true,
        message: "User Created Successfully",
        user
    })
});


const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.getAllUsers();

    res.status(httpStatus.OK).json({
        success: true,
        message: "Users retrieve Successfully",
        user
    })
});

export const UserController = {
    createUser,
    getAllUsers
}