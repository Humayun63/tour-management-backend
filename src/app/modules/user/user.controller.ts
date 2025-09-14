import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        success: true,
        data: user
    });
});

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const token = req.headers.authorization;
    const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload;
    const user = await UserServices.updateUser(userId, req.body, verifiedToken);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
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
    updateUser,
    getAllUsers,
}