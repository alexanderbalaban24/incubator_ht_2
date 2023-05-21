import {jwtServices} from "../application/jwt-services";
import {Request, Response, NextFunction} from "express";

export const jwtAuthAccess = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const [type, token] = req.headers.authorization.split(" ");

    const userId = jwtServices.checkCredentials(token);
    if (userId && type === "Bearer") {
        req.userId = userId;
        next()
    } else {
        res.sendStatus(401);
    }
}