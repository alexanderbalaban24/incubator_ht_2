import mongoose from "mongoose";
import {WithId} from "mongodb";
import {BlogDB} from "./types";


export const BlogsSchema = new mongoose.Schema<WithId<BlogDB>>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    isMembership: {type: Boolean, required: true}
});