import mongoose, {Document, Model, PopulatedDoc} from "mongoose";
import {QueryCustomMethods} from "../../shared/types";

import {queryHelper, reverseLikeStatus} from "../../shared/helpers";
import {LikeStatusEnum} from "../../shared/enums";
import {ObjectId} from "mongodb";
import {IWithMethod} from "../../shared/interfaces";
import {UserLikePostDTO} from "../../shared/dto";

type UserInfoType = {
    login: string
}

export type UserLikeType = {
    user: PopulatedDoc<Document<ObjectId & UserInfoType>>
    likeStatus: LikeStatusEnum
    addedAt: Date
}

export type PostDB = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string,
    likesCount: number
    dislikesCount: number
    usersLikes: UserLikeType[]

}


const UserLikeSchema = new mongoose.Schema<UserLikeType>({
    user: {type: ObjectId, ref: "users"},
    likeStatus: {type: String, required: true},
    addedAt: {type: Date, required: true}
})

export const PostsSchema = new mongoose.Schema<PostDB, Model<PostDB, QueryCustomMethods, IWithMethod<PostDB>>, IWithMethod<PostDB>, QueryCustomMethods>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true},
    usersLikes: {type: [UserLikeSchema], require: true}
}, {timestamps: true, query: {
    findWithQuery: queryHelper.findWithQuery

}});


PostsSchema.method("like", function (userId: string, likeStatus: LikeStatusEnum) {

    const ind: number = this.usersLikes.findIndex((like: UserLikeType) => like.user?._id!.toString() === userId);

    if (ind === -1) {
        const newLike = new UserLikePostDTO(userId,  likeStatus, new Date());

        if (likeStatus !== LikeStatusEnum.None) {
            if (likeStatus === LikeStatusEnum.Like && likeStatus) this.likesCount++;
            else this.dislikesCount++;
        }

        this.usersLikes.push(newLike);
        return this;
    }

    const myLike: UserLikeType = this.usersLikes[ind];
    if (likeStatus === myLike.likeStatus) {
        return this;
    }

    if (myLike.likeStatus !== LikeStatusEnum.None && likeStatus !== LikeStatusEnum.None) {
        myLike.likeStatus = reverseLikeStatus(myLike.likeStatus);

        if (likeStatus === LikeStatusEnum.Like) {
            this.likesCount++;
            this.dislikesCount--
        } else {
            this.dislikesCount++;
            this.likesCount--;
        }

        return this;
    }

    myLike.likeStatus = likeStatus;

    if (myLike.likeStatus === LikeStatusEnum.Like) this.likesCount--;
    else this.dislikesCount--;

    return this;
})

export const PostsModelClass = mongoose.model<PostDB, Model<PostDB, QueryCustomMethods, IWithMethod<PostDB>>>("posts", PostsSchema);