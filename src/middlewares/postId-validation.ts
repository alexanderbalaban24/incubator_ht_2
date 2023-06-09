import {RequestWithParams, RequestWithQueryParamsAndURI, ResponseEmpty} from "../shared/types";
import {NextFunction} from "express";
import {QueryParamsCommentModel} from "../models/input/QueryParamsCommentModel";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {container} from "../inversify.config";
import {PostsQueryRepository} from "../repositories/posts/posts-query-repository";

const postsQueryRepository = container.resolve(PostsQueryRepository);

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