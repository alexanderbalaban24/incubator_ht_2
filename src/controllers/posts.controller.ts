import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithQueryParams, RequestWithQueryParamsAndURI,
    ResponseEmpty
} from "../shared/types";
import {Response} from "express";
import {ViewPostModel} from "../models/view/ViewPostModel";
import {CreatePostModel} from "../models/input/CreatePostModel";
import {PostsServices} from "../domain/posts-services";
import {ViewWithQueryPostModel} from "../models/view/ViewWithQueryPostModel";
import {QueryParamsPostModel} from "../models/input/QueryParamsPostModel";
import {ViewCommentModel} from "../models/view/ViewCommentModel";
import {ViewWithQueryCommentModel} from "../models/view/ViewWithQueryCommentModel";
import {QueryParamsCommentModel} from "../models/input/QueryParamsCommentModel";
import {HTTPResponseStatusCodes, LikeStatusEnum} from "../shared/enums";
import {PostsQueryRepository} from "../repositories/posts/posts-query-repository";
import {CommentsServices} from "../domain/comments-services";
import {CommentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {ResponseHelper} from "../shared/helpers";
import {inject, injectable} from "inversify";


@injectable()
export class PostsController extends ResponseHelper {

    constructor(
        @inject(PostsServices) protected postsServices: PostsServices,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(CommentsServices) protected commentsServices: CommentsServices,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository
    ) {
        super();
    }

    async getAllPosts(req: RequestWithQueryParams<QueryParamsPostModel>, res: Response<ViewWithQueryPostModel | null>) {
        const postsResult = await this.postsQueryRepository.findPost(req.query, undefined, req.userId!);
        console.log(postsResult)
        this.sendResponse<ViewWithQueryPostModel>(res, postsResult);
    }

    async createPost(req: RequestWithBody<CreatePostModel>, res: Response<ViewPostModel | null>) {
        const createdResult = await this.postsServices.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

        if (createdResult.success) {

            const postResult = await this.postsQueryRepository.findPostById(createdResult.payload!.id);

            if (postResult.success) {
                res.status(HTTPResponseStatusCodes.CREATED).json(postResult.payload);
            } else {
                res.sendStatus(this.mapStatusCode(postResult.code));
            }

        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async getPost(req: RequestWithParams<{ postId: string }>, res: Response<ViewPostModel | null>) {
        const postResult = await this.postsQueryRepository.findPostById(req.params.postId, req.userId!);
        console.log(postResult)
        this.sendResponse<ViewPostModel>(res, postResult);
    }

    async updatePost(req: RequestWithParamsAndBody<{
        postId: string
    }, CreatePostModel>, res: ResponseEmpty) {
        const updateResult = await this.postsServices.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

        this.sendResponse(res, updateResult);
    }

    async deletePost(req: RequestWithParams<{ postId: string }>, res: ResponseEmpty) {
        const deletedResult = await this.postsServices.deletePostById(req.params.postId);

        this.sendResponse(res, deletedResult);
    }

    async getAllComments(req: RequestWithQueryParamsAndURI<{
        postId: string
    }, QueryParamsCommentModel>, res: Response<ViewWithQueryCommentModel | null>) {
        const commentsResult = await this.commentsQueryRepository.findComments(req.params.postId, req.query, req.userId!);

        this.sendResponse<ViewWithQueryCommentModel>(res, commentsResult);

    }

    async createComment(req: RequestWithParamsAndBody<{ postId: string }, {
        content: string
    }>, res: Response<ViewCommentModel | null>) {
        const createdResult = await this.commentsServices.createComment(req.params.postId, req.body.content, req.userId!);
        if (!createdResult.success) return res.sendStatus(this.mapStatusCode(createdResult.code));

        const commentResult = await this.commentsQueryRepository.findCommentById(createdResult.payload!.id, req.userId!);

        if (commentResult.success) {
            res.status(HTTPResponseStatusCodes.CREATED).json(commentResult.payload);
        } else {
            res.sendStatus(this.mapStatusCode(commentResult.code));
        }
    }

    async likeStatus(req: RequestWithParamsAndBody<{ postId: string }, { likeStatus: LikeStatusEnum }>, res: ResponseEmpty) {
        const likeResult = await this.postsServices.likeStatus(req.params.postId, req.userId!, req.body.likeStatus);

        if(likeResult.success) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            this.sendResponse<{}>(res, likeResult)
        }
    }
}