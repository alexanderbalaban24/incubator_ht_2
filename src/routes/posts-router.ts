import {Router} from "express";
import {basicAuthMiddleware} from "../middlewares/basic-auth";
import {postValidateSchema} from "../schemes/posts-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {jwtAuthAccess} from "../middlewares/jwt-auth-access";
import {commentsSchema} from "../schemes/comments-schema";
import {postIdValidation} from "../middlewares/postId-validation";
import {postsController} from "../composition-root";

export const postsRouter = Router();

postsRouter.route('/')
    .get(postsController.getAllPosts.bind(postsController))
    .post(basicAuthMiddleware, postValidateSchema, inputValidationMiddleware, postsController.createPost.bind(postsController));

postsRouter.route('/:postId')
    .get(postsController.getPost.bind(postsController))
    .put(basicAuthMiddleware, postValidateSchema, inputValidationMiddleware, postsController.updatePost.bind(postsController))
    .delete(basicAuthMiddleware, postsController.deletePost.bind(postsController));

postsRouter.route('/:postId/comments')
    .get(postIdValidation, postsController.getAllComments.bind(postsController))
    .post(jwtAuthAccess, postIdValidation, commentsSchema, inputValidationMiddleware, postsController.createComment.bind(postsController));