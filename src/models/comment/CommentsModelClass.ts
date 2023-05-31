import mongoose from "mongoose";
import {WithId} from "mongodb";

export type CommentsDB = {
    postId: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}

export const CommentsSchema = new mongoose.Schema<CommentsDB>({
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    }
}, {timestamps: true});

export const CommentsModelClass = mongoose.model<CommentsDB>("comments", CommentsSchema);
