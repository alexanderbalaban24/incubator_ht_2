import mongoose from "mongoose";
import {WithId} from "mongodb";
import {RateLimitDB} from "./types";

export const RateLimitSchema = new mongoose.Schema<WithId<RateLimitDB>>({
    IP: {type: String, required: true},
    URL: {type: String, required: true},
    date: {type: Date, required: true}
})