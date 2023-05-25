import {RequestWithParams, ResponseEmpty} from "../shared/types";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {NextFunction} from "express";
import {HTTPResponseStatusCodes} from "../shared/enums";

export const commentIdValidation = async (req: RequestWithParams<{
    commentId: string
}>, res: ResponseEmpty, next: NextFunction) => {
    const comment = await commentsQueryRepository.findCommentById(req.params.commentId);

    if (comment) {
        next();
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}