import {jwtServices} from "../application/jwt-services";
import {Request, Response, NextFunction} from "express";
import {HTTPResponseStatusCodes} from "../shared/enums";

export const jwtAuthAccess = (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers?.authorization) {
        res.sendStatus(HTTPResponseStatusCodes.UNAUTHORIZED);
        return;
    }

    const [type, token] = req.headers.authorization.split(" ");
    const userResult = jwtServices.checkCredentials(token);
    if (userResult.success && type === "Bearer") {
        req.userId = userResult.payload!.id;
        next()
    } else {
        res.sendStatus(HTTPResponseStatusCodes.UNAUTHORIZED);
    }
}

{

}