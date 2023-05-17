import { Router } from "express";
import {deleteComment, getComment, updateComment} from "../controllers/comments.controller";
import {jwtAuthAccess} from "../middlewares/jwt-auth-access";
import {commentsSchema} from "../schemes/comments-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {commentIdValidation} from "../middlewares/commentId-validation";

export const commentsRouter = Router();

commentsRouter.route("/:commentId")
    .get(getComment)
    .put(jwtAuthAccess, commentIdValidation, commentsSchema, inputValidationMiddleware, updateComment)
    .delete(jwtAuthAccess, commentIdValidation, deleteComment);