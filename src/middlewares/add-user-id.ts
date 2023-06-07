import {NextFunction, Request, Response} from "express";
import {jwtServices} from "../application/jwt-services";

export const addUserId = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers?.authorization) {
        req.userId = null;
        next();
        return;
    }

    const [type, token] = req.headers.authorization.split(" ");
    const userResult = jwtServices.decodeToken(token)
    if (userResult.success && type === "Bearer") {
        req.userId = userResult.payload!.userId;
        next();
        return;
    } else {
        req.userId = null;
        next();
        return;
    }

}