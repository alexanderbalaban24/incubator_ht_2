import {ViewBlogModel} from "../../models/blog/ViewBlogModel";
import {QueryParamsBlogModel} from "../../models/blog/QueryParamsBlogModel";
import {WithId} from "mongodb";
import {ViewWithQueryBlogModel} from "../../models/blog/ViewWithQueryBlogModel";
import {Query} from "mongoose";
import {BlogDB, BlogsModelClass} from "../../db";

export const blogsQueryRepository = {
    async findBlogs(query: QueryParamsBlogModel): Promise<ViewWithQueryBlogModel> {
        const blogInstances = BlogsModelClass.find({});
        const queryResult = await this._queryBuilder(query, blogInstances);
        const blogs = await blogInstances;

        queryResult.items = blogs.map(blog => this._mapBlogDBToViewBlogModel(blog));
        return queryResult;
    },
    async findBlogById(blogId: string): Promise<ViewBlogModel | null> {
        const blog = await BlogsModelClass.findById(blogId).lean();
        if (blog) {
            return this._mapBlogDBToViewBlogModel(blog);
        } else {
            return null;
        }
    },
    _mapBlogDBToViewBlogModel(blog: WithId<BlogDB>): ViewBlogModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    },
    async _queryBuilder(queryBlogData: QueryParamsBlogModel, query: Query<any, any>): Promise<ViewWithQueryBlogModel> {
        const sortBy = queryBlogData.sortBy ? queryBlogData.sortBy : "createdAt";
        const sortDirection = queryBlogData.sortDirection ? queryBlogData.sortDirection : "desc";
        const pageNumber = queryBlogData.pageNumber ? +queryBlogData.pageNumber : 1;
        const pageSize = queryBlogData.pageSize ? +queryBlogData.pageSize : 10;

        const skip = pageSize * (pageNumber - 1);
        if (queryBlogData.searchNameTerm) {
            query.regex("name", new RegExp(queryBlogData.searchNameTerm));
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