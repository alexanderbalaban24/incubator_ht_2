import {Response} from "express";
import {ViewCommentModel} from "../models/comment/ViewCommentModel";
import {RequestWithParams, RequestWithParamsAndBody, ResponseEmpty} from "../shared/types";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {CommentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {CommentsServices} from "../domain/comments-services";
import {mapStatusCode} from "../shared/utils";

export class CommentsController {

    constructor(protected commentsServices: CommentsServices, protected commentsQueryRepository: CommentsQueryRepository) {
    }

    async getComment(req: RequestWithParams<{ commentId: string }>, res: Response<ViewCommentModel | null>) {
        const commentResult = await this.commentsQueryRepository.findCommentById(req.params.commentId);
        if (commentResult.success) {
            res.status(mapStatusCode(commentResult.code)).json(commentResult.payload);
        } else {
            res.sendStatus(mapStatusCode(commentResult.code));
        }
    }

    async deleteComment(req: RequestWithParams<{ commentId: string }>, res: ResponseEmpty) {
        const commentResult = await this.commentsQueryRepository.findCommentById(req.params.commentId);
        if (!commentResult.success) return res.sendStatus(mapStatusCode(commentResult.code));

        if (commentResult.payload!.commentatorInfo.userId !== req.userId) return res.sendStatus(HTTPResponseStatusCodes.FORBIDDEN);

        const deleteResult = await this.commentsServices.deleteComment(req.params.commentId);

        if (deleteResult.success) {
            res.sendStatus(mapStatusCode(deleteResult.code));
        } else {
            res.sendStatus(mapStatusCode(deleteResult.code));
        }
    }

    async updateComment(req: RequestWithParamsAndBody<{ commentId: string }, {
        content: string
    }>, res: ResponseEmpty) {
        const commentResult = await this.commentsQueryRepository.findCommentById(req.params.commentId);
        if (!commentResult.success) return res.sendStatus(mapStatusCode(commentResult.code));

        if (commentResult.payload!.commentatorInfo.userId !== req.userId) return res.sendStatus(HTTPResponseStatusCodes.FORBIDDEN);

        const updateResult = await this.commentsServices.updateComment(req.params.commentId, req.body.content);

        if (updateResult.success) {
            res.sendStatus(mapStatusCode(updateResult.code));
        } else {
            res.sendStatus(mapStatusCode(updateResult.code));
        }
    }
}