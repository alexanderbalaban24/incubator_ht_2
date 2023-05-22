import {client} from "../index";
import {ObjectId, OptionalId} from "mongodb";

export type RateLimitType = {
    _id: ObjectId
    IP: string
    URL: string
    date: Date
}

export const rateLimitCollections = client.db().collection<OptionalId<RateLimitType>>("rateLimit")