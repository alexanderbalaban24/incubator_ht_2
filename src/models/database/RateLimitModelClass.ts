import mongoose from "mongoose";
import {WithId} from "mongodb";

export type RateLimitDB = {
    IP: string
    URL: string
    date: Date
}

export const RateLimitSchema = new mongoose.Schema<RateLimitDB>({
    IP: {type: String, required: true},
    URL: {type: String, required: true}
}, {timestamps: {
        createdAt: "date"
    }})

export const RateLimitModelClass = mongoose.model<RateLimitDB>("rate-limit", RateLimitSchema);