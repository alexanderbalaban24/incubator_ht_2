import {RequestWithParamsAndBody, ResponseEmpty} from "../shared/types";
import {NextFunction} from "express";
import {CreatePostModel} from "../models/post/CreatePostModel";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repository";

export const uriParamsValidation = async (req: RequestWithParamsAndBody<{
    blogId: string
}, CreatePostModel>, res: ResponseEmpty, next: NextFunction) => {
    const blogId = req.params.blogId;

    const blog = await blogsQueryRepository.findBlogById(blogId);
    if (blog) {
        next();
    } else {
        res.sendStatus(404);
    }
}