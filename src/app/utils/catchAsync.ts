import { NextFunction, Request, Response } from "express";
import { Debugger } from "./debugger";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(error => {
        Debugger.error(error);
        next(error);
    })
}
