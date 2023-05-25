import mongoose from "mongoose";
import {PostDB} from "./types";
import {PostsSchema} from "./posts.schema";

export const PostsModel = mongoose.model<PostDB>("posts", PostsSchema);