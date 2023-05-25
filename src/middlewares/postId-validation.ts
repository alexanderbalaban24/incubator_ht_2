import {RequestWithParams, RequestWithQueryParamsAndURI, ResponseEmpty} from "../shared/types";
import {NextFunction} from "express";
import {postsQueryRepository} from "../repositories/posts/posts-query-repository";
import {QueryParamsCommentModel} from "../models/comment/QueryParamsCommentModel";
import {HTTPResponseStatusCodes} from "../shared/enums";

export const postIdValidation = async (req: RequestWithQueryParamsAndURI<{
    postId: string
}, QueryParamsCommentModel> | RequestWithParams<{ postId: string }>, res: ResponseEmpty, next: NextFunction) => {
    const post = await postsQueryRepository.findPostById(req.params.postId);

    if (post) {
        next();
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}