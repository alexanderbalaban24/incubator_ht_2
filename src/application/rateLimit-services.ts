import {rateLimitCommandRepository} from "../repositories/rateLimit/rateLimit-command-repository";
import add from "date-fns/add";
import {sub} from "date-fns";
import {rateLimitQueryRepository} from "../repositories/rateLimit/rateLimit-query-repository";

export type AttemptType = {
    IP: string
    URL: string
    date: Date
}

export const rateLimitServices = {
    async addAttempt(IP: string, URL: string): Promise<string> {
        const newAttempt: AttemptType = {
            IP,
            URL,
            date: new Date()
        }

        return await rateLimitCommandRepository.addAttempt(newAttempt);
    },
    async getCountAttempts(IP: string, URL: string): Promise<number> {
    const limitInterval = sub(new Date(), {
        seconds: 10
    });

    return await rateLimitQueryRepository.getCountAttemptsByIPAndUrl(IP, URL, limitInterval);
    }
}