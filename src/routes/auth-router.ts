import {Router} from "express";
import {authValidateSchema} from "../schemes/auth-schema";
import {inputValidationMiddleware} from "../middlewares/input-validation";
import {jwtAuthAccess} from "../middlewares/jwt-auth-access";
import {confirmationSchema} from "../schemes/confirmation-schema";
import {registrationValidateSchema} from "../schemes/registration-schema";
import {resendSchema} from "../schemes/resend-schema";
import {jwtAuthRefresh} from "../middlewares/jwt-auth-refresh";
import {rateLimitMiddleware} from "../middlewares/rate-limit";
import {passwordRecoverSchema} from "../schemes/password-recover-schema";
import {newPasswordSchema} from "../schemes/new-password-schema";
import {authController} from "../composition-root";

export const authRouter = Router();

authRouter.route('/login').post(rateLimitMiddleware, authValidateSchema, inputValidationMiddleware, authController.login.bind(authController));
authRouter.route('/refresh-token').post(jwtAuthRefresh, authController.refreshToken.bind(authController));
authRouter.route('/registration').post(rateLimitMiddleware, registrationValidateSchema, inputValidationMiddleware, authController.registration.bind(authController));
authRouter.route('/registration-confirmation').post(rateLimitMiddleware, confirmationSchema, inputValidationMiddleware, authController.confirmRegistration.bind(authController));
authRouter.route('/registration-email-resending').post(rateLimitMiddleware, resendSchema, inputValidationMiddleware, authController.resendConfirmationCode.bind(authController));
authRouter.route('/logout').post(jwtAuthRefresh, authController.logout.bind(authController));
authRouter.route('/me').get(jwtAuthAccess, authController.getMe.bind(authController));
authRouter.route('/password-recovery').post(rateLimitMiddleware, passwordRecoverSchema, inputValidationMiddleware, authController.recoverPass.bind(authController));
authRouter.route('/new-password').post(rateLimitMiddleware, newPasswordSchema, inputValidationMiddleware, authController.confirmNewPassword.bind(authController));