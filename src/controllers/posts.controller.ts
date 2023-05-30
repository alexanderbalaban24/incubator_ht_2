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


export class PostsController {

    constructor(
        protected postsServices: PostsServices,
        protected postsQueryRepository: PostsQueryRepository,
        protected commentsServices: CommentsServices,
        protected commentsQueryRepository: CommentsQueryRepository
    ){}
    async getAllPosts(req: RequestWithQueryParams<QueryParamsPostModel>, res: Response<ViewWithQueryPostModel>) {
        const posts = await this.postsQueryRepository.findPost(req.query);
        res.status(HTTPResponseStatusCodes.OK).json(posts);
    }

    async createPost(req: RequestWithBody<CreatePostModel>, res: Response<ViewPostModel>) {
        const postId = await this.postsServices.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
        if (postId) {
            const post = await this.postsQueryRepository.findPostById(postId);
            res.status(HTTPResponseStatusCodes.CREATED).json(post!);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async getPost(req: RequestWithParams<{ postId: string }>, res: Response<ViewPostModel>) {
        const post = await this.postsQueryRepository.findPostById(req.params.postId);

        if (post) {
            res.status(HTTPResponseStatusCodes.OK).json(post);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async updatePost(req: RequestWithParamsAndBody<{
        postId: string
    }, CreatePostModel>, res: ResponseEmpty) {
        const isUpdated = await this.postsServices.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

        if (isUpdated) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async deletePost(req: RequestWithParams<{ postId: string }>, res: ResponseEmpty) {
        const isDeleted = await this.postsServices.deletePostById(req.params.postId);

        if (isDeleted) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async getAllComments(req: RequestWithQueryParamsAndURI<{ postId: string }, QueryParamsCommentModel>, res: Response<ViewWithQueryCommentModel>) {
        const comments = await this.commentsQueryRepository.findComments(req.params.postId, req.query);

        if (comments) {
            res.status(HTTPResponseStatusCodes.OK).json(comments);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }

    }

    async createComment(req: RequestWithParamsAndBody<{ postId: string }, {
        content: string
    }>, res: Response<ViewCommentModel>) {
        const commentId = await this.commentsServices.createComment(req.params.postId, req.body.content, req.userId!);
        if (!commentId) {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
            return;
        }

        const comment = await this.commentsQueryRepository.findCommentById(commentId);

        if (comment) {
            res.status(HTTPResponseStatusCodes.CREATED).json(comment);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }
}