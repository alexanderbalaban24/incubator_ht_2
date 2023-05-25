import mongoose from "mongoose";
import {BlogDB} from "./types";
import {BlogsSchema} from "./blogs.schema";

export const BlogsModel = mongoose.model<BlogDB>("blogs", BlogsSchema);
