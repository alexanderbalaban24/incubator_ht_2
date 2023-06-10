import {Router} from "express";
import {basicAuthMiddleware} from "../middlewares/basic-auth";
import {postValidateSchema} from "../schemes/posts-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {jwtAuthAccess} from "../middlewares/jwt-auth-access";
import {commentsSchema} from "../schemes/comments-schema";
import {postIdValidation} from "../middlewares/postId-validation";
import {container} from "../inversify.config";
import {addUserId} from "../middlewares/add-user-id";
import {PostsController} from "../controllers/posts.controller";
import {likeSchema} from "../schemes/like-schema";

export const postsRouter = Router();

const postsController = container.resolve(PostsController);

postsRouter.route('/')
    .get(addUserId, postsController.getAllPosts.bind(postsController))
    .post(basicAuthMiddleware, postValidateSchema, inputValidationMiddleware, postsController.createPost.bind(postsController));

postsRouter.route('/:postId')
    .get(addUserId, postsController.getPost.bind(postsController))
    .put(basicAuthMiddleware, postValidateSchema, inputValidationMiddleware, postsController.updatePost.bind(postsController))
    .delete(basicAuthMiddleware, postsController.deletePost.bind(postsController));

postsRouter.route('/:postId/comments')
    .get(addUserId, postIdValidation, postsController.getAllComments.bind(postsController))
    .post(jwtAuthAccess, postIdValidation, commentsSchema, inputValidationMiddleware, postsController.createComment.bind(postsController));

postsRouter.route("/:postId/like-status")
    .put(jwtAuthAccess, postIdValidation, likeSchema, inputValidationMiddleware, postsController.likeStatus.bind(postsController));