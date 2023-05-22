import {Router} from "express";
import {
    confirmRegistration,
    getMe,
    login,
    refreshToken,
    registration,
    resendConfirmationCode, logout
} from "../controllers/auth.controller";
import {authValidateSchema} from "../schemes/auth-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {jwtAuthAccess} from "../middlewares/jwt-auth-access";
import {confirmationSchema} from "../schemes/confirmation-schema";
import {registrationValidateSchema} from "../schemes/registration-schema";
import {resendSchema} from "../schemes/resend-schema";
import {jwtAuthRefresh} from "../middlewares/jwt-auth-refresh";
import {rateLimitMiddleware} from "../middlewares/rate-limit";

export const authRouter = Router();

authRouter.route('/login').post(rateLimitMiddleware, authValidateSchema, inputValidationMiddleware, login);
authRouter.route('/refresh-token').post(jwtAuthRefresh, refreshToken);
authRouter.route('/registration').post(rateLimitMiddleware, registrationValidateSchema, inputValidationMiddleware, registration);
authRouter.route('/registration-confirmation').post(rateLimitMiddleware, confirmationSchema, inputValidationMiddleware, confirmRegistration);
authRouter.route('/registration-email-resending').post(rateLimitMiddleware, resendSchema, inputValidationMiddleware, resendConfirmationCode);
authRouter.route('/logout').post(jwtAuthRefresh, logout);
authRouter.route('/me').get(jwtAuthAccess, getMe);