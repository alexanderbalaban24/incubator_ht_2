import {NextFunction, Request, Response} from "express";
import {btoa} from "buffer";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const type = req.header("Authorization")?.split(" ")[0].trim();
    const token = req.header("Authorization")?.split(" ")[1].trim();
    const tokenOrigin = Buffer.from(`${process.env.LOGIN || "admin"}:${process.env.PASS || "qwerty"}`).toString("base64");
    if (token === tokenOrigin && type === "Basic") {
        next();
    } else {
        res.sendStatus(401);
    }
}