import {NextFunction, Request, Response} from "express";
import {btoa} from "buffer";
import {settings} from "../shared/settings";
import {HTTPResponseStatusCodes} from "../shared/enums";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const type = req.header("Authorization")?.split(" ")[0].trim();
    const token = req.header("Authorization")?.split(" ")[1].trim();
    const tokenOrigin = Buffer.from(`${settings.admin_login}:${settings.admin_password}`).toString("base64");
    if (token === tokenOrigin && type === "Basic") {
        next();
    } else {
        res.sendStatus(HTTPResponseStatusCodes.UNAUTHORIZED);
    }
}