import {ZodObject} from "zod";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express"


export const validateRequest = (zodSchema: ZodObject) => catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    await zodSchema.parseAsync(req.body);
    next();
}); 