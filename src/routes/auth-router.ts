import {Router} from "express";
import {getMe, login} from "../controllers/auth.controller";
import {authValidateSchema} from "../schemes/auth-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {jwtAuth} from "../middlewares/jwt-auth";

export const authRouter = Router();

authRouter.route('/login').post(authValidateSchema, inputValidationMiddleware, login);
authRouter.route('/me').get(jwtAuth, getMe);