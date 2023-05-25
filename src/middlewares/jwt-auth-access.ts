import {jwtServices} from "../application/jwt-services";
import {Request, Response, NextFunction} from "express";
import {HTTPResponseStatusCodes} from "../shared/enums";

export const jwtAuthAccess = (req: Request, res: Response, next: NextFunction) => {

    console.log(req.headers)
    if (!req.headers?.authorization) {
        res.sendStatus(HTTPResponseStatusCodes.UNAUTHORIZED);
        return;
    }

    const [type, token] = req.headers.authorization.split(" ");
    const userId = jwtServices.checkCredentials(token);
    if (userId && type === "Bearer") {
        req.userId = userId;
        next()
    } else {
        res.sendStatus(HTTPResponseStatusCodes.UNAUTHORIZED);
    }
}

{

}