import {ViewPostModel} from "../../models/post/ViewPostModel";
import {ViewWithQueryPostModel} from "../../models/post/ViewWithQueryPostModel";
import {WithId} from "mongodb";
import {QueryParamsPostModel} from "../../models/post/QueryParamsPostModel";
import {PostDB, PostsModelClass} from "../../models/post/PostsModelClass";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";

export class PostsQueryRepository {
    async findPost(query: QueryParamsPostModel, blogId?: string | undefined): Promise<ResultDTO<ViewWithQueryPostModel>> {
        const postData = await PostsModelClass.find({}).customFind<WithId<PostDB>, ViewPostModel>(query, blogId);
        postData.map(this._mapPostDBToViewPostModel);

        return new ResultDTO(InternalCode.Success, postData as ViewWithQueryPostModel);
    }
    async findPostById(postId: string): Promise<ResultDTO<ViewPostModel>> {
        const post = await PostsModelClass.findById(postId).lean();

        if (post) {
            const mappedData = this._mapPostDBToViewPostModel(post);
            return new ResultDTO(InternalCode.Success, mappedData);
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }
    }
    _mapPostDBToViewPostModel(post: WithId<PostDB>): ViewPostModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }
}