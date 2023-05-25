import {RequestEmpty, ResponseEmpty} from "../shared/types";
import {NextFunction} from "express";
import {rateLimitServices} from "../application/rateLimit-services";
import {HTTPResponseStatusCodes} from "../shared/enums";

export const rateLimitMiddleware = async (req: RequestEmpty, res: ResponseEmpty, next: NextFunction) => {
    await rateLimitServices.addAttempt(req.ip, req.originalUrl);

    const attemptsCount = await rateLimitServices.getCountAttempts(req.ip, req.originalUrl);

    if (attemptsCount <= 5) {
        next();
    } else {
        res.sendStatus(HTTPResponseStatusCodes.TOO_MANY_REQUESTS);
    }
}