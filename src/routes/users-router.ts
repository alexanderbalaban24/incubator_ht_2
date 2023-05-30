import { Router } from "express";
import {userValidateSchema} from "../schemes/users-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {basicAuthMiddleware} from "../middlewares/basic-auth";
import {usersController} from "../composition-root";

export const usersRouter = Router();

usersRouter.route('/').get(basicAuthMiddleware, usersController.getUsers.bind(usersController)).post(basicAuthMiddleware, userValidateSchema, inputValidationMiddleware, usersController.createUser.bind(usersController));
usersRouter.route('/:userId').delete(basicAuthMiddleware, usersController.deleteUser.bind(usersController));