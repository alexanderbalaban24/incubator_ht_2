import {NextFunction, Request, Response} from "express";
import {btoa} from "buffer";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1].trim();
    const tokenOrigin = btoa(`${process.env.LOGIN}:${process.env.PASS}`);
    if (token === tokenOrigin) {
        next();
    } else {
        res.sendStatus(401);
    }
}