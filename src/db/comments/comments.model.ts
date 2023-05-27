import mongoose from "mongoose";
import {CommentsDB} from "./types";
import {CommentsSchema} from "./comments.schema";

export const CommentsModelClass = mongoose.model<CommentsDB>("comments", CommentsSchema);
