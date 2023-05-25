import mongoose from "mongoose";
import {CommentsDB} from "./types";
import {CommentsSchema} from "./comments.schema";

export const CommentsModel = mongoose.model<CommentsDB>("comments", CommentsSchema);
