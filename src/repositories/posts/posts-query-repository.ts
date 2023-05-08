import {PostDB, postsCollections} from "../../db/collections/postsCollections";
import {ViewPostModel} from "../../models/post/ViewPostModel";
import {ViewWithQueryPostModel} from "../../models/post/ViewWithQueryPostModel";
import {FindCursor} from "mongodb";
import {QueryParamsPostModel} from "../../models/post/QueryParamsPostModel";

export const postsQueryRepository = {
    async findPost(query: QueryParamsPostModel, blogId?: string | undefined): Promise<ViewWithQueryPostModel> {
        const cursor = await postsCollections.find({}, {projection: {_id: 0}});
        const queryResult = await this._findConstructor(query, cursor, blogId);
        const posts = await cursor.toArray();

        queryResult.items = posts.map(post => this._mapPostDBToViewPostModel(post));

        return queryResult;
    },
    async findPostById(postId: string): Promise<ViewPostModel | null> {
        const post = await postsCollections.findOne({id: postId}, {projection: {_id: 0}});

        if (post) {
            return this._mapPostDBToViewPostModel(post);
        } else {
            return null;
        }
    },
    _mapPostDBToViewPostModel(post: PostDB): ViewPostModel {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    },
    async _findConstructor(query: QueryParamsPostModel, cursor: FindCursor, blogId: string | undefined): Promise<ViewWithQueryPostModel> {
        const sortBy = query.sortBy ? query.sortBy : "createdAt";
        const sortDirection = query.sortDirection ? query.sortDirection : "desc"
        const pageNumber = query.pageNumber ? +query.pageNumber : 1
        const pageSize = query.pageSize ? +query.pageSize : 10

        const skip = pageSize * (pageNumber - 1);

        if (blogId) {
            cursor.filter({blogId: blogId});
        }

        const arr = await cursor.toArray();

        cursor.sort({[sortBy]: sortDirection}).skip(skip).limit(pageSize);
        const pagesCount = Math.ceil(arr.length / pageSize);

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: arr.length,
            items: []
        }
    }
}