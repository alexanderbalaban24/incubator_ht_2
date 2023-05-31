import {RateLimitModelClass} from "../../models/rateLimit/RateLimitModelClass";


export class RateLimitQueryRepository {
    async getCountAttemptsByIPAndUrl(IP: string, URL: string, limitInterval: Date): Promise<number> {
        return RateLimitModelClass.find({IP, URL, date: {$gte: limitInterval}}).count();
    }
}