import {BlogDB, blogsCollections} from "../db/collections/blogsCollections";
import {ViewBlogModel} from "../models/blog/ViewBlogModel";

export const blogsQueryRepository = {
    async findBlogs(): Promise<ViewBlogModel[]> {
        const blogs = await blogsCollections.find({}, {projection: {_id: 0}}).toArray();

        return blogs.map(blog => this._mapBlogDBToViewBlogModel(blog));
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
    }
}