import {Router} from "express";
import {basicAuthMiddleware} from "../middlewares/basic-auth";
import {
    createComment,
    createPost,
    deletePost,
    getAllComments,
    getAllPosts,
    getPost,
    updatePost
} from "../controllers/posts.controller";
import {postValidateSchema} from "../schemes/posts-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {jwtAuthAccess} from "../middlewares/jwt-auth-access";
import {commentsSchema} from "../schemes/comments-schema";
import {postIdValidation} from "../middlewares/postId-validation";

export const postsRouter = Router();

postsRouter.route('/')
    .get(getAllPosts)
    .post(basicAuthMiddleware, postValidateSchema, inputValidationMiddleware, createPost);

postsRouter.route('/:postId')
    .get(getPost)
    .put(basicAuthMiddleware, postValidateSchema, inputValidationMiddleware, updatePost)
    .delete(basicAuthMiddleware, deletePost);

postsRouter.route('/:postId/comments').get(postIdValidation, getAllComments).post(jwtAuthAccess, postIdValidation, commentsSchema, inputValidationMiddleware, createComment);