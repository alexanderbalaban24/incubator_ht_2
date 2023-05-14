import {Router} from "express";
import {confirmRegistration, getMe, login, registration, resendConfirmationCode} from "../controllers/auth.controller";
import {authValidateSchema} from "../schemes/auth-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {jwtAuth} from "../middlewares/jwt-auth";
import {confirmationSchema} from "../schemes/confirmation-schema";
import {registrationValidateSchema} from "../schemes/registration-schema";
import {resendSchema} from "../schemes/resend-schema";

export const authRouter = Router();

authRouter.route('/login').post(authValidateSchema, inputValidationMiddleware, login);
authRouter.route('/registration').post(registrationValidateSchema, inputValidationMiddleware, registration);
authRouter.route('/registration-confirmation').post(confirmationSchema, inputValidationMiddleware, confirmRegistration);
authRouter.route('/registration-email-resending').post(resendSchema, inputValidationMiddleware, resendConfirmationCode);
authRouter.route('/me').get(jwtAuth, getMe);