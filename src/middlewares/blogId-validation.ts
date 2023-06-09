import {RequestWithParamsAndBody, ResponseEmpty} from "../shared/types";
import {NextFunction} from "express";
import {CreatePostModel} from "../models/input/CreatePostModel";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {container} from "../inversify.config";
import {BlogsQueryRepository} from "../repositories/blogs/blogs-query-repository";

const blogsQueryRepository = container.resolve(BlogsQueryRepository);

export const blogIdValidation = async (req: RequestWithParamsAndBody<{
    blogId: string
}, CreatePostModel>, res: ResponseEmpty, next: NextFunction) => {
    const blogId = req.params.blogId;

    const blog = await blogsQueryRepository.findBlogById(blogId);
    if (blog) {
        next();
    } else {
        res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
    }
}