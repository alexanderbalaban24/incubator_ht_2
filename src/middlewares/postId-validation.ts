import {RequestWithParams, RequestWithQueryParamsAndURI, ResponseEmpty} from "../shared/types";
import {NextFunction} from "express";
import {QueryParamsCommentModel} from "../models/comment/QueryParamsCommentModel";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {postsQueryRepository} from "../composition-root";

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