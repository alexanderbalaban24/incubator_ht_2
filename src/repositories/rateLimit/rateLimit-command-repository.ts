import {AttemptType} from "../../application/rateLimit-services";
import {RateLimitModelClass} from "../../models/database/RateLimitModelClass";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";
import {injectable} from "inversify";

@injectable()
export class RateLimitCommandRepository {
    async addAttempt(newAttempt: AttemptType): Promise<ResultDTO<{ id: string }>> {
        const result = await new RateLimitModelClass(newAttempt).save();

        return new ResultDTO(InternalCode.Success, { id: result._id.toString() });
    }
}