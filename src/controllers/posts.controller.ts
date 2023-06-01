import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithQueryParams, RequestWithQueryParamsAndURI,
    ResponseEmpty
} from "../shared/types";
import {Response} from "express";
import {ViewPostModel} from "../models/post/ViewPostModel";
import {CreatePostModel} from "../models/post/CreatePostModel";
import {PostsServices} from "../domain/posts-services";
import {ViewWithQueryPostModel} from "../models/post/ViewWithQueryPostModel";
import {QueryParamsPostModel} from "../models/post/QueryParamsPostModel";
import {ViewCommentModel} from "../models/comment/ViewCommentModel";
import {ViewWithQueryCommentModel} from "../models/comment/ViewWithQueryCommentModel";
import {QueryParamsCommentModel} from "../models/comment/QueryParamsCommentModel";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {PostsQueryRepository} from "../repositories/posts/posts-query-repository";
import {CommentsServices} from "../domain/comments-services";
import {CommentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {mapStatusCode} from "../shared/utils";


export class PostsController {

    constructor(
        protected postsServices: PostsServices,
        protected postsQueryRepository: PostsQueryRepository,
        protected commentsServices: CommentsServices,
        protected commentsQueryRepository: CommentsQueryRepository
    ) {
    }

    async getAllPosts(req: RequestWithQueryParams<QueryParamsPostModel>, res: Response<ViewWithQueryPostModel | null>) {
        const postsResult = await this.postsQueryRepository.findPost(req.query);

        if (postsResult.success) {
            res.status(mapStatusCode(postsResult.code)).json(postsResult.payload);
        } else {
            res.sendStatus(mapStatusCode(postsResult.code));
        }
    }

    async createPost(req: RequestWithBody<CreatePostModel>, res: Response<ViewPostModel | null>) {
        const createdResult = await this.postsServices.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

        if (createdResult.success) {

            const postResult = await this.postsQueryRepository.findPostById(createdResult.payload!.id);

            if (postResult.success) {
                res.status(mapStatusCode(postResult.code)).json(postResult.payload);
            } else {
                res.sendStatus(mapStatusCode(postResult.code));
            }

        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async getPost(req: RequestWithParams<{ postId: string }>, res: Response<ViewPostModel | null>) {
        const postResult = await this.postsQueryRepository.findPostById(req.params.postId);

        if (postResult.success) {
            res.status(mapStatusCode(postResult.code)).json(postResult.payload);
        } else {
            res.sendStatus(mapStatusCode(postResult.code));
        }
    }

    async updatePost(req: RequestWithParamsAndBody<{
        postId: string
    }, CreatePostModel>, res: ResponseEmpty) {
        const updateResult = await this.postsServices.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

        if (updateResult.success) {
            res.sendStatus(mapStatusCode(updateResult.code));
        } else {
            res.sendStatus(mapStatusCode(updateResult.code));
        }
    }

    async deletePost(req: RequestWithParams<{ postId: string }>, res: ResponseEmpty) {
        const deletedResult = await this.postsServices.deletePostById(req.params.postId);

        res.sendStatus(mapStatusCode(deletedResult.code));
    }

    async getAllComments(req: RequestWithQueryParamsAndURI<{
        postId: string
    }, QueryParamsCommentModel>, res: Response<ViewWithQueryCommentModel | null>) {
        const commentsResult = await this.commentsQueryRepository.findComments(req.params.postId, req.query);

        if (commentsResult.success) {
            res.status(mapStatusCode(commentsResult.code)).json(commentsResult.payload);
        } else {
            res.sendStatus(mapStatusCode(commentsResult.code));
        }

    }

    async createComment(req: RequestWithParamsAndBody<{ postId: string }, {
        content: string
    }>, res: Response<ViewCommentModel | null>) {
        const createdResult = await this.commentsServices.createComment(req.params.postId, req.body.content, req.userId!);
        if (!createdResult.success) return res.sendStatus(mapStatusCode(createdResult.code));

        const commentResult = await this.commentsQueryRepository.findCommentById(createdResult.payload!.id);

        if (commentResult.success) {
            res.status(mapStatusCode(commentResult.code)).json(commentResult.payload);
        } else {
            res.sendStatus(mapStatusCode(commentResult.code));
        }
    }
}