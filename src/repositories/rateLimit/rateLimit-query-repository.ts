import {RateLimitModelClass} from "../../models/database/RateLimitModelClass";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";


export class RateLimitQueryRepository {
    async getCountAttemptsByIPAndUrl(IP: string, URL: string, limitInterval: Date): Promise<ResultDTO<{ count: number }>> {
        const count = await RateLimitModelClass.find({IP, URL, date: {$gte: limitInterval}}).count();

        return new ResultDTO(InternalCode.Success, {count});
    }
}