import {Response} from "express";
import {RequestEmpty, RequestWithBody, ResponseEmpty} from "../shared/types";
import {LoginModel} from "../models/auth/LoginModel";
import {ViewMeModel} from "../models/auth/ViewMeModel";
import {ViewLoginModel} from "../models/auth/ViewLoginModel";
import {RegistrationModel} from "../models/auth/RegistrationModel";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {usersQueryRepository} from "../composition-root";
import {AuthServices} from "../domain/auth-services";

export class AuthController {

    constructor(protected authServices: AuthServices){}

    async login(req: RequestWithBody<LoginModel>, res: Response<ViewLoginModel>)   {
        const tokenPair = await this.authServices.login(req.body.loginOrEmail, req.body.password, req.headers["user-agent"], req.ip);

        if (tokenPair && tokenPair.accessToken && tokenPair.refreshToken) {
            res.cookie("refreshToken", tokenPair.refreshToken, {httpOnly: true, secure: true});
            res.status(HTTPResponseStatusCodes.OK).json({accessToken: tokenPair.accessToken});
        } else {
            res.sendStatus(HTTPResponseStatusCodes.UNAUTHORIZED);
        }
    }

    async refreshToken(req: RequestEmpty, res: Response<ViewLoginModel>)   {
        const userId = req.userId;
        if (!userId) {
            res.sendStatus(HTTPResponseStatusCodes.UNAUTHORIZED);
            return;
        }

        const refreshToken = req.cookies.refreshToken;

        const tokenPair = await this.authServices.refreshToken(refreshToken, userId!);
        if (tokenPair && tokenPair.accessToken && tokenPair.refreshToken) {
            res.cookie("refreshToken", tokenPair.refreshToken, {httpOnly: true, secure: true});
            res.status(HTTPResponseStatusCodes.OK).json({accessToken: tokenPair.accessToken});
        } else {
            res.sendStatus(HTTPResponseStatusCodes.UNAUTHORIZED);
        }
    }

    async registration(req: RequestWithBody<RegistrationModel>, res: ResponseEmpty)   {
        const success = await this.authServices.registration(req.body.login, req.body.email, req.body.password);

        if (success) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async confirmRegistration(req: RequestWithBody<{ code: string }>, res: ResponseEmpty)   {
        const isVerified = await this.authServices.verifyEmail(req.body.code);

        if (isVerified) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT)
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async logout(req: RequestEmpty, res: ResponseEmpty)   {
        const refreshToken = req.cookies.refreshToken;

        const isRevoked = await this.authServices.logout(refreshToken);

        if (isRevoked) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.UNAUTHORIZED);
        }
    }

    async getMe(req: RequestEmpty, res: Response<ViewMeModel>)   {
        const userId = req.userId;
        const user = await usersQueryRepository.findUserById(userId!);

        if (user) {
            res.status(HTTPResponseStatusCodes.OK).json({email: user.email, login: user.login, userId: user.id});
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }

    }

    async resendConfirmationCode(req: RequestWithBody<{ email: string }>, res: ResponseEmpty)   {
        const success = await this.authServices.resendConfirmationCode(req.body.email);

        if (success) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NOT_FOUND);
        }
    }

    async recoverPass(req: RequestWithBody<{ email: string }>, res: ResponseEmpty)   {
        const isSending = await this.authServices.recoverPass(req.body.email);
        if (isSending) {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT);
        } else {
            res.sendStatus(HTTPResponseStatusCodes.NO_CONTENT)
        }
    }

    async confirmNewPassword(req: RequestWithBody<{ newPassword: string, recoveryCode: string }>, res: ResponseEmpty)   {
        const isConfirmed = await this.authServices.confirmRecoverPass(req.body.newPassword, req.body.recoveryCode);

        if (isConfirmed) {
            res.sendStatus(204);
        } else {
            res.sendStatus(400);
        }
    }
}
