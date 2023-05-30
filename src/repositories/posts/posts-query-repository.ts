import {ViewPostModel} from "../../models/post/ViewPostModel";
import {ViewWithQueryPostModel} from "../../models/post/ViewWithQueryPostModel";
import {WithId} from "mongodb";
import {QueryParamsPostModel} from "../../models/post/QueryParamsPostModel";
import {PostDB, PostsModelClass} from "../../db";
import {Query} from "mongoose";

export class PostsQueryRepository {
    async findPost(query: QueryParamsPostModel, blogId?: string | undefined): Promise<ViewWithQueryPostModel> {
        const postInstances = PostsModelClass.find({});
        const queryResult = await this._queryBuilder(query, postInstances, blogId);
        const posts = await postInstances;

        queryResult.items = posts.map(post => this._mapPostDBToViewPostModel(post));

        return queryResult;
    }
    async findPostById(postId: string): Promise<ViewPostModel | null> {
        const post = await PostsModelClass.findById(postId).lean();

        if (post) {
            return this._mapPostDBToViewPostModel(post);
        } else {
            return null;
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