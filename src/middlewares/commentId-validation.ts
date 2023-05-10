import {RequestWithParams, ResponseEmpty} from "../shared/types";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";
import {NextFunction} from "express";

export const commentIdValidation = async (req: RequestWithParams<{
    commentId: string
}>, res: ResponseEmpty, next: NextFunction) => {
    const comment = await commentsQueryRepository.findCommentById(req.params.commentId);

    if (comment) {
        next();
    } else {
        res.sendStatus(404);
    }
}