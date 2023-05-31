import {Request, Response} from "express";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithQueryParams, RequestWithQueryParamsAndURI,
    ResponseEmpty
} from "../shared/types";
import {ViewBlogModel} from "../models/blog/ViewBlogModel";
import {CreateBlogModel} from "../models/blog/CreateBlogModel";
import {URIParamsBlogModel} from "../models/blog/URIParamsBlogModel";
import {UpdateBlogModel} from "../models/blog/UpdateBlogModel";
import {BlogsServices} from "../domain/blogs-services";
import {CreatePostModel} from "../models/post/CreatePostModel";
import {ViewPostModel} from "../models/post/ViewPostModel";
import {QueryParamsBlogModel} from "../models/blog/QueryParamsBlogModel";
import {ViewWithQueryBlogModel} from "../models/blog/ViewWithQueryBlogModel";
import {QueryParamsPostModel} from "../models/post/QueryParamsPostModel";
import {ViewWithQueryPostModel} from "../models/post/ViewWithQueryPostModel";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {BlogsQueryRepository} from "../repositories/blogs/blogs-query-repository";
import {PostsServices} from "../domain/posts-services";
import {PostsQueryRepository} from "../repositories/posts/posts-query-repository";


export class BlogsController {

    constructor(
        protected blogsServices: BlogsServices,
        protected blogsQueryRepository: BlogsQueryRepository,
        protected postsServices: PostsServices,
        protected postsQueryRepository: PostsQueryRepository
    ) {}

    async getAllBlogs(req: RequestWithQueryParams<QueryParamsBlogModel>, res: Response<ViewWithQueryBlogModel>) {
        const blogs = await this.blogsQueryRepository.findBlogs(req.query);
        res.status(HTTPResponseStatusCodes.OK).json(blogs);
    }

    async createBlog(req: RequestWithBody<CreateBlogModel>, res: Response<ViewBlogModel>) {
        const blogId = await this.blogsServices.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
        const blog = await this.blogsQueryRepository.findBlogById(blogId);
        res.status(HTTPResponseStatusCodes.CREATED).json(blog!);
    }

    async getBlog(req: RequestWithParams<URIParamsBlogModel>, res: Response<ViewBlogModel>) {
        const blog = await this.blogsQueryRepository.findBlogById(req.params.blogId);

        if (blog) {
            res.status(HTTPResponseStatusCodes.OK).json(blog);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async deleteBlog(req: Request<URIParamsBlogModel>, res: ResponseEmpty) {
        const isDeleted = await this.blogsServices.deleteBlogById(req.params.blogId);

        if (isDeleted) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async updateBlog(req: RequestWithParamsAndBody<URIParamsBlogModel, UpdateBlogModel>, res: ResponseEmpty) {
        try {
            const isUpdated = await this.blogsServices.updateBlog(req.params.blogId, req.body.name, req.body.description, req.body.websiteUrl);

            if (isUpdated) {
                res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
            } else {
                res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
            }
        } catch (e) {
            res.sendStatus(500);
        }
    }

    async createPostByBlogId(req: RequestWithParamsAndBody<{
        blogId: string
    }, CreatePostModel>, res: Response<ViewPostModel>) {
        const blogId = req.params.blogId;
        const postId = await this.postsServices.createPost(req.body.title, req.body.shortDescription, req.body.content, blogId);
        if (postId) {
            const post = await this.postsQueryRepository.findPostById(postId);
            res.status(HTTPResponseStatusCodes.CREATED).json(post!);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async getPostsByBlogId(req: RequestWithQueryParamsAndURI<{
        blogId: string
    }, QueryParamsPostModel>, res: Response<ViewWithQueryPostModel>) {
        const posts = await this.postsQueryRepository.findPost(req.query, req.params.blogId);

        res.status(HTTPResponseStatusCodes.OK).json(posts);
    }
}