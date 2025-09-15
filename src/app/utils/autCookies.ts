import { Response } from "express";

export interface IAuthTokens {
    accessToken?: string;
    refreshToken?: string;
}
export const setAuthCookies = (res: Response, tokens: IAuthTokens) => {
    if(tokens.accessToken){
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: false,
        })
    }

    if(tokens.refreshToken){
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
        })
    }
};

export const clearAuthCookie = (res: Response) => {
    const cookieNames = ['accessToken', 'refreshToken'];

    cookieNames.forEach(item => {
        res.clearCookie(item, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        })
    })
};