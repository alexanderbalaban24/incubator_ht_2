import {RequestEmpty, ResponseEmpty} from "../shared/types";
import {NextFunction} from "express";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {container} from "../inversify.config";
import {RateLimitServices} from "../application/rateLimit-services";

const rateLimitServices = container.resolve(RateLimitServices);

export const rateLimitMiddleware = async (req: RequestEmpty, res: ResponseEmpty, next: NextFunction) => {
    await rateLimitServices.addAttempt(req.ip, req.originalUrl);

    const attemptsCountResult = await rateLimitServices.getCountAttempts(req.ip, req.originalUrl);

    if (attemptsCountResult.payload!.count <= 5) {
        next();
    } else {
        res.sendStatus(HTTPResponseStatusCodes.TOO_MANY_REQUESTS);
    }
}