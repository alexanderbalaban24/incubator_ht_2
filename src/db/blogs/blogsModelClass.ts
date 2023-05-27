import mongoose from "mongoose";
import {BlogDB} from "./types";
import {BlogsSchema} from "./blogs.schema";

export const BlogsModelClass = mongoose.model<BlogDB>("blogs", BlogsSchema);
