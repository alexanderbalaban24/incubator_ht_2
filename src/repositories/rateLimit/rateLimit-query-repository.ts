import {RateLimitModelClass} from "../../db";


export const rateLimitQueryRepository = {
    async getCountAttemptsByIPAndUrl(IP: string, URL: string, limitInterval: Date): Promise<number> {
        return RateLimitModelClass.find({IP, URL, date: {$gte: limitInterval}}).count();
    }
}