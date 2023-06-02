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
import {mapStatusCode} from "../shared/utils";

export class BlogsController {

    constructor(
        protected blogsServices: BlogsServices,
        protected blogsQueryRepository: BlogsQueryRepository,
        protected postsServices: PostsServices,
        protected postsQueryRepository: PostsQueryRepository
    ) {
    }

    async getAllBlogs(req: RequestWithQueryParams<QueryParamsBlogModel>, res: Response<ViewWithQueryBlogModel | null>) {
        const blogsResult = await this.blogsQueryRepository.findBlogs(req.query);

        if (blogsResult.success) {
            res.status(mapStatusCode(blogsResult.code)).json(blogsResult.payload);
        } else {
            res.sendStatus(mapStatusCode(blogsResult.code));
        }
    }

    async createBlog(req: RequestWithBody<CreateBlogModel>, res: Response<ViewBlogModel | null>) {
        const createdResult = await this.blogsServices.createBlog(req.body.name, req.body.description, req.body.websiteUrl);

        if (createdResult.success) {

            const blogResult = await this.blogsQueryRepository.findBlogById(createdResult.payload!.id);

            if (blogResult.success) {
                res.status(HTTPResponseStatusCodes.CREATED).send(blogResult.payload);
            } else {
                res.sendStatus(mapStatusCode(createdResult.code));
            }
        } else {
            res.sendStatus(mapStatusCode(createdResult.code));
        }
    }

    async getBlog(req: RequestWithParams<URIParamsBlogModel>, res: Response<ViewBlogModel>) {
        const blogResult = await this.blogsQueryRepository.findBlogById(req.params.blogId);

        if (blogResult.success) {
            res.status(mapStatusCode(blogResult.code)).json(blogResult.payload!);
        } else {
            res.sendStatus(mapStatusCode(blogResult.code));
        }
    }

    async deleteBlog(req: Request<URIParamsBlogModel>, res: ResponseEmpty) {
        const deletedResult = await this.blogsServices.deleteBlogById(req.params.blogId);

        res.sendStatus(mapStatusCode(deletedResult.code));
    }

    async updateBlog(req: RequestWithParamsAndBody<URIParamsBlogModel, UpdateBlogModel>, res: ResponseEmpty) {
        const updateResult = await this.blogsServices.updateBlog(req.params.blogId, req.body.name, req.body.description, req.body.websiteUrl);

        res.sendStatus(mapStatusCode(updateResult.code));
    }

    async createPostByBlogId(req: RequestWithParamsAndBody<{
        blogId: string
    }, CreatePostModel>, res: Response<ViewPostModel | null>) {
        const blogId = req.params.blogId;

        const createResult = await this.postsServices.createPost(req.body.title, req.body.shortDescription, req.body.content, blogId);
        if (createResult.success) {
            const postResult = await this.postsQueryRepository.findPostById(createResult.payload!.id);

            if(postResult.success) {
                res.status(HTTPResponseStatusCodes.CREATED).json(postResult.payload);
            } else {
                res.sendStatus(mapStatusCode(postResult.code));
            }

        } else {
            res.sendStatus(mapStatusCode(createResult.code));
        }
    }

    async getPostsByBlogId(req: RequestWithQueryParamsAndURI<{
        blogId: string
    }, QueryParamsPostModel>, res: Response<ViewWithQueryPostModel | null>) {
        const postsResult = await this.postsQueryRepository.findPost(req.query, req.params.blogId);

        if(postsResult.success) {
            res.status(mapStatusCode(postsResult.code)).json(postsResult.payload);
        } else {
            res.sendStatus(mapStatusCode(postsResult.code));
        }
    }
}