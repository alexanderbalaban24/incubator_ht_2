import {client} from "../index";
import {ObjectId, OptionalId} from "mongodb";

export type CommentsDB = {
    _id: ObjectId,
    postId: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}

export const commentsCollections = client.db().collection<OptionalId<CommentsDB>>("comments");
