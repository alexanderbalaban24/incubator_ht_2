import { Router } from "express";
import {jwtAuthAccess} from "../middlewares/jwt-auth-access";
import {commentsSchema} from "../schemes/comments-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {commentIdValidation} from "../middlewares/commentId-validation";
import {container} from "../inversify.config";
import {likeSchema} from "../schemes/like-schema";
import {addUserId} from "../middlewares/add-user-id";
import {CommentsController} from "../controllers/comments.controller";

export const commentsRouter = Router();

const commentsController = container.resolve(CommentsController);

commentsRouter.route("/:commentId")
    .get(addUserId, commentsController.getComment.bind(commentsController))
    .put(jwtAuthAccess, commentIdValidation, commentsSchema, inputValidationMiddleware, commentsController.updateComment.bind(commentsController))
    .delete(jwtAuthAccess, commentIdValidation, commentsController.deleteComment.bind(commentsController));

commentsRouter.route("/:commentId/like-status")
    .put(jwtAuthAccess, commentIdValidation, likeSchema, inputValidationMiddleware, commentsController.likeStatus.bind(commentsController));