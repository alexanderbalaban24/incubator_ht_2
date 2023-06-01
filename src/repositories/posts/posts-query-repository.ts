import {ViewPostModel} from "../../models/post/ViewPostModel";
import {ViewWithQueryPostModel} from "../../models/post/ViewWithQueryPostModel";
import {WithId} from "mongodb";
import {QueryParamsPostModel} from "../../models/post/QueryParamsPostModel";
import {Query} from "mongoose";
import {PostDB, PostsModelClass} from "../../models/post/PostsModelClass";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";

export class PostsQueryRepository {
    async findPost(query: QueryParamsPostModel, blogId?: string | undefined): Promise<ResultDTO<ViewWithQueryPostModel>> {
        const postInstances = PostsModelClass.find({});
        const queryResult = await this._queryBuilder(query, postInstances, blogId);
        const posts = await postInstances;

        queryResult.items = posts.map(post => this._mapPostDBToViewPostModel(post));

        return new ResultDTO(InternalCode.Success, queryResult);
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
    async _queryBuilder(queryPosts: QueryParamsPostModel, query: Query<any, any>, blogId: string | undefined): Promise<ViewWithQueryPostModel> {
        const sortBy = queryPosts.sortBy ? queryPosts.sortBy : "createdAt";
        const sortDirection = queryPosts.sortDirection ? queryPosts.sortDirection : "desc"
        const pageNumber = queryPosts.pageNumber ? +queryPosts.pageNumber : 1
        const pageSize = queryPosts.pageSize ? +queryPosts.pageSize : 10

        const skip = pageSize * (pageNumber - 1);

        if (blogId) {
            query.where("blogId").equals(blogId);
        }

        const totalCount = await query.clone().count();

        query.sort({[sortBy]: sortDirection}).skip(skip).limit(pageSize);
        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: []
        }
    }
}