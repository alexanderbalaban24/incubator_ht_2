import mongoose from "mongoose";
import {RateLimitDB} from "./types";
import {RateLimitSchema} from "./rateLimit.schema";

export const RateLimitModelClass = mongoose.model<RateLimitDB>("rate-limit", RateLimitSchema);