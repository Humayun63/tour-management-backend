import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const globalErrorHandler =  (error: any, req: Request, res: Response, next: NextFunction) => {

    const statusCode = 500;
    const message = `Something went wrong! ${error.message}`;

    res.status(statusCode).json({
        success: false,
        message: message,
        error,
        stack: 'development' === envVars.NODE_ENV ? error.stack : null
    })    
}