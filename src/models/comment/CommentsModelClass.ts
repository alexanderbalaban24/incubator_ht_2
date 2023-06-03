import mongoose, {Model} from "mongoose";
import {QueryCustomMethods} from "../../shared/types";
import {queryHelper} from "../../shared/helpers";

export type CommentsDB = {
    postId: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}

export const CommentsSchema = new mongoose.Schema<CommentsDB, Model<CommentsDB, QueryCustomMethods>, {}, QueryCustomMethods>({
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    }
}, {timestamps: true, query: queryHelper});

export const CommentsModelClass = mongoose.model<CommentsDB, Model<CommentsDB, QueryCustomMethods>>("comments", CommentsSchema);
