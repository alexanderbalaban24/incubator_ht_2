import {jwtServices} from "../application/jwt-services";
import {Request, Response, NextFunction} from "express";

export const jwtAuthAccess = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const [type, token] = req.headers.authorization.split(" ");

    const result = jwtServices.checkCredentials(token);
    if (result && result.userId && type === "Bearer") {
        req.userId = result.userId;
        next()
    } else {
        res.sendStatus(401);
    }
}