import mongoose from "mongoose";
import {PostDB} from "./types";
import {PostsSchema} from "./posts.schema";

export const PostsModelClass = mongoose.model<PostDB>("posts", PostsSchema);