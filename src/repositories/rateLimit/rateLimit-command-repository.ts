import {AttemptType} from "../../application/rateLimit-services";
import {RateLimitModelClass} from "../../models/rateLimit/RateLimitModelClass";


export class RateLimitCommandRepository {
    async addAttempt(newAttempt: AttemptType): Promise<string> {
        const result = await new RateLimitModelClass(newAttempt).save();

        return result._id.toString();
    }
}