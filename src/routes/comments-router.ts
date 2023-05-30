import { Router } from "express";
import {jwtAuthAccess} from "../middlewares/jwt-auth-access";
import {commentsSchema} from "../schemes/comments-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {commentIdValidation} from "../middlewares/commentId-validation";
import {commentsController} from "../composition-root";

export const commentsRouter = Router();

commentsRouter.route("/:commentId")
    .get(commentsController.getComment.bind(commentsController))
    .put(jwtAuthAccess, commentIdValidation, commentsSchema, inputValidationMiddleware, commentsController.updateComment.bind(commentsController))
    .delete(jwtAuthAccess, commentIdValidation, commentsController.deleteComment.bind(commentsController));