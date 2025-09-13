import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        success: true,
        data: user
    });
});


const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Users retrieve Successfully",
        success: true,
        data: result.data,
        meta: result.meta,
    });
});

export const UserController = {
    createUser,
    getAllUsers
}