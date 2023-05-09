import { Router } from "express";
import {createUser, deleteUser, getUsers} from "../controllers/users.controller";
import {userValidateSchema} from "../schemes/users-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {basicAuthMiddleware} from "../middlewares/basic-auth";

export const usersRouter = Router();

usersRouter.route('/').get(basicAuthMiddleware, getUsers).post(basicAuthMiddleware, userValidateSchema, inputValidationMiddleware, createUser);
usersRouter.route('/:userId').delete(basicAuthMiddleware, deleteUser);