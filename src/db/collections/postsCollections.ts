import {client} from "../index";
import {ObjectId, OptionalId} from "mongodb";

export type PostDB = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    _id: ObjectId
}

export const postsCollections = client.db().collection<OptionalId<PostDB>>("products");