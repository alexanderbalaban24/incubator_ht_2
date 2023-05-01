import {Router} from "express";
import {createBlog, deleteBlog, getAllBlogs, getBlog, updateBlog} from "../controllers/blogs.controller";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {blogValidateSchema} from "../Schemes/blogs-schema";
import {basicAuthMiddleware} from "../middlewares/basic-auth";


export const blogsRouter = Router();

blogsRouter.route('/').get(getAllBlogs).post(basicAuthMiddleware, blogValidateSchema, inputValidationMiddleware, createBlog);
blogsRouter.route('/:blogId').get(getBlog).put(basicAuthMiddleware, blogValidateSchema, inputValidationMiddleware, updateBlog).delete(deleteBlog);