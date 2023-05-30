import {Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {blogValidateSchema} from "../schemes/blogs-schema";
import {basicAuthMiddleware} from "../middlewares/basic-auth";
import {postValidateSchema} from "../schemes/posts-schema";
import {blogIdValidation} from "../middlewares/blogId-validation";
import {blogsController} from "../composition-root";


export const blogsRouter = Router();

blogsRouter.route('/')
    .get(blogsController.getAllBlogs.bind(blogsController))
    .post(basicAuthMiddleware, blogValidateSchema, inputValidationMiddleware, blogsController.createBlog.bind(blogsController));

blogsRouter.route('/:blogId')
    .get(blogsController.getBlog.bind(blogsController))
    .put(basicAuthMiddleware, blogValidateSchema, inputValidationMiddleware, blogsController.updateBlog.bind(blogsController))
    .delete(basicAuthMiddleware, blogsController.deleteBlog);

blogsRouter.route('/:blogId/posts')
    .get(blogIdValidation, blogsController.getPostsByBlogId.bind(blogsController))
    .post(basicAuthMiddleware, blogIdValidation, postValidateSchema, inputValidationMiddleware, blogsController.createPostByBlogId.bind(blogsController));
