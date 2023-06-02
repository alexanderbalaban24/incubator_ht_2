import {sub} from "date-fns";
import {RateLimitCommandRepository} from "../repositories/rateLimit/rateLimit-command-repository";
import {RateLimitQueryRepository} from "../repositories/rateLimit/rateLimit-query-repository";
import {ResultDTO} from "../shared/dto";
import {InternalCode} from "../shared/enums";

export type AttemptType = {
    IP: string
    URL: string
}

export class RateLimitServices {

    constructor(protected rateLimitCommandRepository: RateLimitCommandRepository, protected rateLimitQueryRepository: RateLimitQueryRepository) {}
    async addAttempt(IP: string, URL: string): Promise<ResultDTO<{ id: string }>> {
        const newAttempt: AttemptType = {
            IP,
            URL
        }

        const addedResult = await this.rateLimitCommandRepository.addAttempt(newAttempt);
        if (!addedResult.success) return new ResultDTO(InternalCode.Server_Error);

        return new ResultDTO(InternalCode.Success, { id: addedResult.payload!.id })
    }
    async getCountAttempts(IP: string, URL: string): Promise<ResultDTO<{ count: number }>> {
    const limitInterval = sub(new Date(), {
        seconds: 10
    });

    const countResult = await this.rateLimitQueryRepository.getCountAttemptsByIPAndUrl(IP, URL, limitInterval);
    if (!countResult.success) return new ResultDTO(InternalCode.Server_Error);

    return new ResultDTO(InternalCode.Success, { count: countResult.payload!.count });
    }
}