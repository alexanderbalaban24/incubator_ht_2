import {ViewPostModel} from "../../models/view/ViewPostModel";
import {ViewWithQueryPostModel} from "../../models/view/ViewWithQueryPostModel";
import {WithId} from "mongodb";
import {QueryParamsPostModel} from "../../models/input/QueryParamsPostModel";
import {PostDB, PostsModelClass, UserLikeType} from "../../models/database/PostsModelClass";
import {ResultDTO} from "../../shared/dto";
import {InternalCode, LikeStatusEnum} from "../../shared/enums";
import {injectable} from "inversify";

@injectable()
export class PostsQueryRepository {
    async findPost(query: QueryParamsPostModel, blogId?: string | undefined, userId?: string): Promise<ResultDTO<ViewWithQueryPostModel>> {
        const postData = await PostsModelClass.find({})
            .populate({path: "usersLikes.user", select: "login"})
            .findWithQuery<WithId<PostDB>, ViewPostModel>(query, blogId);
        postData.map((post) => this._mapPostDBToViewPostModel(post, userId));

        return new ResultDTO(InternalCode.Success, postData as ViewWithQueryPostModel);
    }
    async findPostById(postId: string, userId?: string): Promise<ResultDTO<ViewPostModel>> {
        const post = await PostsModelClass.findById(postId).populate({path: "usersLikes.user", select: "login"}).lean();

        if (post) {
            const mappedData = this._mapPostDBToViewPostModel(post, userId);
            return new ResultDTO(InternalCode.Success, mappedData);
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }
    }
    _mapPostDBToViewPostModel(post: WithId<PostDB>, userId?: string): ViewPostModel {
        const userLikeData = post.usersLikes.find((item: UserLikeType) => {
            if (!item.user?._id) return null;

            return item.user!._id!.toString() === userId;
        })

        const newestLikes = post.usersLikes
            .sort((a, b) => Number(b.addedAt) - Number(a.addedAt))
            .filter(item => item.likeStatus === LikeStatusEnum.Like)
            // @ts-ignore
            .map(item => ({addedAt: item.addedAt, userId: item.user!._id!.toString(), login: item.user!.login}))
            .slice(0, 3)
        console.log(userLikeData)
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.likesCount,
                dislikesCount: post.dislikesCount,
                myStatus: userLikeData?.likeStatus ?? LikeStatusEnum.None,
                newestLikes
            },
        }
    }
}