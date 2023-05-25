import {NextFunction, Request, Response} from "express";
import {jwtServices} from "../application/jwt-services";
import {HTTPResponseStatusCodes} from "../shared/enums";

export const jwtAuthRefresh = (req: Request, res: Response, next: NextFunction) => {
    if(!req.cookies.refreshToken) {
        res.sendStatus(HTTPResponseStatusCodes.UNAUTHORIZED);
        return;
    }

    const refreshToken = req.cookies.refreshToken;

    const userId = jwtServices.checkCredentials(refreshToken);
    if (userId) {
        req.userId = userId;
        next();
    } else {
        res.sendStatus(HTTPResponseStatusCodes.UNAUTHORIZED);
    }
}