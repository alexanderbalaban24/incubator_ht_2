import {ViewBlogModel} from "../../models/view/ViewBlogModel";
import {QueryParamsBlogModel} from "../../models/input/QueryParamsBlogModel";
import {WithId} from "mongodb";
import {ViewWithQueryBlogModel} from "../../models/view/ViewWithQueryBlogModel";
import {BlogDB, BlogsModelClass} from "../../models/database/BlogsModelClass";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";


export class BlogsQueryRepository {
    async findBlogs(query: QueryParamsBlogModel): Promise<ResultDTO<ViewWithQueryBlogModel>> {
        const blogsData = await BlogsModelClass.find({}).customFind<WithId<BlogDB>, ViewBlogModel>(query);
        blogsData.map(this._mapBlogDBToViewBlogModel);

        return new ResultDTO(InternalCode.Success, blogsData as ViewWithQueryBlogModel);
    }
    async findBlogById(blogId: string): Promise<ResultDTO<ViewBlogModel>> {
        const blog = await BlogsModelClass.findById(blogId).lean();
        if (blog) {
            const mappedData = this._mapBlogDBToViewBlogModel(blog);
            return new ResultDTO(InternalCode.Success, mappedData);
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }
    }
    _mapBlogDBToViewBlogModel(blog: WithId<BlogDB>): ViewBlogModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }
}