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
import {blogValidateSchema} from "../Schemes/blogs-schema";
import {basicAuthMiddleware} from "../middlewares/basic-auth";
import {postValidateSchema} from "../Schemes/posts-schema";
import {uriParamsValidation} from "../middlewares/uriParams-validation";


export const blogsRouter = Router();

blogsRouter.route('/').get(getAllBlogs).post(basicAuthMiddleware, blogValidateSchema, inputValidationMiddleware, createBlog);
blogsRouter.route('/:blogId').get(getBlog).put(basicAuthMiddleware, blogValidateSchema, inputValidationMiddleware, updateBlog).delete(basicAuthMiddleware, deleteBlog);
blogsRouter.route('/:blogId/posts').get(getPostsByBlogId, uriParamsValidation).post(basicAuthMiddleware, uriParamsValidation, postValidateSchema, inputValidationMiddleware, createPostByBlogId);
