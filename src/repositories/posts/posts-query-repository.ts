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

        //console.log("ALL POSTS : ", postData.items)
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

/*
Expected: {"pagesCount":1,"page":1,"pageSize":10,"totalCount":6,"items":[{"id":"64858af91896532cf76bc6fc","title":"post title","shortDescription":"description","content":"new post content","blogId":"64858af91896532cf76bc6d8","blogName":"new blog","createdAt":"2023-06-11T08:51:05.750Z","extendedLikesInfo":{"likesCount":1,"dislikesCount":1,"myStatus":"Like","newestLikes":[{"addedAt":Any<String>,"userId":"64858af21896532cf76bc636","login":"8779lg"}]}},{"id":"64858af91896532cf76bc6f6","title":"post title","shortDescription":"description","content":"new post content","blogId":"64858af91896532cf76bc6d8","blogName":"new blog","createdAt":"2023-06-11T08:51:05.686Z","extendedLikesInfo":{"likesCount":1,"dislikesCount":1,"myStatus":"None","newestLikes":[{"addedAt":Any<String>,"userId":"64858af31896532cf76bc63b","login":"8780lg"}]}},{"id":"64858af91896532cf76bc6f0","title":"post title","shortDescription":"description","content":"new post content","blogId":"64858af91896532cf76bc6d8","blogName":"new blog","createdAt":"2023-06-11T08:51:05.622Z","extendedLikesInfo":{"likesCount":4,"dislikesCount":0,"myStatus":"Like","newestLikes":[{"addedAt":Any<String>,"userId":"64858af31896532cf76bc640","login":"8781lg"},{"addedAt":Any<String>,"userId":"64858af31896532cf76bc63b","login":"8780lg"},{"addedAt":Any<String>,"userId":"64858af31896532cf76bc645","login":"8782lg"}]}},{"id":"64858af91896532cf76bc6ea","title":"post title","shortDescription":"description","content":"new post content","blogId":"64858af91896532cf76bc6d8","blogName":"new blog","createdAt":"2023-06-11T08:51:05.545Z","extendedLikesInfo":{"likesCount":0,"dislikesCount":1,"myStatus":"Dislike","newestLikes":[]}},{"id":"64858af91896532cf76bc6e4","title":"post title","shortDescription":"description","content":"new post content","blogId":"64858af91896532cf76bc6d8","blogName":"new blog","createdAt":"2023-06-11T08:51:05.475Z","extendedLikesInfo":{"likesCount":2,"dislikesCount":0,"myStatus":"None","newestLikes":[{"addedAt":Any<String>,"userId":"64858af31896532cf76bc640","login":"8781lg"},{"addedAt":Any<String>,"userId":"64858af31896532cf76bc63b","login":"8780lg"}]}},{"id":"64858af91896532cf76bc6de","title":"post title","shortDescription":"description","content":"new post content","blogId":"64858af91896532cf76bc6d8","blogName":"new blog","createdAt":"2023-06-11T08:51:05.396Z","extendedLikesInfo":{"likesCount":2,"dislikesCount":0,"myStatus":"Like","newestLikes":[{"addedAt":Any<String>,"userId":"64858af31896532cf76bc63b","login":"8780lg"},{"addedAt":Any<String>,"userId":"64858af21896532cf76bc636","login":"8779lg"}]}}]}

Received: {"pagesCount":1,"page":1,"pageSize":10,"totalCount":6,"items":[{"id":"64858af91896532cf76bc6fc","title":"post title","shortDescription":"description","content":"new post content","blogId":"64858af91896532cf76bc6d8","blogName":"new blog","createdAt":"2023-06-11T08:51:05.750Z","extendedLikesInfo":{"likesCount":1,"dislikesCount":1,"myStatus":"None","newestLikes":[{"addedAt":"2023-06-11T08:51:06.541Z","userId":"64858af21896532cf76bc636","login":"8779lg"}]}},{"id":"64858af91896532cf76bc6f6","title":"post title","shortDescription":"description","content":"new post content","blogId":"64858af91896532cf76bc6d8","blogName":"new blog","createdAt":"2023-06-11T08:51:05.686Z","extendedLikesInfo":{"likesCount":1,"dislikesCount":1,"myStatus":"None","newestLikes":[{"addedAt":"2023-06-11T08:51:06.410Z","userId":"64858af31896532cf76bc63b","login":"8780lg"}]}},{"id":"64858af91896532cf76bc6f0","title":"post title","shortDescription":"description","content":"new post content","blogId":"64858af91896532cf76bc6d8","blogName":"new blog","createdAt":"2023-06-11T08:51:05.622Z","extendedLikesInfo":{"likesCount":4,"dislikesCount":0,"myStatus":"None","newestLikes":[{"addedAt":"2023-06-11T08:51:06.348Z","userId":"64858af31896532cf76bc640","login":"8781lg"},{"addedAt":"2023-06-11T08:51:06.291Z","userId":"64858af31896532cf76bc63b","login":"8780lg"},{"addedAt":"2023-06-11T08:51:06.225Z","userId":"64858af31896532cf76bc645","login":"8782lg"}]}},{"id":"64858af91896532cf76bc6ea","title":"post title","shortDescription":"description","content":"new post content","blogId":"64858af91896532cf76bc6d8","blogName":"new blog","createdAt":"2023-06-11T08:51:05.545Z","extendedLikesInfo":{"likesCount":0,"dislikesCount":1,"myStatus":"None","newestLikes":[]}},{"id":"64858af91896532cf76bc6e4","title":"post title","shortDescription":"description","content":"new post content","blogId":"64858af91896532cf76bc6d8","blogName":"new blog","createdAt":"2023-06-11T08:51:05.475Z","extendedLikesInfo":{"likesCount":2,"dislikesCount":0,"myStatus":"None","newestLikes":[{"addedAt":"2023-06-11T08:51:06.032Z","userId":"64858af31896532cf76bc640","login":"8781lg"},{"addedAt":"2023-06-11T08:51:05.966Z","userId":"64858af31896532cf76bc63b","login":"8780lg"}]}},{"id":"64858af91896532cf76bc6de","title":"post title","shortDescription":"description","content":"new post content","blogId":"64858af91896532cf76bc6d8","blogName":"new blog","createdAt":"2023-06-11T08:51:05.396Z","extendedLikesInfo":{"likesCount":2,"dislikesCount":0,"myStatus":"None","newestLikes":[{"addedAt":"2023-06-11T08:51:05.895Z","userId":"64858af31896532cf76bc63b","login":"8780lg"},{"addedAt":"2023-06-11T08:51:05.816Z","userId":"64858af21896532cf76bc636","login":"8779lg"}]}}]}
*/