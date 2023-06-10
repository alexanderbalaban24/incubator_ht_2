import {Request, Response} from "express";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithQueryParams, RequestWithQueryParamsAndURI,
    ResponseEmpty
} from "../shared/types";
import {ViewBlogModel} from "../models/view/ViewBlogModel";
import {CreateBlogModel} from "../models/input/CreateBlogModel";
import {URIParamsBlogModel} from "../models/input/URIParamsBlogModel";
import {UpdateBlogModel} from "../models/input/UpdateBlogModel";
import {BlogsServices} from "../domain/blogs-services";
import {CreatePostModel} from "../models/input/CreatePostModel";
import {ViewPostModel} from "../models/view/ViewPostModel";
import {QueryParamsBlogModel} from "../models/input/QueryParamsBlogModel";
import {ViewWithQueryBlogModel} from "../models/view/ViewWithQueryBlogModel";
import {QueryParamsPostModel} from "../models/input/QueryParamsPostModel";
import {ViewWithQueryPostModel} from "../models/view/ViewWithQueryPostModel";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {BlogsQueryRepository} from "../repositories/blogs/blogs-query-repository";
import {PostsServices} from "../domain/posts-services";
import {PostsQueryRepository} from "../repositories/posts/posts-query-repository";
import {ResponseHelper} from "../shared/helpers";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsController extends ResponseHelper {

    constructor(
        @inject(BlogsServices) protected blogsServices: BlogsServices,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(PostsServices) protected postsServices: PostsServices,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository
    ) {
        super();
    }

    async getAllBlogs(req: RequestWithQueryParams<QueryParamsBlogModel>, res: Response<ViewWithQueryBlogModel | null>) {
        const blogsResult = await this.blogsQueryRepository.findBlogs(req.query);

        this.sendResponse<ViewWithQueryBlogModel>(res, blogsResult);
    }

    async createBlog(req: RequestWithBody<CreateBlogModel>, res: Response<ViewBlogModel | null>) {
        const createdResult = await this.blogsServices.createBlog(req.body.name, req.body.description, req.body.websiteUrl);

        if (createdResult.success) {

            const blogResult = await this.blogsQueryRepository.findBlogById(createdResult.payload!.id);

            if (blogResult.success) {
                res.status(HTTPResponseStatusCodes.CREATED).send(blogResult.payload);
            } else {
                res.sendStatus(this.mapStatusCode(createdResult.code));
            }
        } else {
            res.sendStatus(this.mapStatusCode(createdResult.code));
        }
    }

    async getBlog(req: RequestWithParams<URIParamsBlogModel>, res: Response<ViewBlogModel>) {
        const blogResult = await this.blogsQueryRepository.findBlogById(req.params.blogId);

        this.sendResponse<ViewBlogModel>(res, blogResult);
    }

    async deleteBlog(req: Request<URIParamsBlogModel>, res: ResponseEmpty) {
        const deletedResult = await this.blogsServices.deleteBlogById(req.params.blogId);

        res.sendStatus(this.mapStatusCode(deletedResult.code));
    }

    async updateBlog(req: RequestWithParamsAndBody<URIParamsBlogModel, UpdateBlogModel>, res: ResponseEmpty) {
        const updateResult = await this.blogsServices.updateBlog(req.params.blogId, req.body.name, req.body.description, req.body.websiteUrl);

        res.sendStatus(this.mapStatusCode(updateResult.code));
    }

    async createPostByBlogId(req: RequestWithParamsAndBody<{
        blogId: string
    }, CreatePostModel>, res: Response<ViewPostModel | null>) {
        const blogId = req.params.blogId;

        const createResult = await this.postsServices.createPost(req.body.title, req.body.shortDescription, req.body.content, blogId);
        if (createResult.success) {
            const postResult = await this.postsQueryRepository.findPostById(createResult.payload!.id);

            if (postResult.success) {
                res.status(HTTPResponseStatusCodes.CREATED).json(postResult.payload);
            } else {
                res.sendStatus(this.mapStatusCode(postResult.code));
            }

        } else {
            res.sendStatus(this.mapStatusCode(createResult.code));
        }
    }

    async getPostsByBlogId(req: RequestWithQueryParamsAndURI<{
        blogId: string
    }, QueryParamsPostModel>, res: Response<ViewWithQueryPostModel | null>) {
        const postsResult = await this.postsQueryRepository.findPost(req.query, req.params.blogId);

        this.sendResponse<ViewWithQueryPostModel>(res, postsResult);
    }
}