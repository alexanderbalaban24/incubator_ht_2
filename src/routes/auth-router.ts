import {Router} from "express";
import {login} from "../controllers/auth.controller";
import {authValidateSchema} from "../schemes/auth-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";

export const authRouter = Router();

authRouter.route('/login').post(authValidateSchema, inputValidationMiddleware ,login);