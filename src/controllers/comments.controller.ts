import {Response} from "express";
import {ViewCommentModel} from "../models/view/ViewCommentModel";
import {RequestWithParams, RequestWithParamsAndBody, ResponseEmpty} from "../shared/types";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {CommentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {CommentsServices} from "../domain/comments-services";
import {ResponseHelper} from "../shared/helpers";

import {LikeStatusEnum} from "../models/database/CommentsModelClass";

export class CommentsController extends ResponseHelper {

    constructor(protected commentsServices: CommentsServices, protected commentsQueryRepository: CommentsQueryRepository) {
        super();
    }

    async getComment(req: RequestWithParams<{ commentId: string }>, res: Response<ViewCommentModel | null>) {
        const commentResult = await this.commentsQueryRepository.findCommentById(req.params.commentId, req.userId!);

        this.sendResponse<ViewCommentModel>(res, commentResult);
    }

    async deleteComment(req: RequestWithParams<{ commentId: string }>, res: ResponseEmpty) {
        const commentResult = await this.commentsQueryRepository.findCommentById(req.params.commentId);
        if (!commentResult.success) return res.sendStatus(this.mapStatusCode(commentResult.code));

        if (commentResult.payload!.commentatorInfo.userId !== req.userId) return res.sendStatus(HTTPResponseStatusCodes.FORBIDDEN);

        const deleteResult = await this.commentsServices.deleteComment(req.params.commentId);

        res.sendStatus(this.mapStatusCode(deleteResult.code));
    }

    async updateComment(req: RequestWithParamsAndBody<{ commentId: string }, {
        content: string
    }>, res: ResponseEmpty) {
        const commentResult = await this.commentsQueryRepository.findCommentById(req.params.commentId);
        if (!commentResult.success) return res.sendStatus(this.mapStatusCode(commentResult.code));

        if (commentResult.payload!.commentatorInfo.userId !== req.userId) return res.sendStatus(HTTPResponseStatusCodes.FORBIDDEN);

        const updateResult = await this.commentsServices.updateComment(req.params.commentId, req.body.content);

        res.sendStatus(this.mapStatusCode(updateResult.code));
    }

    async likeStatus(req: RequestWithParamsAndBody<{commentId: string}, { likeStatus: LikeStatusEnum }>, res: ResponseEmpty) {
        const likeResult = await this.commentsServices.likeStatus(req.params.commentId, req.userId!, req.body.likeStatus);

        // @ts-ignore
        if(likeResult.success) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            // @ts-ignore
            this.sendResponse(res, likeResult);
        }
    }
}