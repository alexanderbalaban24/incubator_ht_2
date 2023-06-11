import {LikeStatusEnum} from "./enums";
import {HydratedDocument} from "mongoose";

export interface IWithMethod<T> extends Document {
    like(userId: string, likeStatus: LikeStatusEnum): HydratedDocument<T>
}