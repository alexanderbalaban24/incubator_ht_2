import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithQueryParams, RequestWithQueryParamsAndURI,
    ResponseEmpty
} from "../shared/types";
import {Response} from "express";
import {ViewPostModel} from "../models/post/ViewPostModel";
import {CreatePostModel} from "../models/post/CreatePostModel";
import {postsServices} from "../domain/posts-services";
import {postsQueryRepository} from "../repositories/posts/posts-query-repository";
import {ViewWithQueryPostModel} from "../models/post/ViewWithQueryPostModel";
import {QueryParamsPostModel} from "../models/post/QueryParamsPostModel";
import {commentsServices} from "../domain/comments-services";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {ViewCommentModel} from "../models/comment/ViewCommentModel";
import {ViewWithQueryCommentModel} from "../models/comment/ViewWithQueryCommentModel";
import {QueryParamsCommentModel} from "../models/comment/QueryParamsCommentModel";
import {HTTPResponseStatusCodes} from "../shared/enums";


export const getAllPosts = async (req: RequestWithQueryParams<QueryParamsPostModel>, res: Response<ViewWithQueryPostModel>) => {
    const posts = await postsQueryRepository.findPost(req.query);
    res.status(HTTPResponseStatusCodes.OK).json(posts);
}

export const createPost = async (req: RequestWithBody<CreatePostModel>, res: Response<ViewPostModel>) => {
    const postId = await postsServices.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (postId) {
        const post = await postsQueryRepository.findPostById(postId);
        res.status(HTTPResponseStatusCodes.CREATED).json(post!);
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}

export const getPost = async (req: RequestWithParams<{ postId: string }>, res: Response<ViewPostModel>) => {
    const post = await postsQueryRepository.findPostById(req.params.postId);

    if (post) {
        res.status(HTTPResponseStatusCodes.OK).json(post);
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}

export const updatePost = async (req: RequestWithParamsAndBody<{
    postId: string
}, CreatePostModel>, res: ResponseEmpty) => {
    const isUpdated = await postsServices.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

    if (isUpdated) {
        res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}

export const deletePost = async (req: RequestWithParams<{ postId: string }>, res: ResponseEmpty) => {
    const isDeleted = await postsServices.deletePostById(req.params.postId);

    if (isDeleted) {
        res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}

export const getAllComments = async (req: RequestWithQueryParamsAndURI<{ postId: string }, QueryParamsCommentModel>, res: Response<ViewWithQueryCommentModel>) => {
    const comments = await commentsQueryRepository.findComments(req.params.postId, req.query);

    if (comments) {
        res.status(HTTPResponseStatusCodes.OK).json(comments);
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }

}

export const createComment = async (req: RequestWithParamsAndBody<{ postId: string }, {
    content: string
}>, res: Response<ViewCommentModel>) => {
    const commentId = await commentsServices.createComment(req.params.postId, req.body.content, req.userId!);
    if (!commentId) {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        return;
    }

    const comment = await commentsQueryRepository.findCommentById(commentId);

    if (comment) {
        res.status(HTTPResponseStatusCodes.CREATED).json(comment);
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}