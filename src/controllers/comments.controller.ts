import {Response} from "express";
import {ViewCommentModel} from "../models/comment/ViewCommentModel";
import {RequestWithParams, RequestWithParamsAndBody, ResponseEmpty} from "../shared/types";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {commentsCommandRepository} from "../repositories/comments/comments-command-repository";
import {commentsServices} from "../domain/comments-services";

export const getComment = async (req: RequestWithParams<{ commentId: string }>, res: Response<ViewCommentModel>) => {
    const comment = await commentsQueryRepository.findCommentById(req.params.commentId);
    if (comment) {
        res.status(200).json(comment);
    } else {
        res.sendStatus(404);
    }
}

export const deleteComment = async (req: RequestWithParams<{ commentId: string }>, res: ResponseEmpty) => {
    const comment = await commentsQueryRepository.findCommentById(req.params.commentId);
    if (!comment) {
        res.sendStatus(404);
        return;
    }

    if (comment.commentatorInfo.userId !== req.userId) {
        res.sendStatus(403);
        return;
    }

    const isDeleted = await commentsServices.deleteComment(req.params.commentId);

    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}

export const updateComment = async (req: RequestWithParamsAndBody<{ commentId: string }, {
    content: string
}>, res: ResponseEmpty) => {
    const comment = await commentsQueryRepository.findCommentById(req.params.commentId);
    if (!comment) {
        res.sendStatus(404);
        return;
    }

    if (comment.commentatorInfo.userId !== req.userId) {
        res.sendStatus(403);
        return;
    }

    const isUpdated = await commentsServices.updateComment(req.params.commentId, req.body.content);

    if (isUpdated) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}