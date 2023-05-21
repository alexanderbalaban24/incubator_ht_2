import {NextFunction, Request, Response} from "express";
import {jwtServices} from "../application/jwt-services";

export const jwtAuthRefresh = (req: Request, res: Response, next: NextFunction) => {
    if(!req.cookies.refreshToken) {
        res.sendStatus(401);
        return;
    }

    const refreshToken = req.cookies.refreshToken;

    const result = jwtServices.checkCredentials(refreshToken);
    if (result && result.userId) {
        req.userId = result.userId;
        next();
    } else {
        res.sendStatus(401);
    }
}