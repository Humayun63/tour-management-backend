import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status-codes'
import { AuthServices } from "./auth.services";
import AppError from "../../errorHelpers/AppError";
import { clearAuthCookie, setAuthCookies } from "../../utils/autCookies";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AuthServices.credentialsLogin(req.body);

    setAuthCookies(res, result);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        success: true,
        data: result,
    });
});

const getAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        throw new AppError(httpStatus.BAD_REQUEST, 'No Refresh token provided')
    }
    const result = await AuthServices.getAccessToken(refreshToken as string);

    setAuthCookies(res, result);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Access token generated successfully",
        success: true,
        data: result,
    });
});

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    clearAuthCookie(res);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "User logout successfully",
        success: true,
        data: null,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userInfo = req.user;
    const {oldPassword, newPassword} = req.body;
    
    await AuthServices.resetPassword(oldPassword, newPassword, userInfo);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: "Password changed successfully",
        success: true,
        data: null,
    });
});


export const AuthController = {
    credentialsLogin,
    getAccessToken,
    logout,
    resetPassword,
}