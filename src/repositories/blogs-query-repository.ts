import {BlogDB, blogsCollections} from "../db/collections/blogsCollections";
import {ViewBlogModel} from "../models/blog/ViewBlogModel";
import {QueryParamsBlogModel} from "../models/blog/QueryParamsBlogModel";
import {FindCursor} from "mongodb";
import {ViewWithQueryBlogModel} from "../models/blog/ViewWithQueryBlogModel";

export const blogsQueryRepository = {
    async findBlogs(query: QueryParamsBlogModel): Promise<ViewWithQueryBlogModel> {
        const cursor = blogsCollections.find({}, {projection: {_id: 0}});
        const queryResult = await this._findConstructor(query, cursor);
        const blogs = await cursor.toArray();

        queryResult.items = blogs.map(blog => this._mapBlogDBToViewBlogModel(blog));
        return queryResult;
    },
    async findBlogById(blogId: string): Promise<ViewBlogModel | null> {
        const blog = await blogsCollections.findOne({id: blogId}, {projection: {_id: 0}});
        if (blog) {
            return this._mapBlogDBToViewBlogModel(blog);
        } else {
            return null;
        }
    },
    _mapBlogDBToViewBlogModel(blog: BlogDB): ViewBlogModel {
        return {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    },
    async _findConstructor(query: QueryParamsBlogModel, cursor: FindCursor): Promise<ViewWithQueryBlogModel> {
        const sortBy = query.sortBy ? query.sortBy : "createdAt";
        const sortDirection = query.sortDirection ? query.sortDirection : "desc"
        const pageNumber = query.pageNumber ? +query.pageNumber : 1
        const pageSize = query.pageSize ? +query.pageSize : 10

        const skip = pageSize * (pageNumber - 1);
        if (query.searchNameTerm) {
            cursor.filter({name: {$regex: query.searchNameTerm, $options: 'i'}});
        }

        const totalCount = await cursor.count();

        cursor.sort({[sortBy]: sortDirection}).skip(skip).limit(pageSize);
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