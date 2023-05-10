import {Router} from "express";
import {
    createBlog,
    createPostByBlogId,
    deleteBlog,
    getAllBlogs,
    getBlog, getPostsByBlogId,
    updateBlog
} from "../controllers/blogs.controller";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {blogValidateSchema} from "../schemes/blogs-schema";
import {basicAuthMiddleware} from "../middlewares/basic-auth";
import {postValidateSchema} from "../schemes/posts-schema";
import {blogIdValidation} from "../middlewares/blogId-validation";


export const blogsRouter = Router();

blogsRouter.route('/')
    .get(getAllBlogs)
    .post(basicAuthMiddleware, blogValidateSchema, inputValidationMiddleware, createBlog);

blogsRouter.route('/:blogId')
    .get(getBlog)
    .put(basicAuthMiddleware, blogValidateSchema, inputValidationMiddleware, updateBlog)
    .delete(basicAuthMiddleware, deleteBlog);

blogsRouter.route('/:blogId/posts')
    .get(blogIdValidation, getPostsByBlogId)
    .post(basicAuthMiddleware, blogIdValidation, postValidateSchema, inputValidationMiddleware, createPostByBlogId);
