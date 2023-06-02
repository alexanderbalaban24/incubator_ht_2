import {AttemptType} from "../../application/rateLimit-services";
import {RateLimitModelClass} from "../../models/rateLimit/RateLimitModelClass";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";


export class RateLimitCommandRepository {
    async addAttempt(newAttempt: AttemptType): Promise<ResultDTO<{ id: string }>> {
        const result = await new RateLimitModelClass(newAttempt).save();

        return new ResultDTO(InternalCode.Success, { id: result._id.toString() });
    }
}