import {Router} from "express";
import {basicAuthMiddleware} from "../middlewares/basic-auth";
import {createPost, deletePost, getAllPosts, getPost, updatePost} from "../controllers/posts.controller";
import {postValidateSchema} from "../Schemes/posts-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";

export const postsRouter = Router();

postsRouter.route('/').get(getAllPosts).post(basicAuthMiddleware, postValidateSchema, inputValidationMiddleware, createPost);
postsRouter.route('/:postId').get(getPost).put(basicAuthMiddleware, postValidateSchema, inputValidationMiddleware, updatePost).delete(basicAuthMiddleware, deletePost);