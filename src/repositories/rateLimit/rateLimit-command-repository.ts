import {AttemptType} from "../../application/rateLimit-services";
import {rateLimitCollections} from "../../db/collections/rateLimitCollections";


export const rateLimitCommandRepository = {
    async addAttempt(newAttempt: AttemptType): Promise<string> {
        const result = await rateLimitCollections.insertOne(newAttempt);

        return result.insertedId.toString();
    }
}