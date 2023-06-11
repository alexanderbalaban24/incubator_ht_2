import mongoose, {Model} from "mongoose";
import {QueryCustomMethods} from "../../shared/types";
import {queryHelper, reverseLikeStatus} from "../../shared/helpers";
import {LikeStatusEnum} from "../../shared/enums";
import {IWithMethod} from "../../shared/interfaces";
import {UserLikeCommentDTO} from "../../shared/dto";

type CommentatorInfoType = {
    userId: string
    userLogin: string
}

type UserLikeType = {
    userId: string,
    likeStatus: LikeStatusEnum
}

export interface CommentsDB {
    postId: string
    content: string
    commentatorInfo: CommentatorInfoType
    createdAt: string
    likesCount: number
    dislikesCount: number
    usersLikes: UserLikeType[]
}


const CommentatorSchema = new mongoose.Schema<CommentatorInfoType>({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true}
});

const UserLikesSchema = new mongoose.Schema<UserLikeType>({
    userId: {type: String, required: true},
    likeStatus: {type: String, enum: LikeStatusEnum, required: true}
})

export const CommentsSchema = new mongoose.Schema<CommentsDB, Model<CommentsDB, QueryCustomMethods, IWithMethod<CommentsDB>>, IWithMethod<CommentsDB>, QueryCustomMethods>({
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        type: CommentatorSchema,
        required: true
    },
    likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true},
    usersLikes: [UserLikesSchema]
}, {
    timestamps: true,
    query: queryHelper
});

CommentsSchema.method("like", function (userId: string, likeStatus: LikeStatusEnum) {
    const ind = this.usersLikes.findIndex((like: UserLikeType) => like.userId === userId);

    if (ind === -1) {
        const newLike = new UserLikeCommentDTO(userId, likeStatus);

        if (likeStatus !== LikeStatusEnum.None) {
            if (likeStatus === LikeStatusEnum.Like) this.likesCount++;
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

export const CommentsModelClass = mongoose.model<CommentsDB, Model<CommentsDB, QueryCustomMethods, IWithMethod<CommentsDB>>>("comments", CommentsSchema);

//const instance = new CommentsModelClass().like()