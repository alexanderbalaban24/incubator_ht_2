import {sub} from "date-fns";
import {RateLimitCommandRepository} from "../repositories/rateLimit/rateLimit-command-repository";
import {RateLimitQueryRepository} from "../repositories/rateLimit/rateLimit-query-repository";

export type AttemptType = {
    IP: string
    URL: string
}

export class RateLimitServices {

    constructor(protected rateLimitCommandRepository: RateLimitCommandRepository, protected rateLimitQueryRepository: RateLimitQueryRepository) {}
    async addAttempt(IP: string, URL: string): Promise<string> {
        const newAttempt: AttemptType = {
            IP,
            URL
        }

        return await this.rateLimitCommandRepository.addAttempt(newAttempt);
    }
    async getCountAttempts(IP: string, URL: string): Promise<number> {
    const limitInterval = sub(new Date(), {
        seconds: 10
    });

    return await this.rateLimitQueryRepository.getCountAttemptsByIPAndUrl(IP, URL, limitInterval);
    }
}