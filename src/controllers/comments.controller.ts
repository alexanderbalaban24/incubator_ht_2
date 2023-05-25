import {Response} from "express";
import {ViewCommentModel} from "../models/comment/ViewCommentModel";
import {RequestWithParams, RequestWithParamsAndBody, ResponseEmpty} from "../shared/types";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {commentsCommandRepository} from "../repositories/comments/comments-command-repository";
import {commentsServices} from "../domain/comments-services";
import {HTTPResponseStatusCodes} from "../shared/enums";

export const getComment = async (req: RequestWithParams<{ commentId: string }>, res: Response<ViewCommentModel>) => {
    const comment = await commentsQueryRepository.findCommentById(req.params.commentId);
    if (comment) {
        res.status(HTTPResponseStatusCodes.OK).json(comment);
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}

export const deleteComment = async (req: RequestWithParams<{ commentId: string }>, res: ResponseEmpty) => {
    const comment = await commentsQueryRepository.findCommentById(req.params.commentId);
    if (!comment) {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        return;
    }

    if (comment.commentatorInfo.userId !== req.userId) {
        res.sendStatus(HTTPResponseStatusCodes.FORBIDDEN);
        return;
    }

    const isDeleted = await commentsServices.deleteComment(req.params.commentId);

    if (isDeleted) {
        res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}

export const updateComment = async (req: RequestWithParamsAndBody<{ commentId: string }, {
    content: string
}>, res: ResponseEmpty) => {
    const comment = await commentsQueryRepository.findCommentById(req.params.commentId);
    if (!comment) {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        return;
    }

    if (comment.commentatorInfo.userId !== req.userId) {
        res.sendStatus(HTTPResponseStatusCodes.FORBIDDEN);
        return;
    }

    const isUpdated = await commentsServices.updateComment(req.params.commentId, req.body.content);

    if (isUpdated) {
        res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}