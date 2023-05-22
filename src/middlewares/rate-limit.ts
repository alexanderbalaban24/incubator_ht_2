import {RequestEmpty, ResponseEmpty} from "../shared/types";
import {NextFunction} from "express";
import {rateLimitServices} from "../application/rateLimit-services";

export const rateLimitMiddleware = async (req: RequestEmpty, res: ResponseEmpty, next: NextFunction) => {
    await rateLimitServices.addAttempt(req.ip, req.baseUrl);

    const attemptsCount = await rateLimitServices.getCountAttempts(req.ip, req.baseUrl);

    if (attemptsCount <= 5) {
        next();
    } else {
        res.sendStatus(429);
    }
}