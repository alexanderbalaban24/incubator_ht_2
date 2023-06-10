import {Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {blogValidateSchema} from "../schemes/blogs-schema";
import {basicAuthMiddleware} from "../middlewares/basic-auth";
import {postValidateSchema} from "../schemes/posts-schema";
import {blogIdValidation} from "../middlewares/blogId-validation";
import {container} from "../inversify.config";
import {BlogsController} from "../controllers/blogs.controller";


export const blogsRouter = Router();

const blogsController = container.resolve(BlogsController);

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
