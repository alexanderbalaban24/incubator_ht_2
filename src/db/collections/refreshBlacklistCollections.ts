import {client} from "../index";
import {ObjectId, OptionalId} from "mongodb";

export type RefreshBlacklistDB = {
    _id: ObjectId,
    refreshToken: string
}


export const refreshBlacklistCollections = client.db().collection<OptionalId<RefreshBlacklistDB>>("refreshBlacklist")