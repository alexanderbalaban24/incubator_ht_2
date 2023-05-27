import mongoose from "mongoose";
import {CommentsDB} from "./types";
import {WithId} from "mongodb";

export const CommentsSchema = new mongoose.Schema<WithId<CommentsDB>>({
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    }
}, {timestamps: true});