import {Response} from "express";
import {ViewCommentModel} from "../models/comment/ViewCommentModel";
import {RequestWithParams, RequestWithParamsAndBody, ResponseEmpty} from "../shared/types";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {CommentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {CommentsServices} from "../domain/comments-services";

export class CommentsController {

    constructor(protected commentsServices: CommentsServices, protected commentsQueryRepository: CommentsQueryRepository){}
    async getComment(req: RequestWithParams<{ commentId: string }>, res: Response<ViewCommentModel>) {
        const comment = await this.commentsQueryRepository.findCommentById(req.params.commentId);
        if (comment) {
            res.status(HTTPResponseStatusCodes.OK).json(comment);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async deleteComment(req: RequestWithParams<{ commentId: string }>, res: ResponseEmpty) {
        const comment = await this.commentsQueryRepository.findCommentById(req.params.commentId);
        if (!comment) {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
            return;
        }

        if (comment.commentatorInfo.userId !== req.userId) {
            res.sendStatus(HTTPResponseStatusCodes.FORBIDDEN);
            return;
        }

        const isDeleted = await this.commentsServices.deleteComment(req.params.commentId);

        if (isDeleted) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async updateComment(req: RequestWithParamsAndBody<{ commentId: string }, {
        content: string
    }>, res: ResponseEmpty) {
        const comment = await this.commentsQueryRepository.findCommentById(req.params.commentId);
        if (!comment) {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
            return;
        }

        if (comment.commentatorInfo.userId !== req.userId) {
            res.sendStatus(HTTPResponseStatusCodes.FORBIDDEN);
            return;
        }

        const isUpdated = await this.commentsServices.updateComment(req.params.commentId, req.body.content);

        if (isUpdated) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }
}