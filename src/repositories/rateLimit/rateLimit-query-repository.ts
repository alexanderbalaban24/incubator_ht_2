import {RateLimitModel} from "../../db";


export const rateLimitQueryRepository = {
    async getCountAttemptsByIPAndUrl(IP: string, URL: string, limitInterval: Date): Promise<number> {
        const attempts = await RateLimitModel.find({IP, URL, date: {$gte: limitInterval}}).exec();

        return attempts.length;
    }
}