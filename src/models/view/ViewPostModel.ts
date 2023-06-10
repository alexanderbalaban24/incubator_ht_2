import {LikeStatusEnum} from "../../shared/enums";

type NewLikeType = {
    addedAt: Date,
    userId: string,
    login: string
}

type ExtendedLikesInfoType = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatusEnum,
    newestLikes: NewLikeType[]
}

export type ViewPostModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: ExtendedLikesInfoType,
}