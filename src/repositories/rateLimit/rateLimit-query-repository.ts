import {rateLimitCollections} from "../../db/collections/rateLimitCollections";
import {AttemptType} from "../../application/rateLimit-services";

export const rateLimitQueryRepository = {
    async getCountAttemptsByIPAndUrl(IP: string, URL: string, limitInterval: Date): Promise<number> {
        const attempts = await rateLimitCollections.find({IP, URL, date: {$gte: limitInterval}}).toArray();

        return attempts.length;
    }
}