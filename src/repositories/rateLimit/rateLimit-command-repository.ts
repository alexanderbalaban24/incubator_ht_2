import {AttemptType} from "../../application/rateLimit-services";
import {RateLimitModel} from "../../db";


export const rateLimitCommandRepository = {
    async addAttempt(newAttempt: AttemptType): Promise<string> {
        const result = await new RateLimitModel(newAttempt).save();

        return result._id.toString();
    }
}