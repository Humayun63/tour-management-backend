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

export const getAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.headers.authorization;

    const result = await AuthServices.getAccessToken(refreshToken as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Access token generated successfully",
        success: true,
        data: result,
    });
});


export const AuthController = {
    credentialsLogin,
    getAccessToken,
}