import {Response} from "express";
import {RequestEmpty, RequestWithBody, ResponseEmpty} from "../shared/types";
import {LoginModel} from "../models/input/LoginModel";
import {ViewMeModel} from "../models/view/ViewMeModel";
import {ViewLoginModel} from "../models/view/ViewLoginModel";
import {RegistrationModel} from "../models/input/RegistrationModel";
import {HTTPResponseStatusCodes} from "../shared/enums";
import {AuthServices} from "../domain/auth-services";
import {UsersQueryRepository} from "../repositories/users/users-query-repository";
import {ResponseHelper} from "../shared/helpers";
import {inject, injectable} from "inversify";

@injectable()
export class AuthController extends ResponseHelper {

    constructor(@inject(AuthServices) protected authServices: AuthServices, @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository) {
        super();
    }

    async login(req: RequestWithBody<LoginModel>, res: Response<ViewLoginModel>) {
        const tokenPairResult = await this.authServices.login(req.body.loginOrEmail, req.body.password, req.headers["user-agent"], req.ip);

        if (tokenPairResult.success) {
            res.cookie("refreshToken", tokenPairResult.payload!.refreshToken, {httpOnly: true, secure: true});
            res.status(this.mapStatusCode(tokenPairResult.code)).json({accessToken: tokenPairResult.payload!.accessToken});
        } else {
            res.sendStatus(this.mapStatusCode(tokenPairResult.code));
        }
    }

    async refreshToken(req: RequestEmpty, res: Response<ViewLoginModel>) {
        const userId = req.userId;
        if (!userId) {
            res.sendStatus(HTTPResponseStatusCodes.UNAUTHORIZED);
            return;
        }

        const refreshToken = req.cookies.refreshToken;

        const tokenPairResult = await this.authServices.refreshToken(refreshToken, userId!);
        if (tokenPairResult.success) {
            res.cookie("refreshToken", tokenPairResult.payload!.refreshToken, {httpOnly: true, secure: true});
            res.status(HTTPResponseStatusCodes.OK).json({accessToken: tokenPairResult.payload!.accessToken});
        } else {
            res.sendStatus(HTTPResponseStatusCodes.UNAUTHORIZED);
        }
    }

    async registration(req: RequestWithBody<RegistrationModel>, res: ResponseEmpty) {
        const result = await this.authServices.registration(req.body.login, req.body.email, req.body.password);

        res.sendStatus(this.mapStatusCode(result.code));
    }

    async confirmRegistration(req: RequestWithBody<{ code: string }>, res: ResponseEmpty) {
        const verifiedResult = await this.authServices.verifyEmail(req.body.code);

        this.sendResponse(res, verifiedResult);
    }

    async logout(req: RequestEmpty, res: ResponseEmpty) {
        const refreshToken = req.cookies.refreshToken;

        const revokedResult = await this.authServices.logout(refreshToken);

        this.sendResponse(res, revokedResult);
    }

    async getMe(req: RequestEmpty, res: Response<ViewMeModel>) {
        const userId = req.userId;
        const userResult = await this.usersQueryRepository.findUserById(userId!);

        if (userResult.success) {
            res.status(this.mapStatusCode(userResult.code)).json({
                email: userResult.payload!.email,
                login: userResult.payload!.login,
                userId: userResult.payload!.id
            });
        } else {
            res.sendStatus(this.mapStatusCode(userResult.code));
        }

    }

    async resendConfirmationCode(req: RequestWithBody<{ email: string }>, res: ResponseEmpty) {
        const resendResult = await this.authServices.resendConfirmationCode(req.body.email);

        this.sendResponse(res, resendResult);

    }

    async recoverPass(req: RequestWithBody<{ email: string }>, res: ResponseEmpty) {
        const sendingResult = await this.authServices.recoverPass(req.body.email);

        this.sendResponse(res, sendingResult);

    }

    async confirmNewPassword(req: RequestWithBody<{ newPassword: string, recoveryCode: string }>, res: ResponseEmpty) {
        const confirmedResult = await this.authServices.confirmRecoverPass(req.body.newPassword, req.body.recoveryCode);

        this.sendResponse(res, confirmedResult);
    }
}
