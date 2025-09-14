import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import { AuthServices } from "./auth.services";

export const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthServices.credentialsLogin(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        success: true,
        data: result,
    });
});

export const AuthController = {
    credentialsLogin
}