import { Router } from "express";
import {deleteComment, getComment, updateComment} from "../controllers/comments.controller";
import {jwtAuth} from "../middlewares/jwt-auth";
import {commentsSchema} from "../schemes/comments-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {commentIdValidation} from "../middlewares/commentId-validation";

export const commentsRouter = Router();

commentsRouter.route("/:commentId").get(getComment).put(jwtAuth, commentIdValidation, commentsSchema, inputValidationMiddleware, updateComment).delete(jwtAuth, commentIdValidation, deleteComment);