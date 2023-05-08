import {client} from "../index";
import {ObjectId, OptionalId} from "mongodb";

export type BlogDB = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
    _id: ObjectId
}

export const blogsCollections = client.db().collection<OptionalId<BlogDB>>("blogs");